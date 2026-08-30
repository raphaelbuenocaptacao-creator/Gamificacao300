const CACHE='arena-xp-shell-v6-safe';
const APP_SHELL=['./','./index.html','./data.js','./manifest.webmanifest','./icon-192.svg','./icon-512.svg','./icon-512-maskable.svg'];
const PRIVATE_PATH=/\/(api|auth|login|logout|admin|session|sessions|token|tokens|account|profile|user|users|me)(\/|$)/i;
const SENSITIVE_QUERY=/^(token|access_token|refresh_token|password|passwd|secret|session|auth|authorization|api_key|apikey|key|code|credential|credentials)$/i;

function hasSensitiveQuery(url){
  for(const key of url.searchParams.keys()) if(SENSITIVE_QUERY.test(key)) return true;
  return false;
}

function isCacheSafe(request){
  if(request.method!=='GET') return false;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return false;
  if(request.headers.has('authorization')||request.headers.has('cookie')) return false;
  if(PRIVATE_PATH.test(url.pathname)||hasSensitiveQuery(url)) return false;
  return true;
}

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const {request}=event;
  if(!isCacheSafe(request)) return;
  const url=new URL(request.url);
  if(request.mode==='navigate'){
    event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(url.search) return;
  const shellMatch=APP_SHELL.find(item=>new URL(item,self.location.href).pathname===url.pathname);
  if(!shellMatch) return;
  event.respondWith(caches.match(shellMatch).then(cached=>cached||fetch(request,{cache:'no-store'})));
});
