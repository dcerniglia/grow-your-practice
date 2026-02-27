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
        'soft-glow': {
          '0%, 100%': { boxShadow: '0 0 8px 0 rgba(212, 148, 58, 0.3)' },
          '50%': { boxShadow: '0 0 16px 4px rgba(212, 148, 58, 0.45)' },
        },
        'nudge-right': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(3px)' },
        },
      },
      animation: {
        'slide-in': 'slide-in 200ms ease-out',
        'fade-in-right': 'fade-in-right 300ms ease-out',
        'fade-in-left': 'fade-in-left 300ms ease-out',
        'soft-glow': 'soft-glow 3s ease-in-out infinite',
        'nudge-right': 'nudge-right 2s ease-in-out infinite',
      },
    },
  },
};

export default config;
