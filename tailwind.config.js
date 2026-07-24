/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        readex: ['"Readex Pro"', 'system-ui', '-apple-system', 'sans-serif'],
        anton: ['"Anton"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
        figtree: ['"Figtree"', 'sans-serif'],
        'instrument-serif': ['"Instrument Serif"', 'serif'],
      },
      screens: {
        xs: '480px',
        mobile: { max: '809.98px' },
        'md-tablet': { min: '810px', max: '1199.98px' },
      },
    },
  },
  plugins: [],
};
