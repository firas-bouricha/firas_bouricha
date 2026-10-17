// Vérification du JavaScript (npm run lint) : variables non définies, doublons, code mort.
import globals from "globals";

export default [
  {
    files: ["js/**/*.js", "data/**/*.js"],
    ignores: ["js/vendor/**"],
    languageOptions: { ecmaVersion: 2022, sourceType: "script", globals: { ...globals.browser } },
    rules: { "no-undef": "error", "no-unused-vars": ["error", { args: "none" }], "no-redeclare": "error", "no-dupe-keys": "error", "no-unreachable": "error" },
  },
  {
    files: ["tests/**/*.js", "scripts/**/*.js", "playwright.config.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs", globals: { ...globals.node, ...globals.browser } },
    rules: { "no-undef": "error", "no-unused-vars": ["error", { args: "none" }] },
  },
];
