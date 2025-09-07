/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        pastelBlue: '#A7C7E7',
        pastelGreen: '#B7EFC5',
        pastelPink: '#F7C6C7',
        pastelYellow: '#FFF6B7',
        pastelPurple: '#D6C7F7',
        accent: '#7F9CF5',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

