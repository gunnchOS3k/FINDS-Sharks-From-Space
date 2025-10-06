const V="v1", SHELL=["/","/index.html","/manifest.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL))); self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==V).map(k=>caches.delete(k))))); self.clients.claim();});
self.addEventListener("fetch",e=>{const r=e.request; if(r.method==="POST") return; if(r.mode==="navigate"){e.respondWith(fetch(r).catch(()=>caches.match("/index.html"))); return;} e.respondWith(caches.match(r).then(c=>c||fetch(r)));});
