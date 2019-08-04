/** service worker */

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// JS Cache
workbox.routing.registerRoute(
  /.*\.js/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'js-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        // Cache for 4 Hours
        maxAgeSeconds: 14400,
        purgeOnQuotaError: false
      })
    ]
  }),
  'GET'
);
// CSS Cache
workbox.routing.registerRoute(
  /.*\.css/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'css-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        // Cache for 4 Hours
        maxAgeSeconds: 14400,
        purgeOnQuotaError: false
      })
    ]
  }),
  'GET'
);
// Font Cache
workbox.routing.registerRoute(
  /.*\.(?:ttf|otf)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'font-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        // Cache for 12 Hours
        maxAgeSeconds: 43200,
        purgeOnQuotaError: true
      })
    ]
  }),
  'GET'
);
// Image Cache
workbox.routing.registerRoute(
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20,
        // Cache for 4 hrs
        maxAgeSeconds: 14400,
        purgeOnQuotaError: true
      })
    ]
  }),
  'GET'
);
