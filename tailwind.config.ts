import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        moway: {
          primary: "#573DEB",
          bg: "#F2F2F2",
          card: "#FFFFFF",
          text: {
            main: "#1A1A1A",
            secondary: "#838383",
          }
        }
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(87, 61, 235, 0.2)',
        'glass': '0 4px 12px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    }),
  ],
};
export default config;