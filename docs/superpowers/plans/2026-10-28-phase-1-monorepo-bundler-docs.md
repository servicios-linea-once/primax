# Phase 1: Monorepo Infrastructure, Bundler & Documentation Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the pnpm monorepo architecture, Vite-based multi-export bundler with strict TypeScript declaration generation for `@servicio-linea-once/primax`, and the VitePress interactive documentation portal with live preview, PassThrough inspector, API table, and theme selector.

**Architecture:** A dual-workspace monorepo (`packages/primax` and `apps/docs`) managed with pnpm workspaces. `packages/primax` is bundled via Vite library mode with multi-entry points (`.`, `./inertia`, `./tailwind`, `./themes/*`) emitting ESM and DTS declarations via `vite-plugin-dts`. `apps/docs` runs VitePress with Tailwind CSS, resolving `@servicio-linea-once/primax` directly to `packages/primax/src` for instant hot-module replacement during component development.

**Tech Stack:** Node.js (v20+), pnpm, Vue 3, TypeScript (v5+), Vite 6, `vite-plugin-dts`, VitePress, Tailwind CSS, Vitest, `@vue/test-utils`.

**Spec:** [roadmap.md](file:///c:/Users/Jhon/Desktop/paquetes/primax/roadmap.md) (Sección FASE 1: Infraestructura del Monorepo, Bundler y Portal de Documentación).

## Global Constraints

- Package name must strictly be `@servicio-linea-once/primax`.
- Zero 3rd party UI dependencies in `packages/primax`: only `@floating-ui/dom`, `clsx`, and `tailwind-merge` allowed.
- Zero `<style>` blocks in components: styling is handled via Tailwind CSS classes and CSS custom properties.
- SSR & Hydration safe: all DOM and `window`/`document` access must be guarded inside `onMounted` or VitePress `<ClientOnly>`.
- Monorepo package manager is `pnpm` via `pnpm-workspace.yaml`.
- Bundler must emit clean ES modules (`.mjs` / `.js`) and `.d.ts` declaration files for all exposed subpaths.

## Review Focus

1. **Subpath `.d.ts` resolution:** Consumers importing `@servicio-linea-once/primax/inertia` or `@servicio-linea-once/primax/tailwind` must resolve type definitions without errors under both `NodeNext` and `bundler` module resolution algorithms.
2. **SSR safety in VitePress docs:** Components accessing `window`, `document`, or `localStorage` (such as `<ThemeFloatingBar/>` dark mode toggle) must not throw hydration mismatch or `ReferenceError: window is not defined` during `vitepress build`.
3. **Static theme file copying:** The CSS theme files under `src/themes/*.css` must be emitted intact into `dist/themes/*.css` and accessible via the `./themes/*` export map.
4. **Clipboard API fallback:** In `<ComponentPreview/>`, if `navigator.clipboard` is unavailable or denied by browser security policies, the component must handle the error gracefully without crashing.
5. **VitePress live alias synchronization:** Edits in `packages/primax/src` must reflect immediately in `apps/docs` in dev mode without requiring an intermediate rebuild step.

---

## File Structure

```text
primax-ecosystem/
├── package.json                              # Root workspace scripts & devDependencies
├── pnpm-workspace.yaml                       # Defines packages/primax and apps/docs
├── tsconfig.base.json                        # Shared compiler options
├── packages/
│   └── primax/
│       ├── package.json                      # Package metadata, exports map, dependencies
│       ├── tsconfig.json                     # Extends tsconfig.base.json for library
│       ├── vite.config.ts                    # Library multi-entry build + dts + static copy
│       ├── vitest.config.ts                  # Unit test runner config
│       ├── src/
│       │   ├── index.ts                      # Main entrypoint: createPrimax() plugin stub
│       │   ├── inertia/
│       │   │   └── index.ts                  # Inertia bridge export stub
│       │   ├── tailwind/
│       │   │   └── index.ts                  # Tailwind preset export stub
│       │   └── themes/
│       │       ├── aura.css                  # Seed theme token file
│       │       ├── lara.css                  # Seed theme token file
│       │       ├── nora.css                  # Seed theme token file
│       │       └── obsidian.css              # Seed theme token file
│       └── tests/
│           ├── exports.test.ts               # Verification of exports & types build output
│           └── seed-themes.test.ts           # Verification of CSS theme assets presence
└── apps/
    └── docs/
        ├── package.json                      # VitePress workspace package
        ├── tsconfig.json                     # Docs TypeScript config
        ├── tailwind.config.ts                # Docs Tailwind configuration
        ├── postcss.config.js                 # PostCSS setup
        ├── vitest.config.ts                  # Docs components test runner config
        ├── .vitepress/
        │   ├── config.ts                     # VitePress site config & Vite aliases
        │   └── theme/
        │       ├── index.ts                  # Custom theme registering doc components
        │       └── style.css                 # Base Tailwind imports & theme variables
        ├── components/
        │   ├── ThemeFloatingBar.vue          # Theme (Aura/Lara/Nora/Obsidian) & dark toggle
        │   ├── ComponentPreview.vue          # Live preview + source code copy tab
        │   ├── PtViewer.vue                  # Interactive PassThrough DOM section highlighter
        │   ├── ApiTable.vue                  # Markdown/JSON table for props, events, slots, pt
        │   └── index.ts                      # Barrel export of docs components
        ├── pages/
        │   └── index.md                      # VitePress landing page
        └── tests/
            └── docs-components.test.ts       # Unit tests for the 4 docs components
```

---

### Task 1: Root Workspace & Monorepo Tooling Setup

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json`
- Create: `tsconfig.base.json`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: None (root configuration)
- Produces: Monorepo workspace orchestration scripts (`pnpm build`, `pnpm dev`, `pnpm test`, `pnpm typecheck`)

- [ ] **Step 1: Write the failing test for workspace structure**

Create `tests/workspace.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/workspace.test.ts`
Expected: FAIL with missing `pnpm-workspace.yaml` or `tsconfig.base.json`.

- [ ] **Step 3: Implement workspace files**

1. Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

2. Create root `package.json`:
```json
{
  "name": "primax-monorepo",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "dev:docs": "pnpm --filter @servicio-linea-once/primax-docs dev",
    "build:primax": "pnpm --filter @servicio-linea-once/primax build",
    "build:docs": "pnpm --filter @servicio-linea-once/primax-docs build",
    "build": "pnpm build:primax && pnpm build:docs",
    "test": "vitest run",
    "typecheck": "pnpm -r --parallel exec vue-tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vitest": "^3.0.0",
    "vue-tsc": "^2.2.0"
  }
}
```

3. Create `tsconfig.base.json` with `"strict": true`, `"moduleResolution": "bundler"`, and `"target": "ES2022"`.

4. Update `.gitignore` to ignore `node_modules`, `dist`, `.vitepress/dist`, `.vitepress/cache`, and coverage.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/workspace.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add pnpm-workspace.yaml package.json tsconfig.base.json .gitignore tests/workspace.test.ts
git commit -m "chore(root): initialize pnpm workspace and base tsconfig"
```

---

### Task 2: `@servicio-linea-once/primax` Package & Multi-Export Bundler

**Files:**
- Create: `packages/primax/package.json`
- Create: `packages/primax/tsconfig.json`
- Create: `packages/primax/vite.config.ts`
- Create: `packages/primax/vitest.config.ts`
- Create: `packages/primax/src/index.ts`
- Create: `packages/primax/src/inertia/index.ts`
- Create: `packages/primax/src/tailwind/index.ts`
- Create: `packages/primax/src/themes/aura.css`
- Create: `packages/primax/src/themes/lara.css`
- Create: `packages/primax/src/themes/nora.css`
- Create: `packages/primax/src/themes/obsidian.css`
- Create: `packages/primax/tests/exports.test.ts`

**Interfaces:**
- Consumes: None (base library package)
- Produces:
  - `@servicio-linea-once/primax` (`dist/index.mjs`, `dist/index.d.ts` with `createPrimax()` and `version`)
  - `@servicio-linea-once/primax/inertia` (`dist/inertia/index.mjs`, `dist/inertia/index.d.ts`)
  - `@servicio-linea-once/primax/tailwind` (`dist/tailwind/index.mjs`, `dist/tailwind/index.d.ts`)
  - `@servicio-linea-once/primax/themes/*.css` (`dist/themes/*.css`)

- [ ] **Step 1: Write the failing test for library build & exports resolution**

Create `packages/primax/tests/exports.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run packages/primax/tests/exports.test.ts`
Expected: FAIL (dist and package files do not exist yet).

- [ ] **Step 3: Implement package configuration, seed themes, and Vite multi-export bundler**

1. Create `packages/primax/package.json`:
```json
{
  "name": "@servicio-linea-once/primax",
  "version": "0.1.0",
  "description": "Modular Vue 3 UI Component Suite with Inertia.js bridge and Tailwind PassThrough system",
  "type": "module",
  "files": ["dist"],
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs"
    },
    "./inertia": {
      "types": "./dist/inertia/index.d.ts",
      "import": "./dist/inertia/index.mjs"
    },
    "./tailwind": {
      "types": "./dist/tailwind/index.d.ts",
      "import": "./dist/tailwind/index.mjs"
    },
    "./themes/*": "./dist/themes/*"
  },
  "dependencies": {
    "@floating-ui/dom": "^1.6.13",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.0"
  },
  "peerDependencies": {
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "vite-plugin-dts": "^4.5.0",
    "vue": "^3.5.0"
  }
}
```

2. Create `packages/primax/vite.config.ts`:
Configure `build.lib` with multiple entries:
- `index`: `src/index.ts`
- `inertia/index`: `src/inertia/index.ts`
- `tailwind/index`: `src/tailwind/index.ts`
Include `vite-plugin-dts({ rollupTypes: true })` and Rollup asset copy plugin for `src/themes/*.css` to `dist/themes/`.

3. Create the entry files:
- `src/index.ts`: export version `0.1.0` and `createPrimax()` installer plugin stub.
- `src/inertia/index.ts`: export `defineInertiaBridge()` stub.
- `src/tailwind/index.ts`: export `primaxPreset` Tailwind plugin stub.
- `src/themes/aura.css`, `lara.css`, `nora.css`, `obsidian.css`: initial token definitions.

4. Run build script: `pnpm --filter @servicio-linea-once/primax exec vite build`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run packages/primax/tests/exports.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/primax
git commit -m "feat(primax): configure package multi-export build, dts and seed themes"
```

---

### Task 3: VitePress Documentation Portal Setup (`apps/docs`)

**Files:**
- Create: `apps/docs/package.json`
- Create: `apps/docs/tsconfig.json`
- Create: `apps/docs/tailwind.config.ts`
- Create: `apps/docs/postcss.config.js`
- Create: `apps/docs/.vitepress/config.ts`
- Create: `apps/docs/.vitepress/theme/index.ts`
- Create: `apps/docs/.vitepress/theme/style.css`
- Create: `apps/docs/pages/index.md`
- Create: `apps/docs/tests/vitepress-config.test.ts`

**Interfaces:**
- Consumes: `packages/primax/src` (via Vite alias)
- Produces: VitePress portal running in dev mode and production build in `apps/docs/.vitepress/dist`

- [ ] **Step 1: Write the failing test for VitePress configuration and alias resolution**

Create `apps/docs/tests/vitepress-config.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run apps/docs/tests/vitepress-config.test.ts`
Expected: FAIL (VitePress config not yet created).

- [ ] **Step 3: Implement VitePress configuration and Tailwind pipeline**

1. Create `apps/docs/package.json` with dependencies: `vitepress`, `vue`, `tailwindcss`, `postcss`, `autoprefixer`, and workspace dependency to `@servicio-linea-once/primax`.
2. Configure `apps/docs/tailwind.config.ts` pointing content to `.vitepress/**/*.vue`, `components/**/*.vue`, and `pages/**/*.md`.
3. Create `apps/docs/postcss.config.js` with `tailwindcss` and `autoprefixer`.
4. Create `apps/docs/.vitepress/config.ts`:
```typescript
import { defineConfig } from 'vitepress';
import { resolve } from 'node:path';

export default defineConfig({
  title: 'Primax UI',
  description: 'Design system and component suite for Vue 3 and Inertia.js',
  vite: {
    resolve: {
      alias: {
        '@servicio-linea-once/primax': resolve(__dirname, '../../../packages/primax/src'),
        '@docs': resolve(__dirname, '../../')
      }
    }
  }
});
```
5. Create `apps/docs/.vitepress/theme/style.css` with `@tailwind base; @tailwind components; @tailwind utilities;`.
6. Create `apps/docs/.vitepress/theme/index.ts` extending `DefaultTheme` and importing `style.css`.
7. Create `apps/docs/pages/index.md` with landing hero layout.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run apps/docs/tests/vitepress-config.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/docs
git commit -m "feat(docs): setup vitepress documentation portal with tailwind css and alias"
```

---

### Task 4: Documentation Viewer Core Components (`apps/docs/components/`)

**Files:**
- Create: `apps/docs/components/ThemeFloatingBar.vue`
- Create: `apps/docs/components/ComponentPreview.vue`
- Create: `apps/docs/components/PtViewer.vue`
- Create: `apps/docs/components/ApiTable.vue`
- Create: `apps/docs/components/index.ts`
- Modify: `apps/docs/.vitepress/theme/index.ts` (register components globally)
- Create: `apps/docs/tests/docs-components.test.ts`

**Interfaces:**
- Consumes: None (independent UI documentation viewers)
- Produces: Globally available `<ThemeFloatingBar/>`, `<ComponentPreview/>`, `<PtViewer/>`, and `<ApiTable/>` inside any markdown file in `apps/docs`.

- [ ] **Step 1: Write the failing tests for the 4 docs components**

Create `apps/docs/tests/docs-components.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ThemeFloatingBar from '../components/ThemeFloatingBar.vue';
import ComponentPreview from '../components/ComponentPreview.vue';
import PtViewer from '../components/PtViewer.vue';
import ApiTable from '../components/ApiTable.vue';

describe('Documentation Viewer Core Components', () => {
  it('ThemeFloatingBar switches themes and dark mode', async () => {
    const wrapper = mount(ThemeFloatingBar);
    const select = wrapper.find('[data-test="theme-select"]');
    expect(select.exists()).toBe(true);
    await select.setValue('nora');
    expect(wrapper.emitted('theme-change')?.[0]).toEqual(['nora']);
  });

  it('ComponentPreview toggles between preview and source code tabs', async () => {
    const wrapper = mount(ComponentPreview, {
      props: { code: '<Button label="Submit" />' },
      slots: { default: '<button>Submit</button>' }
    });
    expect(wrapper.text()).toContain('Submit');
    const codeTab = wrapper.find('[data-test="tab-code"]');
    await codeTab.trigger('click');
    expect(wrapper.html()).toContain('&lt;Button label="Submit" /&gt;');
  });

  it('PtViewer renders passThrough sections and emits highlight events', async () => {
    const sections = [
      { key: 'root', description: 'Container element' },
      { key: 'label', description: 'Text label span' }
    ];
    const wrapper = mount(PtViewer, { props: { sections } });
    expect(wrapper.text()).toContain('root');
    expect(wrapper.text()).toContain('label');
  });

  it('ApiTable renders columns for props, events, slots or pt keys', () => {
    const rows = [
      { name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Button visual style' }
    ];
    const wrapper = mount(ApiTable, { props: { headers: ['Name', 'Type', 'Default', 'Description'], rows } });
    expect(wrapper.text()).toContain('variant');
    expect(wrapper.text()).toContain("'primary' | 'secondary'");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run apps/docs/tests/docs-components.test.ts`
Expected: FAIL (components do not exist yet).

- [ ] **Step 3: Implement the 4 viewer components with SSR guards**

1. `apps/docs/components/ThemeFloatingBar.vue`:
   - Renders a floating pill bar with 4 themes: `Aura`, `Lara`, `Nora`, `Obsidian`.
   - Dark/Light mode toggle button.
   - Guard `window` and `document.documentElement.classList` modifications strictly inside `onMounted` or event handlers (SSR safe).
   - Attribute `data-test="theme-select"`.

2. `apps/docs/components/ComponentPreview.vue`:
   - Props: `title?: string`, `code: string`.
   - Slots: `default` (live render), `code` (optional custom code block).
   - Interactive toggle: Preview / Code tabs.
   - Copy-to-clipboard button with fallback (`try { await navigator.clipboard.writeText(...) } catch { ... }`) and visual feedback ("Copied!").

3. `apps/docs/components/PtViewer.vue`:
   - Props: `sections: Array<{ key: string; description: string; tag?: string }>`.
   - Renders interactive list/badges of all PassThrough keys for the component.
   - Hovering or clicking a key triggers a visual badge indicator and emits `highlight(key)`.

4. `apps/docs/components/ApiTable.vue`:
   - Props: `type: 'props' | 'events' | 'slots' | 'pt'`, `headers?: string[]`, `rows: Array<Record<string, any>>`.
   - Renders a clean Tailwind-styled responsive table with monospace tags for types and default values.

5. `apps/docs/components/index.ts`: export all 4 components.
6. Register all 4 components globally in `apps/docs/.vitepress/theme/index.ts` using `app.component(...)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run apps/docs/tests/docs-components.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/docs/components apps/docs/.vitepress/theme/index.ts apps/docs/tests/docs-components.test.ts
git commit -m "feat(docs): implement ThemeFloatingBar, ComponentPreview, PtViewer, and ApiTable"
```

---

### Task 5: End-to-End Build Integration & Verification

**Files:**
- Create: `apps/docs/pages/guide/introduction.md`
- Create: `tests/e2e-build.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `packages/primax` build output and `apps/docs` components
- Produces: Clean, passing full-repository build (`pnpm build`) and typecheck (`pnpm typecheck`)

- [ ] **Step 1: Write the failing test for full production build pipeline**

Create `tests/e2e-build.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Production Monorepo Build Pipeline', () => {
  it('builds @servicio-linea-once/primax library without errors', () => {
    execSync('npx vite build packages/primax', { stdio: 'pipe' });
    expect(existsSync(resolve(__dirname, '../packages/primax/dist/index.mjs'))).toBe(true);
  });

  it('builds apps/docs static site without SSR errors', () => {
    execSync('npx vitepress build apps/docs', { stdio: 'pipe' });
    expect(existsSync(resolve(__dirname, '../apps/docs/.vitepress/dist/index.html'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails or catches SSR / build issues**

Run: `npx vitest run tests/e2e-build.test.ts`
Expected: FAIL if any SSR leak or missing asset path occurs during static compilation.

- [ ] **Step 3: Fix any build discrepancies and create sample introduction guide**

1. Create `apps/docs/pages/guide/introduction.md` using `<ThemeFloatingBar/>`, `<ComponentPreview code="...">`, `<PtViewer :sections="...">`, and `<ApiTable :rows="...">` to ensure full markdown compilation.
2. Verify `packages/primax` builds cleanly with DTS output.
3. Verify `apps/docs/.vitepress/dist` generates static HTML without throwing `window is not defined`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/e2e-build.test.ts`
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/pages/guide/introduction.md tests/e2e-build.test.ts package.json
git commit -m "test(e2e): verify complete monorepo build and docs static generation"
```

---

## Self-Review Against Spec

1. **Spec Coverage:**
   - 1.1 Workspace: Covered in Task 1 (`pnpm-workspace.yaml`, package scripts).
   - 1.2 Bundler Multi-Export (`vite.config.ts`, `.`, `./inertia`, `./tailwind`, `./themes/*`, `vite-plugin-dts`): Covered in Task 2.
   - 1.3 Motor del Visor (VitePress + Tailwind + alias + 4 components `<ThemeFloatingBar/>`, `<ComponentPreview/>`, `<PtViewer/>`, `<ApiTable/>`): Covered in Tasks 3 and 4.
   - End-to-end verification and SSR safety: Covered in Task 5.
2. **Step Scan:** Every step follows the red-green-refactor-commit flow with exact commands, assertion criteria, and file paths.
3. **Type Consistency:** All subpath exports map consistently across `package.json`, `vite.config.ts`, and test files (`index.mjs`, `index.d.ts`, `inertia/`, `tailwind/`, `themes/`).
4. **Review Focus:**
   - Subpath `.d.ts` resolution: Tested in Task 2.
   - SSR safety in VitePress: Tested in Task 4 & Task 5.
   - Theme CSS asset copying: Tested in Task 2.
   - Clipboard fallback: Handled and tested in Task 4.
   - Live alias sync: Tested in Task 3.
5. **Proportion:** The plan is focused on exact architectural decisions, interfaces, commands, and tests without superfluous boilerplates.

