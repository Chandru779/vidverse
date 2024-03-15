/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        navy:'#010212',
        semigrey:'#212529',
        semiwhite:'#EDEDEF',
        tomato:'#700708'
      }
    },
  },
  plugins: [require('@tailwindcss/line-clamp'),],
};
