export const brand = {
  colors: {
    primary: {
      DEFAULT: '#2D6A6A',
      light: '#3A8585',
      dark: '#1F4E4E',
    },
    background: {
      DEFAULT: '#FDF8F0',
      dark: '#F5EDE0',
    },
    accent: {
      DEFAULT: '#D4943A',
      light: '#E8B060',
      dark: '#B07A2E',
    },
    text: {
      DEFAULT: '#1A1A1A',
      muted: '#6B7280',
      light: '#9CA3AF',
    },
    border: '#E5E0D8',
    surface: '#FFFFFF',
  },
  borderRadius: {
    card: '12px',
    button: '8px',
    input: '6px',
  },
  shadow: {
    card: '0 2px 8px rgba(45, 106, 106, 0.08)',
  },
} as const;
