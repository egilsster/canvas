import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
  base: "/canvas/",
  plugins: [tailwindcss()],
  server: {
    port: 3000,
  },
};

export default config;
