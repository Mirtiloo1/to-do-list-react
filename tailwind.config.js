// tailwind.config.js
import scrollbar from 'tailwind-scrollbar'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'light-purple': '#876C98',
        'purple': '#BAAFC4',
        'text-purple': '#3B234A',
        'btn-purple': '#523961',
        'block-bg': '#EBE0F2',
        'modal' : '#BAAFC4',
        'check' : '#8555A1',
        
      },
    },
  },
  plugins: [
    scrollbar,
  ],
}
