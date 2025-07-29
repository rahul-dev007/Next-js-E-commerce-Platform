// eslint.config.mjs

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const baseConfig = compat.extends("next/core-web-vitals");

const customConfig = {
  ...baseConfig[0],
  rules: {
    ...baseConfig[0].rules,
    "react/no-unescaped-entities": "off",
    "@next/next/no-img-element": "off", // <img> ট্যাগের warning-ও বন্ধ করে দেওয়া হলো
  },
};

const eslintConfig = [customConfig, ...baseConfig.slice(1)];

export default eslintConfig;