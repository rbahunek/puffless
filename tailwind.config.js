/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Ensure critical classes are always generated
    'bg-teal-50',
    'bg-teal-100',
    'bg-teal-500',
    'bg-teal-600',
    'text-teal-600',
    'text-teal-700',
    'border-teal-500',
    'from-teal-50',
    'to-slate-50',
    'from-teal-500',
    'to-teal-600',
    'shadow-teal-500/20',
    'shadow-teal-500/30',
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
