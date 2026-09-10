/* Lantern mobile review copy: cache-first so the game launches with no connection */
const CACHE='lantern-mobile-1789051588890';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.png','./sw.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET')return; const u=new URL(e.request.url); if(u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{ const net=fetch(e.request).then(r=>{ if(r&&r.ok){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return r; }).catch(()=>hit); return hit||net; })); });
