const {chromium}=require('playwright');const fs=require('fs');
const dir=process.argv[2], from=+process.argv[3]||0, to=+process.argv[4]||1209, only=process.argv[5];
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
const words=JSON.parse(fs.readFileSync(dir+'/words.json'));
await p.addInitScript(w=>{window.WORDS=w},words);
await p.goto('file://'+dir+'/index.html');await p.evaluate(()=>document.fonts.ready);
const list = only? only.split(',').map(Number) : Array.from({length:to-from+1},(_,i)=>from+i);
for(const f of list){await p.evaluate(t=>window.render(t),f/30);await p.screenshot({path:`${process.env.OUT||dir+"/out"}/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:93});}
await b.close()})();
