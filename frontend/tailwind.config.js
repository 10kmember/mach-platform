/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#EFE6D3',
          raised: '#E7DCC4',
        },
        ink: {
          DEFAULT: '#2E2A24',
          muted: 'rgba(46, 42, 36, 0.65)',
        },
        accent: {
          primary: {
            DEFAULT: '#B85C38',
            hover: '#9E4C2D',
          },
          secondary: '#7C8B4E',
          tertiary: '#2F6F6B',
        },
        highlight: '#D9A227',
        focus: '#2F6F6B',
        border: 'rgba(46, 42, 36, 0.12)',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      fontSize: {
        h1: 'clamp(2.5rem, 4vw + 1.2rem, 4.25rem)',
        h2: 'clamp(1.875rem, 2.4vw + 1rem, 2.75rem)',
        h3: 'clamp(1.25rem, 1vw + 1rem, 1.625rem)',
        'text-lg': '1.25rem',
        'text-body': '1.0625rem',
        'text-sm': '0.9375rem',
        'text-mono': '0.875rem',
      },
      spacing: {
        'space-1': '4px',
        'space-2': '8px',
        'space-3': '12px',
        'space-4': '16px',
        'space-5': '24px',
        'space-6': '32px',
        'space-7': '48px',
        'space-8': '64px',
        'space-9': '96px',
        'space-10': '128px',
      },
      borderRadius: {
        'radius-sm': '8px',
        'radius-md': '16px',
        'radius-lg': '24px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(46, 42, 36, 0.08)',
        md: '0 8px 24px rgba(46, 42, 36, 0.12)',
        lg: '0 16px 48px rgba(46, 42, 36, 0.16)',
      },
      maxWidth: {
        container: '1200px',
      },
      transitionTimingFunction: {
        drawer: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
