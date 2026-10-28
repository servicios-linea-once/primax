export interface PrimaxTailwindOptions {
  prefix?: string;
}

export function primaxPreset(options: PrimaxTailwindOptions = {}) {
  return {
    theme: {
      extend: {
        colors: {
          primax: {
            50: 'var(--primax-50, #f0fdf4)',
            500: 'var(--primax-500, #22c55e)',
            900: 'var(--primax-900, #14532d)'
          }
        }
      }
    }
  };
}

export default primaxPreset;
