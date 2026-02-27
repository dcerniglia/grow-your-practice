import type { Config } from 'tailwindcss';
import { brand } from './brand';

const preset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: brand.colors.primary,
        background: brand.colors.background,
        accent: brand.colors.accent,
        text: brand.colors.text,
        border: brand.colors.border,
        surface: brand.colors.surface,
      },
      fontFamily: {
        heading: ['var(--font-dm-serif-display)', 'serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      borderRadius: {
        card: brand.borderRadius.card,
        button: brand.borderRadius.button,
        input: brand.borderRadius.input,
      },
      boxShadow: {
        card: brand.shadow.card,
      },
    },
  },
  plugins: [],
};

export default preset;
