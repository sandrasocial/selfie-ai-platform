import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#171719',
        'soft-white': '#F1F1F1',
        'warm-gray': '#B5B5B3',
      },
      fontFamily: {
        'lingerie': ['Lingerie', 'serif'],
        'bodoni': ['Bodoni FLF', 'serif'],
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        'tighter': '-0.06em',
        'tight': '-0.02em',
        'wide': '0.1em',
        'wider': '0.3em',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'slideUp': 'slideUp 0.6s ease-out forwards',
        'textReveal': 'textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        textReveal: {
          '0%': {
            transform: 'translateY(100%)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        }
      }
    },
  },
  plugins: [],
}

export default config
