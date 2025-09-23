import { createLocalizedLoader } from '../../locale-loader';
import { getBlogPostsWithCache } from '~/services/blog.server';
import { Articles } from './articles';

// Custom loader with articles data
export const loader = createLocalizedLoader(async ({ language }) => {
  try {
    // Load posts from database with caching
    const allPosts = await getBlogPostsWithCache(language as 'en' | 'it');
    const featured = allPosts.find(post => post.featured);
    const posts = allPosts.filter(post => post.slug !== featured?.slug);

    return { posts, featured, lang: language };
  } catch (error) {
    console.error('Error loading articles:', error);
    return { posts: [], featured: null, lang: language };
  }
});

export default Articles;

export const meta = () => {
  return [
    { title: 'Articles' },
    {
      name: 'description',
      content: 'A collection of technical design and development articles.',
    },
  ];
};

export const handle = {
  i18n: ['articles', 'common'],
};
