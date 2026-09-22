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
  ]),
  {
    // Content Studio was ported from a separate codebase (content-agent)
    // with its own, looser lint bar -- untyped Apify/Instagram/Supabase JSON
    // payloads throughout and a few effect patterns that are functionally
    // fine but trip this project's stricter React Compiler rules. Relaxed
    // here rather than retyping/rewriting a large ported subtree wholesale.
    files: [
      "app/admin/studio/**/*.{ts,tsx}",
      "app/api/studio/**/*.{ts,tsx}",
      "lib/studio/**/*.{ts,tsx}",
      "components/studio/**/*.{ts,tsx}",
      "scripts/studio-scrape.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
]);

export default eslintConfig;
