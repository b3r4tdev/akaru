/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0a0a10',
        abyss: '#050507',
        panel: '#101018',
        elevate: '#181824',
        akaru: {
          50: '#fff1f3',
          100: '#ffe0e5',
          200: '#ffc2cd',
          300: '#ff95a9',
          400: '#ff5c7c',
          500: '#f92e56',
          600: '#ea1240',
          700: '#c40c34',
          800: '#9d0e2e',
          900: '#7c0f28',
          950: '#4a0616',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 45px -12px rgba(249, 46, 86, 0.55)',
        'glow-sm': '0 0 22px -8px rgba(249, 46, 86, 0.5)',
        card: '0 18px 45px -18px rgba(0, 0, 0, 0.85)',
        'card-hover': '0 24px 60px -20px rgba(0, 0, 0, 0.9)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease both',
        shimmer: 'shimmer 1.6s infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
