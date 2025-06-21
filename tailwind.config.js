/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-soft-white',
    'text-luxury-black',
    'text-warm-gray',
    'font-bodoni',
    'border-warm-gray',
    'bg-luxury-black',
    'text-soft-white',
    'animate-scroll'
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
        bodoni: ['var(--font-bodoni)'],
        playfair: ['Playfair Display', 'serif'],
      },
      colors: {
        'luxury-black': '#171719',
        'soft-white': '#F1F1F1',
        'warm-gray': '#B5B5B3',
        'deep-graphite': '#4C4B4B',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' }
        },
        loadingLine: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        revealUp: {
          'from': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' }
        },
        spinSlow: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        loadingLine: 'loadingLine 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        revealUp: 'revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        shimmer: 'shimmer 3s infinite',
        spinSlow: 'spinSlow 20s linear infinite',
        float: 'float 6s ease-in-out infinite'
      },
    },
  },
  plugins: [],
}