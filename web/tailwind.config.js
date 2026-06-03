/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        mint: "#2fbf9f",
        coral: "#f26a4f",
        sky: "#4f8cf7"
      }
    }
  },
  plugins: []
};
