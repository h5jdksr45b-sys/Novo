const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});const errs=[];
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file:///home/user/Novo/videos/atalho-plantao-demo/comp.html');await p.waitForTimeout(1500);
const tot=await p.evaluate(()=>TOTAL);console.log('total',tot.toFixed(2), JSON.stringify(await p.evaluate(()=>CENAS.map(c=>+c.ini.toFixed(2)))));
for(const t of process.argv.slice(2).map(Number)){await p.evaluate(t=>seek(t),t);await p.waitForTimeout(250);await p.screenshot({path:`/tmp/claude-0/-home-user-Novo/959b2151-f2ed-549c-aed6-b2a7705a93cc/scratchpad/pv-${t}.jpg`,type:'jpeg',quality:70});}
console.log(errs);await b.close();})();
