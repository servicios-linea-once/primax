import type { Config } from 'tailwindcss';
import { resolve } from 'node:path';

export default {
  darkMode: 'class',
  content: [
    resolve(__dirname, '.vitepress/**/*.{js,ts,vue}'),
    resolve(__dirname, 'components/**/*.{js,ts,vue}'),
    resolve(__dirname, 'pages/**/*.md'),
    resolve(__dirname, '../../packages/primax/src/**/*.{js,ts,vue}')
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;

