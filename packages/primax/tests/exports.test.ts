import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Primax Package Exports & Asset Distribution', () => {
  const distPath = resolve(__dirname, '../dist');

  it('generates dist entrypoints and d.ts files after build', () => {
    expect(existsSync(resolve(distPath, 'index.mjs'))).toBe(true);
    expect(existsSync(resolve(distPath, 'index.d.ts'))).toBe(true);
    expect(existsSync(resolve(distPath, 'inertia/index.mjs'))).toBe(true);
    expect(existsSync(resolve(distPath, 'inertia/index.d.ts'))).toBe(true);
    expect(existsSync(resolve(distPath, 'tailwind/index.mjs'))).toBe(true);
    expect(existsSync(resolve(distPath, 'tailwind/index.d.ts'))).toBe(true);
  });

  it('copies all 4 theme CSS stylesheets into dist/themes/', () => {
    const themes = ['aura.css', 'lara.css', 'nora.css', 'obsidian.css'];
    themes.forEach(theme => {
      expect(existsSync(resolve(distPath, 'themes', theme))).toBe(true);
    });
  });

  it('validates package.json exports mapping contains exact subpaths', () => {
    const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));
    expect(pkg.name).toBe('@servicio-linea-once/primax');
    expect(pkg.exports['.']).toBeDefined();
    expect(pkg.exports['./inertia']).toBeDefined();
    expect(pkg.exports['./tailwind']).toBeDefined();
    expect(pkg.exports['./themes/*']).toBe('./dist/themes/*');
  });
});

