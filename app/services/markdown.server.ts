import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

/**
 * Custom remark plugin to transform image paths
 * Converts "static/articles/..." to "/static/articles/..."
 */
function remarkImagePathTransform() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, 'image', (node: any) => {
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
