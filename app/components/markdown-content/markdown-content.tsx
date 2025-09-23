import { useEffect, useState } from 'react';
import { postMarkdown } from '~/layouts/post/post-markdown';

interface MarkdownContentProps {
  html: string;
}

// Generate heading ID from text content (matches original MDX behavior)
const generateHeadingId = (textContent: string): string => {
  return textContent
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
};

export const MarkdownContent = ({ html }: MarkdownContentProps) => {
  const [isClient, setIsClient] = useState(false);
  const [components, setComponents] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== 'undefined') {
      // Client-side: Parse HTML and convert to React components using postMarkdown
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const elements = Array.from(doc.body.children);

      const parsedComponents = elements.map((element, index) => {
        const key = `element-${index}`;
        const textContent = element.textContent || '';

        switch (element.tagName.toLowerCase()) {
          case 'h1': {
            const id = generateHeadingId(textContent);
            const PostH1 = postMarkdown.h1;
            return (
              <PostH1 key={key} id={id}>
                {textContent}
              </PostH1>
            );
          }
          case 'h2': {
            const id = generateHeadingId(textContent);
            const PostH2 = postMarkdown.h2;
            return (
              <PostH2 key={key} id={id}>
                {textContent}
              </PostH2>
            );
          }
          case 'h3': {
            const id = generateHeadingId(textContent);
            const PostH3 = postMarkdown.h3;
            return (
              <PostH3 key={key} id={id}>
                {textContent}
              </PostH3>
            );
          }
          case 'h4': {
            const id = generateHeadingId(textContent);
            const PostH4 = postMarkdown.h4;
            return (
              <PostH4 key={key} id={id}>
                {textContent}
              </PostH4>
            );
          }
          case 'p': {
            // Check if paragraph contains only an image
            const img = element.querySelector('img');
            if (img && element.children.length === 1 && !element.textContent?.trim()) {
              const PostImg = postMarkdown.img;
              return (
                <PostImg
                  key={key}
                  src={img.getAttribute('src') || ''}
                  alt={img.getAttribute('alt') || ''}
                  width={img.getAttribute('width') || undefined}
                  height={img.getAttribute('height') || undefined}
                />
              );
            }
            const PostP = postMarkdown.p;
            return (
              <PostP key={key}>
                <span dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </PostP>
            );
          }
          case 'ul': {
            const PostUl = postMarkdown.ul;
            const PostLi = postMarkdown.li;
            return (
              <PostUl key={key}>
                {Array.from(element.children).map((li, liIndex) => (
                  <PostLi key={`li-${index}-${liIndex}`}>
                    <span dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
                  </PostLi>
                ))}
              </PostUl>
            );
          }
          case 'ol': {
            const PostOl = postMarkdown.ol;
            const PostLi = postMarkdown.li;
            return (
              <PostOl key={key}>
                {Array.from(element.children).map((li, liIndex) => (
                  <PostLi key={`li-${index}-${liIndex}`}>
                    <span dangerouslySetInnerHTML={{ __html: li.innerHTML }} />
                  </PostLi>
                ))}
              </PostOl>
            );
          }
          case 'pre': {
            const PostPre = postMarkdown.pre;
            return (
              <PostPre key={key}>
                <span dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </PostPre>
            );
          }
          case 'blockquote': {
            const PostBlockquote = postMarkdown.blockquote;
            return (
              <PostBlockquote key={key}>
                <span dangerouslySetInnerHTML={{ __html: element.innerHTML }} />
              </PostBlockquote>
            );
          }
          case 'hr': {
            const PostHr = postMarkdown.hr;
            return <PostHr key={key} />;
          }
          case 'img': {
            const PostImg = postMarkdown.img;
            return (
              <PostImg
                key={key}
                src={element.getAttribute('src') || ''}
                alt={element.getAttribute('alt') || ''}
                width={element.getAttribute('width') || undefined}
                height={element.getAttribute('height') || undefined}
              />
            );
          }
          default:
            return (
              <div key={key} dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
            );
        }
      });

      setComponents(parsedComponents);
    }
  }, [html]);

  // Server-side: render nothing to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return <>{components}</>;
};
