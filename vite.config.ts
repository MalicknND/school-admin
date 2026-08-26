// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Local dev only (ignored inside the Lovable cloud sandbox, which always forces 8080).
  // The école frontend already runs on 8080, so this admin app uses 5174 instead.
  vite: {
    server: {
      port: 5174,
      strictPort: true,
    },
  },
  // Explicit build target: deployed to Vercel, not the Cloudflare default from the plugin comment
  // above. NITRO_PRESET=vercel would also work (Nitro auto-detects Vercel's own VERCEL=1 too), but
  // pinning it here keeps the target versioned instead of relying on dashboard/env config.
  nitro: { preset: "vercel" },
});
