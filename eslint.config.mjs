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

    // Not application code. `docs/research/` holds minified reference bundles
    // captured from the site we studied, and `graphify-out/` is generated
    // tooling output — between them they produced ~1,390 of the 1,398 problems
    // the previous config reported, which buried the handful that were real.
    "docs/**",
    "graphify-out/**",
    "public/**",
  ]),
]);

export default eslintConfig;
