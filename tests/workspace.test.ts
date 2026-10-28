import { readFileSync, existsSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('Monorepo Workspace Configuration', () => {
  it('has pnpm-workspace.yaml including packages/* and apps/*', () => {
    expect(existsSync('pnpm-workspace.yaml')).toBe(true);
    const content = readFileSync('pnpm-workspace.yaml', 'utf-8');
    expect(content).toContain('packages/*');
    expect(content).toContain('apps/*');
  });

  it('has tsconfig.base.json with strict typechecking enabled', () => {
    expect(existsSync('tsconfig.base.json')).toBe(true);
    const tsconfig = JSON.parse(readFileSync('tsconfig.base.json', 'utf-8'));
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });
});
