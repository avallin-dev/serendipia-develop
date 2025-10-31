import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FFFF00',
          foreground: '#0B0E26',
          dark: '#d1bf00',
        },
        dolphin: '#696984',
        alto: {
          '50': '#f7f7f7',
          '100': '#ededed',
          '200': '#d9d9d9',
          '300': '#c8c8c8',
          '400': '#adadad',
          '500': '#999999',
          '600': '#888888',
          '700': '#7b7b7b',
          '800': '#676767',
          '900': '#545454',
          '950': '#363636',
        },
        chicago: {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#585858',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#262626',
        },
        magenta: '#ff00ff',
        secondary: {
          DEFAULT: '#2A2F37',
          dark: '#0B0E26',
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        wild_sand: '#f5f5f5',
        alabaster: '#fafafa',
        'mine-shaft': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#343434',
          '950': '#262626',
        },
        'cerise-red': {
          '50': '#fef2f4',
          '100': '#fce7ea',
          '200': '#f9d2d9',
          '300': '#f5acba',
          '400': '#ee7e96',
          '500': '#e03c64',
          '600': '#cf2f5e',
          '700': '#ae224e',
          '800': '#921f47',
          '900': '#7d1e42',
          '950': '#450c20',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      lineHeight: {
        '150': '147.6%',
      },
      gridTemplateColumns: {
        profile: 'minmax(0, 1fr) 250px minmax(0, 1fr)',
      },
      gridTemplateRows: {
        'layout-board': 'min-content',
      },
      boxShadow: {
        circle: '0px -1px 3px 0px rgba(0,0,0,0.23) inset',
      },
      backgroundImage: {
        circle: 'radial-gradient(#FFF 50%, #fafafa 50%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
