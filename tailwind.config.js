/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/html/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/forms")],
});

// module.exports = withMT({
//   content: ["./index.html"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// });
