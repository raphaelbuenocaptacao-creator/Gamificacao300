const CACHE='arena-xp-v4';
const APP_SHELL=['./','./index.html','./data.js','./manifest.webmanifest','./icon-192.svg','./icon-512.svg'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

function isSafeStatic(request,url){
  if(request.method!=='GET') return false;
  if(request.headers.has('authorization')) return false;
  if(url.origin!==self.location.origin) return false;
  const path=url.pathname.toLowerCase();
  if(path.includes('/api/') || path.includes('/auth') || path.includes('/login') || path.includes('/admin') || path.includes('/session') || path.includes('/token')) return false;
  return ['document','script','style','image','font','manifest'].includes(request.destination) || path.endsWith('.json') || path.endsWith('.webmanifest');
}

self.addEventListener('fetch',event=>{
  const {request}=event;
  const url=new URL(request.url);
  if(!isSafeStatic(request,url)) return;

  if(request.mode==='navigate'){
    event.respondWith(fetch(request).catch(()=>caches.match('./index.html')));
    return;
  }

  event.respondWith(
    caches.match(request).then(cached=>cached || fetch(request).then(response=>{
      if(!response || response.status!==200 || response.type!=='basic') return response;
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(request,copy));
      return response;
    }))
  );
});
