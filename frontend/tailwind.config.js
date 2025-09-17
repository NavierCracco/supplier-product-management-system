import forms from "@tailwindcss/forms";
import scrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-white": "rgb(248 250 252)",
      },
      animation: {
        "spin-custom": "spin 1.5s linear infinite",
      },
    },
  },
  plugins: [forms, scrollbar],
};
