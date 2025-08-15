/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fdf6e3',
        navy: '#1a2946',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
