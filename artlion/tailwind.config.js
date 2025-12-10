/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './music_front_v3/src/**/*.{js,ts,jsx,tsx}',
    './video_front/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#eead2b',
        'background-light': '#fcfaf8',
        'background-dark': '#000000',
        'text-light': '#1b170d',
        'text-dark': '#f3efe7',
        'surface-light': '#f3efe7',
        'surface-dark': '#3a3222',
        'muted-light': '#9a804c',
        'muted-dark': '#9a804c',
      },
      fontFamily: {
        display: ['Spline Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
