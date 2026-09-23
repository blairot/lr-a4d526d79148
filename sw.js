/* Lantern mobile review copy (MOBILE REVIEW · 57m3): cache-first so the game launches with no connection */
/* caches are shared by every app on this origin: this worker names its own as lantern-review|<scope>|<version>, reads only
   from that one, caches only requests inside its own scope, and on activation removes only its own older versions and the
   two cache names earlier Lantern review copies used (lantern-mobile-<number>). Nothing else on the origin is touched */
const CACHE='lantern-review|1790173838191'.replace('|','|'+self.registration.scope+'|');
const MINE=k=>k.startsWith('lantern-review|'+self.registration.scope+'|')||/^lantern-mobile-\d+$/.test(k);
const inScope=u=>u.href.startsWith(self.registration.scope);
const FILES=['./','./index.html','./manifest.webmanifest','./icon.png','./sw.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&MINE(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET')return; const u=new URL(e.request.url); if(u.origin!==location.origin||!inScope(u))return;
  e.respondWith(caches.open(CACHE).then(c=>c.match(e.request,{ignoreSearch:true})).then(hit=>{ const net=fetch(e.request).then(r=>{ if(r&&r.ok){ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return r; }).catch(()=>hit); return hit||net; })); });
