window.APP_DATA = {"source_start":"2026-07-01","source_end":"2026-08-09","active_sales":0,"active_vgv":0.0,"participants":[],"months":{"2026-07":{},"2026-08":{}},"daily":[]};

(function bootstrapPWA(){
  if(!document.querySelector('link[rel="manifest"]')){
    const manifest=document.createElement('link');
    manifest.rel='manifest';
    manifest.href='./manifest.webmanifest';
    document.head.appendChild(manifest);
  }
  if(!document.querySelector('link[rel="apple-touch-icon"]')){
    const apple=document.createElement('link');
    apple.rel='apple-touch-icon';
    apple.href='./icon-192.svg';
    document.head.appendChild(apple);
  }
  if(!document.querySelector('meta[name="theme-color"]')){
    const meta=document.createElement('meta');
    meta.name='theme-color';
    meta.content='#070707';
    document.head.appendChild(meta);
  }

  const secure=location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname);
  let registration=null;

  async function refreshWorker(){
    if(registration){
      try{ await registration.update(); }catch(_error){}
    }
  }

  if('serviceWorker' in navigator&&secure){
    window.addEventListener('load',async()=>{
      try{
        registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
        await refreshWorker();
      }catch(error){
        console.warn('[Arena XP PWA] service worker não registrado:',error);
      }
    });
    document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible') refreshWorker(); });
    window.addEventListener('online',refreshWorker);
  }

  let deferredPrompt=null;
  let installButton=null;
  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;

  function ensureInstallButton(){
    if(installButton||isStandalone()) return;
    installButton=document.createElement('button');
    installButton.type='button';
    installButton.textContent='Instalar app';
    installButton.setAttribute('aria-label','Instalar Arena XP como aplicativo');
    Object.assign(installButton.style,{position:'fixed',right:'14px',bottom:'14px',zIndex:'9999',padding:'10px 14px',borderRadius:'10px',border:'1px solid #333',background:'#f5f5f5',color:'#070707',fontWeight:'800',display:'none'});
    installButton.addEventListener('click',async()=>{
      if(!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt=null;
      installButton.style.display='none';
    });
    document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(installButton),{once:true});
    if(document.body) document.body.appendChild(installButton);
  }

  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();
    deferredPrompt=event;
    ensureInstallButton();
    if(installButton) installButton.style.display='block';
  });
  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    if(installButton) installButton.remove();
    installButton=null;
  });
})();
