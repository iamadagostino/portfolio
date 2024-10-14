import { fixupConfigRules, fixupPluginRules, includeIgnoreFile } from "@eslint/compat";

import { FlatCompat } from "@eslint/eslintrc";
import _import from "eslint-plugin-import";
import { fileURLToPath } from "node:url";
import globals from "globals";
import js from "@eslint/js";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import path from "node:path";
import react from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

// Get the filename and directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Include the .gitignore file in the project root
const gitignorePath = path.resolve(__dirname, ".gitignore");

// Create a new FlatCompat instance
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

// Export the ESLint configuration
export default [...compat.extends("eslint:recommended", "plugin:storybook/recommended"), includeIgnoreFile(gitignorePath), {
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            ...globals.commonjs,
        },

        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
    rules: {
        semi: "error",
        "no-unused-vars": "warn",
    },
}, ...fixupConfigRules(compat.extends(
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
)).map(config => ({
    ...config,
    files: ["**/*.{js,jsx,ts,tsx}"],
})), {
    files: ["**/*.{js,jsx,ts,tsx}"],

    plugins: {
        react: fixupPluginRules(react),
        "jsx-a11y": fixupPluginRules(jsxA11Y),
    },

    settings: {
        react: {
            version: "detect",
        },

        formComponents: ["Form"],

        linkComponents: [{
            name: "Link",
            linkAttribute: "to",
        }, {
            name: "NavLink",
            linkAttribute: "to",
        }],

        "import/resolver": {
            typescript: {},
        },
    },
    
    rules: {
        "react/prop-types": "off",
        "react/display-name": "off",
    },
}, ...fixupConfigRules(compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
)).map(config => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
})), {
    files: ["**/*.{ts,tsx}"],

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        parser: tsParser,
    },

    settings: {
        "import/internal-regex": "^~/",

        "import/resolver": {
            node: {
                extensions: [".ts", ".tsx"],
            },

            typescript: {
                alwaysTryTypes: true,
            },
        },
    },
}, {
    files: ["**/.eslintrc.cjs"],

    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
}];