/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      // font khusus halaman daftar; font halaman lain tidak berubah
      fontFamily: {
        judul: ["Literata", "ui-serif", "Georgia", "serif"],
        isi: ['"Instrument Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        tinta: "#14234B",
        malam: "#0B1226",
        kobalt: { DEFAULT: "#2547F5", gelap: "#1B37C4" },
      },
      keyframes: {
        // punggung buku naik ke rak
        rise: {
          from: { transform: "translateY(110%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        // tanda centang muncul setelah akun dibuat
        pop: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        // "backwards" (bukan "both"): setelah selesai, efek hover tetap bisa bekerja
        rise: "rise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards",
        pop: "pop 0.45s ease-out backwards",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
