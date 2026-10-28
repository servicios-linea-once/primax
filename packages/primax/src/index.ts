import type { App, Plugin } from 'vue';

export interface PrimaxOptions {
  theme?: string;
  unstyled?: boolean;
  pt?: Record<string, any>;
}

export const version = '0.1.0';

export function createPrimax(options: PrimaxOptions = {}): Plugin {
  return {
    install(app: App) {
      app.config.globalProperties.$primax = options;
      app.provide('primax', options);
    }
  };
}

export default createPrimax;
