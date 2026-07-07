/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
  theme: {
    bg: '#1A1A1A',       // Matte Black (Hero, Features strip, Footer)
    card: '#FAF7F2',     // Cream canvas background for content sections
    textLight: '#FAF7F2',// Cream text for dark sections
    textDark: '#1A1A1A', // Dark text for light sections
    copper: '#B87333',   // True Copper accent metallic tone
  }
}

    },
  },
  plugins: [],
}
