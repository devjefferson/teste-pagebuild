/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@squadfy/uai-design-system/dist/index.js',
  ],
  presets: [require('./tailwind.preset.js')],
}
