/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        navy:   { DEFAULT: '#061820', 2: '#0A2030', 3: '#0D2D38' },
        teal:   { DEFAULT: '#14B894', light: '#1DD4A8' },
        indigo: { DEFAULT: '#6366F1', light: '#818CF8' },
        text:   { DEFAULT: '#F0F4FF', muted: '#7ABFCC', dim: '#3D6370' },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xl2: '20px',
      },
    },
  },
  plugins: [],
};
