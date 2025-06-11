/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        digitara: {
          primary: '#6A0DAD',      // Purple primary
          secondary: '#8B5CF6',    // Lighter purple
          accent: '#00FFFF',       // Cyan accent
          dark: '#1F2937',         // Dark gray
          light: '#F3F4F6',        // Light gray
          neutral: '#6B7280',      // Medium gray
        }
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 