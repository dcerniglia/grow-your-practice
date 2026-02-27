import type { Config } from 'tailwindcss';
import gypPreset from '@gyp/shared/tailwind-preset';

const config: Config = {
  presets: [gypPreset],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 200ms ease-out',
      },
    },
  },
};

export default config;
