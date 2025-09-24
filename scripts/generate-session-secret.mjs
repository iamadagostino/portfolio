import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(ROOT, '../.env');

const key = 'SESSION_SECRET';
const secret = randomBytes(32).toString('hex');

async function main() {
  let content = '';

  try {
    content = await readFile(envPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const pattern = new RegExp(`^${key}=.*$`, 'm');
  if (pattern.test(content)) {
    content = content.replace(pattern, `${key}=${secret}`);
  } else {
    const needsNewline = content.length > 0 && !content.endsWith('\n');
    content += `${needsNewline ? '\n' : ''}${key}=${secret}\n`;
  }

  await writeFile(envPath, content, 'utf8');
  console.log(`Updated ${key} in ${path.relative(process.cwd(), envPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
