import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/** Shared by the manifest and the theme-color meta in index.html. */
const THEME = '#241B1D';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // A new worker installs but waits, and src/lib/appUpdate.ts offers the
      // reload. Auto-updating was the safe default while no prompt existed, but
      // it reloads the page the instant a deploy lands — and the transient half
      // of the state is deliberately never saved, so that can drop someone
      // mid-duel. Nobody is stranded on old code either way: a waiting worker
      // activates on its own once every tab is closed.
      registerType: 'prompt',

      // The app registers the worker itself, through `virtual:pwa-register`,
      // which is the only way to hear about the waiting build. Leaving this on
      // would ship registerSW.js and register a second time.
      injectRegister: false,

      // The `icons/*.png` glob below already precaches these, and it also
      // catches apple-touch-icon-180, which the manifest never lists. Leaving
      // this on would enter each manifest icon a second time.
      includeManifestIcons: false,

      manifest: {
        name: 'Ludos',
        short_name: 'Ludos',
        description:
          'Uncover hidden gems, figure out what to play next, conquer your backlog.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: THEME,
        theme_color: THEME,
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            // Padded and opaque so Android's circle/squircle crop can't shave
            // the mark. Kept separate from the `any` icons on purpose —
            // declaring one icon as both makes it look inset everywhere else.
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      workbox: {
        // The shell and the self-hosted fonts, ~740 KB together. Cover art is
        // deliberately excluded — at 1.6 MB it would more than triple the
        // precache; it's cached at runtime instead, see below.
        //
        // The logo is the exception: it only lives under covers/ because the
        // art registry keys everything that way, but it's chrome, and the
        // welcome screen renders a broken image without it offline.
        globPatterns: [
          '**/*.{js,css,html,svg}',
          'icons/*.png',
          'fonts/*.woff2',
          'covers/ludos-logo.png',
        ],
        // Any navigation resolves to the shell; the app has no server routes.
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,

        // `autoUpdate` set this implicitly and `prompt` doesn't, so it has to be
        // spelled out: without it the first visit runs uncontrolled and none of
        // the runtime artwork caching below happens until the second load. It
        // only applies when a worker activates, so a waiting build still waits.
        clientsClaim: true,

        runtimeCaching: [
          {
            // Cover art is too big to precache (1.6 MB against a 708 KB shell)
            // but leaving it network-only means every cover breaks offline. This
            // costs nothing at install and warms as the user browses — and in
            // practice they see the same handful of backlog covers repeatedly.
            urlPattern: ({ url }) =>
              url.origin === self.location.origin &&
              (url.pathname.startsWith('/covers/') || url.pathname.startsWith('/images/')),
            handler: 'CacheFirst',
            options: {
              cacheName: 'ludos-artwork',
              expiration: {
                // 37 covers plus 18 marquee tiles, with room to spare.
                maxEntries: 80,
                // Art keeps its filename when replaced, so CacheFirst would
                // otherwise serve a stale cover indefinitely. A week bounds it.
                maxAgeSeconds: 60 * 60 * 24 * 7,
                purgeOnQuotaError: true,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
