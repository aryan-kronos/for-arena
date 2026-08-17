import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, loadEnv, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function seoHtml(siteUrl: string): Plugin {
  const origin = siteUrl.replace(/\/$/, "");
  return {
    name: "aranch-pass-seo-html",
    transformIndexHtml(html) {
      return html.split("__SITE_URL__").join(origin);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = env.VITE_SITE_URL || env.SITE_URL || "https://example.com";

  return {
    plugins: [
      react(),
      tailwindcss(),
      seoHtml(siteUrl),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.svg", "icons/apple-touch-icon.png"],
        manifest: {
          name: "ARANCH PASS",
          short_name: "ARANCH PASS",
          description: "The service identity that stays with the asset.",
          theme_color: "#2E0759",
          background_color: "#F3F0D6",
          display: "standalone",
          orientation: "any",
          start_url: "/",
          scope: "/",
          icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
          shortcuts: [
            { name: "Customer portal", short_name: "Customer", url: "/customer", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
            { name: "Provider login", short_name: "Login", url: "/login", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
          ],
        },
        workbox: {
          navigateFallbackDenylist: [/^\/founder\//],
          globIgnores: ["**/jspdf*.js", "**/html2canvas*.js", "**/purify*.js", "**/images/*.webp"],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: { cacheName: "aranch-pass-images", expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 } },
            },
          ],
        },
      }),
    ],
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
