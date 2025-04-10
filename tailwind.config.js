/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./assets/**/*.js",
    "./templates/**/*.html.twig",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        strava: {
          "primary": "#FC4C02",
          "secondary": "#F7F7F7",
          "accent": "#767676",
          "neutral": "#09090b",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBF24",
          "error": "#F87272",
        },
      },
    ],
  },
}


