module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#0F0F0F',
          300: '#BBBEBF',
        },
        green: {
          400: '#00FF00',
        },
        blue: {
          400: '#5E93BE',
        },
        gold: {
          DEFAULT: '#FFD700',
        },
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};