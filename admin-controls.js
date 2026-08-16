/* Controles administrativos da Arena BMW X1 */
(()=>{
  const addRole=()=>{
    const roles=document.querySelector('.roles');
    if(roles&&!roles.querySelector('[data-role="Captador"]')){const b=document.createElement('button');b.dataset.role='Captador';b.textContent='Captador';roles.insertBefore(b,roles.firstChild)}
    const sel=document.getElementById('rankRole');
    if(sel&&!sel.querySelector('option[value="Captador"]')){const o=document.createElement('option');o.value='Captador';o.textContent='Captador';sel.insertBefore(o,sel.firstChild)}
  };
  const addFields=()=>{
    const box=document.querySelector('#admin .admin-box:nth-of-type(2)');
    if(!box||document.getElementById('adminFaltas'))return;
    const quick=box.querySelector('.quick');if(quick)quick.style.display='none';
    const wrap=document.createElement('div');wrap.innerHTML=`<div style="margin-top:10px"><label class="muted">FALTAS (quantidade)</label><input id="adminFaltas" type="number" min="0" step="1" value="0" placeholder="0"></div><div><label class="muted">ATRASOS (quantidade)</label><input id="adminAtrasos" type="number" min="0" step="1" value="0" placeholder="0"></div><div class="notice" style="margin-top:7px">Base automática: <b>+50.000 XP/dia</b> de presença e <b>+50.000 XP/dia</b> de pontualidade. Cada falta ou atraso remove 50.000 XP do respectivo indicador.</div><button id="saveAdjustments" class="primary" style="width:100%;margin-top:8px">💾 SALVAR FALTAS E ATRASOS</button>`;
    box.appendChild(wrap);
  };
  addRole();addFields();
})();
