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
  if(!('serviceWorker' in navigator)) return;
  const secure=location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname);
  if(!secure) return;
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'})
      .then(reg=>reg.update())
      .catch(()=>{});
  });
})();
