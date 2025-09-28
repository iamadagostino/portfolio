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

// Recursively parse DOM elements and convert to React components
const parseElement = (element: Element, keyPrefix = ''): React.ReactNode => {
  const tagName = element.tagName.toLowerCase();

  // Handle text nodes
  if (element.nodeType === Node.TEXT_NODE) {
    return element.textContent;
  }

  // Handle different HTML elements
  switch (tagName) {
    case 'h1': {
      const id = generateHeadingId(element.textContent || '');
      const PostH1 = postMarkdown.h1;
      return (
        <PostH1 key={keyPrefix} id={id}>
          {parseChildren(element, keyPrefix)}
        </PostH1>
      );
    }
    case 'h2': {
      const id = generateHeadingId(element.textContent || '');
      const PostH2 = postMarkdown.h2;
      return (
        <PostH2 key={keyPrefix} id={id}>
          {parseChildren(element, keyPrefix)}
        </PostH2>
      );
    }
    case 'h3': {
      const id = generateHeadingId(element.textContent || '');
      const PostH3 = postMarkdown.h3;
      return (
        <PostH3 key={keyPrefix} id={id}>
          {parseChildren(element, keyPrefix)}
        </PostH3>
      );
    }
    case 'h4': {
      const id = generateHeadingId(element.textContent || '');
      const PostH4 = postMarkdown.h4;
      return (
        <PostH4 key={keyPrefix} id={id}>
          {parseChildren(element, keyPrefix)}
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
            key={keyPrefix}
            src={img.getAttribute('src') || ''}
            alt={img.getAttribute('alt') || ''}
            width={img.getAttribute('width') || undefined}
            height={img.getAttribute('height') || undefined}
          />
        );
      }
      const PostP = postMarkdown.p;
      return <PostP key={keyPrefix}>{parseChildren(element, keyPrefix)}</PostP>;
    }
    case 'a': {
      const PostLink = postMarkdown.a;
      return (
        <PostLink
          key={keyPrefix}
          href={element.getAttribute('href') || '#'}
          target={element.getAttribute('target') || undefined}
          rel={element.getAttribute('rel') || undefined}
        >
          {parseChildren(element, keyPrefix)}
        </PostLink>
      );
    }
    case 'code': {
      // Check if this code is inside a pre block
      if (element.parentElement?.tagName.toLowerCase() === 'pre') {
        // This will be handled by the pre case
        return parseChildren(element, keyPrefix);
      }
      const PostCode = postMarkdown.code;
      return <PostCode key={keyPrefix}>{parseChildren(element, keyPrefix)}</PostCode>;
    }
    case 'strong': {
      const PostStrong = postMarkdown.strong;
      return <PostStrong key={keyPrefix}>{parseChildren(element, keyPrefix)}</PostStrong>;
    }
    case 'ul': {
      const PostUl = postMarkdown.ul;
      const PostLi = postMarkdown.li;
      return (
        <PostUl key={keyPrefix}>
          {Array.from(element.children).map((li, liIndex) => (
            <PostLi key={`${keyPrefix}-li-${liIndex}`}>{parseChildren(li, `${keyPrefix}-li-${liIndex}`)}</PostLi>
          ))}
        </PostUl>
      );
    }
    case 'ol': {
      const PostOl = postMarkdown.ol;
      const PostLi = postMarkdown.li;
      return (
        <PostOl key={keyPrefix}>
          {Array.from(element.children).map((li, liIndex) => (
            <PostLi key={`${keyPrefix}-li-${liIndex}`}>{parseChildren(li, `${keyPrefix}-li-${liIndex}`)}</PostLi>
          ))}
        </PostOl>
      );
    }
    case 'pre': {
      const PostPre = postMarkdown.pre;
      return <PostPre key={keyPrefix}>{parseChildren(element, keyPrefix)}</PostPre>;
    }
    case 'blockquote': {
      const PostBlockquote = postMarkdown.blockquote;
      return <PostBlockquote key={keyPrefix}>{parseChildren(element, keyPrefix)}</PostBlockquote>;
    }
    case 'hr': {
      const PostHr = postMarkdown.hr;
      return <PostHr key={keyPrefix} />;
    }
    case 'img': {
      const PostImg = postMarkdown.img;
      return (
        <PostImg
          key={keyPrefix}
          src={element.getAttribute('src') || ''}
          alt={element.getAttribute('alt') || ''}
          width={element.getAttribute('width') || undefined}
          height={element.getAttribute('height') || undefined}
        />
      );
    }
    default:
      // For unsupported elements, render children directly
      return parseChildren(element, keyPrefix);
  }
};

// Parse all children of an element
const parseChildren = (element: Element, keyPrefix = ''): React.ReactNode[] => {
  const children = Array.from(element.childNodes);

  return children
    .map((child, index) => {
      const childKey = `${keyPrefix}-child-${index}`;

      if (child.nodeType === Node.TEXT_NODE) {
        return child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        return parseElement(child as Element, childKey);
      }

      return null;
    })
    .filter(Boolean);
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

      const parsedComponents = elements
        .map((element, index) => {
          const key = `element-${index}`;
          return parseElement(element, key) as React.ReactElement;
        })
        .filter(Boolean);

      setComponents(parsedComponents);
    }
  }, [html]);

  // Server-side: render nothing to avoid hydration issues
  if (!isClient) {
    return null;
  }

  return <>{components}</>;
};
