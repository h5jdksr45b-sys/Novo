// uso: node render.js out.mp4 [fps] [dur]  |  node render.js --stills t1,t2,... prefixo
const {chromium}=require('playwright'); const {spawn}=require('child_process'); const path=require('path');
(async()=>{
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await p.goto('file://'+path.join(__dirname,'index.html')); await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(300);
  if(process.argv[2]==='--stills'){
    const ts=process.argv[3].split(',').map(Number); const pre=process.argv[4];
    for(const t of ts){await p.evaluate(t=>render(t),t); await p.screenshot({path:`${pre}${t.toFixed(2)}.png`});}
    await b.close(); return;}
  const out=process.argv[2], fps=+(process.argv[3]||30), dur=+(process.argv[4]||30), N=Math.round(fps*dur);
  const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-i','-',
    '-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-r',String(fps),'-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<N;i++){await p.evaluate(t=>render(t),i/fps);
    const buf=await p.screenshot({type:'jpeg',quality:95});
    if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r));
    if(i%150===0) console.log('frame',i);}
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await b.close(); console.log('ok',out);
})();
