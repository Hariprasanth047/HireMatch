export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#0891b2',
          600: '#0e7490',
          700: '#155e75',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
        },
        ink: {
          900: '#111827',
          950: '#07111f',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(8, 35, 48, 0.10)',
        glow: '0 20px 55px rgba(8, 145, 178, 0.22)',
      },
    },
  },
  plugins: [],
};
