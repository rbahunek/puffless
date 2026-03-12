/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#e8faf9',
          100: '#d1f5f2',
          200: '#a3ebe5',
          300: '#75e1d8',
          400: '#47d7cb',
          500: '#2EC4B6',
          600: '#25a99d',
          700: '#1c7f76',
          800: '#13544f',
          900: '#0a2a28',
        },
      },
    },
  },
  plugins: [],
}
