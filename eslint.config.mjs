// eslint.config.mjs

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js-এর বেস কনফিগারেশন
  ...compat.extends("next/core-web-vitals"),
  
  // ==========================================================
  // ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
  // ==========================================================
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs"], // .mjs ফাইলও যোগ করা হলো
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        }
    },
    rules: {
      // ★★★ এই লাইনটি "don't" বা "it's" এর মতো শব্দের জন্য এরর দেওয়া বন্ধ করবে ★★★
      "react/no-unescaped-entities": "off",
    },
  },
  // ==========================================================
];

export default eslintConfig;