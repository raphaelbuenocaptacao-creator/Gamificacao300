import csv,json,re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
START='2026-07-01';END='2026-08-09';ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'data'/'base.csv';OUT=ROOT/'data.js'
def clean(v):return re.sub(r'\s+',' ',str(v or '').strip()).upper()
def money(v):
 s=str(v or '').strip().replace('R$','').replace(' ','')
 if ',' in s and '.' in s:s=s.replace('.','').replace(',','.')
 elif ',' in s:s=s.replace(',','.')
 try:return float(s)
 except:return 0.0
def date(v):
 s=str(v or '').strip()
 for f in ('%Y-%m-%d','%d/%m/%Y','%d/%m/%Y %H:%M:%S'):
  try:return datetime.strptime(s[:19],f).strftime('%Y-%m-%d')
  except:pass
 return ''
def main():
 rows=[]
 with SRC.open('r',encoding='utf-8-sig',newline='') as f:
  for r in csv.DictReader(f):
   rr={clean(k):v for k,v in r.items()};d=date(rr.get('DATA DE ATENDIMENTO') or rr.get('DATA'))
   if d and d>=START:rows.append((d,rr))
 people=defaultdict(lambda:{'vgv':0.0,'sales':0,'qualified':0});active_vgv=0.;active_sales=0
 fields={'Promotor':('PROMOTOR DE MARKETING','PROMOTOR'),'Liner':('LINER','LINER'),'Closer':('CLOSER','CLOSER')}
 for d,r in rows:
  status=clean(r.get('STATUS DO CONTRATO') or r.get('STATUS'));v=money(r.get('VALOR VENDIDO') or r.get('VGV'));active='ATIVO' in status and 'CANCEL' not in status
  if active:active_vgv+=v;active_sales+=1 if v>0 else 0
  q=clean(r.get('QUALIFICAÇÃO') or r.get('QUALIFICACAO')).startswith('Q')
  for role,(k1,k2) in fields.items():
   name=clean(r.get(k1) or r.get(k2))
   if not name:continue
   p=people[(role,name)]
   if active:p['vgv']+=v;p['sales']+=1 if v>0 else 0
   if q:p['qualified']+=1
 participants=[{'id':f'{role.lower()}:{name}','name':name,'role':role,'vgv':round(p['vgv'],2),'sales':p['sales'],'avgIncome':0,'qualified':p['qualified']} for (role,name),p in sorted(people.items())]
 out={'source_start':START,'source_end':END,'active_sales':active_sales,'active_vgv':round(active_vgv,2),'participants':participants,'months':{'2026-07':{},'2026-08':{}},'daily':[]}
 OUT.write_text('window.APP_DATA = '+json.dumps(out,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
 print(len(rows),'registros',len(participants),'profissionais',active_sales,'vendas ativas',round(active_vgv,2),'VGV')
if __name__=='__main__':main()
