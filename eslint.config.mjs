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

const baseConfig = compat.extends("next/core-web-vitals");

// আমরা এখন নতুন একটি কনফিগারেশন অবজেক্ট তৈরি করছি এবং নিয়মটি বন্ধ করে দিচ্ছি
const customConfig = {
  ...baseConfig[0],
  rules: {
    ...baseConfig[0].rules,
    "react/no-unescaped-entities": "off",
  },
};

const eslintConfig = [customConfig, ...baseConfig.slice(1)];


export default eslintConfig;