import pluginJs from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,  // Include Node.js globals (like __dirname, process)
        ...globals.browser,  // If you're working with the browser too
      },
    },
  },
  pluginJs.configs.recommended,
];
