import { useMemo } from 'react';
import { useLoaderData } from 'react-router';
import type { BlogPost } from '~/services/blog.server';
import { formatDate } from '~/utils/date';

interface BlogPostPageData {
  post: BlogPost;
  lang: string;
}

export default function BlogPost() {
  const { post, lang } = useLoaderData<BlogPostPageData>();

  // Format date for display using shared helper for consistent localization
  const formattedDate = useMemo(() => {
    if (!post.publishedAt) return '';
    return formatDate(post.publishedAt, lang === 'en' ? 'en' : 'it');
  }, [post.publishedAt, lang]);

  const isoDate = useMemo(() => {
    if (!post.publishedAt) return '';
    return new Date(post.publishedAt).toISOString();
  }, [post.publishedAt]);

  // Check if we have translation content
  if (!post.translation) {
    return (
      <div className="article">
        <div className="article__content">
          <h1>Post not available in this language</h1>
          <p>This post is not available in the selected language.</p>
        </div>
      </div>
    );
  }

  const { title, abstract, content } = post.translation;

  return (
    <article className="article">
      {post.banner && (
        <div className="article__banner">
          <img src={post.banner} alt={title} className="article__banner-image" />
        </div>
      )}

      <div className="article__content">
        <header className="article__header">
          <h1 className="article__title">{title}</h1>

          <div className="article__meta">
            <time className="article__date" dateTime={isoDate}>
              {formattedDate}
            </time>

            {post.readTime && (
              <>
                <span className="article__separator">•</span>
                <span className="article__read-time">{post.readTime} min read</span>
              </>
            )}

            <span className="article__separator">•</span>
            <span className="article__author">
              {post.author.firstName} {post.author.lastName}
            </span>
          </div>

          <p className="article__abstract">{abstract}</p>
        </header>

        <div className="article__body" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </article>
  );
}
