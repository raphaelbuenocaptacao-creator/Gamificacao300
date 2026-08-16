/* Controles administrativos da Arena BMW X1 */
(()=>{
  const addRole=()=>{
    const roles=document.querySelector('.roles');
    if(roles){
      [['Captador','Captador'],['Promotor','Promotor']].forEach(([value,text])=>{if(!roles.querySelector(`[data-role="${value}"]`)){const b=document.createElement('button');b.dataset.role=value;b.textContent=text;roles.insertBefore(b,roles.firstChild)}});
    }
    const sel=document.getElementById('rankRole');
    if(sel){[['Captador','Captador'],['Promotor','Promotor']].forEach(([value,text])=>{if(!sel.querySelector(`option[value="${value}"]`)){const o=document.createElement('option');o.value=value;o.textContent=text;sel.appendChild(o)}})}
  };
  addRole();
})();
