import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';

export default defineConfig({
  title: 'Primax UI',
  description: 'Design system and component suite for Vue 3 and Inertia.js',
  srcDir: './pages',
  vite: {
    resolve: {
      alias: {
        '@servicio-linea-once/primax': resolve(__dirname, '../../../packages/primax/src'),
        '@docs': resolve(__dirname, '../')
      }
    }
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/index' }
    ]
  }
});

