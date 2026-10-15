const {chromium}=require('/opt/node22/lib/node_modules/playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:2});
for(const f of process.argv.slice(2)){await p.goto('file://'+__dirname+'/'+f+'.html');await p.waitForTimeout(300);
await p.screenshot({path:__dirname+'/'+f+'.png'});console.log(f);}await b.close();})();
