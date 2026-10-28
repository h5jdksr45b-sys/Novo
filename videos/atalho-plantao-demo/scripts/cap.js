const { chromium } = require('playwright'); const fs=require('fs');
const S=process.cwd(), OUT=process.argv[2];
const U='file://'+S+'/prova/index.html';
const HIDE=`.notice{display:none!important}`;
(async()=>{
  const b=await chromium.launch(); const info={};
  const novo=async(tour)=>{const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:3,permissions:['clipboard-read','clipboard-write']});
    const pg=await ctx.newPage(); await pg.goto(U); await pg.waitForTimeout(700);
    if(!tour){ await pg.click('#tSkip'); await pg.evaluate(()=>localStorage.setItem('atalho-plantao:dicas','nao')); }
    await pg.addStyleTag({content:HIDE}); return {ctx,pg};};
  const box=async(pg,sel)=>{const r=await pg.$eval(sel,e=>{const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2+scrollY,w:b.width,h:b.height}});return r;};
  const barra=async(pg,nome)=>{await pg.addStyleTag({content:'.tabbar{display:block!important}'}); const y=await pg.evaluate(()=>scrollY); await pg.evaluate(()=>scrollTo(0,0)); await pg.waitForTimeout(150);
    await pg.screenshot({path:`${OUT}/tabbar-${nome}.png`,clip:{x:0,y:800-64,width:390,height:64}}); await pg.addStyleTag({content:'.tabbar{display:none!important}'}); await pg.evaluate(y=>scrollTo(0,y),y);};
  const shot=async(pg,name,full)=>{await pg.waitForTimeout(250); await pg.screenshot({path:`${OUT}/${name}.png`,fullPage:!!full}); info[name]={h: full? await pg.evaluate(()=>document.documentElement.scrollHeight):800};};
  // 1 tour
  let {ctx,pg}=await novo(true); await pg.waitForTimeout(300);
  info.tourOk=await box(pg,'#tOk'); await shot(pg,'tour'); await ctx.close();
  // 2 inicio
  ({ctx,pg}=await novo(false)); await pg.goto(U+'#inicio'); await pg.addStyleTag({content:HIDE}); await pg.waitForTimeout(400);
  info.money=await box(pg,'.money'); info.atr=await box(pg,'#hAtr'); info.cobrar=await box(pg,'[data-cobrar]'); info.lancar=await box(pg,'.tab-cta');
  // a barra inferior é fixa: captura a página inteira sem ela e a barra separada
  await pg.addStyleTag({content:'.tabbar{display:none!important}'}); await shot(pg,'inicio',true);
  await pg.addStyleTag({content:'.tabbar{display:block!important} .canvas{visibility:hidden}'}); await pg.evaluate(()=>scrollTo(0,0));
  await pg.screenshot({path:`${OUT}/tabbar-inicio.png`,clip:{x:0,y:800-64,width:390,height:64}});
  await pg.addStyleTag({content:'.canvas{visibility:visible}'});
  // 3 cobrança copiada
  const sy=Math.round(info.atr.y-150); await pg.evaluate(y=>scrollTo(0,y),sy); info.cobrarScroll=sy;
  await pg.click('[data-cobrar]'); await pg.waitForTimeout(500); await pg.addStyleTag({content:'.tabbar{display:none!important}'}); await shot(pg,'cobranca');
  const txt=await pg.evaluate(()=>navigator.clipboard.readText()); info.textoCobranca=txt;
  // 4 lançar
  await pg.evaluate(()=>{scrollTo(0,0);document.querySelector('#toast').hidden=true}); await pg.addStyleTag({content:'.tabbar{display:block!important}'});
  await pg.click('.tab-cta'); await pg.waitForTimeout(500);
  info.b24=await pg.$eval('[data-f-turno="24h"]',e=>{const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}});
  info.salvar=await pg.$eval('#fSalvar',e=>{const b=e.getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2}});
  await shot(pg,'lancar12'); await pg.click('[data-f-turno="24h"]'); await shot(pg,'lancar24');
  await pg.click('#fSalvar'); await pg.waitForTimeout(600); await shot(pg,'lancado');
  // 5 agenda
  await pg.goto(U+'#agenda'); await pg.addStyleTag({content:HIDE+'.tabbar,.toast{display:none!important}'}); await pg.waitForTimeout(400);
  await pg.click('[data-mes="-1"]'); await pg.waitForTimeout(300);
  await pg.click('.day.has:has(.d-atrasado)'); await pg.waitForTimeout(300); await pg.mouse.move(0,0);
  await shot(pg,'agenda',true); await barra(pg,'agenda');
  // 6 plantões
  await pg.goto(U+'#plantoes'); await pg.addStyleTag({content:HIDE+'.tabbar,.toast{display:none!important}'}); await pg.waitForTimeout(400);
  await pg.click('[data-mes="1"]'); await pg.waitForTimeout(300);
  info.rank=await box(pg,'#hRank'); info.pdf=await box(pg,'[data-act="pdf"]');
  await shot(pg,'plantoes',true); await barra(pg,'plantoes');
  fs.writeFileSync(`${OUT}/info.json`,JSON.stringify(info,null,1)); await b.close(); console.log(JSON.stringify(info).slice(0,900));
})();
