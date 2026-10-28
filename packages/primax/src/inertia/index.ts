export interface InertiaBridgeOptions {
  autoErrors?: boolean;
}

export function defineInertiaBridge(options: InertiaBridgeOptions = {}) {
  return {
    name: 'primax-inertia-bridge',
    options
  };
}

