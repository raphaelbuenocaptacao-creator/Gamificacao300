/* Carregador oficial da base 123.csv — somente 01/07/2026 em diante. */
(()=>{
'use strict';
const START='2026-07-01';
const URL='https://raw.githubusercontent.com/raphaelbuenocaptacao-creator/Gamificacao300/main/123.csv';
const key=s=>String(s??'').replace(/^\uFEFF/,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toUpperCase(); 
const date=v=>{const s=String(v||'').trim();let m=s.match(/(\d{2})[\/-](\d{2})[\/-](\d{4})/);return m?`${m[3]}-${m[2]}-${m[1]}`:/^\d{4}-\d{2}-\d{2}/.test(s)?s.slice(0,10):''};
const money=v=>{let s=String(v??'').trim();if(!s)return 0;s=s.replace(/R\$\s*/gi,'').replace(/\.(?=\d{3}(?:\D|$))/g,'').replace(',','.').replace(/[^0-9.-]/g,'');return Number(s)||0};
function parse(text){const lines=text.split(/\r?\n/);const first=lines.find(x=>x.trim())||'';const delim=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':',';let rows=[],row=[],cell='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cell+='"';i++;continue}if(c==='"'){q=!q;continue}if(c===delim&&!q){row.push(cell);cell='';continue}if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell='';continue}cell+=c}if(cell||row.length){row.push(cell);if(row.some(v=>v.trim()))rows.push(row)}return rows}
function get(o,...names){for(const n of names){const v=o[key(n)];if(v!==undefined)return v}return ''}
fetch(URL,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('CSV '+r.status);return r.text()}).then(text=>{
 const rows=parse(text);
 const hi=rows.findIndex(r=>r.some(c=>key(c)==='PROMOTOR DE MARKETING'));
 if(hi<0)throw Error('Cabeçalho real não encontrado');
 const h=rows[hi].map(key), data=rows.slice(hi+1);
 const out=data.map((r,i)=>{const o={};h.forEach((x,j)=>o[x]=String(r[j]??'').trim());const d=date(get(o,'Data de atendimento','Data/Hora do cadastro','Data'));return {sale_date:d,captador:get(o,'Promotor de marketing','Promotor de Marketing','Captador'),promoter:get(o,'Promotor','Promotor de vendas'),liner:get(o,'Liner','Consultor','Consultoria'),closer:get(o,'Closer'),vgv:money(get(o,'Valor vendido','VGV','Valor')),status:get(o,'Status do contrato','Status'),status_atendimento:get(o,'Status do atendimento'),qualificacao:get(o,'Qualificação','Qualificacao'),renda:money(get(o,'Renda')),entrada:money(get(o,'Entrada','Valor de entrada','Entrada efetiva')),nome1:get(o,'Nome 1'),nome2:get(o,'Nome 2'),source_key:['123',i,d,get(o,'Nome 1'),get(o,'Nome 2'),get(o,'Valor vendido')].join('|')}}).filter(x=>x.sale_date>=START);
 if(!out.length)throw Error('Nenhum registro encontrado desde 01/07/2026');
 localStorage.setItem('arena_sales',JSON.stringify(out));
 localStorage.setItem('arena_base_info',JSON.stringify({source:'123.csv',start:START,loadedAt:new Date().toISOString(),records:out.length}));
 window.dispatchEvent(new CustomEvent('arena-base-ready',{detail:{records:out.length}}));
}).catch(e=>{console.error('Arena base:',e);window.dispatchEvent(new CustomEvent('arena-base-error',{detail:{message:e.message}}));});
})();