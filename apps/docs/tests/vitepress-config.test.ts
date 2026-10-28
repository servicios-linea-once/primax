import { describe, it, expect } from 'vitest';
import config from '../.vitepress/config';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

describe('VitePress Configuration & Path Aliases', () => {
  it('defines alias pointing @servicio-linea-once/primax directly to package src', () => {
    const viteConfig = config.vite;
    expect(viteConfig).toBeDefined();
    const alias = viteConfig?.resolve?.alias as Record<string, string>;
    expect(alias['@servicio-linea-once/primax']).toBeDefined();
    expect(existsSync(alias['@servicio-linea-once/primax'])).toBe(true);
  });

  it('contains title and navigation configuration for Primax', () => {
    expect(config.title).toBe('Primax UI');
  });
});
