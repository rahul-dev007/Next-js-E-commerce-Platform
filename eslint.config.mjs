// eslint.config.mjs

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ==========================================================
// ===== ★★★ আসল সমাধানটি এখানে (THIS IS THE REAL FIX) ★★★ =====
// ==========================================================
// Next.js-এর বেস কনফিগারেশন থেকে সব নিয়ম আনা হচ্ছে
const baseConfig = compat.extends("next/core-web-vitals");

// আমরা এখন নতুন একটি কনফিগারেশন অবজেক্ট তৈরি করছি এবং নিয়মটি বন্ধ করে দিচ্ছি
const customConfig = {
  ...baseConfig[0], // বেস কনফিগারেশনের প্রথম অবজেক্টটি কপি করা হচ্ছে
  rules: {
    ...baseConfig[0].rules, // পুরনো সব নিয়ম রাখা হচ্ছে
    "react/no-unescaped-entities": "off", // ★★★ এবং এই নিয়মটি বন্ধ করে দেওয়া হচ্ছে ★★★
  },
};

const eslintConfig = [customConfig, ...baseConfig.slice(1)];
// ==========================================================


export default eslintConfig;