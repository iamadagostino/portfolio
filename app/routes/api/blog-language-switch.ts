import type { ActionFunctionArgs } from 'react-router';
import { getBlogPostByAnySlugWithCache } from '~/services/blog.server';
import type { Language } from '~/i18n/i18n.resources';

interface LanguageSwitchRequest {
  currentSlug: string;
  currentLang: Language;
  targetLang: Language;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = (await request.json()) as LanguageSwitchRequest;
    const { currentSlug, currentLang, targetLang } = body;

    // Get the current post to find its main slug
    const currentPost = await getBlogPostByAnySlugWithCache(currentSlug, currentLang);

    if (currentPost) {
      // Get the post in the target language to find the appropriate slug
      const targetPost = await getBlogPostByAnySlugWithCache(
        currentPost.slug,
        targetLang
      );

      if (targetPost && targetPost.translation) {
        // Use locale-specific slug if available, otherwise use main slug
        const targetSlug = targetPost.translation.slug || targetPost.slug;

        const targetUrl = `/${targetLang}/article/${targetSlug}`;

        return Response.json({ targetUrl });
      }
    }

    // If we can't find the post, return an error so the client falls back to simple switching
    throw new Response('Post not found', { status: 404 });
  } catch (error) {
    console.error('Error in language switch API:', error);
    throw new Response('Internal server error', { status: 500 });
  }
};
