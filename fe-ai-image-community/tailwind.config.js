/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#eead2b",
        "background-light": "#fcfaf8",
        "background-dark": "#121212",
        "text-light": "#1b170d",
        "text-dark": "#f3efe7",
        "surface-light": "#f3efe7",
        "surface-dark": "#1e1e1e",
        "muted-light": "#9a804c",
        "muted-dark": "#9a804c"
      },
      fontFamily: {
        "display": ["Spline Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}

