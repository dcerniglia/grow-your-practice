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
        'fade-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-left': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 200ms ease-out',
        'fade-in-right': 'fade-in-right 300ms ease-out',
        'fade-in-left': 'fade-in-left 300ms ease-out',
      },
    },
  },
};

export default config;
