import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0b1326',
          dim: '#0b1326',
          bright: '#31394d',
          low: '#131b2e',
          base: '#171f33',
          high: '#222a3d',
          highest: '#2d3449',
        },
        'on-surface': '#dae2fd',
        'on-surface-variant': '#bbcabf',
        outline: '#86948a',
        'outline-variant': '#3c4a42',
        primary: {
          DEFAULT: '#4edea3',
          container: '#10b981',
          fixed: '#6ffbbe',
        },
        'on-primary': '#003824',
        secondary: {
          DEFAULT: '#ffb95f',
          container: '#ee9800',
        },
        tertiary: {
          DEFAULT: '#ffb3af',
          container: '#fc7c78',
        },
        branch: {
          worship: '#4edea3',
          knowledge: '#60a5fa',
          discipline: '#ffb95f',
          character: '#c084fc',
          charity: '#ffb3af',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        DEFAULT: '12px',
        md: '20px',
        lg: '40px',
      },
      boxShadow: {
        'glow-emerald': '0 0 20px rgba(78,222,163,0.3)',
        'glow-emerald-lg': '0 0 40px rgba(78,222,163,0.4)',
        'glow-blue': '0 0 20px rgba(96,165,250,0.3)',
        'glow-amber': '0 0 20px rgba(255,185,95,0.3)',
        'glow-purple': '0 0 20px rgba(192,132,252,0.3)',
        'glow-rose': '0 0 20px rgba(255,179,175,0.3)',
        glass: 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        bloom: 'bloom 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bloom: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
