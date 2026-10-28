import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'node:path';
import { cpSync, mkdirSync, existsSync } from 'node:fs';
import dts from 'vite-plugin-dts';

function copyThemesPlugin(): Plugin {
  return {
    name: 'copy-themes',
    closeBundle() {
      const srcDir = resolve(__dirname, 'src/themes');
      const distDir = resolve(__dirname, 'dist/themes');
      if (existsSync(srcDir)) {
        mkdirSync(distDir, { recursive: true });
        cpSync(srcDir, distDir, { recursive: true });
      }
    }
  };
}

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*.ts', 'src/**/*.vue'],
      outDir: 'dist'
    }),
    copyThemesPlugin()
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'inertia/index': resolve(__dirname, 'src/inertia/index.ts'),
        'tailwind/index': resolve(__dirname, 'src/tailwind/index.ts')
      },
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', '@floating-ui/dom', 'clsx', 'tailwind-merge'],
      output: {
        entryFileNames: '[name].mjs',
        chunkFileNames: 'chunks/[name]-[hash].mjs'
      }
    }
  }
});
