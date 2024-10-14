require('colors'); // Module for colored console output
const fs = require('fs'); // File system module
const path = require('path'); // Path module
const semver = require('semver'); // Semver module

/**
 * Function to detect the package manager in use.
 */
function detectPackageManager() {
  if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
  if (fs.existsSync('package-lock.json')) return 'npm';
  if (fs.existsSync('yarn.lock')) return 'yarn';
  return null;
}

/**
 * Function to find the dynamic remix-i18next directory.
 */
function findDirectory(basePath, searchPattern) {
  const dirs = fs.readdirSync(basePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return dirs.find((dir) => dir.startsWith(searchPattern)) || null;
}

/**
 * Function to extract the version from the directory name.
 */
function extractVersion(dirName, prefix) {
  const versionMatch = dirName.match(new RegExp(`${prefix}([\\d.]+)`));
  return versionMatch ? versionMatch[1] : null;
}

// Detect package manager
const packageManager = detectPackageManager();
if (!packageManager) {
  console.error('Could not detect a package manager'.red);
  process.exit(1);
}

console.info(`Detected package manager: ${packageManager}`.cyan);

const nodeModules = 'node_modules'; // Node modules directory
const moduleName = 'remix-i18next'; // Module name
const versionRange = '>=6.4.1 <=7.0.2'; // Desired version range

// Set basePath based on package manager
const basePath =
  packageManager === 'pnpm'
    ? `./${nodeModules}/.pnpm/`
    : `./${nodeModules}/`;

const remixI18nextDir = findDirectory(basePath, `${moduleName}@`);
if (!remixI18nextDir) {
  console.error(`Could not find remix-i18next directory in ${basePath}`.red);
  process.exit(1);
}

// Extract the version
const currentVersion = extractVersion(remixI18nextDir, `${moduleName}@`);

if (!currentVersion) {
  console.error(`Could not determine the version for remix-i18next in ${remixI18nextDir}`.red);
  process.exit(1);
}

// Check if the current version is within the desired range
if (!semver.satisfies(currentVersion, versionRange)) {
  console.warn(
    `Warning: remix-i18next version ${currentVersion} is not within the desired range ${versionRange}.\n`.yellow +
    `Please ensure compatibility before proceeding.`.yellow
  );
  process.exit(1); // Exit if the version is not in the range
}

console.info(`Found compatible remix-i18next version: ${currentVersion}`.green);

// Define paths for sourcemap patching
const directories = packageManager === 'pnpm'
  ? [
      path.join(basePath, remixI18nextDir, nodeModules, moduleName),
    ]
  : [
      path.join(basePath, remixI18nextDir, moduleName),
    ];

/**
 * Patches general sourcemap files first.
 */
function patchGeneralSourceMaps(dir) {
  if (!fs.existsSync(dir)) {
    console.info(`Directory not found: ${dir}`.red);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    if (file.endsWith('.js.map')) {
      const filePath = path.join(dir, file);

      try {
        // Read the sourcemap file
        const sourcemap = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Replace sources with corresponding .d.ts file
        sourcemap.sources = sourcemap.sources.map((source) =>
          source.startsWith('../') ? `./${path.basename(source, '.ts')}.d.ts` : source
        );

        // Write the updated sourcemap back
        fs.writeFileSync(filePath, JSON.stringify(sourcemap, null, 2), 'utf8');
        console.info(`Patched general: ${filePath}`.green);
      } catch (error) {
        console.error(`Failed to patch sourcemap ${filePath}: ${error.message}`.red);
      }
    }
  });
}

/**
 * Applies specific replacement rules to sourcemap files.
 */
function applyReplacementRules(dir) {
  if (!fs.existsSync(dir)) {
    console.info(`Directory not found: ${dir}`.red);
    return;
  }

  // Define specific replacements for sourcemap files
  const replacementRules = {
    'build/client.js.map': {
      oldSources: ['../src/client.ts'],
      newSources: ['./client.d.ts'],
    },
    'build/react.js.map': {
      oldSources: ['../src/react.tsx'],
      newSources: ['./react.d.ts'],
    },
    'build/server.js.map': {
      oldSources: ['../src/server.ts'],
      newSources: ['./server.d.ts'],
    },
    'build/lib/parser.js.map': {
      oldSources: ['../../src/lib/parser.ts'],
      newSources: ['./parser.d.ts'],
    },
    'build/lib/get-client-locales.js.map': {
      oldSources: ['../../src/lib/get-client-locales.ts'],
      newSources: ['./get-client-locales.d.ts'],
    },
    'build/lib/format-language-string.js.map': {
      oldSources: ['../../src/lib/format-language-string.ts'],
      newSources: ['./format-language-string.d.ts'],
    },
  };

  Object.entries(replacementRules).forEach(([relativePath, { oldSources, newSources }]) => {
    const filePath = path.join(dir, relativePath);

    if (fs.existsSync(filePath)) {
      try {
        // Read the sourcemap file
        const sourcemap = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Replace sources based on rules
        sourcemap.sources = sourcemap.sources.map((source) =>
          oldSources.includes(source) ? newSources[oldSources.indexOf(source)] : source
        );

        // Write the updated sourcemap back
        fs.writeFileSync(filePath, JSON.stringify(sourcemap, null, 2), 'utf8');
        console.info(`Patched with rules: ${filePath}`.magenta);
      } catch (error) {
        console.error(`Failed to patch sourcemap ${filePath}: ${error.message}`.red);
      }
    } else {
      console.warn(`File not found for patching: ${filePath}`.yellow);
    }
  });
}

/**
 * Orchestrates the patching process.
 */
function patchSourceMaps(dir) {
  // Step 1: Apply general sourcemap fixes first
  patchGeneralSourceMaps(dir);

  // Step 2: Apply specific replacement rules
  applyReplacementRules(dir);
}

// Apply patches to all directories
directories.forEach(patchSourceMaps);

console.info('Sourcemaps patching completed'.cyan);