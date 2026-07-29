// Brain Sprint service worker — precache-first, offline-capable.
// Bump CACHE_VERSION when any precached file changes.
const CACHE_VERSION = 'brain-sprint-v2';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './words.txt',

  // shared
  './shared/shared.css',
  './shared/core.js',
  './shared/sounds.js',
  './shared/achievements.js',
  './shared/xp.js',
  './shared/elo.js',
  './shared/ghost.js',
  './shared/worker-client.js',
  './shared/lockout.js',
  './shared/wordlists.js',
  './shared/integration.js',
  './shared/results.js',
  './shared/stats.js',
  './shared/init.js',
  './shared/autoplay.js',
  './shared/workers/solvers.worker.js',

  // challenges — CSS
  './challenges/aim/aim.css',
  './challenges/association/association.css',
  './challenges/blocks/blocks.css',
  './challenges/chainword/chainword.css',
  './challenges/chimp/chimp.css',
  './challenges/colorcode/colorcode.css',
  './challenges/deduction/deduction.css',
  './challenges/economy/economy.css',
  './challenges/escape/escape.css',
  './challenges/estimation/estimation.css',
  './challenges/hanoi/hanoi.css',
  './challenges/math24/math24.css',
  './challenges/maze/maze.css',
  './challenges/memory/memory.css',
  './challenges/mosaic/mosaic.css',
  './challenges/numcrunch/numbot.css',
  './challenges/numcrunch/numcrunch.css',
  './challenges/numgrid/numgrid.css',
  './challenges/nummemory/nummemory.css',
  './challenges/oddoneout/oddoneout.css',
  './challenges/paradox/paradox.css',
  './challenges/pathtracer/pathtracer.css',
  './challenges/pattern/pattern.css',
  './challenges/pulse/pulse.css',
  './challenges/quickmath/quickmath.css',
  './challenges/reaction/reaction.css',
  './challenges/rhythm/rhythm.css',
  './challenges/rotation/rotation.css',
  './challenges/scramble/scramble.css',
  './challenges/simon/simon.css',
  './challenges/sliding/sliding.css',
  './challenges/sortrace/sortrace.css',
  './challenges/spotdiff/spotdiff.css',
  './challenges/stroop/stroop.css',
  './challenges/typing/typing.css',
  './challenges/vismemory/vismemory.css',
  './challenges/wordhive/wordhive.css',
  './challenges/wordro/wordro.css',
  './challenges/wordro/wordrobot.css',
  './challenges/wordsearch/wordsearch.css',

  // challenges — JS
  './challenges/aim/aim.js',
  './challenges/association/association.js',
  './challenges/blocks/blocks.js',
  './challenges/chainword/chainword.js',
  './challenges/chimp/chimp.js',
  './challenges/colorcode/colorcode.js',
  './challenges/deduction/deduction.js',
  './challenges/economy/economy.js',
  './challenges/escape/escape.js',
  './challenges/estimation/estimation.js',
  './challenges/hanoi/hanoi.js',
  './challenges/math24/math24.js',
  './challenges/maze/maze.js',
  './challenges/memory/memory.js',
  './challenges/mosaic/mosaic.js',
  './challenges/numcrunch/numbot.js',
  './challenges/numcrunch/numcrunch.js',
  './challenges/numgrid/numgrid.js',
  './challenges/nummemory/nummemory.js',
  './challenges/oddoneout/oddoneout.js',
  './challenges/paradox/paradox.js',
  './challenges/pathtracer/pathtracer.js',
  './challenges/pattern/pattern.js',
  './challenges/pulse/pulse.js',
  './challenges/quickmath/quickmath.js',
  './challenges/reaction/reaction.js',
  './challenges/rhythm/rhythm.js',
  './challenges/rotation/rotation.js',
  './challenges/scramble/scramble.js',
  './challenges/simon/simon.js',
  './challenges/sliding/sliding.js',
  './challenges/sortrace/sortrace.js',
  './challenges/spotdiff/spotdiff.js',
  './challenges/stroop/stroop.js',
  './challenges/typing/typing.js',
  './challenges/vismemory/vismemory.js',
  './challenges/wordhive/wordhive.js',
  './challenges/wordro/wordro.js',
  './challenges/wordro/wordrobot.js',
  './challenges/wordsearch/wordsearch.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // addAll is atomic — any missing file aborts install. Use individual adds so we
      // still get a working install if one asset is temporarily unavailable. Log failures
      // so a typo in PRECACHE surfaces during dev instead of "just" breaking offline.
      Promise.all(PRECACHE.map((url) =>
        cache.add(new Request(url, { cache: 'reload' }))
          .catch((err) => { console.warn('[SW] precache failed for', url, err); return null; })
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never intercept cross-origin

  // HTML: network-first so updates ship promptly, fall back to cache offline.
  // Never cache non-OK HTML (avoids permanently serving a stale 404/500 offline).
  const isHTML = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');
  if (isHTML) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // Everything else: cache-first with background revalidate.
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
