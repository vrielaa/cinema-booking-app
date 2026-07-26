import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import pluginQuery from "@tanstack/eslint-plugin-query";

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  reactPlugin.configs.flat["jsx-runtime"],
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
    },
  },
  prettier,
  /* blank lines before return statements */
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ],
    },
  },
];
