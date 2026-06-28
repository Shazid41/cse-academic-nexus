import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "_next/**",
    "_not-found/**",
    "admin/**",
    "course/**",
    "forgot-password/**",
    "login/**",
    "profile/**",
    "register/**",
    "semester/**",
    "404/**",
    "404.html",
    "index.html",
    "*.txt",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
