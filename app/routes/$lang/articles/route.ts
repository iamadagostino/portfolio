import { createLocalizedLoader } from '../../locale-loader';
import { getBlogPostsWithCache } from '@/services/blog.server';
import { Articles } from './articles';

// Custom loader with articles data
export const loader = createLocalizedLoader(async ({ language }) => {
  try {
    // Load posts from database with caching using full locale codes
    console.log('🔍 Loading articles for language:', language);
    const allPosts = await getBlogPostsWithCache(language);
    console.log('📝 Found posts:', allPosts.length);
    
    const featured = allPosts.find(post => post.featured);
    const posts = allPosts.filter(post => post.slug !== featured?.slug);
    
    console.log('🌟 Featured post:', featured ? featured.translation?.title : 'none');
    console.log('📚 Other posts:', posts.length);

    return { posts, featured, lang: language };
  } catch (error) {
    console.error('❌ Error loading articles:', error);
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
