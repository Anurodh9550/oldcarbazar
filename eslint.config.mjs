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
    "next-env.d.ts",
    // Non-web-app code that lives inside the repo folder but is not part of
    // the Next.js app (Django backend + virtualenv, the separate Expo app,
    // local docs, and node/python helper scripts). Linting these produced
    // thousands of false errors from vendored/minified JS.
    "backend/**",
    "React native/**",
    "docs/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
