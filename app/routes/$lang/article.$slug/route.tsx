import { LoaderFunctionArgs, redirect, useLoaderData } from 'react-router';

import { MarkdownContent } from '~/components/main/markdown-content';
import { Post } from '~/layouts/post';
import { getBlogPostWithSlugValidation } from '~/services/blog.server';
import { formatTimecode } from '~/utils/timecode';

import { returnLanguageIfSupported } from '../../../i18n/i18n.resources';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const lang = returnLanguageIfSupported(params.lang);

  if (!lang) {
    throw redirect('/');
  }

  const urlSlug = params.slug;
  if (!urlSlug) {
    throw new Error('Slug not found');
  }

  try {
    // Get post and check if URL should redirect to correct slug
    const { post, shouldRedirect, correctSlug } = await getBlogPostWithSlugValidation(urlSlug, lang);

    if (!post || !post.translation) {
      throw new Response('Article not found', { status: 404 });
    }

    // Redirect to correct slug if needed (prevents duplicate content)
    if (shouldRedirect && correctSlug) {
      console.log('🔄 Redirecting from', urlSlug, 'to', correctSlug);
      throw redirect(`/${lang}/articles/${correctSlug}`, 301); // 301 permanent redirect
    }

    // Calculate timecode from reading time
    const timecode = post.readTime ? formatTimecode(post.readTime * 60 * 1000) : formatTimecode(5 * 60 * 1000); // Default 5 minutes

    return {
      post,
      timecode,
      lang,
    };
  } catch (error) {
    console.error('Error loading article:', error);
    throw new Response('Article not found', { status: 404 });
  }
};

export const meta = ({
  data,
}: {
  data: { post: { translation: { title: string; metaDescription?: string } } } | undefined;
}) => {
  if (!data?.post?.translation) return [];
  const { title, metaDescription } = data.post.translation;
  return [
    { title },
    { name: 'description', content: metaDescription || title },
    { property: 'og:title', content: title },
    { property: 'og:description', content: metaDescription || title },
  ];
};

export default function ArticlePage() {
  const { post, timecode, lang } = useLoaderData<typeof loader>();

  if (!post.translation) {
    return <div>Article not found</div>;
  }

  const { title, content } = post.translation;

  return (
    <Post
      title={title}
      date={post.publishedAt || new Date()}
      banner={post.banner || ''}
      timecode={timecode}
      language={lang}
    >
      {/* Render processed HTML from markdown with proper styling */}
      <MarkdownContent html={content} />
    </Post>
  );
}

export const handle = {
  i18n: ['articles', 'common'],
};
