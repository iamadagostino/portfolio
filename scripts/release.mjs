/**
 * Versioning + changelog, ported from auth.parcelabs.com (scripts/release.mjs +
 * scripts/generate-changelog.mjs), merged into one file so the "which commits
 * count" rules can't drift apart between the two.
 *
 * Annotated tags are the single source of truth. CHANGELOG.md is regenerated
 * from them and committed, so every release is reviewable in a diff.
 *
 * Difference from auth: dependency updates are tracked. `chore(deps)` commits
 * cut a patch release and appear in the changelog *with their commit body*, so
 * the upgrade notes (what moved, what was pinned and why) are kept per release.
 * Write those bodies with that in mind.
 *
 * Usage:
 *   pnpm release                       derive the bump, tag, regenerate, commit
 *   pnpm release --title "v1.2.0 — …"  override the tag subject
 *   pnpm release --dry-run             print what would happen, touch nothing
 *   pnpm changelog                     regenerate CHANGELOG.md from existing tags
 *
 * Afterwards: git push --follow-tags
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PKG = resolve(ROOT, 'package.json');
const CHANGELOG = resolve(ROOT, 'CHANGELOG.md');

const git = (...args) =>
  execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();

/** Conventional-commit subject, with the `!` breaking marker. */
const SUBJECT = /^([a-z]+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/;

/** Types that describe a change worth a release and a changelog line. */
const INCLUDED_TYPES = ['feat', 'fix', 'security', 'refactor', 'perf'];

/** chore is noise except dependency work, which we explicitly want tracked. */
const isIncluded = (c) => INCLUDED_TYPES.includes(c.type) || (c.type === 'chore' && c.scope === 'deps');

/** Trailers are attribution, not release notes. */
const TRAILER = /^(Co-Authored-By|Signed-off-by|Reviewed-by):/i;

/**
 * Every non-merge commit in `range`, parsed. Non-conventional subjects keep
 * type null so they still count toward totalCommits.
 *
 * \x1f between fields, \x1e between commits: bodies are multi-line, so a
 * newline-delimited format would split one commit into bogus records.
 */
function commitsInRange(range) {
  const out = git('log', '--no-merges', '--date=short', '--format=%h\x1f%ad\x1f%s\x1f%b\x1e', range);

  return out
    .split('\x1e')
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [sha, date, subject, body = ''] = record.split('\x1f');
      const [, type = null, scope = null, bang, description = subject] = SUBJECT.exec(subject) ?? [];

      return {
        sha,
        date,
        type,
        scope,
        subject: description,
        body: body
          .split('\n')
          .filter((line) => !TRAILER.test(line))
          .join('\n')
          .trim(),
        breaking: bang === '!' || body.includes('BREAKING CHANGE'),
      };
    });
}

/**
 * feat → minor, breaking → major, everything else included → patch.
 * Returns null when nothing in the range warrants a release.
 */
function deriveBump(commits) {
  const releasable = commits.filter(isIncluded);

  if (releasable.length === 0) return null;
  if (releasable.some((c) => c.breaking)) return 'major';

  return releasable.some((c) => c.type === 'feat') ? 'minor' : 'patch';
}

function nextVersion(version, bump) {
  const [major, minor, patch] = version.split('.').map(Number);

  if (bump === 'major') return `${major + 1}.0.0`;
  if (bump === 'minor') return `${major}.${minor + 1}.0`;

  return `${major}.${minor}.${patch + 1}`;
}

/** `v1.3.0 — 8 changes (Sep 2026)`. en-US: en-GB renders September as "Sept". */
function defaultTitle(version, count) {
  const month = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return `v${version} — ${count} change${count === 1 ? '' : 's'} (${month})`;
}

const sortedTags = () => git('tag', '--sort=v:refname').split('\n').filter(Boolean);

function renderEntry(c) {
  const label = c.type === 'chore' ? 'deps' : c.type;
  const scope = c.scope && c.type !== 'chore' ? `(${c.scope})` : '';
  const head = `- **${label}${scope}${c.breaking ? '!' : ''}**: ${c.subject} (\`${c.sha}\`)`;
  const body = c.body
    ? `\n\n${c.body
        .split('\n')
        .map((line) => (line ? `  ${line}` : ''))
        .join('\n')}\n`
    : '';

  return head + body;
}

/** Rebuilds CHANGELOG.md from the annotated tags, newest release first. */
function generateChangelog() {
  const tags = sortedTags();

  if (tags.length === 0) {
    throw new Error('No tags found. Cut the first release by hand.');
  }

  const sections = tags
    .map((tag, index) => {
      const previous = tags[index - 1];
      const commits = commitsInRange(previous ? `${previous}..${tag}` : tag);
      const entries = commits.filter(isIncluded).reverse(); // oldest-first within a release
      const title = git('tag', '-l', '--format=%(contents:subject)', tag);
      const date = git('log', '-1', '--format=%ad', '--date=short', tag);
      const notes = git('tag', '-l', '--format=%(contents:body)', tag);

      return [
        `## ${title}`,
        '',
        `_${date} · ${commits.length} commit${commits.length === 1 ? '' : 's'}_`,
        ...(notes ? ['', notes] : []),
        '',
        ...(entries.length ? entries.map(renderEntry) : ['_No tracked changes._']),
        '',
      ].join('\n');
    })
    .reverse();

  // No timestamp: regenerating on unchanged tags yields an identical file.
  const header =
    '# Changelog\n\nGenerated by `pnpm changelog` from annotated git tags — do not edit by hand.\n' +
    'Tracked: feat, fix, security, refactor, perf, and chore(deps) (with full notes).\n';

  writeFileSync(CHANGELOG, `${header}\n${sections.join('\n')}`);
  console.log(`CHANGELOG.md — ${tags.length} releases → ${tags.at(-1)}`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

// ── changelog only ───────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--changelog-only')) {
  generateChangelog();
  process.exit(0);
}

// ── guards ───────────────────────────────────────────────────────────────────

const dryRun = args.includes('--dry-run');
const titleFlag = args.indexOf('--title');
const titleOverride = titleFlag === -1 ? null : args[titleFlag + 1];

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
if (branch !== 'master') fail(`On ${branch}. Releases are cut from master.`);
if (git('status', '--porcelain') !== '') fail('Working tree is dirty. Commit or stash before releasing.');

const tags = sortedTags();
if (tags.length === 0) fail('No tags found. Cut the first release by hand.');

const lastTag = tags.at(-1);
const current = JSON.parse(readFileSync(PKG, 'utf8')).version;
const commits = commitsInRange(`${lastTag}..HEAD`);
const bump = deriveBump(commits);

// `== null` on purpose: a deriveBump() returning undefined must not cut a tag.
if (bump == null) {
  console.log(`Nothing to release since ${lastTag}.`);
  process.exit(0);
}

const version = nextVersion(current, bump);
const tag = `v${version}`;
const title = titleOverride ?? defaultTitle(version, commits.filter(isIncluded).length);

if (tags.includes(tag)) fail(`${tag} already exists.`);

console.log(`${lastTag} → ${tag}  (${bump}, ${commits.length} commits)`);
console.log(`  ${title}`);
if (dryRun) process.exit(0);

// ── cut ──────────────────────────────────────────────────────────────────────
// Tag first (the changelog reads tags), so the chore(release) commit lands
// *after* the tag it describes. Any failure deletes the tag: no half-releases.

git('tag', '-a', tag, '-m', title);

try {
  const pkg = readFileSync(PKG, 'utf8');
  writeFileSync(PKG, pkg.replace(`"version": "${current}"`, `"version": "${version}"`));
  generateChangelog();
  git('add', PKG, CHANGELOG);
  git('commit', '-m', `chore(release): ${tag}`);
} catch (error) {
  git('tag', '-d', tag);
  git('checkout', '--', PKG);
  fail(`Release aborted, ${tag} removed: ${error.message}`);
}

console.log(`\nCut ${tag}. Push with:\n  git push --follow-tags`);
