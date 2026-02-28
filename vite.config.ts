import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const target = process.env.SERVER_BASE_URL;

export default defineConfig({
    plugins: [react()],
    server: {
        port: 7122,
        proxy: {
            "/api": {
                target,
                changeOrigin: true,
                secure: false,
            },
            // optional:
            "/swagger": { target, changeOrigin: true, secure: false },
        },
    },
});