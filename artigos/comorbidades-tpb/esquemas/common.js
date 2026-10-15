const W=1600,H=1000;
const C={ink:'#1C2230',ink2:'#4A5263',muted:'#8A91A0',grid:'#E7E9EE',gray:'#C3C8D1',blue:'#2B5C9E',red:'#C6372B',bg:'#FFFFFF'};
function svgEl(inner){document.body.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Inter, sans-serif">${inner}</svg>`;}
function t(x,y,s,o={}){const a=Object.assign({size:18,w:400,fill:C.ink,anchor:'start'},o);
 return `<text x="${x}" y="${y}" font-size="${a.size}" font-weight="${a.w}" fill="${a.fill}" text-anchor="${a.anchor}" ${a.italic?'font-style="italic"':''} ${a.extra||''}>${s}</text>`;}
function lines(x,y,arr,lh,o){return arr.map((s,i)=>t(x,y+i*lh,s,o)).join('');}
function arrowDefs(){return `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.ink2}"/></marker>
<marker id="ahb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${C.blue}"/></marker></defs>`;}
