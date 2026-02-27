import type { Config } from 'tailwindcss';
import gypPreset from '@gyp/shared/tailwind-preset';

const config: Config = {
  presets: [gypPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
