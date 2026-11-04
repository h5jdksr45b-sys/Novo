const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
(async()=>{
 const [,,html,out,a,b,list]=process.argv; fs.mkdirSync(out,{recursive:true});
 const br=await chromium.launch(); const p=await br.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+path.resolve(html)); await p.evaluate(()=>window.ready);
 const fr= list? list.split(',').map(Number) : Array.from({length:+b-+a},(_,i)=>+a+i);
 for(const f of fr){ await p.evaluate(t=>window.setTime(t), f/30);
   await p.screenshot({path:path.join(out,String(f).padStart(5,'0')+'.png'),omitBackground:true}); }
 await br.close(); console.log('ok',fr.length);
})();
