const CACHE_PREFIX='arena-xp-';
const CACHE=`${CACHE_PREFIX}v9-raster-safe-shell`;
const APP_SHELL=['./','./index.html','./data.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-512-maskable.png'];
const PRIVATE_PATH=/\/(api|auth|login|logout|admin|session|sessions|token|tokens|account|profile|user|users|me)(\/|$)/i;
const SENSITIVE_QUERY=/^(token|access_token|refresh_token|password|passwd|secret|session|auth|authorization|api_key|apikey|key|code|credential|credentials)$/i;

function hasSensitiveQuery(url){
  for(const key of url.searchParams.keys()) if(SENSITIVE_QUERY.test(key)) return true;
  return false;
}

function isPrivateRequest(request,url){
  if(request.method!=='GET') return true;
  if(url.origin!==self.location.origin) return true;
  if(request.headers.has('authorization')||request.headers.has('cookie')) return true;
  if(request.headers.has('range')||request.headers.has('if-range')) return true;
  if(PRIVATE_PATH.test(url.pathname)||hasSensitiveQuery(url)) return true;
  return false;
}

function isSafeResponse(response){
  if(!response||!response.ok||response.status===206||response.type!=='basic'||response.redirected) return false;
  if(response.headers.has('content-range')) return false;
  const cacheControl=(response.headers.get('cache-control')||'').toLowerCase();
  if(cacheControl.includes('private')||cacheControl.includes('no-store')) return false;
  if(response.headers.has('set-cookie')) return false;
  return true;
}

function shellPath(url){
  if(url.search) return null;
  const normalized=url.pathname.endsWith('/')?'./':'./'+url.pathname.split('/').pop();
  return APP_SHELL.includes(normalized)?normalized:null;
}

async function precacheShell(){
  const cache=await caches.open(CACHE);
  await Promise.all(APP_SHELL.map(async asset=>{
    try{
      const request=new Request(asset,{credentials:'omit',cache:'reload',redirect:'error'});
      const response=await fetch(request);
      if(isSafeResponse(response)) await cache.put(request,response.clone());
    }catch(error){
      console.warn('[Arena XP PWA] precache skipped:',asset,error);
    }
  }));
}

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(precacheShell());
});

self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(isPrivateRequest(request,url)) return;

  if(request.mode==='navigate'){
    event.respondWith(
      fetch(request,{cache:'no-store',redirect:'error'}).catch(async()=>{
        const cache=await caches.open(CACHE);
        return (await cache.match('./index.html'))||Response.error();
      })
    );
    return;
  }

  const asset=shellPath(url);
  if(!asset) return;

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(asset);
    if(cached) return cached;
    const response=await fetch(request,{cache:'no-cache',credentials:'omit',redirect:'error'});
    if(isSafeResponse(response)) await cache.put(asset,response.clone());
    return response;
  })());
});
