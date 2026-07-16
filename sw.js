const CACHE = 'muyassir-cache-v1';
const ASSETS = ['./', './index.html', './manifest.json', './icon/icon-192.png', './icon/icon-512.png'];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(res=>{
        try{
          const resClone = res.clone();
          caches.open(CACHE).then(cache=>cache.put(e.request, resClone));
        }catch(err){}
        return res;
      }).catch(()=> cached);
    })
  );
});
