// Minimal local types to avoid requiring the 'mdast' package for typings.
// Keep these narrow to satisfy TS and ESLint without adding deps.
type ImageNode = {
  type: 'image';
  url?: string;
  alt?: string | null;
  title?: string | null;
  [key: string]: unknown;
};

type RootNode = {
  type: 'root';
  children: unknown[];
  [key: string]: unknown;
};

import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import { visit } from 'unist-util-visit';

/**
 * Custom remark plugin to transform image paths
 * Converts "static/articles/..." to "/static/articles/..."
 */
function remarkImagePathTransform() {
  return (tree: RootNode) => {
    visit(tree, 'image', (node: ImageNode) => {
      if (node.url && typeof node.url === 'string') {
        // Transform relative paths starting with "static/" to absolute paths
        if (node.url.startsWith('static/')) {
          node.url = `/${node.url}`;
        }
      }
    });
  };
}

/**
 * Converts markdown content to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown support
    .use(remarkImagePathTransform) // Transform image paths
    .use(remarkHtml, { sanitize: false }) // Convert to HTML, allow HTML tags
    .process(markdown);

  return result.toString();
}

/**
 * Synchronous version for use in loaders (server-side only)
 */
export function markdownToHtmlSync(markdown: string): string {
  const result = remark()
    .use(remarkGfm)
    .use(remarkImagePathTransform) // Transform image paths
    .use(remarkHtml, { sanitize: false })
    .processSync(markdown);

  return result.toString();
}
