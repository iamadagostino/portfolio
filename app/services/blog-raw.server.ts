// Raw markdown blog post service - extends the main blog service
import { prisma } from '~/.server/db';
import type { Language } from '~/i18n/i18n.resources';
import type { BlogPost } from './blog.server';

// Get a blog post with raw markdown content (for MDXProvider)
export async function getBlogPostWithRawMarkdown(slug: string, language: Language): Promise<BlogPost | null> {
  const langEnum = language.toUpperCase() as 'EN' | 'IT';

  let post = await prisma.post.findFirst({
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
        where: {
          language: langEnum,
        },
        select: {
          title: true,
          abstract: true,
          content: true, // Raw markdown content (no processing)
          slug: true,
          metaTitle: true,
          metaDescription: true,
        },
      },
    },
  });

  // If not found by main slug, try locale-specific slug
  if (!post) {
    const postByLocaleSlug = await prisma.post.findFirst({
      where: {
        translations: {
          some: {
            slug,
            language: langEnum,
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
          where: {
            language: langEnum,
          },
          select: {
            title: true,
            abstract: true,
            content: true, // Raw markdown content (no processing)
            slug: true,
            metaTitle: true,
            metaDescription: true,
          },
        },
      },
    });
    post = postByLocaleSlug;
  }

  if (!post) return null;

  // Return raw markdown content (no markdownToHtmlSync processing)
  const rawTranslation = post.translations[0] || null;

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
    translation: rawTranslation,
  };
}
