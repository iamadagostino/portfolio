import { getPrismaClient, prisma } from '~/.server/db';
import type { Language } from '~/i18n/i18n.resources';
import { markdownToHtmlSync } from '~/services/markdown.server';
import { getDatabaseLanguageFilter } from '~/services/blog-slug.server';

export interface BlogPost {
  id: number;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  banner: string | null;
  readTime: number | null;
  publishedAt: Date | null;
  author: {
    username: string;
    firstName: string;
    lastName: string;
  };
  translation: {
    title: string;
    abstract: string;
    content: string;
    slug: string | null; // Locale-specific slug
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
}

export interface BlogPostSummary {
  id: number;
  slug: string;
  featured: boolean;
  banner: string | null;
  readTime: number | null;
  publishedAt: Date | null;
  translation: {
    title: string;
    abstract: string;
    slug: string | null; // Locale-specific slug
  } | null;
}

// Type for Accelerate-enhanced client (using unknown for caching compatibility)
type AccelerateClient = {
  post: {
    findMany: (args: unknown) => Promise<unknown>;
    findUnique: (args: unknown) => Promise<unknown>;
    findFirst: (args: unknown) => Promise<unknown>;
  };
};

// Get all published blog posts for a specific language
export async function getBlogPosts(language: Language): Promise<BlogPostSummary[]> {
  try {
    const { whereClause, orderBy } = getDatabaseLanguageFilter(language);

    // Use regular prisma client for type safety
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        translations: {
          // Get both requested language and English as fallback
          where: whereClause,
          select: {
            locale: true,
            title: true,
            abstract: true,
            slug: true, // Include locale-specific slug
          },
          orderBy: orderBy,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return posts
      .map((post) => {
        // Find the best translation: requested language first, then English fallback
        const requestedTranslation = post.translations.find((t) => t.locale === language);
        const fallbackTranslation = post.translations.find((t) => t.locale === 'en-US');
        const selectedTranslation = requestedTranslation || fallbackTranslation;

        if (!selectedTranslation) {
          return null; // Skip posts with no translations
        }

        return {
          id: post.id,
          slug: post.slug,
          featured: post.featured,
          banner: post.banner,
          readTime: post.readTime,
          publishedAt: post.publishedAt,
          translation: {
            title: selectedTranslation.title,
            abstract: selectedTranslation.abstract,
            slug: selectedTranslation.slug,
          },
        };
      })
      .filter((post) => post !== null) as BlogPostSummary[]; // Type assertion after filtering
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    // Return empty array instead of throwing error
    return [];
  }
}

// Get all published blog posts with caching (when Accelerate is available)
export async function getBlogPostsWithCache(language: Language): Promise<BlogPostSummary[]> {
  try {
    if (!process.env.ACCELERATE_URL) {
      return getBlogPosts(language);
    }

    const { whereClause, orderBy } = getDatabaseLanguageFilter(language);

    // Use enhanced client for caching
    const client = getPrismaClient() as AccelerateClient;
    const posts = await client.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
        translations: {
          // Get both requested language and English as fallback
          where: whereClause,
          select: {
            locale: true,
            title: true,
            abstract: true,
            slug: true, // Include locale-specific slug
          },
          orderBy: orderBy,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      cacheStrategy: { ttl: 300, swr: 600 }, // 5 min cache, 10 min stale-while-revalidate
    });

    // Type assertion for the cached result
    const typedPosts = posts as {
      id: number;
      slug: string;
      featured: boolean;
      banner: string | null;
      readTime: number | null;
      publishedAt: Date | null;
      translations: {
        locale: string;
        title: string;
        abstract: string;
        slug: string | null;
      }[];
    }[];

    return typedPosts
      .map((post) => {
        // Find the best translation: requested language first, then English fallback
        const requestedTranslation = post.translations.find((t) => t.locale === language);
        const fallbackTranslation = post.translations.find((t) => t.locale === 'en-US');
        const selectedTranslation = requestedTranslation || fallbackTranslation;

        if (!selectedTranslation) {
          return null; // Skip posts with no translations
        }

        return {
          id: post.id,
          slug: post.slug,
          featured: post.featured,
          banner: post.banner,
          readTime: post.readTime,
          publishedAt: post.publishedAt,
          translation: {
            title: selectedTranslation.title,
            abstract: selectedTranslation.abstract,
            slug: selectedTranslation.slug,
          },
        };
      })
      .filter((post) => post !== null) as BlogPostSummary[]; // Type assertion after filtering
  } catch (error) {
    console.error('Error in getBlogPostsWithCache:', error);
    // Fallback to regular method
    return getBlogPosts(language);
  }
}

// Get a specific blog post by slug and language
export async function getBlogPost(slug: string, language: Language): Promise<BlogPost | null> {
  const { whereClause, orderBy } = getDatabaseLanguageFilter(language);

  const post = await prisma.post.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
      translations: {
        // Get both requested language and English as fallback
        where: whereClause,
        select: {
          locale: true,
          title: true,
          abstract: true,
          content: true,
          slug: true, // Include locale-specific slug
          metaTitle: true,
          metaDescription: true,
        },
        orderBy: orderBy,
      },
    },
  });

  if (!post) return null;

  // Find the best translation: requested language first, then English fallback
  const requestedTranslation = post.translations.find((t) => t.locale === language);
  const fallbackTranslation = post.translations.find((t) => t.locale === 'en-US');
  const selectedTranslation = requestedTranslation || fallbackTranslation;

  // Process markdown content to HTML if translation exists
  const processedTranslation = selectedTranslation
    ? {
        ...selectedTranslation,
        content: markdownToHtmlSync(selectedTranslation.content),
      }
    : null;

  return {
    id: post.id,
    slug: post.slug,
    status: post.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    featured: post.featured,
    banner: post.banner,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    author: {
      username: post.author.username,
      firstName: post.author.firstName || '',
      lastName: post.author.lastName || '',
    },
    translation: processedTranslation,
  };
}

// Get a specific blog post with caching (when Accelerate is available)
export async function getBlogPostWithCache(slug: string, language: Language): Promise<BlogPost | null> {
  if (!process.env.ACCELERATE_URL) {
    return getBlogPost(slug, language);
  }

  const { whereClause, orderBy } = getDatabaseLanguageFilter(language);

  const client = getPrismaClient() as AccelerateClient;
  const post = await client.post.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
      translations: {
        // Get both requested language and English as fallback
        where: whereClause,
        select: {
          locale: true,
          title: true,
          abstract: true,
          content: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
        },
        orderBy: orderBy,
      },
    },
    cacheStrategy: { ttl: 900, swr: 1800 }, // 15 min cache, 30 min stale-while-revalidate
  });

  // Type assertion for the cached result
  const typedPost = post as {
    id: number;
    slug: string;
    status: string;
    featured: boolean;
    banner: string | null;
    readTime: number | null;
    publishedAt: Date | null;
    author: {
      username: string;
      firstName: string;
      lastName: string;
    };
    translations: {
      locale: string;
      title: string;
      abstract: string;
      content: string;
      slug: string | null;
      metaTitle: string | null;
      metaDescription: string | null;
    }[];
  } | null;

  if (!typedPost) return null;

  // Find the best translation: requested language first, then English fallback
  const requestedTranslation = typedPost.translations.find((t) => t.locale === language);
  const fallbackTranslation = typedPost.translations.find((t) => t.locale === 'en-US');
  const selectedTranslation = requestedTranslation || fallbackTranslation;

  // Process markdown content to HTML if translation exists
  const processedTranslation = selectedTranslation
    ? {
        ...selectedTranslation,
        content: markdownToHtmlSync(selectedTranslation.content),
      }
    : null;

  return {
    id: typedPost.id,
    slug: typedPost.slug,
    status: typedPost.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    featured: typedPost.featured,
    banner: typedPost.banner,
    readTime: typedPost.readTime,
    publishedAt: typedPost.publishedAt,
    author: typedPost.author,
    translation: processedTranslation,
  };
}

// Get featured posts for homepage
export async function getFeaturedBlogPosts(language: Language, limit = 3): Promise<BlogPostSummary[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      featured: true,
    },
    include: {
      translations: {
        where: {
          locale: language,
        },
        select: {
          title: true,
          abstract: true,
          slug: true, // Include locale-specific slug
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  });

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    featured: post.featured,
    banner: post.banner,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    translation: post.translations[0]
      ? {
          ...post.translations[0],
          slug: post.translations[0].slug,
        }
      : null,
  }));
}

// Get featured posts with caching (when Accelerate is available)
export async function getFeaturedBlogPostsWithCache(language: Language, limit = 3): Promise<BlogPostSummary[]> {
  if (!process.env.ACCELERATE_URL) {
    return getFeaturedBlogPosts(language, limit);
  }

  const client = getPrismaClient() as AccelerateClient;
  const posts = await client.post.findMany({
    where: {
      status: 'PUBLISHED',
      featured: true,
    },
    include: {
      translations: {
        where: {
          locale: language,
        },
        select: {
          title: true,
          abstract: true,
          slug: true, // Include locale-specific slug
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
    cacheStrategy: { ttl: 600, swr: 1200 }, // 10 min cache, 20 min stale-while-revalidate
  });

  // Type assertion for the cached result
  const typedPosts = posts as {
    id: number;
    slug: string;
    featured: boolean;
    banner: string | null;
    readTime: number | null;
    publishedAt: Date | null;
    translations: { title: string; abstract: string; slug: string | null }[];
  }[];

  return typedPosts.map((post) => ({
    id: post.id,
    slug: post.slug,
    featured: post.featured,
    banner: post.banner,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    translation: post.translations[0] || null,
  }));
}

// Get a blog post and check if URL should redirect to proper localized slug
export async function getBlogPostWithSlugValidation(
  urlSlug: string,
  language: Language
): Promise<{ post: BlogPost | null; shouldRedirect: boolean; correctSlug?: string }> {
  const { whereClause, orderBy } = getDatabaseLanguageFilter(language);

  // First, find the post by any slug (main or locale-specific)
  const post = await prisma.post.findFirst({
    where: {
      OR: [
        { slug: urlSlug },
        {
          translations: {
            some: {
              slug: urlSlug,
              locale: language, // Only look for the slug in the current language
            },
          },
        },
      ],
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
      translations: {
        // Get both requested language and English as fallback
        where: whereClause,
        select: {
          locale: true,
          title: true,
          abstract: true,
          content: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
        },
        orderBy: orderBy,
      },
    },
  });

  if (!post) {
    return { post: null, shouldRedirect: false };
  }

  // Find the best translation: requested language first, then English fallback
  const requestedTranslation = post.translations.find((t) => t.locale === language);
  const fallbackTranslation = post.translations.find((t) => t.locale === 'en-US');
  const selectedTranslation = requestedTranslation || fallbackTranslation;

  if (!selectedTranslation) {
    return { post: null, shouldRedirect: false };
  }

  // Determine the correct slug for the current language
  const correctSlug = selectedTranslation.slug || post.slug;

  // Check if we should redirect
  const shouldRedirect = urlSlug !== correctSlug;

  // Process markdown content to HTML if translation exists
  const processedTranslation = {
    ...selectedTranslation,
    content: markdownToHtmlSync(selectedTranslation.content),
  };

  const blogPost: BlogPost = {
    id: post.id,
    slug: post.slug,
    status: post.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    featured: post.featured,
    banner: post.banner,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    author: {
      username: post.author.username,
      firstName: post.author.firstName || '',
      lastName: post.author.lastName || '',
    },
    translation: processedTranslation,
  };

  return {
    post: blogPost,
    shouldRedirect,
    correctSlug: shouldRedirect ? correctSlug : undefined,
  };
}

// Get a blog post by either main slug or locale-specific slug
export async function getBlogPostByAnySlug(urlSlug: string, language: Language): Promise<BlogPost | null> {
  const { whereClause, orderBy } = getDatabaseLanguageFilter(language);

  // First try to find by main slug
  let post = await prisma.post.findFirst({
    where: {
      slug: urlSlug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
      translations: {
        // Get both requested language and English as fallback
        where: whereClause,
        select: {
          locale: true,
          title: true,
          abstract: true,
          content: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
        },
        orderBy: orderBy,
      },
    },
  });

  // If not found by main slug, try to find by locale-specific slug
  if (!post) {
    const postByLocaleSlug = await prisma.post.findFirst({
      where: {
        translations: {
          some: {
            slug: urlSlug,
            locale: language,
          },
        },
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        translations: {
          // Get both requested language and English as fallback
          where: whereClause,
          select: {
            locale: true,
            title: true,
            abstract: true,
            content: true,
            slug: true,
            metaTitle: true,
            metaDescription: true,
          },
          orderBy: orderBy,
        },
      },
    });
    post = postByLocaleSlug;
  }

  if (!post) return null;

  // Find the best translation: requested language first, then English fallback
  const requestedTranslation = post.translations.find((t) => t.locale === language);
  const fallbackTranslation = post.translations.find((t) => t.locale === 'en-US');
  const selectedTranslation = requestedTranslation || fallbackTranslation;

  // Process markdown content to HTML if translation exists
  const processedTranslation = selectedTranslation
    ? {
        ...selectedTranslation,
        content: markdownToHtmlSync(selectedTranslation.content),
      }
    : null;

  return {
    id: post.id,
    slug: post.slug,
    status: post.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    featured: post.featured,
    banner: post.banner,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    author: {
      username: post.author.username,
      firstName: post.author.firstName || '',
      lastName: post.author.lastName || '',
    },
    translation: processedTranslation,
  };
}

// Get a blog post by either main slug or locale-specific slug with caching
export async function getBlogPostByAnySlugWithCache(urlSlug: string, language: Language): Promise<BlogPost | null> {
  if (!process.env.ACCELERATE_URL) {
    return getBlogPostByAnySlug(urlSlug, language);
  }

  const { whereClause, orderBy } = getDatabaseLanguageFilter(language);

  // Use enhanced client for caching
  const client = getPrismaClient() as AccelerateClient;

  // First try to find by main slug
  let post = await client.post.findFirst({
    where: {
      slug: urlSlug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          username: true,
          firstName: true,
          lastName: true,
        },
      },
      translations: {
        // Get both requested language and English as fallback
        where: whereClause,
        select: {
          locale: true,
          title: true,
          abstract: true,
          content: true,
          slug: true,
          metaTitle: true,
          metaDescription: true,
        },
        orderBy: orderBy,
      },
    },
    cacheStrategy: { ttl: 900, swr: 1800 }, // 15 min cache, 30 min stale-while-revalidate
  });

  // If not found by main slug, try to find by locale-specific slug
  if (!post) {
    const postByLocaleSlug = await client.post.findFirst({
      where: {
        translations: {
          some: {
            slug: urlSlug,
            locale: language,
          },
        },
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        translations: {
          // Get both requested language and English as fallback
          where: whereClause,
          select: {
            locale: true,
            title: true,
            abstract: true,
            content: true,
            slug: true,
            metaTitle: true,
            metaDescription: true,
          },
          orderBy: orderBy,
        },
      },
      cacheStrategy: { ttl: 900, swr: 1800 },
    });
    post = postByLocaleSlug;
  }

  // Type assertion for the cached result
  const typedPost = post as {
    id: number;
    slug: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    featured: boolean;
    banner: string | null;
    readTime: number | null;
    publishedAt: Date | null;
    author: {
      username: string;
      firstName: string;
      lastName: string;
    };
    translations: {
      locale: string;
      title: string;
      abstract: string;
      content: string;
      slug: string | null;
      metaTitle: string | null;
      metaDescription: string | null;
    }[];
  } | null;

  if (!typedPost) return null;

  // Find the best translation: requested language first, then English fallback
  const requestedTranslation = typedPost.translations.find((t) => t.locale === language);
  const fallbackTranslation = typedPost.translations.find((t) => t.locale === 'en-US');
  const selectedTranslation = requestedTranslation || fallbackTranslation;

  // Process markdown content to HTML if translation exists
  const processedTranslation = selectedTranslation
    ? {
        ...selectedTranslation,
        content: markdownToHtmlSync(selectedTranslation.content),
      }
    : null;

  return {
    id: typedPost.id,
    slug: typedPost.slug,
    status: typedPost.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    featured: typedPost.featured,
    banner: typedPost.banner,
    readTime: typedPost.readTime,
    publishedAt: typedPost.publishedAt,
    author: typedPost.author,
    translation: processedTranslation,
  };
}