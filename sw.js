/* Sunny Cloud Wonderland — service worker (make the site work like an app) */
const CACHE = 'sunny-cloud-v1';
const CORE = [
  './',
  './index.html',
  './games.html',
  './videos.html',
  './stories.html',
  './coloring.html',
  './music.html',
  './fun-zone.html',
  './common.css',
  './common.js',
  './manifest.webmanifest',
  './icon.jpeg',
  './favicon.svg',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon-180.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).catch(function(){})
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function(hit){
      if(hit) return hit;
      return fetch(e.request).then(function(res){
        const copy = res.clone();
        if(res.ok){
          caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
        }
        return res;
      });
    }).catch(function(){
      return caches.match('./index.html');
    })
  );
});