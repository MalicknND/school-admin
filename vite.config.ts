// Standard TanStack Start / Vite config — no longer wrapped by
// `@lovable.dev/vite-tanstack-config`. The wrapper's Lovable-sandbox-only plugins
// (asset proxy, dev-server bridge, HMR gate, build diagnostics) are intentionally
// dropped; the rest is inlined below. Keep this in sync manually if TanStack Start
// / Nitro change their recommended setup.
import { fileURLToPath } from "node:url";

import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command, mode }) => {
  // Freeze VITE_* into import.meta.env for both the client and the SSR bundle —
  // src/lib/branding.ts reads import.meta.env["VITE_API_BASE_URL"] on both sides.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const define = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );

  return {
    define,
    server: { host: "::", port: 5174, strictPort: true },
    css: { transformer: "lightningcss" },
    resolve: {
      tsconfigPaths: true,
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        // Redirect TanStack Start's bundled server entry to src/server.ts (our
        // SSR error wrapper). nitro/vite builds from this.
        server: { entry: "server" },
        importProtection: {
          behavior: "error",
          client: { files: ["**/server/**"], specifiers: ["server-only"] },
        },
      }),
      // Build-only: emits .vercel/output (Build Output API v3) that Vercel consumes.
      ...(command === "build" ? [nitro({ preset: "vercel" })] : []),
      viteReact(),
    ],
  };
});
