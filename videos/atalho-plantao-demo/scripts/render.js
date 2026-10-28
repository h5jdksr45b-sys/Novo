const { chromium } = require('playwright'); const fs=require('fs');
const OUT=process.argv[2]; fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file:///home/user/Novo/videos/atalho-plantao-demo/comp.html');await p.waitForTimeout(1500);
const tot=await p.evaluate(()=>TOTAL); const N=Math.round(tot*30);
// pré-carrega os quadros do logo
await p.evaluate(async()=>{for(let i=1;i<=135;i++){const im=new Image();im.src=`logo/quadros/${String(i).padStart(3,'0')}.jpg`;await im.decode().catch(()=>{});}});
for(let f=0;f<N;f++){await p.evaluate(t=>seek(t),f/30); if(f/30>=await p.evaluate(()=>FIM_INI)) await p.evaluate(()=>document.getElementById('fimimg').decode().catch(()=>{}));
  await p.screenshot({path:`${OUT}/${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:92});}
fs.writeFileSync(OUT+'/meta.json',JSON.stringify({tot,N,cenas:await p.evaluate(()=>CENAS),fim:await p.evaluate(()=>FIM_INI)}));
console.log('quadros',N,'dur',tot.toFixed(3));await b.close();})();
