import { useLoaderData } from 'react-router';
import { useMemo } from 'react';
import type { BlogPost } from '~/services/blog.server';

interface BlogPostPageData {
  post: BlogPost;
  lang: string;
}

export default function BlogPost() {
  const { post, lang } = useLoaderData<BlogPostPageData>();

  // Format date for display
  const formattedDate = useMemo(() => {
    if (!post.publishedAt) return '';
    const date = new Date(post.publishedAt);
    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
