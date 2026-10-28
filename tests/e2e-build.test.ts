import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Production Monorepo Build Pipeline', () => {
  it('builds @servicio-linea-once/primax library without errors', () => {
    execSync('npx pnpm --filter @servicio-linea-once/primax build', { stdio: 'pipe' });
    expect(existsSync(resolve(__dirname, '../packages/primax/dist/index.mjs'))).toBe(true);
  }, 30000);

  it('builds apps/docs static site without SSR errors', () => {
    execSync('npx pnpm --filter @servicio-linea-once/primax-docs build', { stdio: 'pipe' });
    expect(existsSync(resolve(__dirname, '../apps/docs/.vitepress/dist/index.html'))).toBe(true);
  }, 30000);
});
