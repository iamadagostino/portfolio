import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

/**
 * Converts markdown content to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown support
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
    .use(remarkHtml, { sanitize: false })
    .processSync(markdown);

  return result.toString();
}
