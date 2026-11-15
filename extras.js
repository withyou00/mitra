'use strict';
/* =====================================================================
   ChitraCut extras – stock graphics library, social stickers, more SFX,
   noise reduction, loudness normalisation, motion tracking.
   Everything is generated in the browser: no downloads, no copyright.
   ===================================================================== */

const hsh = i => { const x = Math.sin(i*127.1 + 311.7)*43758.5453; return x - Math.floor(x); };
const easeO = k => 1 - Math.pow(1 - clamp(k,0,1), 3);
function rrp(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function bellPath(ctx,s){
  ctx.beginPath(); ctx.moveTo(-.42*s,.26*s); ctx.lineTo(.42*s,.26*s);
  ctx.quadraticCurveTo(.3*s,.16*s,.3*s,-.06*s); ctx.quadraticCurveTo(.3*s,-.4*s,0,-.42*s);
  ctx.quadraticCurveTo(-.3*s,-.4*s,-.3*s,-.06*s); ctx.quadraticCurveTo(-.3*s,.16*s,-.42*s,.26*s); ctx.closePath();
}
function drawBell(ctx,s,color,ring){
  ctx.save(); ctx.rotate(ring); ctx.fillStyle=color; bellPath(ctx,s); ctx.fill();
  ctx.beginPath(); ctx.arc(0,.36*s,.1*s,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(0,-.47*s,.07*s,0,Math.PI*2); ctx.fill(); ctx.restore();
}
function drawThumb(ctx,s,color){
  ctx.save(); ctx.fillStyle=color;
  rrp(ctx,-.42*s,-.02*s,.18*s,.44*s,.04*s); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-.2*s,-.02*s); ctx.lineTo(-.04*s,-.42*s); ctx.quadraticCurveTo(.02*s,-.52*s,.1*s,-.46*s); ctx.quadraticCurveTo(.14*s,-.4*s,.08*s,-.16*s);
  ctx.lineTo(.34*s,-.16*s); ctx.quadraticCurveTo(.44*s,-.14*s,.42*s,-.03*s); ctx.lineTo(.36*s,.32*s); ctx.quadraticCurveTo(.33*s,.42*s,.22*s,.42*s); ctx.lineTo(-.2*s,.42*s); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function heartPath(ctx,s){
  ctx.beginPath(); ctx.moveTo(0,.32*s);
  ctx.bezierCurveTo(-.55*s,-.05*s,-.32*s,-.55*s,0,-.22*s);
  ctx.bezierCurveTo(.32*s,-.55*s,.55*s,-.05*s,0,.32*s); ctx.closePath();
}
function drawCursor(ctx,x,y,s,press){
  ctx.save(); ctx.translate(x,y); ctx.scale(s*(press?.85:1),s*(press?.85:1));
  ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,1); ctx.lineTo(.27,.76); ctx.lineTo(.45,1.12); ctx.lineTo(.6,1.05); ctx.lineTo(.43,.7); ctx.lineTo(.76,.7); ctx.closePath();
  ctx.fillStyle='#fff'; ctx.strokeStyle='#000'; ctx.lineWidth=.07; ctx.lineJoin='round'; ctx.fill(); ctx.stroke(); ctx.restore();
  if(press){ ctx.save(); ctx.strokeStyle='rgba(255,255,255,.8)'; ctx.lineWidth=s*.06; ctx.beginPath(); ctx.arc(x,y,s*.35,0,Math.PI*2); ctx.stroke(); ctx.restore(); }
}
function pill(ctx,x,y,w,h,fill,text,tc,font){
  ctx.fillStyle=fill; rrp(ctx,x,y,w,h,h/2); ctx.fill();
  if(text){ ctx.fillStyle=tc||'#fff'; ctx.font=font; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,x+w/2,y+h/2+h*.03); }
}
const FONT = (px,w=800) => `${w} ${px}px Inter,"Noto Sans Kannada",Arial,sans-serif`;

/* ---------------- STOCK GRAPHICS LIBRARY ---------------- */
const GFX = [
  // Social
  {id:'subscribe', name:'Subscribe + Bell', cat:'Social', dur:4.5, aspect:.3, text:'SUBSCRIBE', text2:'SUBSCRIBED', color:'#e8231a', thumbT:1.0,
   draw(ctx,t,w,h,o){
     const pop=backOut(clamp(t/.4,0,1)); if(pop<=0) return; ctx.save(); ctx.scale(pop,pop);
     const bw=w*.68, bh=h*.72, bx=-w/2, by=-bh/2, subT=1.45, bellT=2.45, done=t>subT;
     const press1=t>subT-.12&&t<subT+.1, press2=t>bellT-.12&&t<bellT+.1;
     ctx.save(); if(press1){ ctx.translate(bx+bw/2,0); ctx.scale(.94,.94); ctx.translate(-(bx+bw/2),0); }
     pill(ctx,bx,by,bw,bh,done?'#5f5f5f':o.color,done?(o.text2||'SUBSCRIBED'):(o.text||'SUBSCRIBE'),'#fff',FONT(bh*.38)); ctx.restore();
     const r=bh*.5, bxC=w/2-r*1.05; ctx.fillStyle=t>bellT?'#fff':'#f1f1f1'; ctx.beginPath(); ctx.arc(bxC,0,r,0,Math.PI*2); ctx.fill();
     const ring = t>bellT && t<bellT+1 ? Math.sin((t-bellT)*28)*.45*(1-(t-bellT)) : 0;
     ctx.save(); ctx.translate(bxC,0); drawBell(ctx,r*1.15,'#222',ring);
     if(t>bellT){ ctx.fillStyle='#e8231a'; ctx.beginPath(); ctx.arc(r*.42,-r*.42,r*.22,0,Math.PI*2); ctx.fill(); } ctx.restore();
     let cx, cy; const p1={x:bx+bw*.6,y:bh*.1}, p2={x:bxC+r*.1,y:r*.15}, p0={x:w*.55,y:h*1.1};
     if(t<.7){ cx=p0.x; cy=p0.y; } else if(t<subT){ const k=easeO((t-.7)/(subT-.7-.1)); cx=p0.x+(p1.x-p0.x)*k; cy=p0.y+(p1.y-p0.y)*k; }
     else if(t<bellT){ const k=easeO((t-subT-.2)/(bellT-subT-.35)); cx=p1.x+(p2.x-p1.x)*clamp(k,0,1); cy=p1.y+(p2.y-p1.y)*clamp(k,0,1); }
     else { const k=easeO((t-bellT-.4)/.8); cx=p2.x+(p0.x-p2.x)*clamp(k,0,1); cy=p2.y+(p0.y-p2.y)*clamp(k,0,1); }
     if(t>.6 && t<bellT+1.3) drawCursor(ctx,cx,cy,h*.42,press1||press2);
     ctx.restore();
   }},
  {id:'bell', name:'Bell Ringing', cat:'Social', dur:3, aspect:1, color:'#ffc400', thumbT:.5,
   draw(ctx,t,w,h,o){ const s=w*.8, pop=backOut(clamp(t/.4,0,1)); ctx.save(); ctx.scale(pop,pop);
     ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.arc(0,0,s*.55,0,Math.PI*2); ctx.fill();
     drawBell(ctx,s*.75,o.color,Math.sin(t*14)*.35*Math.max(0,Math.sin(t*2.2)));
     const n=(t*1.6)%1; ctx.strokeStyle=o.color; ctx.lineWidth=s*.03; ctx.globalAlpha=1-n;
     for(const sd of [-1,1]){ ctx.beginPath(); ctx.arc(0,-s*.05,s*(.45+n*.15),sd>0?-.6:Math.PI-.4,sd>0?.4:Math.PI+.6); ctx.stroke(); }
     ctx.globalAlpha=1; ctx.fillStyle='#e8231a'; ctx.beginPath(); ctx.arc(s*.25,-s*.28,s*.1,0,Math.PI*2); ctx.fill(); ctx.restore(); }},
  {id:'like', name:'Like Button', cat:'Social', dur:3, aspect:1, color:'#1e88ff', thumbT:1.5,
   draw(ctx,t,w,h,o){ const s=w*.8, liked=t>1.1, pop=backOut(clamp(t/.4,0,1)), bump=liked&&t<1.5?1+.25*Math.sin((t-1.1)/.4*Math.PI):1;
     ctx.save(); ctx.scale(pop*bump,pop*bump); ctx.fillStyle=liked?o.color:'#ffffff'; ctx.beginPath(); ctx.arc(0,0,s*.5,0,Math.PI*2); ctx.fill();
     drawThumb(ctx,s*.62,liked?'#fff':'#333'); ctx.restore();
     if(liked && t<2){ const k=(t-1.1)/.9; for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; ctx.fillStyle=o.color; ctx.globalAlpha=1-k; ctx.beginPath(); ctx.arc(Math.cos(a)*s*(.55+k*.35),Math.sin(a)*s*(.55+k*.35),s*.035,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1; }
     if(t>.4 && t<1.9){ const k=easeO((t-.4)/.6); drawCursor(ctx,s*.7-k*s*.6,s*.8-k*s*.7,s*.4,t>1&&t<1.2); } }},
  {id:'lss', name:'Like • Share • Subscribe', cat:'Social', dur:5, aspect:.24, color:'#e8231a', text:'SUBSCRIBE', thumbT:2.5,
   draw(ctx,t,w,h,o){ const bh=h*.7, gap=w*.025, ws=[w*.22,w*.22,w*.5-gap*2]; let x=-w/2;
     const labels=['👍 Like','↗ Share',o.text||'SUBSCRIBE'], cols=['#ffffff','#ffffff',o.color], tcs=['#111','#111','#fff'];
     for(let i=0;i<3;i++){ const k=backOut(clamp((t-i*.35)/.4,0,1)); if(k>0){ ctx.save(); ctx.translate(x+ws[i]/2,0); ctx.scale(k,k);
       const clicked = t>1.6+i*.7; pill(ctx,-ws[i]/2,-bh/2,ws[i],bh,clicked&&i<2?'#1e88ff':cols[i],labels[i],clicked&&i<2?'#fff':tcs[i],FONT(bh*.36));
       if(i===2&&clicked){ ctx.save(); ctx.translate(ws[i]/2-bh*.45,0); drawBell(ctx,bh*.45,'#fff',Math.sin(t*20)*.3*Math.max(0,1-(t-3.7))); ctx.restore(); }
       ctx.restore(); } x+=ws[i]+gap; }
     if(t>1.2 && t<4.3){ const step=Math.min(2,Math.floor((t-1.2)/.7)), tx=-w/2+ws.slice(0,step).reduce((a,b)=>a+b+gap,0)+ws[step]*.55; drawCursor(ctx,tx,bh*.15,h*.38,((t-1.2)%.7)>.35&&((t-1.2)%.7)<.5); } }},
  {id:'follow', name:'Follow Button', cat:'Social', dur:3.5, aspect:.28, color:'#20b4d8', text:'+ Follow', text2:'✓ Following', thumbT:.8,
   draw(ctx,t,w,h,o){ const pop=backOut(clamp(t/.4,0,1)); if(pop<=0) return; ctx.save(); ctx.scale(pop,pop); const done=t>1.5, bw=w*.9, bh=h*.75;
     if(done){ pill(ctx,-bw/2,-bh/2,bw,bh,'#3a3a40',o.text2||'✓ Following','#fff',FONT(bh*.4)); }
     else { const g=ctx.createLinearGradient(-bw/2,0,bw/2,0); g.addColorStop(0,o.color); g.addColorStop(1,'#6a5cff'); pill(ctx,-bw/2,-bh/2,bw,bh,g,o.text||'+ Follow','#fff',FONT(bh*.4)); }
     ctx.restore(); if(t>.6&&t<2.3){ const k=easeO((t-.6)/.8); drawCursor(ctx,w*.5-k*w*.3,h*.9-k*h*.75,h*.5,t>1.4&&t<1.6); } }},
  {id:'heartlike', name:'Heart Burst', cat:'Social', dur:3, aspect:1, color:'#ff2d55', thumbT:.6,
   draw(ctx,t,w,h,o){ const s=w*.7, p=t%1.5, k=backOut(clamp(p/.35,0,1));
     ctx.save(); ctx.scale(k,k); ctx.fillStyle=o.color; heartPath(ctx,s); ctx.fill(); ctx.restore();
     for(let i=0;i<12;i++){ const a=i/12*Math.PI*2, d=clamp((p-.2)/.8,0,1); if(d<=0||d>=1) continue; ctx.globalAlpha=1-d; ctx.fillStyle=i%2?o.color:'#ffd166';
       ctx.save(); ctx.translate(Math.cos(a)*s*(.4+d*.5),Math.sin(a)*s*(.4+d*.5)); heartPath(ctx,s*.14); ctx.fill(); ctx.restore(); } ctx.globalAlpha=1; }},
  {id:'comment', name:'Comment Bubble', cat:'Social', dur:3.5, aspect:.42, color:'#ffffff', text:'Comment 💬', thumbT:2,
   draw(ctx,t,w,h,o){ const pop=backOut(clamp(t/.4,0,1)); if(pop<=0) return; ctx.save(); ctx.scale(pop,pop);
     ctx.fillStyle=o.color; rrp(ctx,-w/2,-h/2,w,h*.8,h*.2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-w*.3,h*.28); ctx.lineTo(-w*.38,h*.5); ctx.lineTo(-w*.18,h*.29); ctx.fill();
     if(t<1.3){ for(let i=0;i<3;i++){ ctx.fillStyle='#888'; ctx.globalAlpha=.4+.6*Math.max(0,Math.sin(t*8-i)); ctx.beginPath(); ctx.arc(-h*.25+i*h*.25,-h*.1,h*.08,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1; }
     else { ctx.fillStyle='#111'; ctx.font=FONT(h*.24,700); ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(o.text||'',0,-h*.1); }
     ctx.restore(); }},
  // Intro & End
  {id:'countdown', name:'Countdown 3-2-1', cat:'Intro & End', dur:3, aspect:1, color:'#20d5ec', thumbT:.4,
   draw(ctx,t,w,h,o){ const n=Math.max(1,Math.ceil(3-t)), f=t%1, s=w*.45;
     ctx.fillStyle='rgba(0,0,0,.55)'; ctx.beginPath(); ctx.arc(0,0,s,0,Math.PI*2); ctx.fill();
     ctx.strokeStyle='rgba(255,255,255,.2)'; ctx.lineWidth=s*.08; ctx.beginPath(); ctx.arc(0,0,s*.88,0,Math.PI*2); ctx.stroke();
     ctx.strokeStyle=o.color; ctx.beginPath(); ctx.arc(0,0,s*.88,-Math.PI/2,-Math.PI/2+f*Math.PI*2); ctx.stroke();
     const k=backOut(clamp(f/.3,0,1)); ctx.save(); ctx.scale(k,k); ctx.fillStyle='#fff'; ctx.font=FONT(s*1.05,900); ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(String(n),0,s*.05); ctx.restore(); }},
  {id:'title', name:'Title Reveal', cat:'Intro & End', dur:4, aspect:.3, color:'#20d5ec', text:'My Title', text2:'Subtitle here', thumbT:2,
   draw(ctx,t,w,h,o){ const lk=easeO(t/.6), out=clamp((t-3.4)/.6,0,1); ctx.globalAlpha*=1-out;
     ctx.fillStyle=o.color; ctx.fillRect(-w/2*lk,-h*.02,w*lk,h*.04);
     const tk=easeO((t-.45)/.6); ctx.save(); ctx.beginPath(); ctx.rect(-w/2,-h/2,w,h*.48); ctx.clip();
     ctx.fillStyle='#fff'; ctx.font=FONT(h*.34,900); ctx.textAlign='center'; ctx.textBaseline='alphabetic'; ctx.fillText(o.text||'',0,-h*.08+(1-tk)*h*.5); ctx.restore();
     ctx.save(); ctx.beginPath(); ctx.rect(-w/2,h*.02,w,h*.48); ctx.clip(); ctx.fillStyle='rgba(255,255,255,.85)'; ctx.font=FONT(h*.16,500); ctx.textBaseline='top'; ctx.textAlign='center'; ctx.fillText(o.text2||'',0,h*.1-(1-easeO((t-.7)/.6))*h*.4); ctx.restore();
     const sh=((t-1.2)/.8); if(sh>0&&sh<1){ const g=ctx.createLinearGradient(-w/2+sh*w*1.4-w*.2,0,-w/2+sh*w*1.4,0); g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.5,'rgba(255,255,255,.55)'); g.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=g; ctx.globalCompositeOperation='source-atop'; ctx.fillRect(-w/2,-h/2,w,h); ctx.globalCompositeOperation='source-over'; } }},
  {id:'lowerthird', name:'Lower Third', cat:'Intro & End', dur:5, aspect:.24, color:'#20d5ec', text:'Your Name', text2:'Teacher · Karnataka', thumbT:2,
   draw(ctx,t,w,h,o){ const inK=easeO(t/.5), outK=easeO((5-t)/.5), k=Math.min(inK,outK); if(k<=0) return;
     ctx.fillStyle=o.color; ctx.fillRect(-w/2,-h/2,w*.03,h*k);
     ctx.save(); ctx.beginPath(); ctx.rect(-w/2+w*.03,-h/2,w*k,h); ctx.clip();
     ctx.fillStyle='rgba(10,10,14,.85)'; ctx.fillRect(-w/2+w*.03,-h/2,w*.97,h*.6); ctx.fillStyle='#fff'; ctx.fillRect(-w/2+w*.03,h*.1,w*.75,h*.4);
     ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.fillStyle='#fff'; ctx.font=FONT(h*.3,800); ctx.fillText(o.text||'',-w/2+w*.07,-h*.2);
     ctx.fillStyle='#111'; ctx.font=FONT(h*.2,600); ctx.fillText(o.text2||'',-w/2+w*.07,h*.3); ctx.restore(); }},
  {id:'theend', name:'Thanks for Watching', cat:'Intro & End', dur:4, aspect:.4, color:'#ffd166', text:'Thanks for watching', text2:'See you soon!', thumbT:2,
   draw(ctx,t,w,h,o){ const a=easeO(t/.8); ctx.globalAlpha*=a; ctx.strokeStyle=o.color; ctx.lineWidth=h*.025; const lw=w*.4*easeO((t-.3)/.8);
     ctx.beginPath(); ctx.moveTo(-lw,-h*.32); ctx.lineTo(lw,-h*.32); ctx.moveTo(-lw,h*.32); ctx.lineTo(lw,h*.32); ctx.stroke();
     ctx.fillStyle='#fff'; ctx.font=FONT(h*.2,800); ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(o.text||'',0,-h*.07);
     ctx.fillStyle=o.color; ctx.font=FONT(h*.14,600); ctx.fillText(o.text2||'',0,h*.15); }},
  // Backgrounds (full frame)
  {id:'neonhearts', name:'Neon Hearts', cat:'Backgrounds', dur:10, full:true, color:'#ff2fb3', thumbT:1,
   draw(ctx,t,W,H,o){ ctx.fillStyle='#14001f'; ctx.fillRect(-W/2,-H/2,W,H); const m=Math.max(W,H);
     ctx.lineWidth=m*.012; ctx.shadowColor=o.color; ctx.shadowBlur=m*.03; ctx.strokeStyle=o.color;
     for(let i=0;i<9;i++){ const z=((i/9)+t*.18)%1, s=m*(.05+z*z*1.6); ctx.globalAlpha=Math.min(1,z*3)*(1-z*.3); ctx.save(); ctx.translate(0,s*.05); heartPath(ctx,s); ctx.stroke(); ctx.restore(); }
     ctx.globalAlpha=1; ctx.shadowBlur=0; }},
  {id:'gradient', name:'Gradient Flow', cat:'Backgrounds', dur:10, full:true, color:'#20d5ec', thumbT:1,
   draw(ctx,t,W,H,o){ const a=t*.4, g=ctx.createLinearGradient(Math.cos(a)*W/2,Math.sin(a)*H/2,-Math.cos(a)*W/2,-Math.sin(a)*H/2);
     g.addColorStop(0,`hsl(${(t*20)%360},80%,55%)`); g.addColorStop(.5,`hsl(${(t*20+90)%360},75%,45%)`); g.addColorStop(1,`hsl(${(t*20+200)%360},80%,40%)`);
     ctx.fillStyle=g; ctx.fillRect(-W/2,-H/2,W,H); }},
  {id:'bokeh', name:'Bokeh Lights', cat:'Backgrounds', dur:10, full:true, color:'#ffcf6b', thumbT:1,
   draw(ctx,t,W,H,o){ ctx.fillStyle='#0b0b14'; ctx.fillRect(-W/2,-H/2,W,H); const m=Math.max(W,H);
     for(let i=0;i<28;i++){ const r=m*(.03+hsh(i)*.07), x=(hsh(i+1)-.5)*W+Math.sin(t*.3+i)*W*.05, y=((hsh(i+2)-.5)*H*1.2 - t*m*.015*(1+hsh(i+3)))%(H*1.2);
       const yy=y< -H*.6 ? y+H*1.2 : y, g=ctx.createRadialGradient(x,yy,0,x,yy,r); const c=i%3===0?o.color:i%3===1?'#ff7ab6':'#7ad7ff';
       g.addColorStop(0,c); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.globalAlpha=.35+.35*Math.sin(t+i); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,yy,r,0,Math.PI*2); ctx.fill(); }
     ctx.globalAlpha=1; }},
  {id:'stars', name:'Space Warp', cat:'Backgrounds', dur:10, full:true, color:'#ffffff', thumbT:1,
   draw(ctx,t,W,H,o){ ctx.fillStyle='#03030a'; ctx.fillRect(-W/2,-H/2,W,H); const m=Math.max(W,H);
     for(let i=0;i<220;i++){ const a=hsh(i)*Math.PI*2, z=(hsh(i+7)+t*.12)%1, d=z*z*m*.8, x=Math.cos(a)*d, y=Math.sin(a)*d;
       ctx.globalAlpha=z; ctx.fillStyle=o.color; ctx.fillRect(x,y,1+z*3,1+z*3); } ctx.globalAlpha=1; }},
  {id:'fireworks', name:'Fireworks', cat:'Backgrounds', dur:10, full:true, color:'#ff5d5d', thumbT:1.2,
   draw(ctx,t,W,H,o){ ctx.fillStyle='#050510'; ctx.fillRect(-W/2,-H/2,W,H); const m=Math.max(W,H);
     for(let b=0;b<14;b++){ const bt=b*.75+hsh(b)*.5, k=t-bt; if(k<0||k>2.2) continue; const cx=(hsh(b+3)-.5)*W*.8, cy=(hsh(b+5)-.75)*H*.6, hue=hsh(b+9)*360;
       for(let i=0;i<40;i++){ const a=i/40*Math.PI*2, sp=m*.25*(.6+hsh(i+b*40)*.4), x=cx+Math.cos(a)*sp*easeO(k/1.2), y=cy+Math.sin(a)*sp*easeO(k/1.2)+k*k*m*.03;
         ctx.globalAlpha=Math.max(0,1-k/2.2); ctx.fillStyle=`hsl(${hue},95%,${60+20*hsh(i)}%)`; ctx.beginPath(); ctx.arc(x,y,m*.004,0,Math.PI*2); ctx.fill(); } }
     ctx.globalAlpha=1; }},
  {id:'sunburst', name:'Sunburst', cat:'Backgrounds', dur:10, full:true, color:'#ffb703', thumbT:1,
   draw(ctx,t,W,H,o){ const m=Math.max(W,H); ctx.fillStyle=o.color; ctx.fillRect(-W/2,-H/2,W,H); ctx.save(); ctx.rotate(t*.25); ctx.fillStyle='rgba(255,255,255,.22)';
     for(let i=0;i<16;i++){ ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,m,i/16*Math.PI*2,(i+.5)/16*Math.PI*2); ctx.fill(); } ctx.restore();
     const g=ctx.createRadialGradient(0,0,0,0,0,m*.6); g.addColorStop(0,'rgba(255,255,255,.5)'); g.addColorStop(1,'rgba(0,0,0,.25)'); ctx.fillStyle=g; ctx.fillRect(-W/2,-H/2,W,H); }},
  // Overlays (full frame, transparent)
  {id:'snow', name:'Snow', cat:'Overlays', dur:10, full:true, color:'#ffffff', thumbT:2,
   draw(ctx,t,W,H,o){ const m=Math.max(W,H); ctx.fillStyle=o.color;
     for(let i=0;i<160;i++){ const sp=.05+hsh(i)*.08, y=((hsh(i+1)*1.2+t*sp)%1.2-.6)*H, x=(hsh(i+2)-.5)*W+Math.sin(t*1.2+i)*m*.02, r=m*(.002+hsh(i+3)*.005);
       ctx.globalAlpha=.5+.5*hsh(i+4); ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1; }},
  {id:'rain', name:'Rain', cat:'Overlays', dur:10, full:true, color:'#bcd7ff', thumbT:2,
   draw(ctx,t,W,H,o){ const m=Math.max(W,H); ctx.strokeStyle=o.color; ctx.lineWidth=m*.0016;
     for(let i=0;i<200;i++){ const y=((hsh(i)+t*(1.2+hsh(i+1)))%1.1-.55)*H, x=(hsh(i+2)-.5)*W*1.2+y*.15, l=m*(.02+hsh(i+3)*.03);
       ctx.globalAlpha=.3+.4*hsh(i+4); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+l*.15,y+l); ctx.stroke(); } ctx.globalAlpha=1; }},
  {id:'confetti', name:'Confetti', cat:'Overlays', dur:6, full:true, color:'#ff3d7f', thumbT:1.5,
   draw(ctx,t,W,H,o){ const m=Math.max(W,H), cols=[o.color,'#ffd166','#06d6a0','#4cc9f0','#b388ff'];
     for(let i=0;i<140;i++){ const vy=.12+hsh(i)*.15, y=-H*.6+(t*vy+hsh(i+1)*.3)*H*1.1, x=(hsh(i+2)-.5)*W+Math.sin(t*2+i)*m*.03; if(y>H*.6) continue;
       ctx.save(); ctx.translate(x,y); ctx.rotate(t*3*(hsh(i+3)-.5)*4+i); ctx.scale(1,Math.sin(t*5+i)); ctx.fillStyle=cols[i%5]; ctx.fillRect(-m*.008,-m*.004,m*.016,m*.008); ctx.restore(); } }},
  {id:'hearts', name:'Floating Hearts', cat:'Overlays', dur:8, full:true, color:'#ff4d8d', thumbT:2,
   draw(ctx,t,W,H,o){ const m=Math.max(W,H); ctx.fillStyle=o.color;
     for(let i=0;i<30;i++){ const sp=.08+hsh(i)*.08, k=(hsh(i+1)+t*sp)%1, y=H*.6-k*H*1.3, x=(hsh(i+2)-.5)*W+Math.sin(t*1.5+i)*m*.04, s=m*(.03+hsh(i+3)*.05);
       ctx.globalAlpha=Math.sin(k*Math.PI)*.85; ctx.save(); ctx.translate(x,y); heartPath(ctx,s); ctx.fill(); ctx.restore(); } ctx.globalAlpha=1; }},
  {id:'sparkles', name:'Sparkles', cat:'Overlays', dur:8, full:true, color:'#fff6c2', thumbT:1,
   draw(ctx,t,W,H,o){ const m=Math.max(W,H); ctx.fillStyle=o.color;
     for(let i=0;i<60;i++){ const x=(hsh(i)-.5)*W, y=(hsh(i+1)-.5)*H, tw=Math.max(0,Math.sin(t*3+i*1.7)), s=m*.02*tw*(.5+hsh(i+2));
       if(s<.5) continue; ctx.globalAlpha=tw; ctx.beginPath(); for(let k=0;k<8;k++){ const a=k*Math.PI/4, r=k%2?s*.25:s; ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r); } ctx.fill(); } ctx.globalAlpha=1; }},
  {id:'bubbles', name:'Bubbles', cat:'Overlays', dur:8, full:true, color:'#bdefff', thumbT:2,
   draw(ctx,t,W,H,o){ const m=Math.max(W,H); ctx.strokeStyle=o.color; ctx.lineWidth=m*.003;
     for(let i=0;i<40;i++){ const k=(hsh(i)+t*(.06+hsh(i+1)*.06))%1, y=H*.6-k*H*1.3, x=(hsh(i+2)-.5)*W+Math.sin(t*2+i)*m*.02, r=m*(.01+hsh(i+3)*.03);
       ctx.globalAlpha=.7; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=.5; ctx.beginPath(); ctx.arc(x-r*.35,y-r*.35,r*.2,0,Math.PI*2); ctx.stroke(); } ctx.globalAlpha=1; }},
  {id:'filmdust', name:'Old Film Dust', cat:'Overlays', dur:10, full:true, color:'#ffffff', thumbT:1,
   draw(ctx,t,W,H,o){ const f=Math.floor(t*12), m=Math.max(W,H); ctx.strokeStyle=o.color; ctx.fillStyle=o.color;
     for(let i=0;i<3;i++){ if(hsh(f*3+i)<.5) continue; const x=(hsh(f*7+i)-.5)*W; ctx.globalAlpha=.35; ctx.lineWidth=m*.0015; ctx.beginPath(); ctx.moveTo(x,-H/2); ctx.lineTo(x+(hsh(f+i)-.5)*20,H/2); ctx.stroke(); }
     for(let i=0;i<25;i++){ ctx.globalAlpha=.5*hsh(f*31+i); ctx.beginPath(); ctx.arc((hsh(f*13+i)-.5)*W,(hsh(f*17+i)-.5)*H,m*.002*(1+hsh(i)*2),0,Math.PI*2); ctx.fill(); }
     ctx.globalAlpha=1; const g=ctx.createRadialGradient(0,0,m*.3,0,0,m*.75); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.55)'); ctx.fillStyle=g; ctx.fillRect(-W/2,-H/2,W,H); }},
  {id:'lightleak', name:'Light Leak', cat:'Overlays', dur:8, full:true, color:'#ff9a3c', blend:'screen', thumbT:1.5,
   draw(ctx,t,W,H,o){ const m=Math.max(W,H);
     for(let i=0;i<3;i++){ const x=Math.sin(t*.5+i*2)*W*.45, y=Math.cos(t*.4+i*1.3)*H*.4, r=m*(.45+.15*Math.sin(t+i)); const g=ctx.createRadialGradient(x,y,0,x,y,r);
       g.addColorStop(0,i===1?'rgba(255,60,120,.75)':i===2?'rgba(255,220,120,.6)':hexA(o.color,.8)); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(-W/2,-H/2,W,H); } }}
];
const GFX_CATS = ['Social','Intro & End','Backgrounds','Overlays'];
const GFXMAP = Object.fromEntries(GFX.map(g => [g.id, g]));
function drawGfxItem(ctx,o,an,cx,cy,rot,SZ,OP,u,lt){
  const g = GFXMAP[o.gfx]; if(!g) return null;
  const W = out.width, H = out.height, t = lt*(o.gspeed||1);
  ctx.save(); ctx.globalCompositeOperation = o.blend || 'source-over'; ctx.globalAlpha = clamp(OP/100*an.a,0,1);
  if(an.blur > .5) ctx.filter = `blur(${an.blur*u/720}px)`;
  if(g.full){ ctx.translate(W/2,H/2); try{ g.draw(ctx,t,W,H,o); }catch(e){} ctx.restore(); return null; }
  const w = u*SZ/100, h = w*g.aspect;
  ctx.translate(cx,cy); ctx.rotate(rot); ctx.scale(an.s*an.sx, an.s*an.sy);
  try{ g.draw(ctx,t,w,h,o); }catch(e){}
  ctx.restore();
  geo[o.id] = {cx, cy, rot, hw:w/2*an.s, hh:h/2*an.s, flip:false};
  return {hw:w/2, hh:h/2};
}
function paintGfx(canvas,id,t){
  const g = GFXMAP[id]; if(!g) return; const c = canvas.getContext('2d'), W = canvas.width, H = canvas.height;
  c.setTransform(1,0,0,1,0,0); c.clearRect(0,0,W,H);
  c.fillStyle = '#232328'; c.fillRect(0,0,W,H);
  c.save(); c.translate(W/2,H/2);
  const o = {color:g.color, text:g.text, text2:g.text2, gspeed:1};
  try{ if(g.full) g.draw(c,t,W,H,o); else { const w = Math.min(W*.85, H*.85/g.aspect); g.draw(c,t,w,w*g.aspect,o); } }catch(e){}
  c.restore();
}
function addGfx(id,t){
  const g = GFXMAP[id]; if(!g) return;
  const o = newOverlay('gfx', {gfx:id, start:t ?? S.time, dur:g.dur, text:g.text||'', text2:g.text2||'', color:g.color||'#20d5ec', gspeed:1,
    size:g.full?100:(g.aspect<.5?70:40), x:50, y:g.id==='lowerthird'?80:50, blend:g.blend||'source-over',
    anim:{in:'none',out:g.full?'fade':'none',loop:'none',inDur:.5,outDur:.5}});
  pushUndo();
  if(g.full) S.overlays.unshift(o); else S.overlays.push(o);
  S.sel = o.id; afterEdit();
}

/* ---------------- SOCIAL / BADGE STICKERS (generic icons, drawn by ChitraCut) ---------------- */
const SVGW = (body, vb='0 0 100 100') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`;
const SVG_STICKERS = {
  thumb: SVGW('<circle cx="50" cy="50" r="46" fill="#1e88ff"/><path d="M28 47h10v28H28zM42 47l10-20c4-6 11-3 9 4l-3 10h15c5 0 7 4 6 8l-4 19c-1 4-4 7-8 7H42z" fill="#fff"/>'),
  heart: SVGW('<circle cx="50" cy="50" r="46" fill="#ff2d55"/><path d="M50 74C22 56 24 34 38 31c6-1 10 2 12 7 2-5 6-8 12-7 14 3 16 25-12 43z" fill="#fff"/>'),
  bell: SVGW('<circle cx="50" cy="50" r="46" fill="#ffc400"/><path d="M30 64h40l-5-7V44c0-9-6-15-15-16-9 1-15 7-15 16v13z" fill="#fff"/><circle cx="50" cy="69" r="5" fill="#fff"/><circle cx="68" cy="30" r="8" fill="#e8231a"/>'),
  comment: SVGW('<circle cx="50" cy="50" r="46" fill="#7b5cff"/><path d="M27 33h46a5 5 0 0 1 5 5v22a5 5 0 0 1-5 5H45l-12 10v-10h-6a5 5 0 0 1-5-5V38a5 5 0 0 1 5-5z" fill="#fff"/><circle cx="38" cy="49" r="4" fill="#7b5cff"/><circle cx="50" cy="49" r="4" fill="#7b5cff"/><circle cx="62" cy="49" r="4" fill="#7b5cff"/>'),
  share: SVGW('<circle cx="50" cy="50" r="46" fill="#10b981"/><path d="M56 26l22 20-22 20V54c-16 0-25 5-32 16 2-18 12-30 32-32z" fill="#fff"/>'),
  verified: SVGW('<path d="M50 4l11 8 13-2 5 12 12 6-2 13 8 11-8 11 2 13-12 6-5 12-13-2-11 8-11-8-13 2-5-12-12-6 2-13-8-11 8-11-2-13 12-6 5-12 13 2z" fill="#1d9bf0"/><path d="M33 51l11 11 24-25" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'),
  check: SVGW('<circle cx="50" cy="50" r="46" fill="#22c55e"/><path d="M29 52l14 14 29-31" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>'),
  play: SVGW('<circle cx="50" cy="50" r="46" fill="#e8231a"/><path d="M41 31v38l30-19z" fill="#fff"/>'),
  follow: SVGW('<circle cx="50" cy="50" r="46" fill="#20b4d8"/><circle cx="44" cy="40" r="11" fill="#fff"/><path d="M24 72c2-13 11-19 20-19s18 6 20 19z" fill="#fff"/><path d="M70 36v18M61 45h18" stroke="#fff" stroke-width="7" stroke-linecap="round"/>'),
  camera: SVGW('<circle cx="50" cy="50" r="46" fill="#f97316"/><rect x="24" y="35" width="52" height="34" rx="7" fill="#fff"/><path d="M40 35l4-7h12l4 7z" fill="#fff"/><circle cx="50" cy="52" r="10" fill="#f97316"/><circle cx="50" cy="52" r="5" fill="#fff"/>'),
  star: SVGW('<circle cx="50" cy="50" r="46" fill="#facc15"/><path d="M50 22l8 17 19 2-14 13 4 19-17-10-17 10 4-19-14-13 19-2z" fill="#fff"/>'),
  pin: SVGW('<path d="M50 6c-18 0-31 13-31 30 0 23 31 58 31 58s31-35 31-58C81 19 68 6 50 6z" fill="#ef4444"/><circle cx="50" cy="36" r="12" fill="#fff"/>'),
  music: SVGW('<circle cx="50" cy="50" r="46" fill="#111"/><path d="M42 66V34l26-6v30" fill="none" stroke="#20d5ec" stroke-width="6"/><circle cx="36" cy="66" r="8" fill="#20d5ec"/><circle cx="62" cy="58" r="8" fill="#ff2d75"/>'),
  live: SVGW('<rect x="4" y="24" width="92" height="52" rx="10" fill="#e8231a"/><circle cx="22" cy="50" r="7" fill="#fff"/><text x="60" y="61" font-family="Arial,sans-serif" font-weight="900" font-size="30" fill="#fff" text-anchor="middle">LIVE</text>'),
  new: SVGW('<path d="M50 4l9 13 15-5 2 16 16 3-6 15 12 10-12 10 6 15-16 3-2 16-15-5-9 13-9-13-15 5-2-16-16-3 6-15L4 54l12-10-6-15 16-3 2-16 15 5z" fill="#ff2d55"/><text x="50" y="60" font-family="Arial,sans-serif" font-weight="900" font-size="26" fill="#fff" text-anchor="middle">NEW</text>'),
  sale: SVGW('<rect x="6" y="26" width="88" height="48" rx="8" fill="#facc15"/><text x="50" y="60" font-family="Arial,sans-serif" font-weight="900" font-size="28" fill="#111" text-anchor="middle">SALE</text>'),
  hot: SVGW('<rect x="6" y="26" width="88" height="48" rx="24" fill="#f97316"/><text x="50" y="59" font-family="Arial,sans-serif" font-weight="900" font-size="24" fill="#fff" text-anchor="middle">🔥 HOT</text>'),
  arrowR: SVGW('<path d="M10 40h52V22l30 28-30 28V60H10z" fill="#facc15" stroke="#111" stroke-width="4" stroke-linejoin="round"/>'),
  arrowD: SVGW('<path d="M40 8v52H22l28 30 28-30H60V8z" fill="#20d5ec" stroke="#111" stroke-width="4" stroke-linejoin="round"/>'),
  arrowC: SVGW('<path d="M18 74C22 38 46 22 74 26" fill="none" stroke="#ff2d55" stroke-width="9" stroke-linecap="round"/><path d="M64 12l18 14-18 14" fill="none" stroke="#ff2d55" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'),
  click: SVGW('<path d="M30 14v58l14-12 10 24 10-4-10-24 19-1z" fill="#fff" stroke="#111" stroke-width="5" stroke-linejoin="round"/>'),
  circle: SVGW('<ellipse cx="50" cy="50" rx="44" ry="34" fill="none" stroke="#ff2d55" stroke-width="7" transform="rotate(-8 50 50)"/>'),
  cross: SVGW('<circle cx="50" cy="50" r="46" fill="#ef4444"/><path d="M33 33l34 34M67 33L33 67" stroke="#fff" stroke-width="10" stroke-linecap="round"/>'),
  q: SVGW('<circle cx="50" cy="50" r="46" fill="#7b5cff"/><text x="50" y="66" font-family="Arial,sans-serif" font-weight="900" font-size="48" fill="#fff" text-anchor="middle">?</text>'),
  ex: SVGW('<path d="M50 6l46 82H4z" fill="#facc15" stroke="#111" stroke-width="4" stroke-linejoin="round"/><path d="M50 36v24" stroke="#111" stroke-width="9" stroke-linecap="round"/><circle cx="50" cy="74" r="5" fill="#111"/>'),
  num1: SVGW('<circle cx="50" cy="50" r="46" fill="#20d5ec"/><text x="50" y="66" font-family="Arial,sans-serif" font-weight="900" font-size="46" fill="#04262b" text-anchor="middle">1</text>'),
  num2: SVGW('<circle cx="50" cy="50" r="46" fill="#20d5ec"/><text x="50" y="66" font-family="Arial,sans-serif" font-weight="900" font-size="46" fill="#04262b" text-anchor="middle">2</text>'),
  num3: SVGW('<circle cx="50" cy="50" r="46" fill="#20d5ec"/><text x="50" y="66" font-family="Arial,sans-serif" font-weight="900" font-size="46" fill="#04262b" text-anchor="middle">3</text>')
};
const STICKER_SETS = {
  social: ['thumb','heart','bell','comment','share','verified','check','play','follow','camera','star','pin','music'],
  badges: ['live','new','sale','hot','arrowR','arrowD','arrowC','click','circle','cross','q','ex','num1','num2','num3']
};
const SVG_URL = {}, SVGIMG = {};
for(const k in SVG_STICKERS){ SVG_URL[k] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVG_STICKERS[k]); const im = new Image(); im.src = SVG_URL[k]; SVGIMG[k] = im; }

/* ---------------- MORE SOUND EFFECTS ---------------- */
SFX.push(
  {id:'notif2',  name:'Notification',    cat:'UI', dur:.8},
  {id:'msgpop',  name:'Message Pop',     cat:'UI', dur:.25},
  {id:'swipe',   name:'Swipe',           cat:'UI', dur:.3},
  {id:'pageturn',name:'Page Turn',       cat:'UI', dur:.6},
  {id:'correct', name:'Correct Answer',  cat:'UI', dur:.8},
  {id:'wrong',   name:'Wrong Buzzer',    cat:'UI', dur:.8},
  {id:'alarm',   name:'Alarm Beep',      cat:'Alerts', dur:2},
  {id:'phonering',name:'Phone Ring',     cat:'Alerts', dur:2.6},
  {id:'timer',   name:'Timer Countdown', cat:'Alerts', dur:4.2},
  {id:'siren',   name:'Siren',           cat:'Alerts', dur:3},
  {id:'carhorn', name:'Car Horn',        cat:'Alerts', dur:1},
  {id:'cashreg', name:'Cash Register',   cat:'Everyday', dur:1.3},
  {id:'knock',   name:'Door Knock',      cat:'Everyday', dur:1.2},
  {id:'footsteps',name:'Footsteps',      cat:'Everyday', dur:2.4},
  {id:'waterdrop',name:'Water Drop',     cat:'Everyday', dur:.6},
  {id:'splash',  name:'Splash',          cat:'Everyday', dur:1.2},
  {id:'jump',    name:'Game Jump',       cat:'Game', dur:.35},
  {id:'powerup', name:'Power Up',        cat:'Game', dur:.8},
  {id:'levelup', name:'Level Up',        cat:'Game', dur:1.4},
  {id:'gameover',name:'Game Over',       cat:'Game', dur:1.8},
  {id:'laser',   name:'Laser',           cat:'Game', dur:.4},
  {id:'explode8',name:'8-bit Explosion', cat:'Game', dur:.9},
  {id:'bassdrop',name:'Bass Drop',       cat:'Cinematic', dur:2.2},
  {id:'impact',  name:'Cinematic Impact',cat:'Cinematic', dur:2.5},
  {id:'braam',   name:'Braam',           cat:'Cinematic', dur:3},
  {id:'tension', name:'Tension Rise',    cat:'Cinematic', dur:4},
  {id:'thunder', name:'Thunder',         cat:'Cinematic', dur:3.5},
  {id:'sword',   name:'Sword Swish',     cat:'Cinematic', dur:.8},
  {id:'scratch', name:'Record Scratch',  cat:'Funny', dur:.7},
  {id:'laugh',   name:'Crowd Laugh',     cat:'Funny', dur:3},
  {id:'cheer',   name:'Crowd Cheer',     cat:'Funny', dur:3.5},
  {id:'wind',    name:'Wind',            cat:'Ambience', dur:5},
  {id:'rainamb', name:'Rain',            cat:'Ambience', dur:5},
  {id:'harp',    name:'Harp Glissando',  cat:'Musical', dur:2},
  {id:'chord',   name:'Piano Chord',     cat:'Musical', dur:2.5}
);
for(const c of ['Alerts','Game','Cinematic','Ambience']) if(!SFX_CATS.includes(c)) SFX_CATS.push(c);
function synthExtra(id,{ctx,out_,env,osc,noise,nb}){
  const tone = (type,f,t,len,peak=.3,f1) => osc(type,f,f1,t,len,.004,len,peak);
  switch(id){
    case 'notif2': tone('sine',880,0,.35,.4); tone('sine',1320,.15,.5,.35); break;
    case 'msgpop': osc('sine',600,1400,0,.05,.002,.12,.6); osc('sine',1800,null,.04,0,.002,.06,.15); break;
    case 'swipe': noise(0,.05,.2,.6,'bandpass',800,4000,1.5,.22); break;
    case 'pageturn': for(let i=0;i<6;i++) noise(i*.07,.01,.08,.35,'bandpass',2500+i*400,null,2); noise(.3,.02,.2,.4,'highpass',3000); break;
    case 'correct': tone('sine',1047,0,.18,.4); tone('sine',1568,.12,.6,.4); break;
    case 'wrong': osc('sawtooth',140,null,0,0,.01,.7,.25); osc('sawtooth',147,null,0,0,.01,.7,.25); break;
    case 'alarm': for(let i=0;i<8;i++) osc('square',i%2?1760:880,null,i*.24,0,.003,.14,.18); break;
    case 'phonering': for(const t0 of [0,1.3]) for(let i=0;i<18;i++){ osc('sine',440,null,t0+i*.05,0,.002,.045,.2); osc('sine',480,null,t0+i*.05,0,.002,.045,.2); } break;
    case 'timer': [0,1,2].forEach(t=>osc('sine',880,null,t,0,.003,.18,.4)); osc('sine',1760,null,3,0,.003,1,.45); break;
    case 'siren': { const o=ctx.createOscillator(), l=ctx.createOscillator(), lg=ctx.createGain(); o.type='sawtooth'; o.frequency.value=900; l.frequency.value=.7; lg.gain.value=300; l.connect(lg); lg.connect(o.frequency); const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2500; o.connect(lp); env(0,.1,2.85,.25,lp); o.start(0); l.start(0); o.stop(3); l.stop(3); break; }
    case 'carhorn': osc('square',400,null,0,0,.01,.9,.18); osc('square',500,null,0,0,.01,.9,.15); break;
    case 'cashreg': osc('square',2400,null,0,0,.002,.06,.15); osc('square',3000,null,.07,0,.002,.06,.15); noise(.15,.002,.25,.4,'highpass',4000); osc('sine',2637,null,.3,0,.003,1,.35); osc('sine',3951,null,.3,0,.003,.7,.15); break;
    case 'knock': [0,.22,.44].forEach(t=>{ osc('sine',180,90,t,.08,.002,.12,.9); noise(t,.001,.04,.5,'bandpass',900,null,2); }); break;
    case 'footsteps': for(let i=0;i<6;i++){ const t=i*.4; osc('sine',110,60,t,.06,.002,.1,.7); noise(t,.002,.08,.35,'lowpass',1200); } break;
    case 'waterdrop': osc('sine',1400,500,0,.08,.002,.3,.6); osc('sine',700,1600,.06,.1,.002,.2,.2); break;
    case 'splash': noise(0,.01,1,.8,'lowpass',3500,600); for(let i=0;i<10;i++) osc('sine',800+Math.random()*1600,null,.1+Math.random()*.6,0,.002,.08,.08); break;
    case 'jump': osc('square',300,900,0,.2,.003,.22,.25); break;
    case 'powerup': [523,659,784,1047,1319,1568].forEach((f,i)=>osc('square',f,null,i*.07,0,.002,.12,.18)); break;
    case 'levelup': [523,659,784,1047].forEach((f,i)=>osc('square',f,null,i*.12,0,.002,.15,.18)); [784,1047].forEach(f=>osc('square',f,null,.55,0,.002,.8,.15)); break;
    case 'gameover': [494,466,440,415].forEach((f,i)=>osc('square',f,null,i*.3,0,.004,i===3?.9:.26,.2)); break;
    case 'laser': osc('sawtooth',2200,180,0,.3,.002,.35,.25); break;
    case 'explode8': { const n=noise(0,.002,.85,.9,'lowpass',2000,100); break; }
    case 'bassdrop': osc('sine',140,30,0,2,.01,2.1,1); osc('triangle',70,25,0,2,.01,2,.4); break;
    case 'impact': osc('sine',70,25,0,1.5,.004,2.3,1); noise(0,.002,.4,.8,'lowpass',3000,200); noise(0,.001,.15,.5,'highpass',3000); osc('sine',55,null,.05,0,.01,2.2,.35); break;
    case 'braam': for(const f of [55,55.6,82.4,110.3]) { const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.value=f; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(200,0); lp.frequency.linearRampToValueAtTime(1600,.4); lp.frequency.linearRampToValueAtTime(400,2.8); o.connect(lp); env(0,.25,2.7,.22,lp); o.start(0); o.stop(3); } break;
    case 'tension': { for(const f of [110,116.5]){ const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(f,0); o.frequency.exponentialRampToValueAtTime(f*2.2,3.9); const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(300,0); lp.frequency.exponentialRampToValueAtTime(3000,3.9); o.connect(lp); const g=ctx.createGain(); g.gain.setValueAtTime(.001,0); g.gain.exponentialRampToValueAtTime(.25,3.8); g.gain.linearRampToValueAtTime(0,4); lp.connect(g); g.connect(out_); o.start(0); o.stop(4); } noise(0,3.8,.15,.25,'bandpass',300,5000,1,3.9); break; }
    case 'thunder': noise(0,.005,.3,1,'highpass',1500); noise(.05,.3,3,.9,'lowpass',500,60); noise(.6,.2,2.2,.6,'lowpass',220); break;
    case 'sword': noise(0,.06,.25,.8,'bandpass',1200,6000,4,.25); osc('sine',3200,null,.12,0,.002,.6,.12); osc('sine',4700,null,.12,0,.002,.5,.08); break;
    case 'scratch': { const n=ctx.createBufferSource(); n.buffer=nb; const f=ctx.createBiquadFilter(); f.type='bandpass'; f.Q.value=6; f.frequency.setValueAtTime(400,0); f.frequency.exponentialRampToValueAtTime(2500,.15); f.frequency.exponentialRampToValueAtTime(300,.35); f.frequency.exponentialRampToValueAtTime(2000,.55); n.connect(f); env(0,.01,.65,1,f); n.start(0); n.stop(.7); break; }
    case 'laugh': for(let v=0;v<6;v++){ const base=Math.random()*.3; for(let i=0;i<10;i++){ const t=base+i*.2+Math.random()*.05; if(t>2.8) break; const k=Math.min(1,(2.9-t)/.8); noise(t,.01,.1,.25*k,'bandpass',600+v*180+Math.random()*200,null,4); } } break;
    case 'cheer': for(let i=0;i<220;i++){ const t=Math.random()*3.2, k=Math.min(1,t/.3)*Math.min(1,(3.4-t)/.8); noise(t,.001,.03,.12*k,'bandpass',1200+Math.random()*2800,null,1.5); } noise(.1,.4,2.8,.35,'bandpass',900,1400,3,3); break;
    case 'wind': { const n=ctx.createBufferSource(); n.buffer=nb; n.loop=true; const f=ctx.createBiquadFilter(); f.type='bandpass'; f.Q.value=1.5; f.frequency.setValueAtTime(300,0); for(let i=1;i<6;i++) f.frequency.linearRampToValueAtTime(250+Math.random()*700,i); n.connect(f); env(0,1,4,.7,f); n.start(0); n.stop(5); break; }
    case 'rainamb': { const n=ctx.createBufferSource(); n.buffer=nb; n.loop=true; const f=ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value=2500; n.connect(f); env(0,.5,4.5,.35,f); n.start(0); n.stop(5); for(let i=0;i<60;i++) noise(Math.random()*4.8,.001,.02,.15,'bandpass',3000+Math.random()*4000,null,3); break; }
    case 'harp': for(let i=0;i<16;i++){ const f=262*Math.pow(2,[0,2,4,7,9][i%5]/12+Math.floor(i/5)); osc('triangle',f,null,i*.06,0,.003,1.2,.12); } break;
    case 'chord': [261.6,329.6,392,523.3].forEach(f=>{ osc('triangle',f,null,0,0,.005,2.3,.18); osc('sine',f*2,null,0,0,.005,1.2,.05); }); break;
  }
}

/* ---------------- AUDIO TOOLS: noise reduction & loudness ---------------- */
function wavMulti(chans, sr){
  const nC = chans.length, n = chans[0].length, ab = new ArrayBuffer(44 + n*nC*2), v = new DataView(ab);
  const w = (o,s) => { for(let i=0;i<s.length;i++) v.setUint8(o+i, s.charCodeAt(i)); };
  w(0,'RIFF'); v.setUint32(4,36+n*nC*2,true); w(8,'WAVE'); w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,nC,true);
  v.setUint32(24,sr,true); v.setUint32(28,sr*nC*2,true); v.setUint16(32,nC*2,true); v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,n*nC*2,true);
  let o = 44; for(let i=0;i<n;i++) for(let c=0;c<nC;c++){ v.setInt16(o, clamp(chans[c][i],-1,1)*32767, true); o += 2; }
  return new Blob([ab], {type:'audio/wav'});
}
const DENOISE_SRC = `
function fft(re,im,inv){const n=re.length;for(let i=1,j=0;i<n;i++){let b=n>>1;for(;j&b;b>>=1)j^=b;j^=b;if(i<j){let t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t;}}
 for(let len=2;len<=n;len<<=1){const a=2*Math.PI/len*(inv?1:-1),wr=Math.cos(a),wi=Math.sin(a);for(let i=0;i<n;i+=len){let cr=1,ci=0;for(let j=0;j<len/2;j++){const p=i+j,q=p+len/2,xr=re[q]*cr-im[q]*ci,xi=re[q]*ci+im[q]*cr;re[q]=re[p]-xr;im[q]=im[p]-xi;re[p]+=xr;im[p]+=xi;const t=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=t;}}}
 if(inv)for(let i=0;i<n;i++){re[i]/=n;im[i]/=n;}}
self.onmessage=e=>{
  const {chans,strength}=e.data, N=2048, H=512, B=N/2+1, win=new Float32Array(N);
  for(let i=0;i<N;i++) win[i]=.5-.5*Math.cos(2*Math.PI*i/N);
  const alpha=[1.3,2.0,3.0][strength]||2, floor=[.18,.1,.05][strength]||.1, out=[], total=chans.length;
  const re=new Float64Array(N), im=new Float64Array(N);
  chans.forEach((x,ci)=>{
    const L=x.length, frames=Math.max(1,Math.ceil(L/H)), en=new Float32Array(frames);
    for(let f=0;f<frames;f++){ let s=0; const o=f*H; for(let i=0;i<N&&o+i<L;i+=4) s+=x[o+i]*x[o+i]; en[f]=s; }
    const idx=[...en.keys()].sort((a,b)=>en[a]-en[b]), take=Math.max(4,Math.floor(frames*.12)), noise=new Float64Array(B);
    for(let k=0;k<take&&k<idx.length;k++){ const o=idx[k]*H; for(let i=0;i<N;i++){ re[i]=(o+i<L?x[o+i]:0)*win[i]; im[i]=0; } fft(re,im,false); for(let b=0;b<B;b++) noise[b]+=Math.hypot(re[b],im[b])/take; }
    const y=new Float32Array(L+N), prev=new Float64Array(B).fill(1);
    for(let f=0;f<frames;f++){
      const o=f*H; for(let i=0;i<N;i++){ re[i]=(o+i<L?x[o+i]:0)*win[i]; im[i]=0; }
      fft(re,im,false);
      for(let b=0;b<B;b++){ const m=Math.hypot(re[b],im[b])+1e-12; let g=Math.max(floor,1-alpha*noise[b]/m); g=prev[b]*.55+g*.45; prev[b]=g; re[b]*=g; im[b]*=g; if(b>0&&b<N/2){ re[N-b]=re[b]; im[N-b]=-im[b]; } }
      fft(re,im,true);
      for(let i=0;i<N;i++) y[o+i]+=re[i]*win[i]/1.5;
      if(f%200===0) self.postMessage({prog:(ci+f/frames)/total});
    }
    out.push(y.subarray(0,L).slice());
  });
  self.postMessage({chans:out},out.map(c=>c.buffer));
};`;
function srcRangeOf(it){ return !it.type ? {from:it.in, len:it.out-it.in} : {from:it.in, len:it.dur*it.speed}; }
async function reduceNoise(it, strength, onProg){
  const m = media(it.mediaId), blob = m && mediaBlobs[m.id]; if(!blob) throw new Error('Media file not found');
  const {from, len} = srcRangeOf(it);
  const ab = await new OfflineAudioContext(1,1,44100).decodeAudioData(await blob.arrayBuffer());
  const s0 = Math.floor(from*ab.sampleRate), n = Math.max(1, Math.min(ab.length - s0, Math.ceil(len*ab.sampleRate)));
  const chans = []; for(let c=0;c<Math.min(2,ab.numberOfChannels);c++) chans.push(ab.getChannelData(c).slice(s0, s0+n));
  const res = await new Promise((resolve,reject) => {
    const w = new Worker(URL.createObjectURL(new Blob([DENOISE_SRC],{type:'text/javascript'})));
    w.onmessage = e => { if(e.data.prog != null){ onProg && onProg(e.data.prog); } else { resolve(e.data.chans); w.terminate(); } };
    w.onerror = e => { reject(new Error(e.message || 'worker error')); w.terminate(); };
    w.postMessage({chans, strength}, chans.map(c => c.buffer));
  });
  const f = new File([wavMulti(res, ab.sampleRate)], `${m.name.replace(/\.[^.]+$/,'')} (clean).wav`, {type:'audio/wav'});
  return addAudioMedia(f, n/ab.sampleRate);
}
async function computeNorm(it){
  const m = media(it.mediaId), blob = m && mediaBlobs[m.id]; if(!blob) return 1;
  const {from, len} = srcRangeOf(it);
  const ab = await new OfflineAudioContext(1,1,16000).decodeAudioData(await blob.arrayBuffer());
  const s0 = Math.floor(from*ab.sampleRate), n = Math.max(1, Math.min(ab.length - s0, Math.ceil(len*ab.sampleRate)));
  let ss = 0, pk = 0, cnt = 0;
  for(let c=0;c<ab.numberOfChannels;c++){ const d = ab.getChannelData(c); for(let i=s0;i<s0+n;i++){ const v = d[i]; ss += v*v; if(Math.abs(v) > pk) pk = Math.abs(v); cnt++; } }
  const db = 20*Math.log10(Math.sqrt(ss/Math.max(1,cnt)) + 1e-9);
  let g = Math.pow(10, (-17 - db)/20); g = Math.min(g, .97/(pk + 1e-9)); g = clamp(g, .2, 8);
  it.normGain = g; return g;
}

/* ---------------- MOTION TRACKING (template matching, runs in browser) ---------------- */
async function runTracking(o, box, onProg, cancel){
  const W = out.width, H = out.height, SC = Math.min(1, 320/Math.max(W,H)), sw = Math.round(W*SC), sh = Math.round(H*SC);
  const cnv = document.createElement('canvas'); cnv.width = sw; cnv.height = sh; const x = cnv.getContext('2d', {willReadFrequently:true});
  const v = mkVideo(null); v.muted = true; let curUrl = '';
  const tw = Math.max(8, Math.round(box.w*SC)), th = Math.max(8, Math.round(box.h*SC));
  let px = (box.x + box.w/2)*SC, py = (box.y + box.h/2)*SC, tpl = null; const res = [];
  const gray = () => { const d = x.getImageData(0,0,sw,sh).data, g = new Float32Array(sw*sh); for(let i=0,j=0;i<g.length;i++,j+=4) g[i] = d[j]*.299 + d[j+1]*.587 + d[j+2]*.114; return g; };
  const grab = (g,cx,cy) => { const t = new Float32Array(tw*th), x0 = Math.round(cx-tw/2), y0 = Math.round(cy-th/2); for(let yy=0;yy<th;yy++) for(let xx=0;xx<tw;xx++) t[yy*tw+xx] = g[clamp(y0+yy,0,sh-1)*sw + clamp(x0+xx,0,sw-1)]; return t; };
  const sad = (g,cx,cy,stride,best) => { const x0 = Math.round(cx-tw/2), y0 = Math.round(cy-th/2); let s = 0;
    for(let yy=0;yy<th;yy+=stride){ const row = clamp(y0+yy,0,sh-1)*sw; for(let xx=0;xx<tw;xx+=stride) s += Math.abs(g[row + clamp(x0+xx,0,sw-1)] - tpl[yy*tw+xx]); if(s >= best) return s; } return s; };
  const step = 1/12, t0 = o.start, t1 = o.start + o.dur;
  try{
    for(let t = t0; t <= t1 + 1e-6 && !cancel.flag; t += step){
      const c = clipAt(t);
      x.setTransform(1,0,0,1,0,0); x.fillStyle = '#000'; x.fillRect(0,0,sw,sh);
      if(c){
        const st = localToSrc(c, t - derived[c.id].start); let el, vw, vh;
        if(isImg(c)){ el = images[c.mediaId]; vw = el.naturalWidth; vh = el.naturalHeight; }
        else {
          const m = media(c.mediaId);
          if(m.url !== curUrl){ curUrl = m.url; await new Promise(r => { v.onloadedmetadata = r; v.onerror = r; v.src = m.url; }); }
          await seekTo(v, st); await waitFrame(v); el = v; vw = v.videoWidth; vh = v.videoHeight;
        }
        if(vw){
          const k = Math.min(W/vw, H/vh)*ev(c,'tf.scale',st)/100;
          x.scale(SC,SC); x.translate(W/2 + ev(c,'tf.x',st)*PK(), H/2 - ev(c,'tf.y',st)*PK()); x.rotate(ev(c,'tf.rot',st)*Math.PI/180); if(c.tf.flip) x.scale(-1,1);
          x.drawImage(el, -vw*k/2, -vh*k/2, vw*k, vh*k);
        }
      }
      const g = gray();
      if(!tpl) tpl = grab(g, px, py);
      else {
        const R = Math.max(10, Math.round(Math.max(tw,th)*.7)); let best = Infinity, bx = px, by = py;
        for(let dy=-R; dy<=R; dy+=2) for(let dx=-R; dx<=R; dx+=2){ const s = sad(g, px+dx, py+dy, 2, best); if(s < best){ best = s; bx = px+dx; by = py+dy; } }
        let best2 = Infinity, fx = bx, fy = by;
        for(let dy=-2; dy<=2; dy++) for(let dx=-2; dx<=2; dx++){ const s = sad(g, bx+dx, by+dy, 1, best2); if(s < best2){ best2 = s; fx = bx+dx; fy = by+dy; } }
        px = fx; py = fy;
        const nt = grab(g, px, py); for(let i=0;i<tpl.length;i++) tpl[i] = tpl[i]*.85 + nt[i]*.15;
      }
      res.push({t, x:px/SC, y:py/SC});
      onProg && onProg((t - t0)/Math.max(.01, t1 - t0));
      await new Promise(r => setTimeout(r, 0));
    }
  } finally { dropEl(v); }
  return res;
}
function applyTracking(o, pts, box){
  if(!pts.length) return;
  const W = out.width, H = out.height, c0x = box.x + box.w/2, c0y = box.y + box.h/2, lt0 = pts[0].t - o.start;
  const offX = ev(o,'x',lt0)/100*W - c0x, offY = ev(o,'y',lt0)/100*H - c0y;
  const sm = pts.map((p,i) => { const a = pts[Math.max(0,i-1)], b = pts[Math.min(pts.length-1,i+1)]; return {t:p.t, x:(a.x+p.x*2+b.x)/4, y:(a.y+p.y*2+b.y)/4}; });
  const kf = sm.map(p => { const lt = p.t - o.start; return {t:lt, v:{size:ev(o,'size',lt), rot:ev(o,'rot',lt), opacity:ev(o,'opacity',lt), x:(p.x+offX)/W*100, y:(p.y+offY)/H*100}}; });
  pushUndo(); o.kf = kf; o.tracked = true;
}

/* ---------------- PRO FILTERS (cinematic colour grades, generated as 3D LUTs) ----------------
   Each grade is a small recipe (exposure, white balance, lift/gamma/gain, contrast curve, split-toning,
   teal-orange, fade, mono …). It is baked into a 25³ LUT on first use, so playback costs one texture lookup. */
const lumF = (r,g,b) => .2126*r + .7152*g + .0722*b;
function scurve(v,k){ v = clamp(v,0,1); if(k >= 0){ const e = 1 + k*1.6; return v < .5 ? .5*Math.pow(2*v,e) : 1 - .5*Math.pow(2*(1-v),e); } return .5 + (v-.5)*(1+k*.7); }
// selective colour (like an HSL panel): each band = [centre hue°, width°, hue shift°, saturation ×, lightness +]
function hueSat(c){ const mx = Math.max(...c), mn = Math.min(...c), d = mx - mn; if(d < 1e-5) return [0, 0];
  let h = mx === c[0] ? ((c[1]-c[2])/d) % 6 : mx === c[1] ? (c[2]-c[0])/d + 2 : (c[0]-c[1])/d + 4; h *= 60; if(h < 0) h += 360; return [h, d]; }
function rotHue(c, deg){ const a = deg*Math.PI/180, cs = Math.cos(a), sn = Math.sin(a), k = 1/Math.sqrt(3), dot = (c[0]+c[1]+c[2])*k;
  const cx = [k*(c[2]-c[1]), k*(c[0]-c[2]), k*(c[1]-c[0])];
  return c.map((v,i) => v*cs + cx[i]*sn + k*dot*(1-cs)); }
function hslBands(c, bands){
  const [h, d] = hueSat(c); if(d < .01) return c; const sw = clamp(d*5, 0, 1);
  let sh = 0, sm = 0, la = 0, wsum = 0;
  for(const [cen, wid, dh, smul, dl] of bands){ let dd = Math.abs(h - cen); if(dd > 180) dd = 360 - dd; if(dd >= wid) continue;
    const w = .5*(1 + Math.cos(Math.PI*dd/wid))*sw; sh += dh*w; sm += (smul-1)*w; la += (dl||0)*w; wsum += w; }
  if(!wsum) return c;
  if(sh) c = rotHue(c, sh);
  const l = lumF(...c); c = c.map(v => l + (v-l)*(1+sm) + la); return c;
}
function gradeFn(p){
  return (r,g,b) => {
    let c = [r,g,b];
    if(p.ex){ const k = Math.pow(2,p.ex); c = c.map(v => v*k); }
    if(p.t || p.ti){ c[0] *= 1 + .14*(p.t||0); c[2] *= 1 - .14*(p.t||0); c[1] *= 1 + .08*(p.ti||0); }
    const L = p.lift || [0,0,0], Ga = p.gam || [1,1,1], Gn = p.gain || [1,1,1];
    c = c.map((v,i) => Math.pow(Math.max(0, v*Gn[i] + L[i]*(1-v)), 1/Ga[i]));
    if(p.con) c = c.map(v => scurve(v, p.con));
    let l = lumF(...c);
    if(p.to){   // teal shadows / orange highlights, skin protected
      const warm = clamp((c[0]-c[2])*3, 0, 1), k = p.to;
      c[0] += k*(-.07*(1-l) + .08*l*(.5+warm*.5)); c[1] += k*(.015*(1-l) + .01*l); c[2] += k*(.08*(1-l) - .09*l*(.5+warm*.5));
    }
    if(p.hsl) c = hslBands(c, p.hsl);
    if(p.greens){ const gr = clamp((c[1] - Math.max(c[0],c[2]))*4, 0, 1); c = c.map((v,i) => v + gr*p.greens[i]); }
    if(p.blues){ const bl = clamp((c[2] - Math.max(c[0],c[1]))*4, 0, 1); c = c.map((v,i) => v + bl*p.blues[i]); }
    l = lumF(...c);
    if(p.vib){ const s = Math.max(...c) - Math.min(...c), f = 1 + p.vib*(1 - clamp(s*1.6,0,1)); c = c.map(v => l + (v-l)*f); }
    if(p.sat != null) c = c.map(v => l + (v-l)*(1+p.sat));
    if(p.sh){ const w = Math.pow(1-clamp(l,0,1),2)*(p.shA||.2); c = c.map((v,i) => v + (p.sh[i]-.5)*w); }
    if(p.hi){ const w = Math.pow(clamp(l,0,1),2)*(p.hiA||.2); c = c.map((v,i) => v + (p.hi[i]-.5)*w); }
    if(p.mono){ const m = scurve(lumF(...c), p.monoCon||0), tn = p.tone || [1,1,1]; c = tn.map(t => m + (t-1)*m*(1-m)*1.6); }
    if(p.fade){ c = c.map(v => v*(1-p.fade*.55) + p.fade*.13); }
    c = c.map(v => v > .82 ? .82 + (v-.82)/(1 + (v-.82)/.18) : v);   // soft highlight roll-off (film shoulder)
    return c.map(v => clamp(v,0,1));
  };
}
const PF = (id,name,cat,p) => ({id,name,cat,p});
const PRO_FILTERS = [
  // Cinematic
  PF('teal','Teal & Orange','Cinematic',{to:1.2,con:.25,sat:.08}),
  PF('blockbuster','Blockbuster','Cinematic',{to:1.6,con:.4,sat:-.05,lift:[0,.01,.025],gain:[1.03,1,.97]}),
  PF('cinewarm','Cine Warm','Cinematic',{t:.45,con:.22,sat:-.05,lift:[.02,.01,0],fade:.06}),
  PF('cinecool','Cine Cool','Cinematic',{t:-.5,con:.2,sat:-.12,sh:[.3,.5,.75],shA:.25}),
  PF('bleach','Bleach Bypass','Cinematic',{con:.55,sat:-.55,ex:.05}),
  PF('desert','Desert Heat','Cinematic',{t:.8,ti:-.1,con:.3,sat:-.1,hi:[.85,.6,.3],hiA:.25,lift:[.02,.01,0]}),
  PF('arrakis','Golden Dune','Cinematic',{t:.6,con:.35,sat:-.25,mono:0,gain:[1.06,.98,.85],lift:[.03,.02,0]}),
  PF('matrixg','Code Green','Cinematic',{ti:-.6,con:.3,sat:-.3,gain:[.92,1.05,.9],sh:[.3,.6,.4],shA:.3}),
  PF('noirblue','Night Blue','Cinematic',{t:-.9,ex:-.25,con:.35,sat:-.3,lift:[0,.02,.06]}),
  PF('moonlight','Moonlight','Cinematic',{t:-.7,ex:-.35,sat:-.45,con:.15,sh:[.25,.4,.8],shA:.3}),
  PF('epic','Epic Contrast','Cinematic',{con:.6,sat:.1,to:.6,ex:-.05}),
  PF('thriller','Thriller','Cinematic',{ti:-.35,con:.45,sat:-.35,sh:[.35,.55,.45],shA:.35,ex:-.15}),
  // Portrait
  PF('natural','Natural Skin','Portrait',{t:.12,con:.08,vib:.25,ex:.05}),
  PF('softglow','Soft Glow','Portrait',{ex:.12,con:-.15,fade:.08,t:.15,sat:-.05}),
  PF('peach','Peach','Portrait',{t:.3,ti:.15,ex:.08,hi:[.95,.75,.65],hiA:.2,sat:.05}),
  PF('rosy','Rosy','Portrait',{ti:.35,t:.1,ex:.06,sat:.08}),
  PF('goldenhour','Golden Hour','Portrait',{t:.7,ex:.06,hi:[.95,.7,.35],hiA:.3,vib:.2,con:.1}),
  PF('porcelain','Porcelain','Portrait',{ex:.18,sat:-.25,t:-.1,con:.05,fade:.05}),
  PF('tan','Warm Tan','Portrait',{t:.4,con:.18,sat:.12,gain:[1.04,1,.95]}),
  PF('clean','Clean Bright','Portrait',{ex:.2,con:.1,vib:.2}),
  // Landscape
  PF('nature','Vivid Nature','Landscape',{vib:.55,con:.2,greens:[-.02,.05,0],blues:[0,0,.05]}),
  PF('lush','Lush Green','Landscape',{greens:[-.04,.08,-.02],vib:.3,con:.15,t:.05}),
  PF('deepsky','Deep Sky','Landscape',{blues:[-.03,0,.1],con:.2,vib:.3,ex:-.05}),
  PF('autumn','Autumn','Landscape',{t:.55,greens:[.08,-.02,-.04],sat:.15,con:.15}),
  PF('sunset','Sunset','Landscape',{t:.65,ti:.2,hi:[1,.55,.3],hiA:.35,sat:.2,con:.15}),
  PF('misty','Misty','Landscape',{fade:.25,con:-.2,sat:-.25,t:-.15,ex:.1}),
  PF('tropical','Tropical','Landscape',{vib:.6,ti:-.1,blues:[-.04,.04,.06],con:.12,ex:.05}),
  // Film
  PF('film400','Film 400','Film',{con:.18,fade:.08,t:.12,sh:[.42,.55,.55],shA:.2,hi:[.6,.55,.45],hiA:.15,sat:-.05}),
  PF('film800','Film 800 Warm','Film',{t:.35,fade:.12,con:.12,sat:.05,lift:[.03,.015,0]}),
  PF('slide','Slide Film','Film',{con:.45,sat:.3,lift:[0,0,.01]}),
  PF('fadedfilm','Faded Film','Film',{fade:.32,con:-.05,sat:-.2,t:.1}),
  PF('cross','Cross Process','Film',{gam:[.92,1.08,1.25],gain:[1.08,1.05,.82],con:.3,sat:.15}),
  PF('expired','Expired Film','Film',{ti:.25,t:.25,fade:.2,sat:-.15,sh:[.55,.35,.6],shA:.3}),
  // Retro
  PF('seventies','70s','Retro',{t:.55,fade:.22,sat:-.1,hi:[.9,.75,.45],hiA:.25,con:.05}),
  PF('neon80','80s Neon','Retro',{ti:.45,t:-.2,sat:.35,con:.25,sh:[.55,.25,.75],shA:.35}),
  PF('instant','Instant Photo','Retro',{fade:.2,t:.2,ti:-.1,con:.1,sat:-.15,hi:[.75,.8,.6],hiA:.25}),
  PF('sepia','Sepia','Retro',{mono:1,tone:[1.12,1,.78],fade:.08}),
  PF('vintagefade','Vintage','Retro',{fade:.3,t:.3,sat:-.35,con:.1}),
  // B&W
  PF('bwclassic','Classic B&W','B&W',{mono:1,monoCon:.2}),
  PF('bwhigh','High Contrast','B&W',{mono:1,monoCon:.7}),
  PF('bwsoft','Soft B&W','B&W',{mono:1,monoCon:-.2,fade:.12}),
  PF('silver','Silver','B&W',{mono:1,monoCon:.35,tone:[.97,1,1.05],ex:.08}),
  PF('cyanmono','Cyanotype','B&W',{mono:1,tone:[.75,.95,1.2],monoCon:.15}),
  // Mood
  PF('moody','Moody','Mood',{ex:-.2,sat:-.35,con:.2,t:-.15,fade:.08}),
  PF('darkforest','Dark Forest','Mood',{ex:-.25,greens:[-.04,.02,.02],sat:-.25,con:.3,sh:[.35,.55,.5],shA:.3}),
  PF('nightcity','Night City','Mood',{to:1,ti:.2,con:.35,sat:.15,ex:-.1}),
  PF('cyber','Cyberpunk','Mood',{ti:.55,t:-.35,con:.35,sat:.35,sh:[.35,.3,.85],shA:.35,hi:[.95,.45,.85],hiA:.25}),
  PF('horror','Horror','Mood',{ti:-.3,sat:-.6,con:.5,ex:-.2,sh:[.3,.5,.4],shA:.3}),
  PF('dream','Dreamy','Mood',{ex:.15,con:-.2,fade:.18,ti:.25,sat:.1}),
];
// ---- v18: premium grades (selective colour + HD detail), named and tuned in-house ----
const PF2 = (id,name,cat,p,adj) => ({id,name,cat,p,adj});
PRO_FILTERS.push(
  // Trending
  PF2('emerald','Emerald Lake','Trending',{con:.22,vib:.25,hsl:[[110,55,22,1.25,-.04],[200,50,8,1.3,-.05],[28,25,0,1.05,.01]],sh:[.35,.5,.55],shA:.15},{sharpen:15}),
  PF2('forestamber','Forest Amber','Trending',{con:.28,t:.2,hsl:[[100,60,18,.85,-.05],[30,30,-4,1.22,.02],[210,50,-6,.9,0]],hi:[.8,.62,.4],hiA:.18},{vignette:15}),
  PF2('amberteal','Amber Teal','Trending',{to:1.3,con:.3,hsl:[[30,30,0,1.18,.02],[190,60,12,1.25,-.04]]},{sharpen:12}),
  PF2('clearsky','Clear Sky','Trending',{ex:.05,con:.15,vib:.35,hsl:[[215,55,-4,1.35,-.06],[180,30,10,1.2,0]]},{sharpen:25,highlights:-12}),
  PF2('autumnglow','Autumn Glow','Trending',{t:.35,con:.2,hsl:[[90,55,-38,1.3,0],[40,30,-10,1.25,.02]],hi:[.85,.6,.35],hiA:.2},{vignette:12}),
  PF2('sunsetgold','Sunset Gold','Trending',{t:.65,con:.26,sat:.08,hsl:[[30,35,-3,1.3,.02],[220,50,15,.9,-.04]],hi:[.9,.62,.3],hiA:.3,lift:[.02,.01,0]},{vignette:18}),
  PF2('sunnymeadow','Sunny Meadow','Trending',{ex:.08,vib:.3,hsl:[[110,55,-12,1.3,.04],[205,45,0,1.2,-.02]],hi:[.8,.75,.5],hiA:.12},{sharpen:15,shadows:12}),
  PF2('freshlime','Fresh Lime','Trending',{ex:.06,con:.15,hsl:[[100,50,-10,1.4,.03],[190,45,-8,1.25,0]],ti:-.15},{sharpen:15}),
  PF2('neoncity','Neon City','Trending',{ex:-.08,con:.35,t:-.25,hsl:[[220,50,8,1.35,-.03],[320,45,0,1.35,0],[0,25,0,1.25,0]],sh:[.3,.4,.7],shA:.25},{vignette:22}),
  PF2('peachsoft','Peach Soft','Trending',{t:.18,ti:.15,sat:-.05,fade:.05,lift:[.03,.015,.01],hsl:[[25,30,-2,1.05,.04]]}),
  // HD — detail + tone (these also sharpen the picture on the GPU)
  PF2('ultra8k','Ultra 8K','HD',{con:.2,vib:.35,hsl:[[215,50,0,1.15,-.03]]},{sharpen:55,shadows:10,highlights:-10}),
  PF2('hdboost','HD Boost','HD',{con:.15,vib:.3,ex:.03},{sharpen:40,shadows:18,highlights:-15}),
  PF2('hdcam','HD Camera','HD',{con:.12,vib:.25,t:.05},{sharpen:35,shadows:22,highlights:-20}),
  PF2('hdsun','HD Sunlight','HD',{t:.35,ex:.08,vib:.3,hi:[.85,.7,.45],hiA:.18},{sharpen:30,highlights:-10}),
  PF2('hddark','HD Dark','HD',{ex:-.12,con:.38,sat:.05,sh:[.35,.45,.55],shA:.15},{sharpen:38,vignette:25}),
  PF2('hdglow','HD Glow','HD',{lift:[.025,.02,.02],fade:.03,vib:.2,hi:[.8,.7,.6],hiA:.15},{sharpen:18,highlights:10}),
  PF2('cinedark','Cinematic Dark','HD',{to:.8,ex:-.15,con:.42,sat:-.15},{vignette:35,sharpen:22}),
  PF2('crisp','Crisp Clear','HD',{con:.18,vib:.25},{sharpen:60}),
  // Portrait (skin-safe)
  PF2('focus','Soft Focus','Portrait',{fade:.04,sat:-.05,hsl:[[25,30,-2,.95,.04]],lift:[.02,.015,.015]},{vignette:22}),
  PF2('porcelain','Porcelain','Portrait',{ex:.06,sat:-.12,t:-.1,hsl:[[25,35,0,.85,.06]]},{highlights:-10}),
  PF2('radiant','Radiant Skin','Portrait',{t:.2,hsl:[[25,30,-2,1.05,.05]],hi:[.85,.7,.55],hiA:.15},{highlights:10,sharpen:10}),
  PF2('dewy','Dewy Glow','Portrait',{lift:[.03,.03,.035],fade:.06,vib:.15,ti:.1}),
  PF2('bronze','Bronze Tan','Portrait',{t:.5,con:.2,hsl:[[25,30,-3,1.2,-.03]]},{vignette:15}),
  PF2('seoulbright','Seoul Bright','Portrait',{ex:.1,sat:-.08,ti:.12,fade:.04,hsl:[[210,50,-10,1.1,0],[25,30,0,.95,.04]]}),
  // Landscape
  PF2('alpine','Alpine Fresh','Landscape',{ex:.03,con:.18,hsl:[[215,55,0,1.3,-.05],[110,50,10,1.15,0]]},{sharpen:20}),
  PF2('tropical','Tropical','Landscape',{t:.15,hsl:[[190,55,-8,1.35,0],[110,50,-5,1.2,.02]],hi:[.8,.7,.5],hiA:.12},{sharpen:12}),
  PF2('oceandeep','Ocean Deep','Landscape',{t:-.2,con:.22,hsl:[[210,60,0,1.25,-.08],[180,40,10,1.15,-.03]]},{vignette:15}),
  PF2('redbridge','Bridge Red','Landscape',{con:.3,hsl:[[5,30,0,1.3,0],[215,55,0,1.1,-.05]],t:-.1},{sharpen:15}),
  // Food
  PF2('tasty','Tasty Warm','Food',{t:.3,con:.15,hsl:[[10,35,0,1.3,0],[35,25,0,1.2,.02]]},{sharpen:25}),
  PF2('freshsalad','Fresh Salad','Food',{ex:.05,hsl:[[100,55,-5,1.35,.03],[0,25,0,1.2,0]]},{sharpen:22}),
  PF2('cafemocha','Cafe Mocha','Food',{t:.4,sat:-.1,fade:.08,con:.2,hsl:[[30,35,0,1.1,-.02]]},{vignette:20}),
  PF2('sweettreat','Sweet Treat','Food',{ex:.06,ti:.12,vib:.2,hsl:[[330,40,0,1.25,.02],[25,25,0,1.1,.02]]}),
  // Night
  PF2('nightpop','Night Pop','Night',{ex:.12,vib:.3,con:.15},{shadows:35,sharpen:20}),
  PF2('purplenight','Purple Night','Night',{ti:.4,t:-.3,con:.25,hsl:[[260,50,0,1.3,0],[320,45,-10,1.3,0]]},{vignette:25}),
  PF2('sodium','Street Light','Night',{t:.3,con:.25,hsl:[[35,30,0,1.25,.02],[210,50,-10,.8,-.03]]},{vignette:20}),
  PF2('cyberneon','Cyber Neon','Night',{con:.35,hsl:[[200,50,0,1.4,0],[320,45,0,1.4,0],[30,30,150,.6,-.04]]},{vignette:22,sharpen:15})
);
PRO_FILTERS.forEach(f => { if(!f.fn) f.fn = gradeFn(f.p); });
const PF_MAP = {}; PRO_FILTERS.forEach(f => { PF_MAP[f.id] = f; f.fn = gradeFn(f.p); });
const PF_CATS = ['Featured','Trending','HD','Portrait','Landscape','Cinematic','Food','Night','Film','Retro','B&W','Mood','Basic'];
const PF_FEATURED = ['emerald','amberteal','clearsky','sunsetgold','hdboost','cinedark','radiant','autumnglow','neoncity','teal','blockbuster','goldenhour','film400','moody','natural','nature','bwclassic','cyber','fadedfilm','cinewarm','bleach'];
const PRO_LUTS = {};
function proLut(id){
  if(PRO_LUTS[id]) return PRO_LUTS[id];
  const f = PF_MAP[id]; if(!f) return null;
  const n = 25, data = new Uint8Array(n*n*n*4);
  for(let b=0;b<n;b++) for(let g=0;g<n;g++) for(let r=0;r<n;r++){
    const o = f.fn(r/(n-1), g/(n-1), b/(n-1)), i = (g*n*n + b*n + r)*4;
    data[i] = o[0]*255; data[i+1] = o[1]*255; data[i+2] = o[2]*255; data[i+3] = 255;
  }
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, t);
  for(const [k,v] of [[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE],[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR]]) gl.texParameteri(gl.TEXTURE_2D,k,v);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,n*n,n,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
  gl.activeTexture(gl.TEXTURE0);
  return PRO_LUTS[id] = {tex:t, n};
}
function filterName(k){ if(!k || k === 'none') return 'None'; if(k.startsWith('pf:')) return (PF_MAP[k.slice(3)]||{}).name || k; return FILTER_NAMES[k] || k; }
// real previews: the grade is applied (on the CPU) to a small frame of the selected clip
function sampleFrame(it){
  const c = document.createElement('canvas'); c.width = 96; c.height = 64; const x = c.getContext('2d', {willReadFrequently:true});
  const sc = SCENES.portrait; if(sc.complete && sc.naturalWidth){ const k = Math.max(96/sc.naturalWidth, 64/sc.naturalHeight); x.drawImage(sc, (96-sc.naturalWidth*k)/2, (64-sc.naturalHeight*k)/2, sc.naturalWidth*k, sc.naturalHeight*k); return {c, key:'scene'+SCENES.ver}; }
  let el = null;
  if(it){ if(it.type === 'video') el = ovVids[it.id]; else if(!it.type && !isImg(it)) el = vids[it.id]; if(!el || (el.tagName === 'VIDEO' && el.readyState < 2)) el = images[it.mediaId] || null; }
  const m = it && media(it.mediaId);
  if(el){ const w = el.videoWidth || el.naturalWidth, h = el.videoHeight || el.naturalHeight, k = Math.max(96/w, 64/h); x.drawImage(el, (96-w*k)/2, (64-h*k)/2, w*k, h*k); return {c, key:(m?m.id:'')+':'+(el.currentTime||0).toFixed(1)}; }
  // built-in sample: sky, sun, hills and a face so every grade is easy to judge
  const g = x.createLinearGradient(0,0,0,64); g.addColorStop(0,'#5d9be0'); g.addColorStop(.55,'#f2c79a'); g.addColorStop(.56,'#4f8a3c'); g.addColorStop(1,'#2d4a24'); x.fillStyle = g; x.fillRect(0,0,96,64);
  x.fillStyle = '#ffe9a8'; x.beginPath(); x.arc(22,20,8,0,7); x.fill();
  x.fillStyle = '#d9a07a'; x.beginPath(); x.ellipse(66,34,13,16,0,0,7); x.fill(); x.fillStyle = '#3a2618'; x.beginPath(); x.ellipse(66,22,14,8,0,Math.PI,0); x.fill();
  x.fillStyle = '#b8323a'; x.fillRect(52,50,28,14);
  return {c, key:'sample'};
}
// each grade is previewed on a photo that suits it (people for portrait looks, landscapes for nature looks…)
const PF_POOL = {Portrait:['r1027','r64','r91','r1005','r338','cat'], Landscape:['r1015','r1018','r1039','temple','flower','r1043','r1050'], Food:['coffee','r1080'],
  Night:['rocket','space','r1067'], HD:['temple','r1015','cat','flower','r1067','rocket'], Trending:['r1018','temple','flower','r1027','r1050','cat','r1015','coffee','r1067','r64'],
  'B&W':['cat','temple','r1005'], _:['r1027','temple','flower','cat','r1015','coffee','r64','r1018']};
function pfPreviewImg(f){
  const pool = PF_POOL[f.cat] || PF_POOL._, idx = PRO_FILTERS.filter(x => x.cat === f.cat).indexOf(f);
  const ok = pool.filter(k => PHOTOS[k]);
  if(ok.length) return [ok[idx % ok.length], PHOTOS[ok[idx % ok.length]]];
  const l = SCENES.list; return ['s' + (idx % l.length), l[idx % l.length]];
}
const pfThumbCache = {};
const PFW = 132, PFH = 96;
function pfThumbs(list){
  const urls = {}, c = document.createElement('canvas'); c.width = PFW; c.height = PFH; const x = c.getContext('2d', {willReadFrequently:true}), src = {};
  for(const f of list){
    const [key, img] = pfPreviewImg(f), ck = f.id + '|' + key + '|' + photoVer;
    if(pfThumbCache[ck]){ urls[f.id] = pfThumbCache[ck]; continue; }
    if(!img || !img.complete || !img.naturalWidth){ urls[f.id] = ''; continue; }
    if(!src[key]){ const k = Math.max(PFW/img.naturalWidth, PFH/img.naturalHeight); x.drawImage(img, (PFW-img.naturalWidth*k)/2, (PFH-img.naturalHeight*k)/2, img.naturalWidth*k, img.naturalHeight*k); src[key] = x.getImageData(0,0,PFW,PFH); }
    const d = new ImageData(PFW, PFH), s = src[key].data, o = d.data;
    for(let i=0;i<s.length;i+=4){ const r = f.fn(s[i]/255, s[i+1]/255, s[i+2]/255); o[i] = r[0]*255; o[i+1] = r[1]*255; o[i+2] = r[2]*255; o[i+3] = 255; }
    x.putImageData(d,0,0);
    const vg = f.adj && f.adj.vignette; if(vg){ const g = x.createRadialGradient(PFW/2,PFH/2,PFH*.35,PFW/2,PFH/2,PFW*.7); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,`rgba(0,0,0,${vg/100*.9})`); x.fillStyle = g; x.fillRect(0,0,PFW,PFH); }
    urls[f.id] = pfThumbCache[ck] = c.toDataURL('image/jpeg', .85);
  }
  return urls;
}
/* ---------------- REVERSE AUDIO (offline, new media) ---------------- */
async function reverseAudioItem(it){
  const m = media(it.mediaId), blob = m && mediaBlobs[m.id]; if(!blob) throw new Error('Media file not found');
  const {from, len} = srcRangeOf(it);
  const ab = await new OfflineAudioContext(1,1,44100).decodeAudioData(await blob.arrayBuffer());
  const s0 = Math.floor(from*ab.sampleRate), n = Math.max(1, Math.min(ab.length - s0, Math.ceil(len*ab.sampleRate)));
  const chans = []; for(let c=0;c<Math.min(2,ab.numberOfChannels);c++) chans.push(ab.getChannelData(c).slice(s0, s0+n).reverse());
  const f = new File([wavMulti(chans, ab.sampleRate)], `${m.name.replace(/\.[^.]+$/,'')} (reversed).wav`, {type:'audio/wav'});
  return addAudioMedia(f, n/ab.sampleRate);
}

/* =====================================================================
   ANIMATION LIBRARY (v8) — in / out / loop, grouped by category
   fn(R, k, e, W, H): k = 0→1 progress (1 = fully visible), e = eased k
   ===================================================================== */
const elasticO = k => k <= 0 ? 0 : k >= 1 ? 1 : Math.pow(2,-10*k)*Math.sin((k*10-.75)*2.0944) + 1;
const aBlur = (R,x) => { R.blur = (R.blur||0) + x*18; if(!R.fx) R.fx = ['blur', x]; };
const aFx = (R,t,x) => { R.fx = [t, clamp(x,0,1)]; };
const sgnMax = v => (v < 0 ? -1 : 1)*Math.max(.001, Math.abs(v));
const ANIM_LIB = [
  // Basic
  ['fadeUp','Fade Up','Basic',(R,k,e,W,H)=>{ R.a*=e; R.dy+=(1-e)*H*.08; }],
  ['fadeDown','Fade Down','Basic',(R,k,e,W,H)=>{ R.a*=e; R.dy-=(1-e)*H*.08; }],
  ['fadeLeft','Fade Left','Basic',(R,k,e,W)=>{ R.a*=e; R.dx+=(1-e)*W*.12; }],
  ['fadeRight','Fade Right','Basic',(R,k,e,W)=>{ R.a*=e; R.dx-=(1-e)*W*.12; }],
  ['zoomFade','Zoom Fade','Basic',(R,k,e)=>{ R.a*=e; R.s*=1+.3*(1-e); }],
  ['popUp','Pop Up','Basic',(R,k)=>{ R.s*=Math.max(.001,backOut(k)); R.a*=Math.min(1,k*3); }],
  ['elastic','Elastic','Basic',(R,k)=>{ R.s*=Math.max(.001,elasticO(k)); }],
  ['squeeze','Squeeze','Basic',(R,k,e)=>{ R.sx*=Math.max(.001,backOut(k)); R.sy*=1+.25*(1-e); }],
  ['stretch','Stretch','Basic',(R,k,e)=>{ R.sy*=Math.max(.001,backOut(k)); R.sx*=1+.2*(1-e); }],
  ['unfold','Unfold','Basic',(R,k,e)=>{ R.sy*=Math.max(.001,e); }],
  ['bounceUp','Bounce Up','Basic',(R,k,e,W,H)=>{ R.dy+=(1-bounceOut(k))*H*.35; R.a*=Math.min(1,k*5); }],
  ['swingDrop','Swing Drop','Basic',(R,k,e,W,H)=>{ R.dy-=(1-e)*H*.3; R.r+=Math.sin(k*Math.PI*3)*(1-k)*.4; }],
  // Light
  ['flashFade','Flash Fade','Light',(R,k,e)=>{ aFx(R,'bright',1-e); R.a*=Math.min(1,k*2); }],
  ['glowIn','Glow In','Light',(R,k,e)=>{ aFx(R,'glow',1-e*.6); R.a*=e; }],
  ['leakIn','Light Leak','Light',(R,k,e)=>{ aFx(R,'lightleak',1-e); R.a*=Math.min(1,k*2); }],
  ['flashZoom','Flash Zoom','Light',(R,k,e)=>{ aFx(R,'bright',1-e); R.s*=1+.25*(1-e); }],
  ['strobeIn','Strobe','Light',(R,k)=>{ if(k < .75 && Math.floor(k*16)%2) R.a*=.1; }],
  ['exposeIn','Over-expose','Light',(R,k,e)=>{ aFx(R,'bright',(1-e)*.9); aBlur(R,(1-e)*.4); }],
  ['beamIn','Beam Fade','Light',(R,k,e)=>{ aFx(R,'bright',(1-e)*.8); R.sy*=Math.max(.02,e); }],
  // Glitch
  ['glitchSlide','Glitch Slide','Glitch',(R,k,e,W)=>{ aFx(R,'rgbsplit',1-k); R.dx+=(1-e)*W*.3 + Math.sin(k*80)*W*.02*(1-k); }],
  ['digital','Digital Glitch','Glitch',(R,k)=>{ aFx(R,'glitch',(1-k)*.9+.1*(k<.9)); R.a*=k>.08?1:k/.08; }],
  ['vhsIn','VHS On','Glitch',(R,k,e)=>{ aFx(R,'vhs',1-k); R.a*=e; }],
  ['rgbShake','RGB Shake','Glitch',(R,k,e,W,H)=>{ aFx(R,'rgbsplit',1-k); R.dx+=Math.sin(k*90)*W*.03*(1-k); R.dy+=Math.cos(k*70)*H*.01*(1-k); }],
  ['pixelZoom','Pixel Zoom','Glitch',(R,k,e)=>{ aFx(R,'pixelate',1-e); R.s*=1+.2*(1-e); }],
  ['chromaIn','Chromatic','Glitch',(R,k,e)=>{ aFx(R,'chroma',1-e); R.s*=1+.1*(1-e); }],
  ['tvOn','TV Turn On','Glitch',(R,k)=>{ if(k < .4){ R.sy*=.01+k/.4*.04; R.sx*=Math.max(.001,k/.4); } else R.sy*=.05+(k-.4)/.6*.95; aFx(R,'bright',(1-k)*.8); }],
  ['jitter','Jitter','Glitch',(R,k,e,W)=>{ R.dx+=(hsh(Math.floor(k*20))-.5)*W*.06*(1-k); aFx(R,'rgbsplit',.6*(1-k)); }],
  ['scanIn','Scanline','Glitch',(R,k,e)=>{ aFx(R,'crt',1-e*.7); R.mT=13; R.mP=e; }],
  // Mask (shapes reveal the clip)
  ['circleReveal','Circle Reveal','Mask',(R,k,e)=>{ R.mT=1; R.mP=e; }],
  ['irisIn','Iris In','Mask',(R,k,e)=>{ R.mT=2; R.mP=e; }],
  ['diamondIn','Diamond','Mask',(R,k,e)=>{ R.mT=3; R.mP=e; }],
  ['clockIn','Clock Wipe','Mask',(R,k,e)=>{ R.mT=4; R.mP=e; }],
  ['blindsIn','Blinds','Mask',(R,k,e)=>{ R.mT=5; R.mP=e; }],
  ['blindsVIn','Blinds V','Mask',(R,k,e)=>{ R.mT=6; R.mP=e; }],
  ['dissolveIn','Pixel Dissolve','Mask',(R,k)=>{ R.mT=7; R.mP=k; }],
  ['doorsIn','Doors Open','Mask',(R,k,e)=>{ R.mT=8; R.mP=e; }],
  ['barnIn','Barn Door','Mask',(R,k,e)=>{ R.mT=9; R.mP=e; }],
  ['heartIn','Heart','Mask',(R,k,e)=>{ R.mT=10; R.mP=e; }],
  ['starIn','Star','Mask',(R,k,e)=>{ R.mT=11; R.mP=e; }],
  ['lumaIn','Luma Fade','Mask',(R,k)=>{ R.mT=12; R.mP=k; }],
  // 3D
  ['flip3dX','3D Flip X','3D',(R,k,e)=>{ R.sx*=Math.max(.001,Math.sin(e*Math.PI/2)); R.s*=.9+.1*e; }],
  ['flip3dY','3D Flip Y','3D',(R,k,e)=>{ R.sy*=Math.max(.001,Math.sin(e*Math.PI/2)); R.s*=.9+.1*e; }],
  ['cubeIn','Cube','3D',(R,k,e,W)=>{ R.sx*=Math.max(.001,e); R.dx+=(1-e)*W*.5; }],
  ['tilt3d','Tilt Back','3D',(R,k,e,W,H)=>{ R.sy*=Math.max(.001,.3+.7*e); R.dy+=(1-e)*H*.15; R.a*=e; }],
  ['spinFlip','Spin Flip','3D',(R,k,e)=>{ R.sx*=sgnMax(Math.cos((1-e)*Math.PI*2)); }],
  ['rollIn','Roll In','3D',(R,k,e,W)=>{ R.r-=(1-e)*Math.PI*2; R.dx-=(1-e)*W*.6; }],
  ['doorSwing','Door Swing','3D',(R,k,e,W)=>{ R.sx*=Math.max(.001,e); R.dx-=(1-e)*W*.25; }],
  ['cardIn','Card Turn','3D',(R,k,e)=>{ R.sx*=Math.max(.001,e); R.r+=(1-e)*.3; R.s*=.85+.15*e; }],
  // Vibration
  ['shakeHard','Hard Shake','Vibration',(R,k,e,W)=>{ R.dx+=Math.sin(k*60)*(1-k)*W*.06; }],
  ['quake','Earthquake','Vibration',(R,k,e,W,H)=>{ const f=Math.floor(k*30); R.dx+=(hsh(f)-.5)*W*.08*(1-k); R.dy+=(hsh(f+7)-.5)*H*.05*(1-k); }],
  ['wobbleIn','Wobble','Vibration',(R,k)=>{ R.r+=Math.sin(k*25)*(1-k)*.25; }],
  ['jelloIn','Jello','Vibration',(R,k)=>{ R.sx*=1+Math.sin(k*20)*(1-k)*.3; R.sy*=1-Math.sin(k*20)*(1-k)*.3; }],
  ['pulseIn','Pulse','Vibration',(R,k)=>{ R.s*=1+Math.sin(k*Math.PI*4)*(1-k)*.15; R.a*=Math.min(1,k*3); }],
  ['heartbeatIn','Heartbeat','Vibration',(R,k)=>{ R.s*=k<.6 ? Math.max(.001,backOut(k/.6)) : 1+.1*Math.sin((k-.6)/.4*Math.PI*2); }],
  ['rubber','Rubber Band','Vibration',(R,k)=>{ R.sx*=1+.35*Math.sin(k*Math.PI*3)*(1-k); R.sy*=1-.25*Math.sin(k*Math.PI*3)*(1-k); }],
  // Zoom
  ['zoomBlurIn','Zoom Blur','Zoom',(R,k,e)=>{ R.s*=1+(1-e); aBlur(R,1-e); }],
  ['punchIn','Punch In','Zoom',(R,k)=>{ R.s*=k<.6 ? .6+.55*(k/.6) : 1.15-.15*((k-.6)/.4); }],
  ['crashZoom','Crash Zoom','Zoom',(R,k)=>{ R.s*=1+2*Math.pow(1-k,4); R.a*=Math.min(1,k*4); }],
  ['zoomRotate','Zoom Rotate','Zoom',(R,k,e)=>{ R.s*=.4+.6*e; R.r+=(1-e)*.8; R.a*=e; }],
  ['dollyIn','Dolly In','Zoom',(R,k,e)=>{ R.s*=1+.25*(1-e); }],
  ['zoomBounce','Zoom Bounce','Zoom',(R,k)=>{ R.s*=Math.max(.001,bounceOut(k)); }],
  // Blur
  ['focusIn','Focus In','Blur',(R,k,e)=>{ aBlur(R,1-e); R.s*=1+.08*(1-e); }],
  ['motionL','Motion Left','Blur',(R,k,e,W)=>{ R.dx+=(1-e)*W*.4; aBlur(R,1-e); }],
  ['motionR','Motion Right','Blur',(R,k,e,W)=>{ R.dx-=(1-e)*W*.4; aBlur(R,1-e); }],
  ['motionU','Motion Up','Blur',(R,k,e,W,H)=>{ R.dy+=(1-e)*H*.4; aBlur(R,1-e); }],
  ['dreamIn','Dreamy','Blur',(R,k,e)=>{ aFx(R,'glow',1-e); R.blur=(R.blur||0)+(1-e)*8; R.a*=e; }],
  // Rotate
  ['rotateHalf','Rotate 180','Rotate',(R,k,e)=>{ R.r+=(1-e)*Math.PI; R.s*=.5+.5*e; R.a*=e; }],
  ['spiral','Spiral','Rotate',(R,k,e)=>{ R.r+=(1-e)*Math.PI*4; R.s*=Math.max(.001,e); }],
  ['twirlIn','Twirl','Rotate',(R,k,e)=>{ aFx(R,'swirl',1-e); R.a*=e; }],
  ['pendulum','Pendulum','Rotate',(R,k)=>{ R.r+=Math.sin(k*Math.PI*4)*(1-k)*.5; }],
  ['rotateCCW','Rotate Left','Rotate',(R,k,e)=>{ R.r+=(1-e)*Math.PI/2; R.s*=.7+.3*e; R.a*=e; }],
  // Distort
  ['waveIn','Wave','Distort',(R,k,e)=>{ aFx(R,'wave',1-e); R.a*=e; }],
  ['fisheyeIn','Fisheye','Distort',(R,k,e)=>{ aFx(R,'fisheye',1-e); R.s*=.8+.2*e; }],
  ['rippleIn','Ripple','Distort',(R,k)=>{ aFx(R,'wave',1-k); R.s*=1+.05*Math.sin(k*30)*(1-k); }],
];
const ANIM_MAP = {}; ANIM_LIB.forEach(a => ANIM_MAP[a[0]] = a);
function animLibApply(name, k, R, W, H){ const a = ANIM_MAP[name]; if(!a) return; k = clamp(k,0,1); a[3](R, k, 1-Math.pow(1-k,3), W, H); }
const LOOP_LIB = [
  ['breathe','Breathe',(R,t)=>{ R.s*=1+.035*Math.sin(t*2.2); }],
  ['float3d','Float 3D',(R,t,d,W,H)=>{ R.dy+=Math.sin(t*1.8)*H*.015; R.sx*=1+.04*Math.sin(t*1.3); }],
  ['glowPulse','Glow Pulse',(R,t)=>{ aFx(R,'glow',.35+.35*Math.sin(t*4)); }],
  ['rgbLoop','RGB Drift',(R,t)=>{ aFx(R,'rgbsplit',.3+.25*Math.sin(t*5)); }],
  ['strobeLoop','Strobe',(R,t)=>{ aFx(R,'bright',(t*4%1)<.15 ? .8 : 0); }],
  ['orbit','Orbit',(R,t,d,W,H)=>{ R.dx+=Math.cos(t*1.5)*W*.02; R.dy+=Math.sin(t*1.5)*H*.012; }],
  ['wiggle','Wiggle',(R,t,d,W)=>{ R.r+=(hsh(Math.floor(t*6))-.5)*.08; R.dx+=(hsh(Math.floor(t*6)+3)-.5)*W*.02; }],
  ['vhsLoop','VHS',(R)=>{ aFx(R,'vhs',.7); }],
  ['crtLoop','Old TV',(R)=>{ aFx(R,'crt',.8); }],
  ['waveLoop','Wavy',(R)=>{ aFx(R,'wave',.45); }],
  ['leakLoop','Light Leak',(R)=>{ aFx(R,'lightleak',.75); }],
  ['tilt3dLoop','3D Tilt',(R,t)=>{ R.sx*=.92+.08*Math.cos(t*1.6); R.r+=.03*Math.sin(t*1.6); }],
];
const LOOP_MAP = {}; LOOP_LIB.forEach(a => LOOP_MAP[a[0]] = a);
function loopLibApply(name, t, dur, R, W, H){ const a = LOOP_MAP[name]; if(a) a[2](R, t, dur, W, H); }
// categories for the old built-ins
const ANIM_OLD_CAT = {fade:'Basic',zoomIn:'Zoom',zoomOut:'Zoom',slideL:'Basic',slideR:'Basic',slideU:'Basic',slideD:'Basic',spin:'Rotate',shake:'Vibration',rotateIn:'Rotate',flipX:'3D',flipY:'3D',dropIn:'Basic',riseUp:'Basic',blurIn:'Blur',glitchIn:'Glitch',swingIn:'Rotate',shrinkIn:'Zoom',growIn:'Zoom',wipeIn:'Mask',circleIn:'Mask',flashIn:'Light',pixelIn:'Glitch',tiltIn:'3D',
  pop:'Basic',zoom:'Zoom',slideUp:'Basic',slideDown:'Basic',typewriter:'Text',bounce:'Basic',blur:'Blur',letterPop:'Text',letterFade:'Text',letterBounce:'Text',wordPop:'Text'};
const ANIM_CATS = ['Trending','Basic','Text','Light','Glitch','Mask','3D','Vibration','Zoom','Blur','Rotate','Distort'];
const ANIM_TREND = ['popUp','zoomBlurIn','glitchSlide','flashZoom','punchIn','circleReveal','flip3dX','motionL','letterPop','typewriter','crashZoom','rgbShake','elastic','dreamIn','spinFlip','fadeUp','tvOn','leakIn'];

/* =====================================================================
   VOICE CHANGER LIBRARY (v8)
   ===================================================================== */
const VOICE_LIB = [
  // Voice filters
  ['orig','Original','filters',{}],
  ['michog','Mic Hog','filters',{voice:'michog'}],
  ['crispmic','Crisp Mic','filters',{voice:'studio',eq:[-2,-1,0,0,0,1,3,4,3,2]}],
  ['studio','Studio Voice','filters',{voice:'studio'}],
  ['podcast','Podcast','filters',{voice:'podcast'}],
  ['sharpener','Sound Sharpener','filters',{eq:[-3,-2,-1,0,0,2,4,5,4,3],comp:true,compThr:-22,compRatio:3}],
  ['energetic','Energetic','filters',{eq:[3,3,1,0,0,1,2,3,3,2],comp:true,compThr:-26,compRatio:5,amp:2}],
  ['deepclear','Deep & Clear','filters',{pitch:-2,eq:[3,3,2,0,-1,0,2,3,2,1],comp:true,compThr:-24,compRatio:3}],
  ['fmradio','Classic FM Radio','filters',{voice:'radio',reverb:12,reverbSize:'room'}],
  ['lofi','Lo-Fi','filters',{voice:'lofi',vinyl:25}],
  ['vinyl','Vinyl','filters',{vinyl:60,lp:7000,hp:120,eq:[0,0,1,2,2,1,0,-2,-4,-6]}],
  ['oldphone','Old Phone','filters',{voice:'telephone',crush:35}],
  ['telephone','Telephone','filters',{voice:'telephone'}],
  ['megaphone','Megaphone','filters',{voice:'megaphone'}],
  ['distorted','Distorted','filters',{dist:55,eq:[0,0,0,2,3,3,2,0,-2,-4]}],
  ['practice','Practice Room','filters',{reverb:30,reverbSize:'room'}],
  ['livestage','Live Stage','filters',{reverb:40,reverbSize:'hall',echo:12,echoTime:.12,echoFb:20,comp:true,compThr:-20,compRatio:3}],
  ['emptyhall','Empty Hall','filters',{reverb:65,reverbSize:'church'}],
  ['divineecho','Divine Echo','filters',{reverb:45,reverbSize:'church',echo:35,echoTime:.42,echoFb:45,chorus:20}],
  ['souljourney','Soul Journey','filters',{reverb:50,reverbSize:'plate',chorus:35,echo:15,echoTime:.35}],
  ['echo','Echo','filters',{echo:55,echoTime:.32,echoFb:40}],
  ['bighouse','Big House','filters',{reverb:65,reverbSize:'stadium'}],
  ['cave','Cave','filters',{voice:'cave'}],
  ['underwater','Underwater','filters',{voice:'underwater'}],
  ['tremble','Tremble','filters',{trem:70,vibrato:40}],
  ['ninedee','8D / 9D Sound','filters',{pan8d:100,reverb:25,reverbSize:'hall'}],
  ['airlight','Air Light','filters',{hp:180,eq:[-4,-3,-2,0,0,1,2,3,4,5],reverb:15,reverbSize:'plate'}],
  ['muted','Muted','filters',{lp:1200,eq:[2,2,1,0,0,-2,-4,-6,-8,-10]}],
  ['chorus','Chorus','filters',{chorus:70}],
  // Voice characters
  ['chipmunk','Chipmunk','chars',{voice:'chipmunk'}],
  ['squirrel','Squirrel','chars',{pitch:12}],
  ['kid','Kid','chars',{pitch:5,eq:[-4,-3,-1,0,1,2,2,1,0,0]}],
  ['female','Female Tone','chars',{pitch:4,eq:[-3,-2,-1,0,0,1,2,2,1,1]}],
  ['male','Male Tone','chars',{pitch:-4,eq:[2,3,2,0,0,0,-1,-1,0,0]}],
  ['giant','Giant','chars',{pitch:-7,reverb:30,reverbSize:'hall',eq:[4,4,2,0,0,-1,-2,-2,-2,-3]}],
  ['monster','Monster','chars',{voice:'monster'}],
  ['villain','Villain','chars',{pitch:-6,dist:20,reverb:25,reverbSize:'church',ring:30}],
  ['robot','Robot','chars',{voice:'robot'}],
  ['alien','Alien','chars',{pitch:3,ring:180,chorus:40}],
  ['synth','Synth','chars',{ring:440,chorus:50,crush:20}],
  ['ghost','Ghost','chars',{pitch:-3,reverb:60,reverbSize:'church',chorus:45,vibrato:30}],
  ['oldman','Old Man','chars',{pitch:-2,vibrato:45,trem:25,lp:6000}],
  ['elf','Elf','chars',{pitch:7,reverb:20,reverbSize:'plate',chorus:25}],
  ['cartoon','Cartoon','chars',{pitch:8,vibrato:15}],
  ['announcer','Announcer','chars',{pitch:-2,voice:'podcast',reverb:18,reverbSize:'hall'}],
  ['deep','Deep','chars',{voice:'deep'}],
  ['bot8bit','8-bit','chars',{crush:80,pitch:2}],
];
const VOICE_MAP = {}; VOICE_LIB.forEach(v => VOICE_MAP[v[0]] = v);
const VOICE_KEEP = ['enhance','isolate','norm','eq'];
function applyVoicePreset(it, id){
  const v = VOICE_MAP[id]; if(!v) return;
  const a = it.audio, keep = {}; for(const k of ['enhance','isolate','norm']) keep[k] = a[k];
  const fresh = Object.assign(defAudio(), keep, deep(v[3])); fresh.vpreset = id; if(!v[3].eq) fresh.eq = a.vpreset ? defAudio().eq : a.eq;
  it.audio = fresh;
}

/* =====================================================================
   TEXT EFFECTS (v8) — styled lettering
   st: {fill: color | [c1,c2,c3], strokes:[[width,color]...], extrude:[depth,color], glow:[blur,color], shadow:[x,y,blur,color], dbl:[dx,dy,color]}
   ===================================================================== */
const TFX = [
  ['neonPink','Neon Pink','Neon',{fill:'#fff',strokes:[[3,'#ff2bd6']],glow:[26,'#ff2bd6']}],
  ['neonBlue','Neon Blue','Neon',{fill:'#e9fdff',strokes:[[3,'#19c8ff']],glow:[26,'#19c8ff']}],
  ['neonGreen','Neon Green','Neon',{fill:'#f2fff2',strokes:[[3,'#39ff6a']],glow:[26,'#39ff6a']}],
  ['neonYellow','Neon Gold','Neon',{fill:'#fffbe0',strokes:[[3,'#ffc400']],glow:[24,'#ffb000']}],
  ['neonRed','Neon Red','Neon',{fill:'#fff0f0',strokes:[[3,'#ff2d2d']],glow:[28,'#ff1a1a']}],
  ['gold','Gold','Gradient',{fill:['#fff3b0','#f7c843','#a8690e'],strokes:[[5,'#4a2a00']],shadow:[0,4,6,'#0008']}],
  ['silver','Silver','Gradient',{fill:['#ffffff','#c9d1d9','#6b7480'],strokes:[[5,'#1d2229']],shadow:[0,4,6,'#0008']}],
  ['chrome','Chrome','Gradient',{fill:['#ffffff','#9fb3c8','#1f2d3d','#d7e6f5'],strokes:[[3,'#0b1622']],glow:[10,'#7fd3ff']}],
  ['fire','Fire','Gradient',{fill:['#fff36b','#ff9a1f','#e31b0c'],strokes:[[5,'#3a0700']],glow:[22,'#ff5a00']}],
  ['ice','Ice','Gradient',{fill:['#ffffff','#a8ecff','#2aa4e8'],strokes:[[5,'#05324d']],glow:[16,'#7fe3ff']}],
  ['sunset','Sunset','Gradient',{fill:['#ffd86b','#ff6b8b','#7a3cff'],strokes:[[4,'#22093a']]}],
  ['ocean','Ocean','Gradient',{fill:['#7fffd4','#1fb6ff','#173b9c'],strokes:[[4,'#041433']]}],
  ['candy','Candy','Gradient',{fill:['#ffd1f0','#ff5fb6'],strokes:[[8,'#ffffff'],[11,'#c2187a']]}],
  ['rainbow','Rainbow','Gradient',{fill:['#ff4d4d','#ffd84d','#4dff88','#4dc3ff','#b84dff'],strokes:[[5,'#111']]}],
  ['toxic','Toxic','Gradient',{fill:['#eaff7a','#5bff3a','#0f8f2a'],strokes:[[5,'#062b00']],glow:[18,'#7dff3a']}],
  ['lava','Lava','Gradient',{fill:['#ffb347','#ff3d00','#5a0000'],strokes:[[5,'#1a0000']],shadow:[0,0,18,'#ff3d00']}],
  ['red3d','3D Red','3D',{fill:'#ffffff',strokes:[[5,'#e3122b']],extrude:[9,'#7a0010']}],
  ['blue3d','3D Blue','3D',{fill:'#ffffff',strokes:[[5,'#1f6bff']],extrude:[9,'#0a2766']}],
  ['gold3d','3D Gold','3D',{fill:['#fff6c4','#f2c33a'],strokes:[[4,'#7a4c00']],extrude:[10,'#4a2c00']}],
  ['comic','Comic','3D',{fill:'#ffe600',strokes:[[7,'#111']],extrude:[7,'#111']}],
  ['popart','Pop Art','3D',{fill:'#ff3b6b',strokes:[[7,'#fff'],[10,'#111']],extrude:[6,'#111']}],
  ['retro80','Retro 80s','Retro',{fill:['#ffe36e','#ff4fa8','#6a2cff'],strokes:[[4,'#fff']],extrude:[7,'#2b0a5c'],glow:[14,'#ff4fa8']}],
  ['vapor','Vaporwave','Retro',{fill:['#8ef6ff','#ff9ff3'],dbl:[5,4,'#ff3df5'],strokes:[[2,'#2a0050']]}],
  ['glitchT','Glitch','Retro',{fill:'#ffffff',dbl:[-5,0,'#00f0ff'],dbl2:[5,0,'#ff0055']}],
  ['longshadow','Long Shadow','Retro',{fill:'#ffffff',extrude:[16,'#00000066']}],
  ['sticker','Sticker','Outline',{fill:'#111111',strokes:[[10,'#ffffff']],shadow:[0,5,10,'#0009']}],
  ['dblOutline','Double Outline','Outline',{fill:'#ffffff',strokes:[[6,'#111'],[11,'#ffd400']]}],
  ['marker','Marker','Outline',{fill:'#ffffff',strokes:[[6,'#e3122b']]}],
  ['bubble','Bubble','Outline',{fill:['#ffffff','#bfe9ff'],strokes:[[9,'#2a7bd6']],shadow:[0,6,8,'#0007']}],
  ['minimalShadow','Soft Shadow','Outline',{fill:'#ffffff',shadow:[0,6,18,'#000c']}],
  ['kannadaGold','Yellow-Red Gold','Trending',{fill:['#ffe600','#ffb800'],strokes:[[6,'#c8102e']],shadow:[0,4,8,'#0009']}],
  ['royal','Royal','Trending',{fill:['#f9e7a1','#d4a017'],strokes:[[5,'#3d0a54']],glow:[12,'#d4a017']}],
  ['mint','Mint','Trending',{fill:'#c9ffe9',strokes:[[6,'#0b6e4f']],shadow:[4,4,0,'#0b6e4f']}],
];
const TFX_MAP = {}; TFX.forEach(t => TFX_MAP[t[0]] = {id:t[0], name:t[1], cat:t[2], st:t[3]});
const TFX_CATS = ['All','Trending','Neon','Gradient','3D','Retro','Outline'];
function drawStyledText(ctx, s, x, y, px, st){
  const k = px/60;
  const grad = () => { if(!Array.isArray(st.fill)) return st.fill; const g = ctx.createLinearGradient(0, y - px*.55, 0, y + px*.45); st.fill.forEach((c,i) => g.addColorStop(i/(st.fill.length-1), c)); return g; };
  ctx.save(); ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  if(st.extrude){ const [d, c] = st.extrude, n = Math.max(1, Math.round(d*k)); ctx.fillStyle = c; ctx.strokeStyle = c;
    const sw = st.strokes ? Math.max(...st.strokes.map(q => q[0]))*k*2 : 0; ctx.lineWidth = sw;
    for(let i=n;i>=1;i--){ if(sw) ctx.strokeText(s, x+i, y+i); ctx.fillText(s, x+i, y+i); } }
  if(st.shadow){ const [sx, sy, b, c] = st.shadow; ctx.shadowOffsetX = sx*k; ctx.shadowOffsetY = sy*k; ctx.shadowBlur = b*k; ctx.shadowColor = c; }
  if(st.glow){ ctx.shadowBlur = st.glow[0]*k; ctx.shadowColor = st.glow[1]; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
  for(const d of [st.dbl, st.dbl2]) if(d){ ctx.fillStyle = d[2]; ctx.fillText(s, x + d[0]*k, y + d[1]*k); }
  if(st.strokes) [...st.strokes].sort((a,b) => b[0]-a[0]).forEach(([w,c]) => { ctx.strokeStyle = c; ctx.lineWidth = w*k*2; ctx.strokeText(s, x, y); ctx.shadowColor = 'transparent'; });
  ctx.fillStyle = grad(); ctx.fillText(s, x, y);
  if(st.glow){ ctx.shadowBlur = st.glow[0]*k*.5; ctx.shadowColor = st.glow[1]; ctx.fillText(s, x, y); }
  ctx.restore();
}

/* =====================================================================
   TEXT TO SPEECH (v8) — Meta MMS voices running in the browser
   ===================================================================== */
const TTS_LANGS = [['kan','ಕನ್ನಡ','onnx-community/mms-tts-kan-ONNX'],['eng','English','Xenova/mms-tts-eng'],['hin','हिन्दी','Xenova/mms-tts-hin']];
const TTS_STYLES = [['natural','Natural',{}],['deep','Deep',{pitch:-3,eq:[2,3,2,0,0,0,-1,-1,0,0]}],['bright','Bright',{pitch:3}],['child','Child',{pitch:6}],['announcer','Announcer',{pitch:-2,voice:'podcast',reverb:15,reverbSize:'hall'}],
  ['radio','Radio',{voice:'radio'}],['robot','Robot',{voice:'robot'}],['monster','Monster',{voice:'monster'}],['echo','Echo',{echo:40,echoTime:.3,echoFb:35}],['studio','Studio',{voice:'studio'}]];
const TTS_SRC = `
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';
env.allowLocalModels = false;
const cache = {};
const msgOf = e => typeof e === 'number' ? 'ONNX runtime error ' + e : String(e && e.message || e);
async function load(model, dtype){
  const k = model + '|' + dtype;
  if(!cache[k]) cache[k] = pipeline('text-to-speech', model, { dtype, progress_callback: p => self.postMessage({ type: 'progress', p }) });
  try { return await cache[k]; } catch(e){ delete cache[k]; throw e; }
}
// run one piece; if the voice model chokes on it, split it in half and try again
async function speak(tts, text, depth){
  try { const r = await tts(text); if(!r.audio || !r.audio.length) throw new Error('empty'); return [r]; }
  catch(e){
    if(depth > 3 || text.length < 12) throw e;
    const sp = text.split(' '), h = Math.ceil(sp.length/2);
    if(sp.length < 2) throw e;
    return [...await speak(tts, sp.slice(0,h).join(' '), depth+1), ...await speak(tts, sp.slice(h).join(' '), depth+1)];
  }
}
self.onmessage = async e => {
  const { model, parts } = e.data;
  // the small 8-bit voice is tried first; some browsers can't run it, so the full-precision voice is the fallback
  for (const dtype of ['q8', 'fp32']) {
    try {
      if (dtype === 'fp32') self.postMessage({ type: 'note', msg: 'Switching to the high-quality voice model (one-time download)…' });
      const tts = await load(model, dtype);
      const out = []; let sr = 16000, skipped = 0;
      for (let i = 0; i < parts.length; i++) {
        self.postMessage({ type: 'status', i, n: parts.length });
        try { for (const r of await speak(tts, parts[i], 0)) { sr = r.sampling_rate; out.push(r.audio); } }
        catch (err) { if (dtype === 'q8') throw err; skipped++; }
      }
      if (!out.length) throw new Error('no audio');
      self.postMessage({ type: 'done', out, sr, skipped }); return;
    } catch (err) {
      if (dtype === 'fp32') { self.postMessage({ type: 'error', msg: msgOf(err) }); return; }
    }
  }
};`;
// keep only what the voice can pronounce (unknown characters crash the model)
const TTS_KEEP = {kan:/[^ಀ-೿\s,.?!'-]/g, hin:/[^ऀ-ॿ\s,.?!'-]/g, eng:/[^a-z\s,.?!'-]/g};
const DIG = {kan:'ಸೊನ್ನೆ ಒಂದು ಎರಡು ಮೂರು ನಾಲ್ಕು ಐದು ಆರು ಏಳು ಎಂಟು ಒಂಬತ್ತು', hin:'शून्य एक दो तीन चार पाँच छह सात आठ नौ', eng:'zero one two three four five six seven eight nine'};
function ttsClean(text, lang){
  let t = text.normalize('NFC');
  if(lang === 'eng') t = t.toLowerCase();
  const dw = (DIG[lang] || DIG.eng).split(' ');
  t = t.replace(/[0-9೦-೯०-९]/g, d => { const c = d.charCodeAt(0), v = c <= 57 ? c - 48 : c >= 0x0CE6 && c <= 0x0CEF ? c - 0x0CE6 : c - 0x0966; return ' ' + dw[v] + ' '; });
  t = t.replace(/[।|;:\n]/g, '. ').replace(TTS_KEEP[lang] || TTS_KEEP.eng, ' ').replace(/\s+/g, ' ').trim();
  return t;
}
let ttsWorker = null;
async function synthSpeech(text, lang, onProg){
  const L = TTS_LANGS.find(l => l[0] === lang) || TTS_LANGS[0];
  const clean = ttsClean(text, L[0]);
  if(!clean.replace(/[\s,.?!'-]/g,'')) throw new Error(L[0] === 'eng' ? 'Type English text for the English voice' : `Type the text in ${L[1]} script for this voice`);
  const parts = clean.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.replace(/[\s,.?!'-]/g,'')).flatMap(s => s.length > 140 ? s.split(/(?<=,)\s+/) : [s]).flatMap(s => s.length > 140 ? s.match(/.{1,120}(\s|$)/g).map(x => x.trim()).filter(Boolean) : [s]);
  if(!parts.length) throw new Error('Text is empty');
  if(!ttsWorker) ttsWorker = new Worker(URL.createObjectURL(new Blob([TTS_SRC],{type:'text/javascript'})),{type:'module'});
  const files = {};
  const res = await new Promise((resolve, reject) => {
    ttsWorker.onmessage = e => { const d = e.data;
      if(d.type === 'progress' && d.p && d.p.status === 'progress' && d.p.total){ files[d.p.file] = [d.p.loaded, d.p.total]; const a = Object.values(files).reduce((s,x)=>s+x[0],0), b = Object.values(files).reduce((s,x)=>s+x[1],0); onProg && onProg(`⬇ Voice model: ${(a/1048576).toFixed(0)} / ${(b/1048576).toFixed(0)} MB`, a/b); }
      else if(d.type === 'status') onProg && onProg(`🗣 Generating voice… ${d.i+1}/${d.n}`, (d.i+1)/d.n);
      else if(d.type === 'note') onProg && onProg('⏳ ' + d.msg, 0);
      else if(d.type === 'done') resolve(d); else if(d.type === 'error') reject(new Error(d.msg)); };
    ttsWorker.onerror = e => reject(new Error(e.message || 'TTS worker error (internet needed)'));
    ttsWorker.postMessage({model:L[2], parts});
  });
  const gap = Math.round(res.sr*.22), total = res.out.reduce((s,a) => s + a.length + gap, 0), all = new Float32Array(total); let o = 0;
  for(const a of res.out){ all.set(a, o); o += a.length + gap; }
  let pk = 0; for(let i=0;i<all.length;i++) pk = Math.max(pk, Math.abs(all[i])); if(pk > 0) for(let i=0;i<all.length;i++) all[i] *= .89/pk;
  const name = 'TTS ' + text.trim().slice(0,24).replace(/[\\/:*?"<>|]/g,'') + '.wav';
  return addAudioMedia(new File([wavMulti([all], res.sr)], name, {type:'audio/wav'}), all.length/res.sr);
}
async function ttsToTimeline(text, lang, style, start, speed, onProg){
  const m = await synthSpeech(text, lang, onProg);
  pushUndo();
  const sp = speed || 1, preset = (TTS_STYLES.find(s => s[0] === style) || TTS_STYLES[0])[2];
  const a = newAudioItem(m, {kind:'tts', start, dur:m.duration/sp, speed:sp});
  a.audio = Object.assign(defAudio(), deep(preset)); if(sp !== 1) a.audio.pitch = (a.audio.pitch||0) - 12*Math.log2(sp);
  S.audios.push(a); S.sel = a.id; afterEdit(); renderMediaPanel(); return a;
}

/* =====================================================================
   KANNADA: romanised Whisper output → Kannada script (best-effort)
   ===================================================================== */
const KN_V = [['aa','ಆ','ಾ'],['ii','ಈ','ೀ'],['ee','ಈ','ೀ'],['uu','ಊ','ೂ'],['oo','ಊ','ೂ'],['ai','ಐ','ೈ'],['au','ಔ','ೌ'],['ou','ಔ','ೌ'],['a','ಅ',''],['i','ಇ','ಿ'],['u','ಉ','ು'],['e','ಎ','ೆ'],['o','ಒ','ೊ'],['ru','ಋ','ೃ']];
const KN_C = [['chh','ಛ'],['ksh','ಕ್ಷ'],['kh','ಖ'],['gh','ಘ'],['ch','ಚ'],['jh','ಝ'],['th','ಥ'],['dh','ಧ'],['ph','ಫ'],['bh','ಭ'],['sh','ಶ'],['ng','ಙ'],['k','ಕ'],['g','ಗ'],['c','ಕ'],['j','ಜ'],['t','ತ'],['d','ದ'],['n','ನ'],['p','ಪ'],['b','ಬ'],['m','ಮ'],['y','ಯ'],['r','ರ'],['l','ಲ'],['v','ವ'],['w','ವ'],['s','ಸ'],['h','ಹ'],['f','ಫ'],['z','ಜ'],['q','ಕ'],['x','ಕ್ಸ']];
function translitKn(text){
  return text.replace(/[A-Za-z]+/g, word => {
    let w = word.toLowerCase(), out = '', i = 0, prevC = false;
    const vAt = j => KN_V.find(v => w.startsWith(v[0], j)), cAt = j => KN_C.find(c => w.startsWith(c[0], j));
    while(i < w.length){
      const c = cAt(i);
      if(c){
        // n / m before another consonant → anusvara (ಂ)
        if((c[0] === 'n' || c[0] === 'm') && !prevC && out && i+1 < w.length && cAt(i+1) && !vAt(i+1) && w[i+1] !== c[0] && w[i+1] !== 'y'){ out += 'ಂ'; i += 1; prevC = false; continue; }
        if(prevC) out += '್';
        out += c[1]; i += c[0].length; prevC = true;
        const v = vAt(i); if(v){ out += v[2]; i += v[0].length; prevC = false; }
        continue;
      }
      const v = vAt(i);
      if(v){ out += v[1]; i += v[0].length; prevC = false; continue; }
      out += w[i]; i++; prevC = false;
    }
    if(prevC) out += 'ು';   // Kannada words rarely end in a bare consonant
    return out;
  });
}
const latinRatio = s => { const L = (s.match(/[A-Za-z]/g)||[]).length, K = (s.match(/[ಀ-೿]/g)||[]).length; return L/Math.max(1, L+K); };

/* =====================================================================
   v9: TEXT BUBBLES
   ===================================================================== */
const BUBBLES = [['speech','Speech'],['thought','Thought'],['shout','Shout'],['pill','Pill'],['ribbon','Ribbon'],['tag','Tag'],['note','Sticky note'],['circle','Circle'],['comic','Comic box'],['cloud','Cloud'],['brush','Brush'],['underline','Marker']];
function drawBubble(x, id, bw, bh, px, fill, stroke){
  const lw = Math.max(1.5, px*.06), hw = bw/2, hh = bh/2;
  x.save(); x.lineJoin = 'round'; x.fillStyle = fill; x.strokeStyle = stroke; x.lineWidth = lw;
  const done = (noStroke) => { x.fill(); if(!noStroke) x.stroke(); };
  x.beginPath();
  switch(id){
    case 'speech': { const r = Math.min(hh, px*.5); x.roundRect ? x.roundRect(-hw-px*.2,-hh-px*.1,bw+px*.4,bh+px*.2,r) : x.rect(-hw,-hh,bw,bh);
      x.moveTo(-hw*.45, hh+px*.1); x.lineTo(-hw*.7, hh+px*.75); x.lineTo(-hw*.15, hh+px*.1); done(); break; }
    case 'thought': x.ellipse(0,0,hw+px*.6,hh+px*.5,0,0,7); done();
      x.beginPath(); x.arc(-hw*.6, hh+px*.65, px*.22, 0, 7); done(); x.beginPath(); x.arc(-hw*.8, hh+px*1.05, px*.12, 0, 7); done(); break;
    case 'shout': { const n = 16; for(let i=0;i<n*2;i++){ const a = i/(n*2)*Math.PI*2, r = i%2 ? 1 : 1.32; const px_ = Math.cos(a)*(hw+px*.5)*r, py = Math.sin(a)*(hh+px*.5)*r; i ? x.lineTo(px_,py) : x.moveTo(px_,py); } x.closePath(); done(); break; }
    case 'pill': x.roundRect ? x.roundRect(-hw-px*.3,-hh,bw+px*.6,bh,hh) : x.rect(-hw,-hh,bw,bh); done(); break;
    case 'ribbon': { const e = px*.7; x.moveTo(-hw-e,-hh); x.lineTo(hw+e,-hh); x.lineTo(hw+e*.55,0); x.lineTo(hw+e,hh); x.lineTo(-hw-e,hh); x.lineTo(-hw-e*.55,0); x.closePath(); done(); break; }
    case 'tag': { const e = px*.6; x.moveTo(-hw-e,0); x.lineTo(-hw,-hh); x.lineTo(hw+px*.2,-hh); x.lineTo(hw+px*.2,hh); x.lineTo(-hw,hh); x.closePath(); done(); x.beginPath(); x.fillStyle = stroke; x.arc(-hw-e*.35,0,px*.1,0,7); x.fill(); break; }
    case 'note': x.rotate(-.04); x.shadowColor = '#0006'; x.shadowBlur = px*.3; x.shadowOffsetY = px*.12; x.rect(-hw-px*.3,-hh-px*.25,bw+px*.6,bh+px*.5); done(true);
      x.shadowColor = 'transparent'; x.beginPath(); x.fillStyle = stroke; x.globalAlpha = .25; x.rect(-px*.6,-hh-px*.45,px*1.2,px*.35); x.fill(); break;
    case 'circle': { const r = Math.max(hw, hh) + px*.35; x.arc(0,0,r,0,7); done(); break; }
    case 'comic': x.fillStyle = stroke; x.rect(-hw-px*.2+px*.18,-hh+px*.18,bw+px*.4,bh); x.fill(); x.beginPath(); x.fillStyle = fill; x.rect(-hw-px*.2,-hh,bw+px*.4,bh); done(); break;
    case 'cloud': { const n = Math.max(5, Math.round(bw/(px*.9))); for(let i=0;i<n;i++){ const t = (i+.5)/n; x.moveTo(-hw+bw*t+px*.45, -hh); x.arc(-hw+bw*t, -hh, px*.45, 0, 7); x.moveTo(-hw+bw*t+px*.45, hh); x.arc(-hw+bw*t, hh, px*.45, 0, 7); }
      x.moveTo(-hw+hh,-hh); x.ellipse(0,0,hw+px*.2,hh+px*.1,0,0,7); x.fill(); break; }
    case 'brush': for(let i=0;i<5;i++){ const o = (i-2)*bh*.16; x.rect(-hw-px*.3+(i%2)*px*.25, o-bh*.12, bw+px*.4-(i%3)*px*.2, bh*.3); } x.fill(); break;
    case 'underline': x.globalAlpha = .9; x.rect(-hw-px*.1, hh*.15, bw+px*.2, hh*.75); x.fill(); break;
  }
  x.restore();
}

/* =====================================================================
   v9: TEXT TEMPLATES
   ===================================================================== */
const TT = (id,name,items) => ({id,name,items});
const TEXT_TPL = [
  TT('news','Breaking News',[{text:'BREAKING NEWS',size:54,y:78,font:'Oswald',bubble:'ribbon',bubColor:'#d81b20',bubStroke:'#ffffff',color:'#ffffff',anim:{in:'wipeIn',out:'fade',loop:'none',inDur:.5,outDur:.3}},{text:'Type the news here',size:34,y:86,bubble:'pill',bubColor:'#111111',bubStroke:'#111111',color:'#ffffff',anim:{in:'fadeLeft',out:'fade',loop:'none',inDur:.6,outDur:.3}}]),
  TT('subscribe','Subscribe',[{text:'SUBSCRIBE',size:60,y:80,font:'Anton',bubble:'pill',bubColor:'#e62117',bubStroke:'#e62117',color:'#ffffff',anim:{in:'popUp',out:'zoomOut',loop:'pulse',inDur:.5,outDur:.4}}]),
  TT('sale','Sale',[{text:'50% OFF',size:110,y:45,font:'Anton',tfx:'comic',anim:{in:'crashZoom',out:'fade',loop:'shake',inDur:.5,outDur:.3}},{text:'Today only!',size:40,y:60,bubble:'shout',bubColor:'#ffe600',bubStroke:'#111111',color:'#111111',anim:{in:'popUp',out:'fade',loop:'none',inDur:.5,outDur:.3}}]),
  TT('lower','Lower Third',[{text:'Your Name',size:46,y:80,x:30,align:'left',bubble:'tag',bubColor:'#20d5ec',bubStroke:'#04262b',color:'#04262b',anim:{in:'fadeLeft',out:'fadeLeft',loop:'none',inDur:.5,outDur:.4}},{text:'Title / Organisation',size:30,y:87,x:28,align:'left',color:'#ffffff',bgOn:true,bgColor:'#000000',bgAlpha:70,anim:{in:'fadeLeft',out:'fadeLeft',loop:'none',inDur:.7,outDur:.4}}]),
  TT('quote','Quote',[{text:'“ Your quote here ”',size:48,y:50,font:'Tiro Kannada',bubble:'note',bubColor:'#fff6b0',bubStroke:'#8a6d00',color:'#3b2a00',anim:{in:'fadeUp',out:'fade',loop:'none',inDur:.8,outDur:.5}}]),
  TT('bday','Happy Birthday',[{text:'Happy Birthday',size:72,y:40,font:'Pacifico',tfx:'candy',anim:{in:'elastic',out:'fade',loop:'breathe',inDur:.8,outDur:.5}},{text:'Happy Birthday',size:40,y:52,font:'Baloo Tamma 2',tfx:'kannadaGold',anim:{in:'letterPop',out:'fade',loop:'none',inDur:1,outDur:.5}}]),
  TT('festival','Festival Wishes',[{text:'Happy Festival',size:70,y:45,font:'Baloo Tamma 2',tfx:'gold3d',anim:{in:'zoomBlurIn',out:'fade',loop:'glowPulse',inDur:.8,outDur:.5}}]),
  TT('cinematic','Cinematic Title',[{text:'THE JOURNEY',size:84,y:48,font:'Bebas Neue',tfx:'silver',anim:{in:'focusIn',out:'blur',loop:'none',inDur:1.2,outDur:.8}},{text:'a film by you',size:26,y:57,font:'Montserrat',color:'#dddddd',anim:{in:'fade',out:'fade',loop:'none',inDur:1.5,outDur:.6}}]),
  TT('chapter','Chapter',[{text:'Chapter 1',size:36,y:44,font:'Montserrat',color:'#20d5ec',anim:{in:'fadeDown',out:'fade',loop:'none',inDur:.6,outDur:.4}},{text:'Lesson Name',size:74,y:52,font:'Baloo Tamma 2',tfx:'minimalShadow',anim:{in:'fadeUp',out:'fade',loop:'none',inDur:.8,outDur:.4}}]),
  TT('comicpop','Comic Pop',[{text:'WOW!',size:110,y:45,font:'Anton',tfx:'popart',curve:30,bubble:'shout',bubColor:'#ffe600',bubStroke:'#111111',anim:{in:'popUp',out:'zoomOut',loop:'wobble',inDur:.4,outDur:.3}}]),
  TT('neonsign','Neon Sign',[{text:'OPEN',size:100,y:48,font:'Montserrat',tfx:'neonPink',anim:{in:'strobeIn',out:'fade',loop:'glowPulse',inDur:1,outDur:.4}}]),
  TT('arc','Arc Title',[{text:'Our School, Our Pride',size:56,y:40,font:'Baloo Tamma 2',tfx:'royal',curve:45,anim:{in:'fadeUp',out:'fade',loop:'none',inDur:.8,outDur:.4}}]),
];
function addTextTemplate(id){
  const t = TEXT_TPL.find(x => x.id === id); if(!t) return; pushUndo(); let last = null;
  for(const it of t.items){ const o = newOverlay('text', {...deep(it), start:S.time, dur:4, shadow:it.tfx ? 0 : (it.shadow ?? 20)}); if(it.font) ensureFont(it.font); S.overlays.push(o); last = o; }
  S.sel = last.id; afterEdit();
}

/* =====================================================================
   v9: VIDEO TEMPLATES — your photos / videos go into a ready design
   ===================================================================== */
const TPL = [
  {id:'school',name:'School Event',cat:'Events',ratio:'16:9',n:6,slot:3,trans:['fade','zoomIn','circleOpen','slideL'],loop:'kenburns',filter:'pf:natural',col:['#0f4c81','#f2c33a'],
   texts:[{text:'Annual Day',key:'title',size:78,y:42,font:'Baloo Tamma 2',tfx:'kannadaGold',at:0,dur:3.5,anim:{in:'zoomBlurIn',out:'fade',loop:'none',inDur:.8,outDur:.5}},
          {text:'2026',key:'sub',size:40,y:55,font:'Montserrat',bubble:'ribbon',bubColor:'#c8102e',bubStroke:'#ffffff',color:'#ffffff',at:.4,dur:3.1,anim:{in:'fadeUp',out:'fade',loop:'none',inDur:.6,outDur:.4}},
          {text:'Thank You',size:80,y:50,font:'Baloo Tamma 2',tfx:'gold',at:-3,dur:3,anim:{in:'popUp',out:'fade',loop:'none',inDur:.6,outDur:.6}}]},
  {id:'bday',name:'Birthday',cat:'Events',ratio:'9:16',n:6,slot:2.5,trans:['heart','star','circleOpen','zoomIn'],loop:'zoomInOut',filter:'pf:peach',col:['#ff5fb6','#ffd1f0'],gfx:[['confetti',0]],
   texts:[{text:'Happy Birthday',key:'title',size:80,y:30,font:'Pacifico',tfx:'candy',at:0,dur:4,anim:{in:'elastic',out:'fade',loop:'breathe',inDur:.8,outDur:.5}},
          {text:'Your Name',key:'sub',size:52,y:42,font:'Baloo Tamma 2',tfx:'kannadaGold',at:.6,dur:3.4,anim:{in:'letterPop',out:'fade',loop:'none',inDur:1,outDur:.5}}]},
  {id:'festival',name:'Festival',cat:'Events',ratio:'9:16',n:5,slot:3,trans:['star','fade','flashShake','circleOpen'],loop:'kenburns',filter:'pf:goldenhour',col:['#ff8a00','#7a1f00'],gfx:[['fireworks',0]],
   texts:[{text:'Happy Festival',key:'title',size:72,y:40,font:'Baloo Tamma 2',tfx:'gold3d',at:0,dur:4,anim:{in:'zoomBlurIn',out:'fade',loop:'glowPulse',inDur:.8,outDur:.5}},
          {text:'Your Name',key:'sub',size:40,y:52,color:'#ffffff',bubble:'pill',bubColor:'#7a1f00',bubStroke:'#f2c33a',at:.6,dur:3.4,anim:{in:'fadeUp',out:'fade',loop:'none',inDur:.6,outDur:.4}}]},
  {id:'ytintro',name:'YouTube Intro',cat:'YouTube',ratio:'16:9',n:3,slot:1.4,trans:['rgbGlitch','whipL','zoomBlur'],loop:'none',filter:'pf:blockbuster',col:['#111','#e62117'],
   texts:[{text:'MY CHANNEL',key:'title',size:96,y:46,font:'Anton',tfx:'neonBlue',at:.2,dur:3.6,anim:{in:'glitchSlide',out:'digital',loop:'rgbLoop',inDur:.6,outDur:.4}},
          {text:'Welcome!',key:'sub',size:40,y:60,font:'Montserrat',color:'#ffffff',at:.9,dur:2.9,anim:{in:'fadeUp',out:'fade',loop:'none',inDur:.5,outDur:.3}}]},
  {id:'ytoutro',name:'YouTube Outro',cat:'YouTube',ratio:'16:9',n:1,slot:8,trans:[],loop:'kenburns',filter:'pf:moody',col:['#1b1b1b','#20d5ec'],gfx:[['subscribe',1],['bell',1.5]],
   texts:[{text:'Thanks for watching',key:'title',size:64,y:30,font:'Montserrat',tfx:'minimalShadow',at:.3,dur:7.5,anim:{in:'fadeDown',out:'fade',loop:'none',inDur:.8,outDur:.5}}]},
  {id:'reels',name:'Reels Fast Cut',cat:'Social',ratio:'9:16',n:8,slot:.8,trans:['whipL','zoomBlur','flashShake','whipR'],loop:'none',filter:'pf:teal',col:['#7a3cff','#ff6b8b'],
   texts:[{text:'WAIT FOR IT…',key:'title',size:64,y:20,font:'Anton',tfx:'dblOutline',at:0,dur:2.4,anim:{in:'punchIn',out:'fade',loop:'shakeLoop',inDur:.3,outDur:.2}}]},
  {id:'memories',name:'Memories',cat:'Social',ratio:'9:16',n:6,slot:3.5,trans:['fade','blurDissolve','fade'],loop:'kenburns',filter:'pf:film400',col:['#3b2a1a','#e8d5b0'],gfx:[['filmdust',0]],
   texts:[{text:'Memories',key:'title',size:80,y:44,font:'Dancing Script',tfx:'minimalShadow',at:.2,dur:4,anim:{in:'focusIn',out:'fade',loop:'none',inDur:1.2,outDur:.6}},
          {text:'Memories',key:'sub',size:44,y:54,font:'Tiro Kannada',color:'#f5e6c8',at:.8,dur:3.4,anim:{in:'fade',out:'fade',loop:'none',inDur:1,outDur:.6}}]},
  {id:'travel',name:'Travel Diary',cat:'Social',ratio:'16:9',n:6,slot:2.5,trans:['slideL','whipR','zoomIn','slideU'],loop:'kenburns',filter:'pf:nature',col:['#1fb6ff','#7fffd4'],
   texts:[{text:'TRAVEL DIARY',key:'title',size:86,y:44,font:'Bebas Neue',tfx:'ocean',at:.2,dur:3.6,anim:{in:'motionL',out:'motionR',loop:'none',inDur:.7,outDur:.5}},
          {text:'My Trip',key:'sub',size:40,y:56,bubble:'brush',bubColor:'#ffe600',bubStroke:'#000',color:'#111',at:.7,dur:3.1,anim:{in:'wipeIn',out:'fade',loop:'none',inDur:.6,outDur:.4}}]},
  {id:'lesson',name:'Lesson Intro',cat:'Education',ratio:'16:9',n:2,slot:4,trans:['fade'],loop:'zoomOutSlow',filter:'pf:clean',col:['#0b6e4f','#c9ffe9'],gfx:[['lowerthird',4.2]],
   texts:[{text:'Chapter 1',key:'sub',size:40,y:38,font:'Montserrat',color:'#20d5ec',at:.2,dur:3.6,anim:{in:'fadeDown',out:'fade',loop:'none',inDur:.6,outDur:.4}},
          {text:'Lesson Name',key:'title',size:84,y:50,font:'Baloo Tamma 2',tfx:'mint',at:.4,dur:3.4,anim:{in:'fadeUp',out:'fade',loop:'none',inDur:.8,outDur:.4}}]},
  {id:'quote',name:'Status / Quote',cat:'Social',ratio:'9:16',n:1,slot:7,trans:[],loop:'kenburns',filter:'pf:moody',col:['#222','#fff6b0'],
   texts:[{text:'“ Never stop learning ”',key:'title',size:56,y:50,font:'Tiro Kannada',bubble:'note',bubColor:'#fff6b0',bubStroke:'#8a6d00',color:'#3b2a00',at:.3,dur:6.5,anim:{in:'letterFade',out:'fade',loop:'float',inDur:1.5,outDur:.6}}]},
];
const TPL_CATS = ['All','Events','Social','YouTube','Education'];
function buildTemplate(tpl, medias, texts){
  pushUndo();
  S.ratio = tpl.ratio; if(typeof syncSelects === 'function') syncSelects(); setCanvas();
  for(const c of S.clips) if(vids[c.id]) vids[c.id].pause();
  active = null; dropAllChains(); pairKey = '';
  const n = Math.max(tpl.n, medias.length), W = cv.width, H = cv.height;
  S.clips = []; S.overlays = [];
  for(let i=0;i<n;i++){
    const m = medias[i % medias.length], c = newClip(m);
    if(m.type === 'video'){ const len = Math.min(m.duration, tpl.slot); c.in = Math.max(0, Math.min(m.duration - len, m.duration*.15)); c.out = c.in + len; } else c.out = tpl.slot;
    if(m.w && m.h) c.tf.scale = Math.round(Math.max(W/m.w, H/m.h)/Math.min(W/m.w, H/m.h)*100);
    c.anim.loop = tpl.loop; c.filter = tpl.filter; c.filterAmt = 85;
    if(i > 0 && tpl.trans.length) c.trans = {type:tpl.trans[(i-1) % tpl.trans.length], dur:Math.min(.6, tpl.slot*.35)};
    S.clips.push(c);
  }
  layout();
  for(const t of tpl.texts){
    const st = t.at < 0 ? Math.max(0, S.mainEnd + t.at) : t.at, val = texts[t.key] != null && t.key ? texts[t.key] : t.text;
    const o = newOverlay('text', {...deep(t), text:val, start:st, dur:Math.min(t.dur, Math.max(.5, S.mainEnd - st)), shadow:t.tfx ? 0 : 20});
    delete o.key; delete o.at; if(t.font) ensureFont(t.font); S.overlays.push(o);
  }
  for(const [g, at] of (tpl.gfx || [])){ const G = GFXMAP[g]; if(!G) continue;
    const o = newOverlay('gfx', {gfx:g, start:at, dur:Math.min(G.dur, Math.max(1, S.mainEnd - at)), text:G.text||'', text2:G.text2||'', color:G.color||'#20d5ec', gspeed:1, size:G.full?100:(G.aspect<.5?70:40), x:50, y:g==='lowerthird'?80:g==='subscribe'?72:g==='bell'?72:50, blend:G.blend||'source-over', anim:{in:'none',out:'fade',loop:'none',inDur:.5,outDur:.5}});
    if(g === 'bell') o.x = 72; if(g === 'subscribe') o.x = 45; S.overlays.push(o); }
  S.sel = S.clips[0] ? S.clips[0].id : null; afterEdit(); seek(0);
}

/* =====================================================================
   v9: BEAT DETECTION + AUTO CUT TO BEATS
   ===================================================================== */
async function detectBeats(a){
  const m = media(a.mediaId), blob = m && mediaBlobs[m.id]; if(!blob) throw new Error('Audio file not found');
  const sr = 11025, ab = await new OfflineAudioContext(1,1,sr).decodeAudioData(await blob.arrayBuffer());
  const d = ab.getChannelData(0), hop = 256, n = Math.floor(d.length/hop), env = new Float32Array(n);
  let lp = 0, prev = 0;
  for(let i=0;i<n;i++){ let e = 0; for(let j=i*hop;j<(i+1)*hop && j<d.length;j++){ lp += (d[j]-lp)*.25; e += lp*lp; } e = Math.log(1e-6 + e); env[i] = Math.max(0, e - prev); prev = e; }
  // smooth + normalise onset envelope
  const fps = sr/hop, on = new Float32Array(n); let mx = 1e-9;
  for(let i=1;i<n-1;i++){ on[i] = (env[i-1] + 2*env[i] + env[i+1])/4; mx = Math.max(mx, on[i]); }
  for(let i=0;i<n;i++) on[i] /= mx;
  // tempo by autocorrelation (70–180 BPM)
  let best = 0, bestLag = Math.round(fps*.5);
  for(let lag = Math.round(fps*60/180); lag <= Math.round(fps*60/70); lag++){ let s = 0; for(let i=lag;i<n;i++) s += on[i]*on[i-lag]; s *= 1 + .15*Math.exp(-Math.pow(60*fps/lag - 115, 2)/1800); if(s > best){ best = s; bestLag = lag; } }
  let bestOff = 0, bo = -1;
  for(let off=0; off<bestLag; off++){ let s = 0; for(let i=off;i<n;i+=bestLag) s += on[i]; if(s > bo){ bo = s; bestOff = off; } }
  const beats = [], win = Math.round(fps*.06);
  for(let i=bestOff;i<n;i+=bestLag){ let bi = i, bv = -1; for(let j=Math.max(0,i-win); j<=Math.min(n-1,i+win); j++) if(on[j] > bv){ bv = on[j]; bi = j; } beats.push(+(bi/fps).toFixed(3)); }
  a.beats = beats; a.bpm = Math.round(60*fps/bestLag);
  return a;
}
// returns timeline times of the beats that fall inside the audio item
const beatTimes = a => (a.beats||[]).filter(b => b >= a.in && b <= a.in + a.dur*a.speed).map(b => a.start + (b - a.in)/a.speed);
function cutToBeats(a, every){
  const T = beatTimes(a).filter((_,i) => i % every === 0); if(T.length < 2) return alert('Not enough beats');
  if(!S.clips.length) return alert('Add photos / videos to the main track');
  pushUndo();
  const bounds = T[0] > .3 ? [0, ...T] : T.map((t,i) => i === 0 ? 0 : t);
  let k = 0;
  for(const c of S.clips){
    if(k >= bounds.length - 1) break;
    const dur = bounds[k+1] - bounds[k], m = media(c.mediaId);
    c.trans = {type:'none', dur:.6}; c.curve = null; c.curveName = 'none';
    if(m.type === 'image') c.out = c.in + dur; else { c.out = Math.min(m.duration, c.in + dur*c.speed); }
    k++;
  }
  afterEdit();
  return k;
}

/* =====================================================================
   v9: AUTO SILENCE CUT
   ===================================================================== */
async function analyzeSilence(c, opt){
  const m = media(c.mediaId), blob = m && mediaBlobs[m.id]; if(!blob) throw new Error('Media file not found');
  if(!c._pcm || c._pcmKey !== m.id){ const ab = await new OfflineAudioContext(1,1,16000).decodeAudioData(await blob.arrayBuffer()); c._pcm = ab.getChannelData(0); c._pcmKey = m.id; }
  const d = c._pcm, sr = 16000, win = 320, s0 = Math.floor(c.in*sr), s1 = Math.min(d.length, Math.floor(c.out*sr)), n = Math.floor((s1-s0)/win), db = new Float32Array(n);
  for(let i=0;i<n;i++){ let e = 0; for(let j=s0+i*win; j<s0+(i+1)*win; j++) e += d[j]*d[j]; db[i] = 10*Math.log10(e/win + 1e-10); }
  const sorted = [...db].sort((a,b)=>a-b), floor = sorted[Math.floor(n*.1)] || -60, peak = sorted[Math.floor(n*.95)] || -20;
  const thr = opt.thr != null ? opt.thr : Math.max(floor + 8, Math.min(peak - 18, -30));
  const minN = Math.round(opt.minSil*sr/win), pad = opt.pad;
  const keep = []; let i = 0, segStart = c.in;
  while(i < n){
    if(db[i] < thr){ let j = i; while(j < n && db[j] < thr) j++;
      if(j - i >= minN){ const a = c.in + i*win/sr + pad, b = c.in + j*win/sr - pad; if(b > a){ if(a - segStart > .05) keep.push([segStart, a]); segStart = b; } }
      i = j; } else i++;
  }
  if(c.out - segStart > .05) keep.push([segStart, c.out]);
  const kept = keep.reduce((s,k)=>s+k[1]-k[0],0);
  return {keep, thr:Math.round(thr), removed:(c.out-c.in)-kept, cuts:Math.max(0, keep.length-1)};
}
function applySilenceCut(c, keep){
  if(!keep.length) return; pushUndo();
  const i = S.clips.indexOf(c), parts = keep.map(([a,b],k) => { const x = deep(c); delete x._pcm; x.id = k === 0 ? c.id : nid(); x.in = a; x.out = b; x.kf = [];
    if(k > 0){ x.trans = {type:'none',dur:.6}; x.anim.in = 'none'; } if(k < keep.length-1) x.anim.out = 'none'; return x; });
  delete c._pcm; S.clips.splice(i, 1, ...parts); afterEdit();
}

/* =====================================================================
   v9: COVER / THUMBNAIL MAKER
   ===================================================================== */
async function grabFrame(t){
  const prevSel = S.sel; S.sel = null;
  await renderAt(t); const c = document.createElement('canvas'); c.width = out.width; c.height = out.height; c.getContext('2d').drawImage(out,0,0);
  S.sel = prevSel; render(performance.now()); return c;
}
function drawCover(cnv, frame, o){
  const x = cnv.getContext('2d'), W = cnv.width, H = cnv.height;
  x.fillStyle = '#000'; x.fillRect(0,0,W,H);
  if(frame){ const k = Math.max(W/frame.width, H/frame.height); x.filter = `brightness(${1+o.bright/100}) saturate(${1+o.sat/100})`; x.drawImage(frame, (W-frame.width*k)/2, (H-frame.height*k)/2, frame.width*k, frame.height*k); x.filter = 'none'; }
  if(o.shade > 0){ const g = x.createLinearGradient(0, o.pos==='top'?0:H, 0, o.pos==='top'?H:0); g.addColorStop(0, `rgba(0,0,0,${o.shade/100})`); g.addColorStop(.65, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0,0,W,H); }
  const u = Math.min(W,H), px = o.size/100*u*.22, y = o.pos==='top' ? H*.2 : o.pos==='bottom' ? H*.78 : H*.5;
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `900 ${px}px "${o.font}","Noto Sans Kannada",sans-serif`;
  const st = (TFX_MAP[o.style] || TFX_MAP.kannadaGold).st, lines = (o.title||'').split('\n');
  lines.forEach((l,i) => drawStyledText(x, l, W/2, y + (i - (lines.length-1)/2)*px*1.15, px, st));
  if(o.sub){ x.font = `700 ${px*.42}px Montserrat,"Noto Sans Kannada",sans-serif`; const sy = y + (lines.length/2 + .5)*px*1.15;
    x.save(); x.translate(W/2, sy); const tw = x.measureText(o.sub).width; drawBubble(x, 'pill', tw + px*.5, px*.62, px*.42, '#e62117', '#e62117'); x.fillStyle = '#fff'; x.fillText(o.sub, 0, 0); x.restore(); }
}

/* =====================================================================
   v12: VOCAL REMOVER / BGM REMOVER (AI stem separation, runs in the browser)
   Model: UVR MDX-Net "Inst HQ 3" (ONNX) → instrumental; vocals = mix − instrumental
   ===================================================================== */
const STEM_MODEL_URLS = ['models/UVR-MDX-NET-Inst_HQ_3.onnx', 'https://huggingface.co/seanghay/uvr_models/resolve/main/UVR-MDX-NET-Inst_HQ_3.onnx'];
const MDX_DSP = `
const NFFT=6144, HOP=1024, DIMF=3072, DIMT=256, NB=NFFT/2+1, CH=HOP*(DIMT-1), TRIM=NFFT/2, GEN=CH-2*TRIM;
function makeFFT(N){
  const fac=[]; let n=N; for(const p of [4,2,3,5]) while(n%p===0){ fac.push(p); n/=p; }
  const C=new Float64Array(N), Sn=new Float64Array(N); for(let k=0;k<N;k++){ C[k]=Math.cos(2*Math.PI*k/N); Sn[k]=-Math.sin(2*Math.PI*k/N); }
  const tr=new Float64Array(8), ti=new Float64Array(8);
  function rec(iR,iI,oR,oI,oOff,n,iOff,stride,fi){
    if(n===1){ oR[oOff]=iR[iOff]; oI[oOff]=iI[iOff]; return; }
    const p=fac[fi], m=n/p;
    for(let q=0;q<p;q++) rec(iR,iI,oR,oI,oOff+q*m,m,iOff+q*stride,stride*p,fi+1);
    const step=N/n, pstep=N/p;
    for(let k=0;k<m;k++){
      for(let q=0;q<p;q++){ const idx=oOff+q*m+k, w=(q*k*step)%N, xr=oR[idx], xi=oI[idx]; tr[q]=xr*C[w]-xi*Sn[w]; ti[q]=xr*Sn[w]+xi*C[w]; }
      for(let r=0;r<p;r++){ let sr=0, si=0; for(let q=0;q<p;q++){ const w=((q*r)%p)*pstep; sr+=tr[q]*C[w]-ti[q]*Sn[w]; si+=tr[q]*Sn[w]+ti[q]*C[w]; } oR[oOff+r*m+k]=sr; oI[oOff+r*m+k]=si; }
    }
  }
  return (iR,iI,oR,oI) => rec(iR,iI,oR,oI,0,N,0,1,0);
}
const fft=makeFFT(NFFT), WIN=new Float64Array(NFFT); for(let i=0;i<NFFT;i++) WIN[i]=.5-.5*Math.cos(2*Math.PI*i/NFFT);
const bR=new Float64Array(NFFT), bI=new Float64Array(NFFT), oR=new Float64Array(NFFT), oI=new Float64Array(NFFT);
// reflect-padded STFT of one CH-long channel into X (layout [4][DIMF][DIMT]), channel slot c (0 = left, 1 = right)
function stftInto(x, X, c){
  const P=NFFT/2, L=x.length, at=i=>{ let j=i-P; if(j<0) j=-j; if(j>=L) j=2*(L-1)-j; return x[j]; };
  for(let t=0;t<DIMT;t++){
    for(let i=0;i<NFFT;i++){ bR[i]=at(t*HOP+i)*WIN[i]; bI[i]=0; }
    fft(bR,bI,oR,oI);
    const re=(c*2)*DIMF*DIMT, im=(c*2+1)*DIMF*DIMT;
    for(let f=0;f<DIMF;f++){ X[re+f*DIMT+t]=oR[f]; X[im+f*DIMT+t]=oI[f]; }
  }
}
let WSUM=null;
function istftFrom(Y, c, out){
  if(!WSUM){ WSUM=new Float64Array(NFFT+HOP*(DIMT-1)); for(let t=0;t<DIMT;t++) for(let i=0;i<NFFT;i++) WSUM[t*HOP+i]+=WIN[i]*WIN[i]; }
  const acc=new Float64Array(NFFT+HOP*(DIMT-1)), re=(c*2)*DIMF*DIMT, im=(c*2+1)*DIMF*DIMT;
  for(let t=0;t<DIMT;t++){
    for(let f=0;f<NB;f++){ const a=f<DIMF?Y[re+f*DIMT+t]:0, b=f<DIMF?Y[im+f*DIMT+t]:0; bR[f]=a; bI[f]=-b; if(f>0&&f<NFFT/2){ bR[NFFT-f]=a; bI[NFFT-f]=b; } }   // conj for inverse
    fft(bR,bI,oR,oI);
    for(let i=0;i<NFFT;i++) acc[t*HOP+i]+=oR[i]/NFFT*WIN[i];
  }
  const P=NFFT/2; for(let i=0;i<CH;i++) out[i]=acc[i+P]/Math.max(WSUM[i+P],1e-8);
}`;
const STEM_SRC = MDX_DSP + `
importScripts('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/ort.webgpu.min.js');
ort.env.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
ort.env.wasm.numThreads=self.crossOriginIsolated?Math.min(4,navigator.hardwareConcurrency||2):1;
let sess=null, ep='';
async function getModel(urls){
  const cache=await caches.open('cc-models');
  for(const u of urls){
    const abs=new URL(u, self.location.href.startsWith('blob:')?self.__base:self.location.href).href;
    try{
      let r=await cache.match(abs);
      if(!r){ r=await fetch(abs); if(!r.ok) continue;
        const total=+r.headers.get('content-length')||67e6, rd=r.body.getReader(), parts=[]; let got=0;
        while(true){ const {done,value}=await rd.read(); if(done) break; parts.push(value); got+=value.length; postMessage({type:'dl',got,total}); }
        const blob=new Blob(parts); if(blob.size<1e6) continue; await cache.put(abs,new Response(blob)); return await blob.arrayBuffer(); }
      return await r.arrayBuffer();
    }catch(e){}
  }
  throw new Error('AI model download failed (internet needed — ~67 MB the first time)');
}
onmessage=async e=>{
  const d=e.data; self.__base=d.base;
  try{
    if(!sess){
      const buf=await getModel(d.urls);
      postMessage({type:'status',msg:'Opening AI model…'});
      const eps=d.gpu?['webgpu','wasm']:['wasm'];
      for(const p of eps){ try{ sess=await ort.InferenceSession.create(buf,{executionProviders:[p],graphOptimizationLevel:'all'}); ep=p; break; }catch(err){ sess=null; } }
      if(!sess) throw new Error('Could not run the AI model');
    }
    const L=d.L, R=d.R, n=L.length, pad=GEN+TRIM-(n%GEN), tot=TRIM+n+pad;
    const mL=new Float32Array(tot), mR=new Float32Array(tot); mL.set(L,TRIM); mR.set(R,TRIM);
    const oL=new Float32Array(n), oR2=new Float32Array(n), X=new Float32Array(4*DIMF*DIMT), segL=new Float32Array(CH), segR=new Float32Array(CH), tL=new Float32Array(CH), tR=new Float32Array(CH);
    const chunks=Math.floor((tot-CH)/GEN)+1; let w=0; const t0=Date.now();
    for(let k=0;k<chunks;k++){
      const i=k*GEN; segL.set(mL.subarray(i,i+CH)); segR.set(mR.subarray(i,i+CH));
      stftInto(segL,X,0); stftInto(segR,X,1);
      const res=await sess.run({input:new ort.Tensor('float32',X,[1,4,DIMF,DIMT])});
      const Y=res.output.data;
      istftFrom(Y,0,tL); istftFrom(Y,1,tR);
      for(let j=TRIM;j<CH-TRIM && w<n;j++,w++){ oL[w]=tL[j]*d.comp; oR2[w]=tR[j]*d.comp; }
      postMessage({type:'prog',k:k+1,n:chunks,ep,sec:(Date.now()-t0)/1000});
    }
    postMessage({type:'done',L:oL,R:oR2},[oL.buffer,oR2.buffer]);
  }catch(err){ postMessage({type:'error',msg:String(err&&err.message||err)}); }
};`;
let stemWorker = null;
function stopStems(){ if(stemWorker){ stemWorker.terminate(); stemWorker = null; } }
async function decodeRange(it, sr){
  const m = media(it.mediaId), blob = m && mediaBlobs[m.id]; if(!blob) throw new Error('Media file not found');
  const ab = await new OfflineAudioContext(2, 1, sr).decodeAudioData(await blob.arrayBuffer());
  const {from, len} = srcRangeOf(it), s0 = Math.floor(from*sr), n = Math.max(1, Math.min(ab.length - s0, Math.ceil(len*sr)));
  const L = ab.getChannelData(0).slice(s0, s0+n), R = (ab.numberOfChannels > 1 ? ab.getChannelData(1) : ab.getChannelData(0)).slice(s0, s0+n);
  return {L, R, n, name:m.name.replace(/\.[^.]+$/,'')};
}
// which: 'inst' (remove vocals) | 'vocals' (remove music) | 'both' | 'quick' (fast karaoke, no AI)
async function separateStems(it, which, onProg){
  const sr = 44100, {L, R, n, name} = await decodeRange(it, sr);
  let iL, iR;
  if(which === 'quick'){   // centre-channel cancel + keep the bass
    iL = new Float32Array(n); iR = new Float32Array(n); let lp = 0;
    for(let i=0;i<n;i++){ const mid = (L[i]+R[i])/2, side = (L[i]-R[i])/2; lp += (mid - lp)*.02; iL[i] = side + lp; iR[i] = -side + lp; }
    let same = 0; for(let i=0;i<n;i+=97) same += Math.abs(L[i]-R[i]); if(same/(n/97) < 1e-4) throw new Error('This audio is mono — Quick karaoke works only on stereo songs. Use the AI remover.');
  } else {
    stopStems();
    stemWorker = new Worker(URL.createObjectURL(new Blob([STEM_SRC], {type:'text/javascript'})));
    const res = await new Promise((resolve, reject) => {
      stemWorker.onmessage = e => { const d = e.data;
        if(d.type === 'dl') onProg(`⬇ AI model: ${(d.got/1048576).toFixed(0)} / ${(d.total/1048576).toFixed(0)} MB (first time only)`, d.got/d.total);
        else if(d.type === 'status') onProg(d.msg, 0);
        else if(d.type === 'prog'){ const left = d.sec/d.k*(d.n-d.k); onProg(`🎛 ${d.ep === 'webgpu' ? '⚡ GPU' : 'CPU'} · ${d.k}/${d.n} · time left ~${left < 60 ? Math.ceil(left)+' s' : Math.ceil(left/60)+' min'}`, d.k/d.n); }
        else if(d.type === 'note') onProg && onProg('⏳ ' + d.msg, 0);
      else if(d.type === 'done') resolve(d); else if(d.type === 'error') reject(new Error(d.msg)); };
      stemWorker.onerror = e => reject(new Error(e.message || 'worker error'));
      stemWorker.postMessage({L, R, urls:STEM_MODEL_URLS, base:location.href, comp:1.012, gpu:!!navigator.gpu});
    });
    stopStems(); iL = res.L; iR = res.R;
  }
  const out = [];
  const add = async (a, b, label) => { const f = new File([wavMulti([a, b], sr)], `${name} (${label}).wav`, {type:'audio/wav'}); out.push([label, await addAudioMedia(f, n/sr)]); };
  if(which !== 'vocals') await add(iL, iR, which === 'quick' ? 'Karaoke' : 'Instrumental');
  if(which === 'vocals' || which === 'both'){ const vL = new Float32Array(n), vR = new Float32Array(n); for(let i=0;i<n;i++){ vL[i] = L[i] - iL[i]; vR[i] = R[i] - iR[i]; } await add(vL, vR, 'Vocals'); }
  pushUndo();
  const st = itemStart(it), sp = it.speed || 1;
  for(const [label, m] of out){ const a = newAudioItem(m, {kind:'extract', start:st, in:0, dur:m.duration/sp, speed:sp, volume:it.volume||100, linkClip:it.id}); S.audios.push(a); S.sel = a.id; }
  it.prevVolume = it.volume || 100; it.extracted = 'stems'; it.volume = 0;
  afterEdit(); renderMediaPanel();
  return out.length;
}

/* =====================================================================
   v13: PREVIEW SCENES — illustrated pictures used on every effect / transition /
   animation / filter tile (instead of the user's clip or test bars)
   ===================================================================== */
const SCENE_ART = (() => {
  const W = 320, H = 240, R = (a,b) => a + Math.random()*(b-a);
  let seed = 7; const rnd = () => (seed = (seed*16807) % 2147483647) / 2147483647;
  const mk = draw => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); seed = 7; draw(x); const i = new Image(); i.src = c.toDataURL('image/jpeg', .9); return i; };
  const lin = (x, y0, y1, stops) => { const g = x.createLinearGradient(0, y0, 0, y1); stops.forEach(([o,c]) => g.addColorStop(o,c)); return g; };
  const glow = (x, cx, cy, r, col) => { const g = x.createRadialGradient(cx,cy,0,cx,cy,r); g.addColorStop(0,col); g.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(cx-r,cy-r,r*2,r*2); };
  const ridge = (x, base, amp, freq, col, ph) => { x.fillStyle = col; x.beginPath(); x.moveTo(0,H); for(let i=0;i<=W;i+=4){ const y = base - amp*(Math.sin(i*freq+ph)*.6 + Math.sin(i*freq*2.3+ph*1.7)*.3 + Math.sin(i*freq*5.1)*.1); x.lineTo(i,y); } x.lineTo(W,H); x.fill(); };
  const sunset = mk(x => {
    x.fillStyle = lin(x,0,H,[[0,'#1d2b64'],[.35,'#7b3f8f'],[.6,'#f0805a'],[.75,'#ffc46b'],[1,'#ffe3a0']]); x.fillRect(0,0,W,H);
    glow(x,210,150,120,'rgba(255,214,140,.9)'); x.fillStyle = '#fff3c9'; x.beginPath(); x.arc(210,150,22,0,7); x.fill();
    x.globalAlpha = .5; for(let i=0;i<5;i++){ x.fillStyle = '#ffb3a0'; x.beginPath(); x.ellipse(40+i*70, 50+(i%2)*25, 40, 6, 0, 0, 7); x.fill(); } x.globalAlpha = 1;
    ridge(x,175,25,.02,'#4a2a5e',1); ridge(x,195,18,.03,'#2e1b40',3); ridge(x,218,10,.05,'#170d22',5);
  });
  const city = mk(x => {
    x.fillStyle = lin(x,0,H,[[0,'#050816'],[.6,'#1a1747'],[1,'#3b1f5c']]); x.fillRect(0,0,W,H);
    for(let i=0;i<60;i++){ x.fillStyle = `rgba(255,255,255,${rnd()*.8})`; x.fillRect(rnd()*W, rnd()*H*.5, 1, 1); }
    x.fillStyle = '#f5f0d8'; x.beginPath(); x.arc(260,45,14,0,7); x.fill(); glow(x,260,45,40,'rgba(245,240,216,.35)');
    for(let b=0;b<14;b++){ const bw = 18+rnd()*18, bx = b*24-6, bh = 70+rnd()*110; x.fillStyle = '#0b0b1e'; x.fillRect(bx, H-bh, bw, bh);
      for(let wy=H-bh+6; wy<H-6; wy+=8) for(let wx=bx+3; wx<bx+bw-4; wx+=6) if(rnd() > .45){ x.fillStyle = rnd() > .5 ? '#ffd27a' : '#7fd3ff'; x.fillRect(wx, wy, 3, 4); } }
    for(let i=0;i<14;i++){ const c = ['255,120,180','120,200,255','255,210,120'][i%3]; glow(x, rnd()*W, H-10-rnd()*60, 10+rnd()*16, `rgba(${c},.55)`); }
  });
  const beach = mk(x => {
    x.fillStyle = lin(x,0,H*.55,[[0,'#2f8fe0'],[1,'#a9e2ff']]); x.fillRect(0,0,W,H*.55);
    glow(x,70,60,70,'rgba(255,255,220,.9)'); x.fillStyle = '#fffbe6'; x.beginPath(); x.arc(70,60,18,0,7); x.fill();
    x.fillStyle = lin(x,H*.55,H*.78,[[0,'#0f6ea8'],[1,'#26b3c9']]); x.fillRect(0,H*.55,W,H*.23);
    x.globalAlpha = .6; x.strokeStyle = '#fff'; for(let i=0;i<9;i++){ x.beginPath(); x.moveTo(rnd()*W, H*.6+i*4); x.lineTo(rnd()*W, H*.6+i*4); x.stroke(); } x.globalAlpha = 1;
    x.fillStyle = lin(x,H*.76,H,[[0,'#f3d9a4'],[1,'#e2b874']]); x.beginPath(); x.moveTo(0,H*.8); x.quadraticCurveTo(W/2,H*.72,W,H*.8); x.lineTo(W,H); x.lineTo(0,H); x.fill();
    x.strokeStyle = '#3d2a14'; x.lineWidth = 6; x.beginPath(); x.moveTo(250,H); x.quadraticCurveTo(262,150,240,90); x.stroke();
    x.fillStyle = '#1f6b2e'; for(let a=0;a<7;a++){ x.save(); x.translate(240,90); x.rotate(-2.6 + a*.75); x.beginPath(); x.ellipse(28,0,30,7,0,0,7); x.fill(); x.restore(); }
  });
  const flowers = mk(x => {
    x.fillStyle = lin(x,0,H,[[0,'#8fd3ff'],[.45,'#e8f7ff'],[.46,'#7bc96f'],[1,'#2f7d32']]); x.fillRect(0,0,W,H);
    ridge(x,112,10,.02,'#9bbf8a',2);
    for(let i=0;i<220;i++){ const y = 115 + Math.pow(rnd(),.7)*125, s = (y-100)/140*7+1, c = ['#ff4f81','#ffd23f','#ffffff','#b45cff','#ff8c42'][i%5];
      x.fillStyle = '#2d6a2f'; x.fillRect(rnd()*W, y, 1, s*2); const fx = rnd()*W; x.fillStyle = c; for(let p=0;p<5;p++){ x.beginPath(); x.arc(fx+Math.cos(p*1.26)*s*.6, y+Math.sin(p*1.26)*s*.6, s*.5, 0, 7); x.fill(); } x.fillStyle = '#ffde59'; x.beginPath(); x.arc(fx, y, s*.3, 0, 7); x.fill(); }
  });
  const portrait = mk(x => {
    x.fillStyle = lin(x,0,H,[[0,'#ff9a8b'],[.5,'#ff6a88'],[1,'#7b4397']]); x.fillRect(0,0,W,H);
    for(let i=0;i<16;i++) glow(x, rnd()*W, rnd()*H, 10+rnd()*22, `rgba(255,${200+rnd()*55|0},${150+rnd()*100|0},.45)`);
    x.fillStyle = '#2a2140'; x.beginPath(); x.moveTo(90,H); x.quadraticCurveTo(96,175,160,168); x.quadraticCurveTo(224,175,230,H); x.fill();      // shoulders
    x.fillStyle = '#e0a383'; x.fillRect(146,140,28,32);                                                                                         // neck
    x.fillStyle = '#eab08f'; x.beginPath(); x.ellipse(160,112,34,42,0,0,7); x.fill();                                                          // face
    x.fillStyle = '#231a15'; x.beginPath(); x.ellipse(160,92,40,32,0,Math.PI,0); x.fill(); x.beginPath(); x.ellipse(128,120,12,40,.15,0,7); x.fill(); x.beginPath(); x.ellipse(192,120,12,40,-.15,0,7); x.fill();
    x.fillStyle = '#3a2a22'; x.beginPath(); x.arc(147,114,3,0,7); x.arc(173,114,3,0,7); x.fill(); x.strokeStyle = '#b5615a'; x.lineWidth = 2.5; x.beginPath(); x.arc(160,128,9,.2,Math.PI-.2); x.stroke();
    x.fillStyle = 'rgba(255,140,140,.35)'; x.beginPath(); x.arc(140,126,7,0,7); x.arc(180,126,7,0,7); x.fill();
    x.fillStyle = '#20d5ec'; x.fillRect(150,176,20,64);
  });
  const neon = mk(x => {
    x.fillStyle = '#07040f'; x.fillRect(0,0,W,H);
    x.strokeStyle = 'rgba(160,80,255,.25)'; x.lineWidth = 1; for(let i=0;i<=16;i++){ x.beginPath(); x.moveTo(W/2, H*.55); x.lineTo(i*W/16*3 - W, H); x.stroke(); } for(let j=0;j<8;j++){ const y = H*.55 + Math.pow(j/8,2)*H*.45; x.beginPath(); x.moveTo(0,y); x.lineTo(W,y); x.stroke(); }
    const g = x.createLinearGradient(0,40,0,130); g.addColorStop(0,'#ffe26a'); g.addColorStop(1,'#ff3d9a'); x.fillStyle = g; x.beginPath(); x.arc(W/2,110,56,Math.PI,0); x.fill();
    x.fillStyle = '#07040f'; for(let i=0;i<5;i++) x.fillRect(W/2-60, 70+i*9, 120, 2+i*.8);
    x.shadowBlur = 14; x.lineWidth = 3; [['#00f0ff',40,170,120,40],['#ff2bd6',200,150,90,70]].forEach(([c,a,b,w,h]) => { x.shadowColor = c; x.strokeStyle = c; x.strokeRect(a,b,w,h); }); x.shadowBlur = 0;
  });
  const lake = mk(x => {
    x.fillStyle = lin(x,0,H*.5,[[0,'#0e3b5c'],[1,'#7fc8d8']]); x.fillRect(0,0,W,H*.5);
    ridge(x,H*.5,55,.015,'#1f4e5f',2); ridge(x,H*.5,30,.03,'#163b45',4);
    x.save(); x.translate(0,H); x.scale(1,-1); x.globalAlpha = .55; x.drawImage(x.canvas,0,0,W,H*.5,0,0,W,H*.5); x.restore(); x.globalAlpha = 1;
    x.fillStyle = 'rgba(30,90,110,.35)'; x.fillRect(0,H*.5,W,H*.5);
    for(let t=0;t<9;t++){ const tx = t*38+10, th = 50+rnd()*30; x.fillStyle = '#0b2a22'; x.beginPath(); x.moveTo(tx,H*.5-th); x.lineTo(tx-12,H*.5); x.lineTo(tx+12,H*.5); x.fill(); }
  });
  return {sunset, city, beach, flowers, portrait, neon, lake, list:[sunset, city, beach, flowers, portrait, neon, lake]};
})();
/* v14: real photographs replace the drawn scenes.
   Bundled (always available, offline): previews/*.jpg — CC0 / public-domain / CC-BY photos (see README credits).
   Extra pack: free Unsplash-licensed photos from picsum.photos, loaded when online and cached by the service worker. */
const PHOTO_LOCAL = ['temple','flower','coffee','cat','rocket','space'];
const PHOTO_REMOTE = [1015,1018,1039,1043,1050,1067,1069,1074,1080,1011,1027,1005,64,91,338,1062];
const PHOTOS = {}, PHOTO_ORDER = [], PHOTO_RANK = [...PHOTO_LOCAL, ...PHOTO_REMOTE.map(i => 'r' + i)];
let photoVer = 0, photoT = null;
function photoLoaded(k, img){ PHOTOS[k] = img; PHOTO_ORDER.push(k); PHOTO_ORDER.sort((a,b) => PHOTO_RANK.indexOf(a) - PHOTO_RANK.indexOf(b)); photoVer++; clearTimeout(photoT); photoT = setTimeout(() => { if(typeof refreshPreviews === 'function') refreshPreviews(); }, 350); }
function loadPhotos(){
  PHOTO_LOCAL.forEach(k => { const i = new Image(); i.onload = () => photoLoaded(k, i); i.src = 'previews/' + k + '.jpg'; });
  if(navigator.onLine === false) return;
  PHOTO_REMOTE.forEach((id, n) => setTimeout(() => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => { if(i.naturalWidth > 8) photoLoaded('r' + id, i); }; i.src = `https://picsum.photos/id/${id}/360/240`; }, 400 + n*60));
}
loadPhotos();
const PHOTO_ROLE = {sunset:['r1015','temple'], city:['r1067','rocket'], beach:['r1050','coffee'], flowers:['flower'], portrait:['r1027','r64','cat'], neon:['space','r1069'], lake:['r1018','temple']};
const SCENES = {
  get list(){ const l = PHOTO_ORDER.map(k => PHOTOS[k]); return l.length >= 3 ? l : SCENE_ART.list; },
  get ver(){ return photoVer; }
};
Object.keys(PHOTO_ROLE).forEach(role => Object.defineProperty(SCENES, role, {get(){ for(const k of PHOTO_ROLE[role]) if(PHOTOS[k]) return PHOTOS[k]; const l = PHOTO_ORDER.map(k => PHOTOS[k]); return l.length ? l[role.length % l.length] : SCENE_ART[role]; }}));
const SCENE_FOR = {Trending:'portrait', Cinematic:'sunset', Party:'neon', Light:'city', Retro:'beach', Glitch:'neon', Lens:'flowers', Motion:'lake', Split:'portrait', Weather:'lake', Color:'flowers', All:'beach', body:'portrait'};
function sceneFor(key, i){ if(SCENES[SCENE_FOR[key]]) return SCENES[SCENE_FOR[key]]; return SCENES.list[(i||0) % SCENES.list.length]; }

/* =====================================================================
   v13: AUTO THUMBNAIL — picks the best frames of YOUR video, cuts out the
   person with AI (when possible) and builds YouTube / Instagram style designs
   ===================================================================== */
const THUMB_SIZES = [['yt','YouTube 1280×720',1280,720],['shorts','Shorts / Reels 1080×1920',1080,1920],['insta','Instagram 1080×1080',1080,1080],['insta45','Instagram 1080×1350',1080,1350],['fb','Facebook 1200×630',1200,630]];
const isKn = s => /[^\u0000-\u024F\u2000-\u206F\u20A0-\u20CF\s\p{Emoji}]/u.test(s);   // any non-Latin script (Kannada, Hindi, Tamil, Urdu…)
const SCRIPT_FONT = [[/[\u0C80-\u0CFF]/,'Baloo Tamma 2'],[/[\u0900-\u097F]/,'Baloo 2'],[/[\u0B80-\u0BFF]/,'Baloo Thambi 2'],[/[\u0C00-\u0C7F]/,'Baloo Tammudu 2'],[/[\u0D00-\u0D7F]/,'Baloo Chettan 2'],[/[\u0980-\u09FF]/,'Baloo Da 2'],[/[\u0A80-\u0AFF]/,'Baloo Bhai 2'],[/[\u0A00-\u0A7F]/,'Baloo Paaji 2'],[/[\u0B00-\u0B7F]/,'Baloo Bhaina 2'],[/[\u0600-\u06FF]/,'Lalezar']];
const scriptFont = s => { for(const [re, f] of SCRIPT_FONT) if(re.test(s)) return f; return null; };
let THUMB_FONT = '', THUMB_THEME = null, THUMB_SCALE = 1;
const autoFont = s => THUMB_FONT ? `"${THUMB_FONT}","${scriptFont(s)||'Anton'}",sans-serif` : isKn(s) ? `"${scriptFont(s)||'Baloo 2'}","Noto Sans Kannada",sans-serif` : 'Anton,Impact,sans-serif';
const caseT = s => isKn(s) || /Script|Vibes|Pacifico|Lobster|Satisfy|Sacramento|Allura|Parisienne|Yellowtail|Cookie|Courgette|Brush|Tangerine|Dafoe|Doulaise|Caveat|Dancing/.test(THUMB_FONT) ? s : s.toUpperCase();
function autoTitle(){
  const nm = S.project && S.project.name || '';
  if(nm && !/^Project \d+$/.test(nm)) return nm;
  const t = S.overlays.filter(o => o.type === 'text' && !o.caption && o.text && o.text.trim().length > 2).sort((a,b) => (b.size||0) - (a.size||0))[0];
  if(t) return t.text.split('\n')[0];
  const cap = S.overlays.filter(o => o.caption).sort((a,b) => a.start - b.start)[0];
  if(cap) return cap.text.split(/\s+/).slice(0,5).join(' ');
  return 'My Video';
}
// ---- frame analysis ----
function frameStats(cnv){
  const s = document.createElement('canvas'); s.width = 64; s.height = 64; const x = s.getContext('2d', {willReadFrequently:true}); x.drawImage(cnv, 0, 0, 64, 64);
  const d = x.getImageData(0,0,64,64).data, L = new Float32Array(4096); let sum = 0, rg = 0, yb = 0, rg2 = 0, yb2 = 0; const hue = new Float32Array(12);
  for(let i=0;i<4096;i++){ const r = d[i*4], g = d[i*4+1], b = d[i*4+2]; L[i] = .299*r + .587*g + .114*b; sum += L[i];
    const a = r - g, c = (r+g)/2 - b; rg += a; yb += c; rg2 += a*a; yb2 += c*c;
    const mx = Math.max(r,g,b), mn = Math.min(r,g,b), sat = mx ? (mx-mn)/mx : 0;
    if(sat > .35 && mx > 60){ let h = mx === r ? (g-b)/(mx-mn) : mx === g ? 2 + (b-r)/(mx-mn) : 4 + (r-g)/(mx-mn); h = ((h*60)+360)%360; hue[Math.floor(h/30)] += sat; } }
  let lap = 0; for(let y=1;y<63;y++) for(let xx=1;xx<63;xx++){ const i = y*64+xx, v = 4*L[i] - L[i-1] - L[i+1] - L[i-64] - L[i+64]; lap += v*v; }
  const mean = sum/4096, n = 4096, sdRG = Math.sqrt(rg2/n - (rg/n)**2), sdYB = Math.sqrt(yb2/n - (yb/n)**2);
  const colorful = Math.sqrt(sdRG**2 + sdYB**2) + .3*Math.sqrt((rg/n)**2 + (yb/n)**2);
  let hb = 0; for(let i=1;i<12;i++) if(hue[i] > hue[hb]) hb = i;
  return {sharp:Math.log(1 + lap/3844), bright:mean/255, colorful, hue:hb*30 + 15, sig:Array.from({length:16}, (_,k) => L[(k>>2)*16*64 + (k&3)*16 + 8*64 + 8])};
}
async function personMask(cnv){
  try{ await Promise.race([loadSeg(), new Promise((_,r) => setTimeout(() => r(new Error('t')), 6000))]); }catch(e){ return null; }
  if(!SEG) return null;
  return new Promise(res => { try{
    segTs = Math.max(segTs + 1, performance.now());
    SEG.segmentForVideo(cnv, segTs, r => { const m = r.confidenceMasks && r.confidenceMasks[0]; if(!m){ res(null); return; }
      const f = m.getAsFloat32Array(), w = m.width, h = m.height, mc = document.createElement('canvas'); mc.width = w; mc.height = h;
      const mx = mc.getContext('2d'), id = mx.createImageData(w, h); let cov = 0, x0 = w, y0 = h, x1 = 0, y1 = 0;
      for(let i=0;i<f.length;i++){ const a = Math.max(0, Math.min(1, (f[i]-.35)/.3)); id.data[i*4+3] = a*255; if(a > .5){ cov++; const xx = i%w, yy = (i/w)|0; if(xx<x0) x0=xx; if(xx>x1) x1=xx; if(yy<y0) y0=yy; if(yy>y1) y1=yy; } }
      mx.putImageData(id, 0, 0);
      res(cov/f.length > .03 ? {mask:mc, cov:cov/f.length, box:[x0/w, y0/h, x1/w, y1/h]} : null);
    });
  }catch(e){ res(null); } });
}
async function collectThumbFrames(n, onProg){
  pause(); const t0 = S.time, fr = [], N = Math.max(4, n);
  soloMain = true;
  try{
    for(let i=0;i<N;i++){
      const t = S.total*(.06 + .88*i/(N-1)); onProg && onProg(`🎞 Analysing frames ${i+1}/${N}`, i/N*.8);
      await renderAt(t); const k = Math.min(1, 1280/Math.max(out.width, out.height)), c = document.createElement('canvas');
      c.width = Math.round(out.width*k); c.height = Math.round(out.height*k); c.getContext('2d').drawImage(out, 0, 0, c.width, c.height);
      fr.push({c, t, st:frameStats(c)});
    }
  } finally { soloMain = false; seek(t0); }
  return fr;
}
function pickFrames(frames, k){
  const sc = f => f.st.sharp*1.2 + Math.min(f.st.colorful/60, 1.2) - Math.abs(f.st.bright - .5)*1.6 + (f.seg ? .9 + Math.min(f.seg.cov, .35)*2 : 0);
  const sorted = [...frames].sort((a,b) => sc(b) - sc(a)), pick = [];
  for(const f of sorted){ if(pick.length >= k) break; if(pick.some(p => p.st.sig.reduce((s,v,i) => s + Math.abs(v - f.st.sig[i]), 0)/16 < 10)) continue; pick.push(f); }
  for(const f of sorted) if(pick.length < k && !pick.includes(f)) pick.push(f);
  return pick;
}
// ---- drawing helpers ----
function tGrade(src, o){ const c = document.createElement('canvas'); c.width = src.width; c.height = src.height; const x = c.getContext('2d'); x.filter = `contrast(${o.c||1.12}) saturate(${o.s||1.3}) brightness(${o.b||1.04})${o.blur?` blur(${o.blur}px)`:''}`; x.drawImage(src, 0, 0); return c; }
function cover(x, img, X, Y, W, H, fx, fy){ const k = Math.max(W/img.width, H/img.height), w = img.width*k, h = img.height*k; x.drawImage(img, X + (W-w)*(fx ?? .5), Y + (H-h)*(fy ?? .5), w, h); }
function cutout(frame, seg, outline, color){
  const c = document.createElement('canvas'); c.width = frame.width; c.height = frame.height; const x = c.getContext('2d');
  x.drawImage(tGrade(frame, {c:1.15, s:1.25, b:1.06}), 0, 0); x.globalCompositeOperation = 'destination-in'; x.imageSmoothingQuality = 'high'; x.drawImage(seg.mask, 0, 0, c.width, c.height);
  if(!outline) return c;
  const o = document.createElement('canvas'), pad = outline*2; o.width = c.width + pad*2; o.height = c.height + pad*2; const ox = o.getContext('2d');
  const sil = document.createElement('canvas'); sil.width = c.width; sil.height = c.height; const sx = sil.getContext('2d'); sx.drawImage(c, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = color || '#fff'; sx.fillRect(0, 0, c.width, c.height);
  for(let a=0;a<16;a++){ ox.drawImage(sil, pad + Math.cos(a/16*Math.PI*2)*outline, pad + Math.sin(a/16*Math.PI*2)*outline); }
  ox.drawImage(c, pad, pad); return o;
}
function wrapTitle(x, text, maxW, maxLines, px0, font, minPx){
  let px = px0;
  for(;;){ x.font = `900 ${px}px ${font}`; const words = text.split(/\s+/), lines = []; let cur = '';
    for(const w of words){ const t = cur ? cur + ' ' + w : w; if(x.measureText(t).width <= maxW || !cur) cur = t; else { lines.push(cur); cur = w; } }
    if(cur) lines.push(cur);
    if((lines.length <= maxLines && lines.every(l => x.measureText(l).width <= maxW)) || px <= (minPx||14)) return {lines, px};
    px = Math.floor(px*.9); }
}
function drawTitle(x, text, cx, cy, maxW, maxLines, px0, st, align, font){
  font = (THUMB_FONT && !font) ? autoFont(text) : (font || autoFont(text)); px0 *= THUMB_SCALE;
  if(THUMB_THEME && !(st && st.keep)) st = THUMB_THEME;
  const T = caseT(text), {lines, px} = wrapTitle(x, T, maxW, maxLines, px0, font);
  x.save(); x.font = `900 ${px}px ${font}`; x.textAlign = align || 'center'; x.textBaseline = 'middle';
  const lh = px*1.08, y0 = cy - (lines.length-1)*lh/2;
  lines.forEach((l,i) => drawStyledText(x, l, cx, y0 + i*lh, px, typeof st === 'function' ? st(i) : st)); x.restore();
  return {h:lines.length*lh, px};
}
const hsl = (h,s,l) => `hsl(${h},${s}%,${l}%)`;
function arrowShape(x, x0, y0, x1, y1, w, col){
  const a = Math.atan2(y1-y0, x1-x0), L = Math.hypot(x1-x0, y1-y0); x.save(); x.translate(x0, y0); x.rotate(a);
  x.fillStyle = col; x.strokeStyle = '#000'; x.lineWidth = w*.18; x.beginPath(); x.moveTo(0,-w*.25); x.lineTo(L-w,-w*.25); x.lineTo(L-w,-w*.6); x.lineTo(L,0); x.lineTo(L-w,w*.6); x.lineTo(L-w,w*.25); x.lineTo(0,w*.25); x.closePath(); x.stroke(); x.fill(); x.restore();
}
function badge(x, text, X, Y, px, bg, fg){ x.save(); x.font = `900 ${px}px Anton,Impact,sans-serif`; const w = x.measureText(text).width + px*.8; x.translate(X, Y); x.rotate(-.08); x.fillStyle = bg; x.shadowColor = '#0008'; x.shadowBlur = px*.4; x.beginPath(); x.roundRect ? x.roundRect(-w/2, -px*.65, w, px*1.3, px*.25) : x.rect(-w/2, -px*.65, w, px*1.3); x.fill(); x.shadowBlur = 0; x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 0, px*.04); x.restore(); }
// ---- layouts ----
const THUMB_LAYOUTS = {
  popout(x, W, H, F, o){   // blurred tinted background + big cut-out person + huge title
    const f = F[0], hue = f.st.hue, v = H > W;
    cover(x, tGrade(f.c, {blur:Math.round(Math.max(W,H)/60), b:.75, s:1.4}), 0, 0, W, H);
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, `hsla(${hue},80%,25%,.93)`); g.addColorStop(1, `hsla(${(hue+40)%360},90%,45%,.4)`); x.fillStyle = g; x.fillRect(0,0,W,H);
    const u = Math.min(W,H);
    if(f.seg){ const co = cutout(f.c, f.seg, u*.012, '#fff'), b = f.seg.box, bw = (b[2]-b[0])*f.c.width, bh = (b[3]-b[1])*f.c.height;
      const k = (v ? H*.62 : H*1.02)/Math.max(bh, f.c.height*.4), dx = v ? W/2 - (b[0]+b[2])/2*f.c.width*k : W*.72 - (b[0]+b[2])/2*f.c.width*k, dy = H - (b[3]*f.c.height + 4)*k;
      x.save(); x.shadowColor = hsl(hue,100,60); x.shadowBlur = u*.05; x.drawImage(co, dx - u*.024*k, dy - u*.024*k, co.width*k, co.height*k); x.restore(); }
    else { x.save(); x.shadowColor = '#000c'; x.shadowBlur = u*.04; const cw = v ? W*.86 : W*.5, ch = v ? H*.42 : H*.7; x.translate(v ? W/2 : W*.7, v ? H*.66 : H*.5); x.rotate(.04); x.fillStyle = '#fff'; x.fillRect(-cw/2-8, -ch/2-8, cw+16, ch+16); x.shadowBlur = 0; cover(x, tGrade(f.c, {}), -cw/2, -ch/2, cw, ch); x.restore(); }
    drawTitle(x, o.title, v ? W/2 : W*.3, v ? H*.2 : H*.45, v ? W*.88 : W*.52, 3, u*.2, i => i%2 ? TFX_MAP.fire.st : {fill:'#ffffff', strokes:[[7,'#000000']], shadow:[0,6,10,'#000c']});
    if(o.sub) badge(x, o.sub, v ? W/2 : W*.24, v ? H*.33 : H*.82, u*.06, '#e62117', '#fff');
    if(!v) arrowShape(x, W*.4, H*.78, W*.52, H*.62, u*.08, '#ffe600');
  },
  banner(x, W, H, F, o){   // full frame + strong colour banner
    const f = F[0], u = Math.min(W,H); cover(x, tGrade(f.c, {c:1.18, s:1.35}), 0, 0, W, H);
    const vg = x.createRadialGradient(W/2,H/2,u*.3,W/2,H/2,Math.max(W,H)*.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.65)'); x.fillStyle = vg; x.fillRect(0,0,W,H);
    const bh = H*(H > W ? .2 : .3), by = H - bh*1.15; x.save(); x.translate(0, by); x.rotate(-.03); x.fillStyle = '#ffd400'; x.fillRect(-20, 0, W+40, bh); x.fillStyle = '#000'; x.fillRect(-20, bh*.92, W+40, bh*.08); x.restore();
    { const fnt = autoFont(o.title), one = wrapTitle(x, caseT(o.title), W*.92, 1, bh*.62, fnt, bh*.2);
      drawTitle(x, o.title, W/2, by + bh*.48, W*.92, one.px >= bh*.4 ? 1 : 2, one.px >= bh*.4 ? bh*.62 : bh*.42, {fill:'#111111', shadow:[0,0,0,'#0000'], keep:true}); }
    if(o.sub) badge(x, o.sub, W*.18, H*.12, u*.07, '#e62117', '#fff');
  },
  compare(x, W, H, F, o){   // two moments side by side
    const a = F[0], b = F[1] || F[0], v = H > W, u = Math.min(W,H);
    x.save(); x.beginPath(); v ? (x.moveTo(0,0), x.lineTo(W,0), x.lineTo(W,H*.46), x.lineTo(0,H*.54)) : (x.moveTo(0,0), x.lineTo(W*.54,0), x.lineTo(W*.46,H), x.lineTo(0,H)); x.clip(); cover(x, tGrade(a.c,{}), 0, 0, v?W:W*.56, v?H*.56:H); x.restore();
    x.save(); x.beginPath(); v ? (x.moveTo(0,H*.54), x.lineTo(W,H*.46), x.lineTo(W,H), x.lineTo(0,H)) : (x.moveTo(W*.54,0), x.lineTo(W,0), x.lineTo(W,H), x.lineTo(W*.46,H)); x.clip(); cover(x, tGrade(b.c,{s:1.5}), v?0:W*.44, v?H*.44:0, v?W:W*.56, v?H*.56:H); x.restore();
    x.strokeStyle = '#fff'; x.lineWidth = u*.018; x.beginPath(); v ? (x.moveTo(0,H*.54), x.lineTo(W,H*.46)) : (x.moveTo(W*.54,0), x.lineTo(W*.46,H)); x.stroke();
    x.save(); x.translate(W/2, H/2); x.fillStyle = '#e62117'; x.beginPath(); x.arc(0,0,u*.11,0,7); x.fill(); x.lineWidth = u*.012; x.strokeStyle = '#fff'; x.stroke(); x.restore();
    drawTitle(x, 'VS', W/2, H/2, u*.2, 1, u*.11, {fill:'#fff'});
    x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 0, W, H*(v ? .14 : .2));
    drawTitle(x, o.title, W/2, H*(v ? .07 : .1), W*.9, 1, H*(v ? .06 : .12), {fill:'#ffffff', strokes:[[5,'#000']]});
  },
  collage(x, W, H, F, o){
    const u = Math.min(W,H), v = H > W, g = u*.02; x.fillStyle = '#111'; x.fillRect(0,0,W,H);
    const cells = v ? [[0,0,W,H*.5],[0,H*.5,W/2,H*.3],[W/2,H*.5,W/2,H*.3]] : [[0,0,W*.62,H],[W*.62,0,W*.38,H*.5],[W*.62,H*.5,W*.38,H*.5]];
    cells.forEach((cl,i) => { const f = F[i % F.length]; cover(x, tGrade(f.c,{}), cl[0]+g, cl[1]+g, cl[2]-g*2, cl[3]-g*2); });
    const by = v ? H*.8 : H*.7, bh = v ? H*.2 : H*.3; const gr = x.createLinearGradient(0, by, 0, H); gr.addColorStop(0,'rgba(0,0,0,0)'); gr.addColorStop(.35,'rgba(0,0,0,.85)'); x.fillStyle = gr; x.fillRect(0, by-bh*.3, W, H);
    drawTitle(x, o.title, W/2, by + bh*.45, W*.92, 2, bh*.42, TFX_MAP.kannadaGold.st);
  },
  neon(x, W, H, F, o){
    const f = F[0], u = Math.min(W,H), v = H > W;
    cover(x, tGrade(f.c, {b:.35, s:.6, blur:Math.round(u/80)}), 0, 0, W, H);
    const g = x.createLinearGradient(0,0,W,0); g.addColorStop(0,'rgba(255,0,170,.35)'); g.addColorStop(1,'rgba(0,220,255,.35)'); x.fillStyle = g; x.fillRect(0,0,W,H);
    x.strokeStyle = 'rgba(0,240,255,.25)'; x.lineWidth = 1; for(let i=0;i<20;i++){ x.beginPath(); x.moveTo(0, H*.7 + i*i*H*.002); x.lineTo(W, H*.7 + i*i*H*.002); x.stroke(); }
    if(f.seg){ const co = cutout(f.c, f.seg, u*.008, '#00f0ff'), b = f.seg.box, bh = (b[3]-b[1])*f.c.height, k = (v ? H*.6 : H*.95)/Math.max(bh, f.c.height*.4);
      x.save(); x.shadowColor = '#ff2bd6'; x.shadowBlur = u*.06; x.drawImage(co, W/2 - (b[0]+b[2])/2*f.c.width*k, H - b[3]*f.c.height*k, co.width*k, co.height*k); x.restore(); }
    else { x.save(); x.shadowColor = '#ff2bd6'; x.shadowBlur = u*.05; const cw = v ? W*.8 : W*.46, ch = cw*.62; x.strokeStyle = '#00f0ff'; x.lineWidth = u*.01; cover(x, tGrade(f.c,{}), W/2-cw/2, H*.62-ch/2, cw, ch); x.strokeRect(W/2-cw/2, H*.62-ch/2, cw, ch); x.restore(); }
    drawTitle(x, o.title, W/2, H*(v ? .18 : .2), W*.92, 2, u*.17, TFX_MAP.neonPink.st);
    if(o.sub) drawTitle(x, o.sub, W/2, H*(v ? .32 : .37), W*.8, 1, u*.07, TFX_MAP.neonBlue.st);
  },
  cinematic(x, W, H, F, o){
    const f = F[0], u = Math.min(W,H); const c = tGrade(f.c, {c:1.2, s:1.1}); cover(x, c, 0, 0, W, H);
    x.save(); x.globalCompositeOperation = 'soft-light'; const g = x.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0a5c7a'); g.addColorStop(1,'#ff8a3d'); x.fillStyle = g; x.fillRect(0,0,W,H); x.restore();
    const bar = H*.12; x.fillStyle = '#000'; x.fillRect(0,0,W,bar); x.fillRect(0,H-bar,W,bar);
    const cf = THUMB_FONT ? autoFont(o.title) : isKn(o.title) ? autoFont(o.title) : '"Bebas Neue",Oswald,sans-serif';
    x.save(); x.font = `${u*.13}px ${cf}`; if(!isKn(o.title)) x.letterSpacing = (u*.02)+'px';
    const T = caseT(o.title); x.textAlign = 'center'; x.textBaseline = 'middle';
    const {lines, px} = wrapTitle(x, T, W*.85, 2, u*.15*THUMB_SCALE, cf);
    x.font = `${px}px ${cf}`; lines.forEach((l,i) => drawStyledText(x, l, W/2, H*.5 + (i-(lines.length-1)/2)*px*1.05, px, THUMB_THEME || {fill:['#ffffff','#e8d9b0'], shadow:[0,4,20,'#000']}));
    if(o.sub){ x.font = `600 ${u*.04}px Montserrat,sans-serif`; x.fillStyle = '#ddd'; x.fillText(o.sub.toUpperCase(), W/2, H - bar*.5); } x.restore();
  },
  zoomcircle(x, W, H, F, o){
    const f = F[0], u = Math.min(W,H), v = H > W; cover(x, tGrade(f.c, {c:1.15, s:1.3}), 0, 0, W, H);
    x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0,0,W,H);
    const b = f.seg ? f.seg.box : [.35,.3,.65,.7], fx = (b[0]+b[2])/2, fy = b[1] + (b[3]-b[1])*.3, r = u*.27, cx = v ? W/2 : W*.68, cy = v ? H*.58 : H*.55;
    x.save(); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.clip(); const k = 2.2*Math.max(W/f.c.width, H/f.c.height); x.drawImage(tGrade(f.c,{s:1.4}), cx - fx*f.c.width*k, cy - fy*f.c.height*k, f.c.width*k, f.c.height*k); x.restore();
    x.lineWidth = u*.02; x.strokeStyle = '#e62117'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
    drawTitle(x, o.title, v ? W/2 : W*.28, v ? H*.18 : H*.42, v ? W*.9 : W*.5, 3, u*.16, {fill:'#ffe600', strokes:[[8,'#000']], shadow:[0,6,10,'#000c']});
    arrowShape(x, v ? W*.2 : W*.36, v ? H*.36 : H*.72, cx - r*.85, cy + (v ? -r*.5 : r*.2), u*.07, '#e62117');
  },
  gradient(x, W, H, F, o){
    const f = F[0], u = Math.min(W,H), v = H > W, h = f.st.hue;
    const g = x.createLinearGradient(0,0,W,H); g.addColorStop(0, hsl(h,90,55)); g.addColorStop(1, hsl((h+60)%360,90,35)); x.fillStyle = g; x.fillRect(0,0,W,H);
    x.globalAlpha = .18; x.fillStyle = '#fff'; for(let i=0;i<14;i++){ x.beginPath(); x.arc(((i*97)%W), ((i*53)%H), u*(.03 + (i%3)*.02), 0, 7); x.fill(); } x.globalAlpha = 1;
    if(f.seg){ const co = cutout(f.c, f.seg, u*.014, '#fff'), b = f.seg.box, bh = (b[3]-b[1])*f.c.height, k = (v ? H*.6 : H*.88)/Math.max(bh, f.c.height*.4);
      x.save(); x.shadowColor = '#0009'; x.shadowBlur = u*.04; x.drawImage(co, (v ? W/2 : W*.7) - (b[0]+b[2])/2*f.c.width*k, H - b[3]*f.c.height*k - 2, co.width*k, co.height*k); x.restore(); }
    else { x.save(); x.shadowColor = '#000a'; x.shadowBlur = u*.05; const cw = v ? W*.84 : W*.48, ch = cw*(v ? .75 : .62), cx = v ? W/2 : W*.72, cy = v ? H*.66 : H*.52; x.beginPath(); x.roundRect ? x.roundRect(cx-cw/2, cy-ch/2, cw, ch, u*.04) : x.rect(cx-cw/2, cy-ch/2, cw, ch); x.clip(); cover(x, tGrade(f.c,{}), cx-cw/2, cy-ch/2, cw, ch); x.restore(); }
    drawTitle(x, o.title, v ? W/2 : W*.3, v ? H*.2 : H*.45, v ? W*.9 : W*.52, 3, u*.18, {fill:'#ffffff', strokes:[[6,hsl(h,90,20)]], extrude:[6,hsl(h,90,15)]});
    if(o.sub) badge(x, o.sub, v ? W/2 : W*.3, v ? H*.33 : H*.8, u*.06, '#ffffff', hsl(h,90,30));
  }
};
THUMB_LAYOUTS.split = function(x, W, H, F, o){   // solid colour panel + photo with a diagonal edge
  const f = F[0], u = Math.min(W,H), v = H > W, h = f.st.hue, ac = hsl((h+180)%360, 85, 50);
  cover(x, tGrade(f.c, {c:1.15, s:1.3}), v ? 0 : W*.35, v ? H*.35 : 0, v ? W : W*.65, v ? H*.65 : H);
  x.save(); x.fillStyle = '#111'; x.beginPath(); if(v){ x.moveTo(0,0); x.lineTo(W,0); x.lineTo(W,H*.36); x.lineTo(0,H*.46); } else { x.moveTo(0,0); x.lineTo(W*.5,0); x.lineTo(W*.4,H); x.lineTo(0,H); } x.closePath(); x.fill();
  x.strokeStyle = ac; x.lineWidth = u*.025; x.beginPath(); if(v){ x.moveTo(0,H*.46); x.lineTo(W,H*.36); } else { x.moveTo(W*.5,0); x.lineTo(W*.4,H); } x.stroke(); x.restore();
  if(f.seg){ const co = cutout(f.c, f.seg, u*.01, '#fff'), b = f.seg.box, bh = (b[3]-b[1])*f.c.height, k = (v ? H*.55 : H*.95)/Math.max(bh, f.c.height*.4);
    x.save(); x.shadowColor = '#000a'; x.shadowBlur = u*.04; x.drawImage(co, (v ? W/2 : W*.72) - (b[0]+b[2])/2*f.c.width*k, H - b[3]*f.c.height*k, co.width*k, co.height*k); x.restore(); }
  drawTitle(x, o.title, v ? W/2 : W*.23, v ? H*.18 : H*.46, v ? W*.88 : W*.4, 4, u*.16, i => i === 0 ? {fill:ac, shadow:[0,4,0,'#000']} : {fill:'#ffffff', shadow:[0,4,0,'#000']});
  if(o.sub) badge(x, o.sub, v ? W/2 : W*.2, v ? H*.31 : H*.86, u*.055, ac, '#fff');
};
THUMB_LAYOUTS.polaroid = function(x, W, H, F, o){   // tilted photo prints on a soft colour background
  const u = Math.min(W,H), v = H > W, h = F[0].st.hue;
  const g = x.createRadialGradient(W/2, H/2, u*.1, W/2, H/2, Math.max(W,H)*.75); g.addColorStop(0, hsl(h,60,88)); g.addColorStop(1, hsl((h+30)%360,55,62)); x.fillStyle = g; x.fillRect(0,0,W,H);
  const pw = v ? W*.62 : W*.3, ph = pw*.92, spots = v ? [[W*.36,H*.5,-.12],[W*.64,H*.62,.1],[W*.5,H*.8,-.04]] : [[W*.2,H*.6,-.13],[W*.5,H*.56,.05],[W*.8,H*.62,.12]];
  spots.forEach(([cx,cy,r],i) => { const f = F[i % F.length]; x.save(); x.translate(cx,cy); x.rotate(r); x.shadowColor = '#0006'; x.shadowBlur = u*.03; x.shadowOffsetY = u*.01; x.fillStyle = '#fff'; x.fillRect(-pw/2, -ph/2, pw, ph*1.12); x.shadowColor = 'transparent';
    cover(x, tGrade(f.c, {s:1.25}), -pw/2 + pw*.05, -ph/2 + pw*.05, pw*.9, ph*.86); x.fillStyle = 'rgba(255,240,180,.75)'; x.rotate(-r*1.5); x.fillRect(-pw*.12, -ph/2 - u*.02, pw*.24, u*.045); x.restore(); });
  drawTitle(x, o.title, W/2, H*(v ? .16 : .17), W*.92, 2, u*.14, {fill:'#ffffff', strokes:[[8,hsl(h,70,25)]], shadow:[0,6,0,hsl(h,70,20)]});
  if(o.sub) badge(x, o.sub, W*.85, H*(v ? .28 : .32), u*.055, '#e62117', '#fff');
};
const THUMB_ORDER = ['popout','banner','zoomcircle','split','gradient','neon','cinematic','polaroid','collage','compare'];
const THUMB_THEMES = {auto:null, white:{fill:'#ffffff', strokes:[[7,'#000000']], shadow:[0,6,10,'#000c']}, yellow:{fill:'#ffe600', strokes:[[8,'#000000']], shadow:[0,6,10,'#000c']},
  fire:'fire', gold:'kannadaGold', neon:'neonPink', ice:'neonBlue', red:{fill:'#ffffff', strokes:[[5,'#e62117'],[9,'#000000']]}, pastel:{fill:['#ffd1f0','#c9e7ff'], strokes:[[6,'#3b1d5e']]}};
async function makeThumbnails(opt, onProg){
  let frames = opt.frames;
  if(!frames){ frames = await collectThumbFrames(opt.n || 10, onProg); }
  if(opt.photos) for(const p of opt.photos) frames.unshift({c:p, t:-1, st:frameStats(p), user:true});
  onProg && onProg('🤖 Detecting people (AI)…', .8);
  const top = pickFrames(frames, 5);
  for(const f of top) if(f.seg === undefined) f.seg = await personMask(f.c);
  const ranked = pickFrames(frames, 5), [W, H] = (THUMB_SIZES.find(s => s[0] === opt.size) || THUMB_SIZES[0]).slice(2);
  thumbStyle(opt);
  const order = opt.shuffle ? [...THUMB_ORDER].sort(() => Math.random() - .5) : THUMB_ORDER, res = [];
  order.forEach((name, i) => {
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    const off = opt.shuffle ? Math.floor(Math.random()*ranked.length) : i;
    const F = [ranked[off % ranked.length], ranked[(off+1) % ranked.length], ranked[(off+2) % ranked.length]];
    try{ THUMB_LAYOUTS[name](x, W, H, F, opt); res.push({name, c, F}); }catch(e){ console.warn('thumb', name, e); }
  });
  return {thumbs:res, frames};
}

function thumbStyle(opt){ THUMB_FONT = opt.font || ''; THUMB_SCALE = (opt.scale || 100)/100; const th = THUMB_THEMES[opt.theme || 'auto']; THUMB_THEME = !th ? null : typeof th === 'string' ? (TFX_MAP[th] || {}).st || null : th; }
function renderThumb(t, W, H, opt){ thumbStyle(opt); const c = document.createElement('canvas'); c.width = W; c.height = H; THUMB_LAYOUTS[t.name](c.getContext('2d'), W, H, t.F, opt); return c; }
async function thumbFonts(extra, sample){ if(!document.fonts) return; const fs = ['Anton','Baloo Tamma 2','Bebas Neue','Montserrat', ...(extra||[]).filter(Boolean)]; await Promise.all(fs.map(async f => { const css = fontLink(f); if(css) await css; ensureFont(f); return Promise.race([document.fonts.load(`900 60px "${f}"`, (sample || 'ಕನ್ನಡ') + ' AB'), new Promise(r => setTimeout(r, 2500))]).catch(()=>{}); })); }

/* =====================================================================
   v20: VIDEO STABILIZATION — global motion analysis (block matching +
   robust similarity fit), trajectory smoothing, auto crop-zoom.
   Analysis is stored per clip (raw camera path), so changing strength
   re-smooths instantly without analysing again.
   ===================================================================== */
const STAB_MODES = [['off','Off'],['smooth','Smooth'],['tripod','Tripod (lock)']];
async function analyzeStab(c, onProg, cancel){
  const m = media(c.mediaId); if(!m || m.type !== 'video') throw new Error('Stabilization works on video clips');
  const v = mkVideo(null); v.muted = true;
  await new Promise((r, j) => { v.onloadedmetadata = r; v.onerror = () => j(new Error('Cannot read this video')); v.src = m.url; });
  const vw = v.videoWidth, vh = v.videoHeight, AW = vw >= vh ? 320 : 240, AH = Math.max(60, Math.round(AW*vh/vw));   // v21: higher analysis resolution → ~0.5 px precision
  const cnv = document.createElement('canvas'); cnv.width = AW; cnv.height = AH; const x = cnv.getContext('2d', {willReadFrequently:true});
  const len = c.out - c.in, fps = len > 90 ? 12 : len > 45 ? 18 : len > 20 ? 24 : 30, n = Math.max(2, Math.floor(len*fps) + 1);   // every frame for short clips → catches fast hand shake
  const gray = () => { x.drawImage(v, 0, 0, AW, AH); const d = x.getImageData(0,0,AW,AH).data, g = new Float32Array(AW*AH); for(let i=0,j=0;i<g.length;i++,j+=4) g[i] = d[j]*.299 + d[j+1]*.587 + d[j+2]*.114; return g; };
  const half = g => { const w = AW>>1, h = AH>>1, o = new Float32Array(w*h); for(let y=0;y<h;y++) for(let xx=0;xx<w;xx++){ const i = (y*2)*AW + xx*2; o[y*w+xx] = (g[i] + g[i+1] + g[i+AW] + g[i+AW+1])*.25; } return o; };
  const B = 16, GX = 12, GY = Math.max(5, Math.round(12*AH/AW)), R = fps >= 24 ? 20 : 28;
  // block matching between two frames → motion vectors
  function vectors(p, q, ph, qh){
    const vs = [], W2 = AW>>1, H2 = AH>>1, b2 = B>>1;
    for(let gy=0; gy<GY; gy++) for(let gx=0; gx<GX; gx++){
      const bx = Math.round((gx + .5)*AW/GX - B/2), by = Math.round((gy + .5)*AH/GY - B/2);
      if(bx < R+2 || by < R+2 || bx + B > AW-R-2 || by + B > AH-R-2) continue;
      let tex = 0; for(let yy=0;yy<B;yy++) for(let xx=1;xx<B;xx++){ const i = (by+yy)*AW + bx+xx; tex += Math.abs(p[i]-p[i-1]) + (yy ? Math.abs(p[i]-p[i-AW]) : 0); }
      if(tex < B*B*3) continue;   // flat block (sky, wall) — no reliable motion
      // coarse search on half resolution
      const hx = bx>>1, hy = by>>1, r2 = R>>1; let best = Infinity, cdx = 0, cdy = 0;
      for(let dy=-r2; dy<=r2; dy++) for(let dx=-r2; dx<=r2; dx++){
        let s = 0; for(let yy=0;yy<b2 && s<best;yy++){ const a = (hy+yy)*W2 + hx, b = (hy+yy+dy)*W2 + hx+dx; for(let xx=0;xx<b2;xx++) s += Math.abs(ph[a+xx] - qh[b+xx]); }
        if(s < best){ best = s; cdx = dx*2; cdy = dy*2; }
      }
      // refine at full resolution ±2 px, then sub-pixel by parabola fit
      let bst = Infinity, fx = cdx, fy = cdy; const S3 = {};
      for(let dy=cdy-2; dy<=cdy+2; dy++) for(let dx=cdx-2; dx<=cdx+2; dx++){
        let s = 0; for(let yy=0;yy<B;yy++){ const a = (by+yy)*AW + bx, b = (by+yy+dy)*AW + bx+dx; for(let xx=0;xx<B;xx++) s += Math.abs(p[a+xx] - q[b+xx]); }
        S3[dx+','+dy] = s; if(s < bst){ bst = s; fx = dx; fy = dy; }
      }
      const sp = (a, m0, b) => { const d = a - 2*m0 + b; return d > 1e-6 ? clamp(.5*(a - b)/d, -.5, .5) : 0; };
      const sx = S3[(fx-1)+','+fy], sx2 = S3[(fx+1)+','+fy], sy = S3[fx+','+(fy-1)], sy2 = S3[fx+','+(fy+1)];
      const ox = sx != null && sx2 != null ? sp(sx, bst, sx2) : 0, oy = sy != null && sy2 != null ? sp(sy, bst, sy2) : 0;
      vs.push([bx + B/2 - AW/2, by + B/2 - AH/2, fx + ox, fy + oy, bst/(B*B)]);
    }
    return vs;
  }
  // robust similarity fit: x' = a·x − b·y + tx, y' = b·x + a·y + ty
  function fit(vs){
    let use = vs.filter(v => v[4] < 40);
    if(use.length < 4) use = vs;
    if(use.length < 3) return [0,0,0,0];
    let res = [0,0,0,0];
    for(let it=0; it<3; it++){
      const n2 = use.length; let mx=0,my=0,mx2=0,my2=0; for(const v of use){ mx += v[0]; my += v[1]; mx2 += v[0]+v[2]; my2 += v[1]+v[3]; } mx/=n2; my/=n2; mx2/=n2; my2/=n2;
      let num1=0,num2=0,den=0; for(const v of use){ const xa = v[0]-mx, ya = v[1]-my, xb = v[0]+v[2]-mx2, yb = v[1]+v[3]-my2; num1 += xa*xb + ya*yb; num2 += xa*yb - ya*xb; den += xa*xa + ya*ya; }
      const a = den ? num1/den : 1, b = den ? num2/den : 0, tx = mx2 - (a*mx - b*my), ty = my2 - (b*mx + a*my);
      res = [tx, ty, Math.atan2(b, a), Math.log(Math.max(.5, Math.hypot(a, b)))];
      const err = use.map(v => Math.hypot(a*v[0] - b*v[1] + tx - v[0] - v[2], b*v[0] + a*v[1] + ty - v[1] - v[3]));
      const med = [...err].sort((p,q) => p-q)[err.length>>1], lim = Math.max(.6, med*2.5);
      const keep = use.filter((v,i) => err[i] <= lim); if(keep.length < 4 || keep.length === use.length) break; use = keep;
    }
    return res;
  }
  const T = [], X = [0], Y = [0], A = [0], Sc = [0]; let prev = null, prevH = null; HEAVY++;
  const motion = (t, g) => {
    const gh = half(g); T.push(t);
    if(prev){ const [tx, ty, da, ds] = fit(vectors(prev, g, prevH, gh)); const k = X.length - 1;
      X.push(X[k] + tx); Y.push(Y[k] + ty); A.push(A[k] + da); Sc.push(Sc[k] + ds); }
    prev = g; prevH = gh; onProg && onProg(Math.min(1, (t - c.in)/Math.max(.05, len)));
  };
  const take = t => motion(t, gray());
  try{
    if(v.requestVideoFrameCallback){
      // fast path: the browser decodes the clip continuously; each callback only COPIES the frame (cheap, so the
      // copied picture is exactly the frame reported by mediaTime). Motion maths runs from a queue; playback
      // pauses if the queue gets long, so slow phones never mislabel frames.
      await seekTo(v, c.in);
      await new Promise(res => {
        let next = c.in, done = false, lastT = -1, busy = false; const Q = [];
        const end = () => { if(done) return; done = true; v.pause(); drain(true); };
        const drain = fin => {
          if(busy) return; busy = true;
          const step = () => {
            const t0 = performance.now();
            while(Q.length && performance.now() - t0 < 12){ const [t, g] = Q.shift(); motion(t, g); }
            if(!done && Q.length < 4 && v.paused && !v.ended && !(cancel && cancel.flag)) v.play().catch(()=>{});
            if(Q.length) setTimeout(step, 0); else { busy = false; if(done) res(); }
          };
          step();
        };
        const cb = (now, md) => {
          if(done) return; const t = md.mediaTime;
          if(cancel && cancel.flag){ end(); return; }
          if(t > lastT + 1e-4 && t >= next - 1e-3 && t <= c.out + .05){ Q.push([t, gray()]); lastT = t; next = t + 1/fps*.98; }
          if(Q.length > 24) v.pause();
          drain();
          if(t >= c.out - .03 || v.ended){ end(); return; }
          v.requestVideoFrameCallback(cb);
        };
        v.requestVideoFrameCallback(cb); v.onended = end;
        v.playbackRate = fps >= 30 ? 1 : fps >= 24 ? 1.5 : 2; v.play().catch(end);
        setTimeout(end, (len/ v.playbackRate + 20)*1000*4);
      });
    }
    if(T.length < Math.min(n, 6)){   // fallback: frame-by-frame seeking
      T.length = 0; X.length = 1; Y.length = 1; A.length = 1; Sc.length = 1; prev = null;
      for(let i=0; i<n && !(cancel && cancel.flag); i++){ const t = Math.min(c.out - .02, c.in + i/fps); await seekTo(v, t); await waitFrame(v); take(t); }
    }
  } finally { HEAVY = Math.max(0, HEAVY - 1); v.pause(); v.removeAttribute('src'); v.load(); v.remove(); }
  if(cancel && cancel.flag) return null;
  const r4 = a => a.map(v => Math.round(v*1000)/1000);
  return {t:r4(T), x:r4(X.slice(0,T.length)), y:r4(Y.slice(0,T.length)), a:r4(A.slice(0,T.length)), s:r4(Sc.slice(0,T.length)), w:AW, h:AH};
}
const stabCache = {};
function gaussSmooth(arr, sigma){
  const n = arr.length; if(sigma <= .01 || n < 3) return arr.slice();
  const r = Math.ceil(sigma*3), w = []; for(let k=-r;k<=r;k++) w.push(Math.exp(-k*k/(2*sigma*sigma)));
  const at = i => { if(i < 0) return 2*arr[0] - arr[Math.min(n-1, -i)]; if(i >= n) return 2*arr[n-1] - arr[Math.max(0, 2*n-2-i)]; return arr[i]; };   // odd reflection keeps the path's direction at the ends
  return arr.map((_, i) => { let s = 0, ws = 0; for(let k=-r;k<=r;k++){ s += at(i+k)*w[k+r]; ws += w[k+r]; } return s/ws; });
}
function stabData(c){
  const st = c.stab; if(!st || st.mode === 'off' || !st.raw || st.raw.t.length < 2) return null;
  const key = st.mode + ':' + st.level + ':' + st.raw.t.length + ':' + st.raw.t[0] + ':' + (st.crop ?? 'a');
  const hit = stabCache[c.id]; if(hit && hit.key === key) return hit;
  const R = st.raw, n = R.t.length, fps = n > 1 ? (n - 1)/Math.max(.05, R.t[n-1] - R.t[0]) : 15;
  const mean = a => a.reduce((p,q) => p+q, 0)/a.length;
  let sm;
  if(st.mode === 'tripod'){ sm = [R.x, R.y, R.a, R.s].map(a => { const m0 = mean(a); return a.map(() => m0); }); }
  else { const sig = fps*(.15 + 2.4*Math.pow((st.level ?? 60)/100, 1.4)); sm = [R.x, R.y, R.a, R.s].map(a => gaussSmooth(a, sig)); sm[3] = gaussSmooth(R.s, sig*2); }
  // correction = smooth path − shaky path (move the picture back where a steady camera would see it)
  const cx = R.x.map((v,i) => (sm[0][i] - v)/R.w), cy = R.y.map((v,i) => (sm[1][i] - v)/R.h), ca = R.a.map((v,i) => sm[2][i] - v), cs = R.s.map((v,i) => sm[3][i] - v);
  // auto zoom so no black borders show (95th percentile, capped)
  const asp = Math.max(R.w/R.h, R.h/R.w), need = cx.map((_,i) => { const zr = Math.abs(Math.cos(ca[i])) + asp*Math.abs(Math.sin(ca[i])); return Math.max(1/(1 - Math.min(.45, 2*Math.abs(cx[i]))), 1/(1 - Math.min(.45, 2*Math.abs(cy[i]))))*zr/Math.exp(Math.min(0, cs[i])); }).sort((p,q) => p-q);
  const auto = need[Math.floor(need.length*.95)] || 1, maxZ = 1 + (st.crop ?? 25)/100;
  const z = Math.min(maxZ, Math.max(1, auto));
  const lim = (1 - 1/z)/2 + .002;   // never move further than the crop allows
  for(let i=0;i<n;i++){ cx[i] = clamp(cx[i], -lim, lim); cy[i] = clamp(cy[i], -lim, lim); }
  return stabCache[c.id] = {key, t:R.t, cx, cy, ca, cs, z, auto};
}
function stabAt(c, st){
  const d = stabData(c); if(!d) return null; const T = d.t, n = T.length;
  if(st <= T[0]) return {dx:d.cx[0], dy:d.cy[0], r:d.ca[0], s:d.cs[0], z:d.z};
  if(st >= T[n-1]) return {dx:d.cx[n-1], dy:d.cy[n-1], r:d.ca[n-1], s:d.cs[n-1], z:d.z};
  let lo = 0, hi = n - 1; while(hi - lo > 1){ const m = (lo + hi) >> 1; if(T[m] <= st) lo = m; else hi = m; }
  const f = (st - T[lo])/Math.max(1e-6, T[hi] - T[lo]), L = (a) => a[lo] + (a[hi] - a[lo])*f;
  return {dx:L(d.cx), dy:L(d.cy), r:L(d.ca), s:L(d.cs), z:d.z};
}

/* =====================================================================
   v23: MAGIC ANIMATE — AI finds the people / animals / objects in a photo,
   cuts each one out, fills the hole behind it, and animates every object
   separately (in + out, from left / right / top / bottom, pop, rise…)
   Models (downloaded once, then cached, run in the browser):
     • object finder : DETR ResNet-50 (Apache-2.0) via transformers.js
     • cut-out       : MediaPipe "magic touch" interactive segmenter (Apache-2.0)
   ===================================================================== */
function ensureMagic(it){ if(!it.magic) it.magic = MAGIC_DEF(); return it.magic; }
const MAGIC_DEF = () => ({on:false, layers:[], inS:'rise', outS:'none', inDur:.6, outDur:.5, stag:.1, order:'lr', bg:'haze'});
const MAGIC_STYLES = [['auto','Auto'],['left','Left'],['right','Right'],['top','Top'],['bottom','Bottom'],['pop','Pop'],['rise','Rise'],['fade','Fade'],['spin','Spin']];
const MAGIC_RT = {};
let ISEG = null, isegLoading = null, DET = null, detLoading = null;
function loadISeg(){
  if(ISEG) return Promise.resolve(ISEG);
  if(!isegLoading) isegLoading = (async () => {
    const v = await import(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}/vision_bundle.mjs`);
    const fs = await v.FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}/wasm`);
    const opts = d => ({baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/interactive_segmenter/magic_touch/float32/1/magic_touch.tflite', delegate:d}, outputCategoryMask:false, outputConfidenceMasks:true});
    try{ ISEG = await v.InteractiveSegmenter.createFromOptions(fs, opts('GPU')); }catch(e){ ISEG = await v.InteractiveSegmenter.createFromOptions(fs, opts('CPU')); }
    return ISEG;
  })().catch(e => { isegLoading = null; throw e; });
  return isegLoading;
}
function loadDetector(onProg){
  if(DET) return Promise.resolve(DET);
  if(!detLoading) detLoading = (async () => {
    const T = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2');
    T.env.allowLocalModels = false;
    DET = await T.pipeline('object-detection', 'Xenova/detr-resnet-50', {dtype:'q8', progress_callback: p => { if(onProg && p.status === 'progress' && /onnx/.test(p.file||'')) onProg(p.progress/100); }});
    return DET;
  })().catch(e => { detLoading = null; throw e; });
  return detLoading;
}
function magicSrc(it){ const el = images[it.mediaId]; if(!el || !el.naturalWidth) return null;
  const k = Math.min(1, 1024/Math.max(el.naturalWidth, el.naturalHeight)), c = document.createElement('canvas');
  c.width = Math.round(el.naturalWidth*k); c.height = Math.round(el.naturalHeight*k); c.getContext('2d').drawImage(el, 0, 0, c.width, c.height); return c; }
// one tap / one detected box → soft object mask (Float32, src size) or null
function isegAt(src, x, y){
  return new Promise(res => { try{
    ISEG.segment(src, {keypoint:{x, y}}, r => {
      const ms = r.confidenceMasks || []; if(!ms.length){ res(null); return; }
      const w = ms[0].width, h = ms[0].height, px = Math.min(w-1, Math.round(x*w)) + Math.min(h-1, Math.round(y*h))*w;
      let best = null, bv = -1; for(const m of ms){ const a = m.getAsFloat32Array(); if(a[px] > bv){ bv = a[px]; best = a; } }
      res(best && bv > .4 ? {a:Float32Array.from(best), w, h} : null);
    });
  }catch(e){ res(null); } });
}
function maskStats(m, box){
  let ins = 0, all = 0, boxN = 0; const [x0,y0,x1,y1] = box.map((v,i) => Math.round(v*(i%2 ? m.h : m.w)));
  for(let y=0;y<m.h;y++) for(let x=0;x<m.w;x++){ const v = m.a[y*m.w+x] > .5; if(v) all++; const inb = x>=x0 && x<=x1 && y>=y0 && y<=y1; if(inb){ boxN++; if(v) ins++; } }
  return {fill: ins/Math.max(1,boxN), leak: all ? 1 - ins/all : 1, cov: all/(m.w*m.h)};
}
// crop mask to its bounding box and store as a small PNG (kept inside the project)
function maskToLayer(m, label, limitBox, src){
  let x0 = m.w, y0 = m.h, x1 = -1, y1 = -1; const [bx0,by0,bx1,by1] = limitBox ? [limitBox[0]*m.w, limitBox[1]*m.h, limitBox[2]*m.w, limitBox[3]*m.h] : [0,0,m.w,m.h];
  for(let y=0;y<m.h;y++) for(let x=0;x<m.w;x++){ if(x<bx0||x>bx1||y<by0||y>by1){ m.a[y*m.w+x] = 0; continue; } if(m.a[y*m.w+x] > .5){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; } }
  if(x1 < 0) return null;
  x0 = Math.max(0, x0-3); y0 = Math.max(0, y0-3); x1 = Math.min(m.w-1, x1+3); y1 = Math.min(m.h-1, y1+3);
  const cw = x1-x0+1, ch = y1-y0+1, c = document.createElement('canvas'); c.width = cw; c.height = ch;
  const x = c.getContext('2d'), id = x.createImageData(cw, ch);
  for(let y=0;y<ch;y++) for(let xx=0;xx<cw;xx++){ const v = clamp((m.a[(y+y0)*m.w + xx+x0] - .35)/.3, 0, 1); const i = (y*cw+xx)*4; id.data[i] = id.data[i+1] = id.data[i+2] = 255; id.data[i+3] = v*255; }
  x.putImageData(id, 0, 0);
  let t = '';
  if(src){ const k = Math.min(1, 96/Math.max(cw, ch)), tc = document.createElement('canvas'); tc.width = Math.max(1, Math.round(cw*k)); tc.height = Math.max(1, Math.round(ch*k)); const tx = tc.getContext('2d');
    tx.drawImage(src, x0/m.w*src.width, y0/m.h*src.height, cw/m.w*src.width, ch/m.h*src.height, 0, 0, tc.width, tc.height); tx.globalCompositeOperation = 'destination-in'; tx.drawImage(c, 0, 0, tc.width, tc.height); t = tc.toDataURL('image/png'); }
  return {id:nid(), label:label||'object', box:[x0/m.w, y0/m.h, (x1+1)/m.w, (y1+1)/m.h], m:c.toDataURL('image/png'), t};
}
async function magicAddAt(it, x, y){
  await loadISeg(); const src = magicSrc(it); if(!src) throw new Error('Image not loaded');
  const m = await isegAt(src, x, y); if(!m) return null;
  const st = maskStats(m, [0,0,1,1]); if(st.cov > .7 || st.cov < .0005) return null;   // that was the background, not an object
  return maskToLayer(m, 'object', null, src);
}
async function magicAuto(it, onProg){
  const src = magicSrc(it); if(!src) throw new Error('Image not loaded');
  onProg && onProg('🤖 Loading object finder (first time ~45 MB)…', 0);
  const det = await loadDetector(p => onProg && onProg(`🤖 Downloading object finder… ${Math.round(p*100)}%`, p*.5));
  onProg && onProg('🔎 Finding people & objects…', .55);
  let found = await det(src.toDataURL('image/jpeg', .9), {threshold:.6, percentage:true});
  found = found.map(d => ({label:d.label, s:d.score, b:[d.box.xmin, d.box.ymin, d.box.xmax, d.box.ymax]}))
    .filter(d => (d.b[2]-d.b[0])*(d.b[3]-d.b[1]) > .002 && (d.b[2]-d.b[0])*(d.b[3]-d.b[1]) < .6)
    .sort((a,b) => (b.b[2]-b.b[0])*(b.b[3]-b.b[1]) - (a.b[2]-a.b[0])*(a.b[3]-a.b[1])).slice(0, 14);
  if(!found.length) return [];
  onProg && onProg('✂️ Loading cut-out AI…', .6); await loadISeg();
  const layers = [];
  for(let i=0;i<found.length;i++){
    const d = found[i], [x0,y0,x1,y1] = d.b, w = x1-x0, h = y1-y0; onProg && onProg(`✂️ Cutting out ${d.label} (${i+1}/${found.length})`, .6 + .4*i/found.length);
    const pad = [Math.max(0,x0-w*.06), Math.max(0,y0-h*.06), Math.min(1,x1+w*.06), Math.min(1,y1+h*.06)];
    let U = null;
    for(const [kx, ky] of [[.5,.5],[.5,.3],[.5,.7],[.35,.5],[.65,.5]]){
      const m = await isegAt(src, x0 + w*kx, y0 + h*ky); if(!m) continue;
      const st = maskStats(m, d.b); if(st.fill < .06 || st.leak > .45) continue;
      if(!U) U = m; else for(let j=0;j<U.a.length;j++) U.a[j] = Math.max(U.a[j], m.a[j]);
      if(maskStats(U, d.b).fill > .45) break;
    }
    if(!U) continue;
    const L = maskToLayer(U, d.label, pad, src); if(L && !layers.some(o => iou(o.box, L.box) > .7)) layers.push(L);
  }
  return layers;
}
function iou(a, b){ const ix = Math.max(0, Math.min(a[2],b[2]) - Math.max(a[0],b[0])), iy = Math.max(0, Math.min(a[3],b[3]) - Math.max(a[1],b[1])), I = ix*iy;
  return I / ((a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - I); }
// ---- fill the holes behind the objects: multi-scale PatchMatch "content-aware fill" ----
// (copies real texture from the rest of the picture — ground, walls, sky — instead of blurring)
function inpaint(img, hole, W, H){
  const w0 = Math.min(W, 560), h0 = Math.round(H*w0/W), cvs = document.createElement('canvas'); cvs.width = w0; cvs.height = h0;
  const cx = cvs.getContext('2d', {willReadFrequently:true}); cx.drawImage(img, 0, 0, w0, h0); const d = cx.getImageData(0,0,w0,h0).data;
  const mc = document.createElement('canvas'); mc.width = w0; mc.height = h0; const mx = mc.getContext('2d', {willReadFrequently:true}); mx.drawImage(hole, 0, 0, w0, h0); const md = mx.getImageData(0,0,w0,h0).data;
  const L0 = {w:w0, h:h0, I:new Float32Array(w0*h0*3), M:new Uint8Array(w0*h0)};
  for(let i=0;i<w0*h0;i++){ L0.I[i*3] = d[i*4]; L0.I[i*3+1] = d[i*4+1]; L0.I[i*3+2] = d[i*4+2]; L0.M[i] = md[i*4+3] > 10 ? 1 : 0; }
  const pyr = [L0];
  while(Math.min(pyr[pyr.length-1].w, pyr[pyr.length-1].h) > 48){ const p = pyr[pyr.length-1], w = p.w>>1, h = p.h>>1, n = {w, h, I:new Float32Array(w*h*3), M:new Uint8Array(w*h)};
    for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const o = y*w+x; let m = 0;
      for(let c=0;c<3;c++){ let v = 0; for(const [dx,dy] of [[0,0],[1,0],[0,1],[1,1]]) v += p.I[((y*2+dy)*p.w + x*2+dx)*3+c]; n.I[o*3+c] = v/4; }
      for(const [dx,dy] of [[0,0],[1,0],[0,1],[1,1]]) m |= p.M[(y*2+dy)*p.w + x*2+dx]; n.M[o] = m; }
    pyr.push(n); }
  const R = 3, PN = (2*R+1)*(2*R+1);
  let NX = null, NY = null, pw = 0;
  for(let lv = pyr.length-1; lv >= 0; lv--){
    const {w, h, I, M} = pyr[lv], N = w*h;
    // integral image of the hole → which source patches are 100% real picture
    const S = new Int32Array((w+1)*(h+1)); for(let y=0;y<h;y++){ let row = 0; for(let x=0;x<w;x++){ row += M[y*w+x]; S[(y+1)*(w+1)+x+1] = S[y*(w+1)+x+1] + row; } }
    const holeIn = (x0,y0,x1,y1) => S[(y1+1)*(w+1)+x1+1] - S[y0*(w+1)+x1+1] - S[(y1+1)*(w+1)+x0] + S[y0*(w+1)+x0];
    const valid = new Uint8Array(N), VL = [];
    for(let y=R;y<h-R;y++) for(let x=R;x<w-R;x++) if(!holeIn(x-R,y-R,x+R,y+R)){ valid[y*w+x] = 1; VL.push(y*w+x); }
    if(VL.length < 8) return inpaintSmooth(img, hole, W, H);
    // target = every pixel whose patch touches the hole
    const T = []; for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(holeIn(Math.max(0,x-R),Math.max(0,y-R),Math.min(w-1,x+R),Math.min(h-1,y+R))) T.push(y*w+x);
    const nx = new Int32Array(N), ny = new Int32Array(N);
    const rnd = () => VL[(Math.random()*VL.length)|0];
    for(const p of T){ let s;
      if(NX){ const px = p % w, py = (p / w)|0, q = Math.min(pw-1, px>>1) + Math.min(pyr[lv+1].h-1, py>>1)*pw; const sx = NX[q]*2 + (px&1), sy = NY[q]*2 + (py&1); s = (sx>=0 && sy>=0 && sx<w && sy<h && valid[sy*w+sx]) ? sy*w+sx : rnd(); }
      else s = rnd();
      nx[p] = s % w; ny[p] = (s / w)|0; }
    if(lv === pyr.length-1){ // coarsest: start from a smooth guess
      for(let it=0; it<200; it++) for(let i=0;i<N;i++){ if(!M[i]) continue; const x = i % w, y = (i/w)|0; let c0=0,c1=0,c2=0,k=0;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const xx = x+dx, yy = y+dy; if(xx<0||yy<0||xx>=w||yy>=h) continue; const j = (yy*w+xx)*3; c0+=I[j]; c1+=I[j+1]; c2+=I[j+2]; k++; }
        I[i*3] = c0/k; I[i*3+1] = c1/k; I[i*3+2] = c2/k; } }
    const LK = PN*3*100/Math.pow(w*.15, 2);   // locality: prefer texture from near the hole (ground fills ground, wall fills wall)
    const dist = (p, sx, sy, best) => { const px = p % w, py = (p/w)|0; let dd = LK*((px-sx)*(px-sx) + (py-sy)*(py-sy)); if(dd > best) return dd;
      for(let oy=-R; oy<=R; oy++){ const ty = py+oy; if(ty<0||ty>=h) continue; const sr = (sy+oy)*w;
        for(let ox=-R; ox<=R; ox++){ const tx = px+ox; if(tx<0||tx>=w) continue; const a = (ty*w+tx)*3, b = (sr+sx+ox)*3;
          const e0 = I[a]-I[b], e1 = I[a+1]-I[b+1], e2 = I[a+2]-I[b+2]; dd += e0*e0+e1*e1+e2*e2; }
        if(dd > best) return dd; }
      return dd; };
    const D = new Float32Array(N);
    const vote = () => {
      const acc = new Float32Array(N*3), ws = new Float32Array(N);
      for(const p of T){ const px = p % w, py = (p/w)|0, sx = nx[p], sy = ny[p], wt = Math.exp(-D[p]/(PN*3*2*14*14)) + 1e-6;
        for(let oy=-R; oy<=R; oy++){ const ty = py+oy; if(ty<0||ty>=h) continue;
          for(let ox=-R; ox<=R; ox++){ const tx = px+ox; if(tx<0||tx>=w) continue; const q = ty*w+tx; if(!M[q]) continue; const b = ((sy+oy)*w + sx+ox)*3;
            acc[q*3] += I[b]*wt; acc[q*3+1] += I[b+1]*wt; acc[q*3+2] += I[b+2]*wt; ws[q] += wt; } } }
      for(let q=0;q<N;q++) if(M[q] && ws[q] > 0){ I[q*3] = acc[q*3]/ws[q]; I[q*3+1] = acc[q*3+1]/ws[q]; I[q*3+2] = acc[q*3+2]/ws[q]; } };
    if(lv !== pyr.length-1){ for(const p of T) D[p] = dist(p, nx[p], ny[p], 1e30); vote(); }
    const iters = lv === pyr.length-1 ? 8 : lv === 0 ? 3 : 5;
    for(let it=0; it<iters; it++){
      for(const p of T) D[p] = dist(p, nx[p], ny[p], 1e30);
      for(let pass=0; pass<2; pass++){
        const dir = (it*2 + pass) % 2 ? -1 : 1, order = dir > 0 ? T : [...T].reverse();
        for(const p of order){ const px = p % w, py = (p/w)|0;
          // propagation from the neighbour that was just improved
          for(const [qx,qy] of [[px-dir,py],[px,py-dir]]){ if(qx<0||qy<0||qx>=w||qy>=h) continue; const q = qy*w+qx; const sx = nx[q]+dir, sy = ny[q];
            if(sx>=0 && sx<w && sy>=0 && sy<h && valid[sy*w+sx] && (q !== p)){ const dd = dist(p, sx, sy, D[p]); if(dd < D[p]){ D[p] = dd; nx[p] = sx; ny[p] = sy; } }
            const sx2 = nx[q], sy2 = ny[q]+dir; if(sx2>=0 && sx2<w && sy2>=0 && sy2<h && valid[sy2*w+sx2]){ const dd = dist(p, sx2, sy2, D[p]); if(dd < D[p]){ D[p] = dd; nx[p] = sx2; ny[p] = sy2; } } }
          // random search around the current best
          for(let rad = Math.max(w,h); rad >= 1; rad >>= 1){ const sx = nx[p] + ((Math.random()*2-1)*rad|0), sy = ny[p] + ((Math.random()*2-1)*rad|0);
            if(sx<0||sy<0||sx>=w||sy>=h||!valid[sy*w+sx]) continue; const dd = dist(p, sx, sy, D[p]); if(dd < D[p]){ D[p] = dd; nx[p] = sx; ny[p] = sy; } }
        }
      }
      vote();
    }
    // pass the match field up to the next finer level
    NX = nx; NY = ny; pw = w;
    if(lv > 0){ const f = pyr[lv-1]; for(let y=0;y<f.h;y++) for(let x=0;x<f.w;x++){ const q = y*f.w+x; if(!f.M[q]) continue; const c = Math.min(h-1,y>>1)*w + Math.min(w-1,x>>1);
      f.I[q*3] = I[c*3]; f.I[q*3+1] = I[c*3+1]; f.I[q*3+2] = I[c*3+2]; } }
  }
  const id = cx.createImageData(w0, h0); for(let i=0;i<w0*h0;i++){ id.data[i*4] = L0.I[i*3]; id.data[i*4+1] = L0.I[i*3+1]; id.data[i*4+2] = L0.I[i*3+2]; id.data[i*4+3] = 255; }
  cx.putImageData(id, 0, 0);
  const outC = document.createElement('canvas'); outC.width = W; outC.height = H; const ox = outC.getContext('2d');
  const fill = document.createElement('canvas'); fill.width = W; fill.height = H; const fx = fill.getContext('2d');
  fx.imageSmoothingQuality = 'high'; fx.drawImage(cvs, 0, 0, W, H);
  fx.globalCompositeOperation = 'destination-in'; fx.filter = `blur(${Math.max(1, W/700)}px)`; fx.drawImage(hole, 0, 0, W, H); fx.filter = 'none';
  ox.drawImage(img, 0, 0, W, H); ox.drawImage(fill, 0, 0); return outC;
}
// fallback when almost the whole picture is selected
function inpaintSmooth(img, hole, W, H){ const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.filter = `blur(${W/40}px)`; x.drawImage(img, 0, 0, W, H); x.filter = 'none';
  const f = document.createElement('canvas'); f.width = W; f.height = H; const fx = f.getContext('2d'); fx.drawImage(c, 0, 0); fx.globalCompositeOperation = 'destination-in'; fx.drawImage(hole, 0, 0, W, H);
  const o = document.createElement('canvas'); o.width = W; o.height = H; const ox = o.getContext('2d'); ox.drawImage(img, 0, 0, W, H); ox.drawImage(f, 0, 0); return o; }
function loadDataImg(src){ return new Promise((r, j) => { const i = new Image(); i.onload = () => r(i); i.onerror = j; i.src = src; }); }
async function buildMagic(it){
  const el = images[it.mediaId], mg = it.magic; if(!el || !el.naturalWidth || !mg) return;
  const key = it.mediaId + ':' + mg.layers.map(l => l.id).join(','); const rt = MAGIC_RT[it.id];
  if(rt && (rt.key === key)) return;
  MAGIC_RT[it.id] = {key, ready:false};
  const k = Math.min(1, 1600/Math.max(el.naturalWidth, el.naturalHeight)), W = Math.round(el.naturalWidth*k), H = Math.round(el.naturalHeight*k);
  const hole = document.createElement('canvas'); hole.width = W; hole.height = H; const hx = hole.getContext('2d');
  const cuts = [];
  for(const L of mg.layers){
    let mi; try{ mi = await loadDataImg(L.m); }catch(e){ continue; }
    const bx = L.box[0]*W, by = L.box[1]*H, bw = (L.box[2]-L.box[0])*W, bh = (L.box[3]-L.box[1])*H;
    const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(bw)); c.height = Math.max(1, Math.round(bh)); const x = c.getContext('2d');
    x.drawImage(el, L.box[0]*el.naturalWidth, L.box[1]*el.naturalHeight, (L.box[2]-L.box[0])*el.naturalWidth, (L.box[3]-L.box[1])*el.naturalHeight, 0, 0, c.width, c.height);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(mi, 0, 0, c.width, c.height);
    // the hole is a little bigger than the object so no outline is left behind
    hx.save(); hx.filter = `blur(${Math.max(2, W/300)}px)`; for(const [dx,dy] of [[0,0],[-3,0],[3,0],[0,-3],[0,3]]) hx.drawImage(mi, bx+dx*W/800, by+dy*W/800, bw, bh); hx.restore();
    cuts.push({id:L.id, c, x:bx, y:by, w:bw, h:bh});
  }
  const bg = inpaint(el, hole, W, H), comp = document.createElement('canvas'); comp.width = W; comp.height = H;
  if(MAGIC_RT[it.id] && MAGIC_RT[it.id].key === key) MAGIC_RT[it.id] = {key, ready:true, W, H, bg, cuts, comp};
  if(typeof render === 'function') try{ render(performance.now()); }catch(e){}
}
const eOutCubic = p => 1 - Math.pow(1-p, 3), eInCubic = p => p*p*p, eOutBack = p => { const c1 = 1.7; return 1 + (c1+1)*Math.pow(p-1,3) + c1*Math.pow(p-1,2); };
function magicPose(style, p, cut, W, H, isIn){
  // p: 0 = hidden, 1 = in place
  if(style === 'auto'){ const cx = (cut.x + cut.w/2)/W, cy = (cut.y + cut.h/2)/H, d = {left:cx, right:1-cx, top:cy, bottom:1-cy};
    style = Object.keys(d).reduce((a,b) => d[a] <= d[b] ? a : b); }
  const e = isIn ? (style === 'pop' ? eOutBack(p) : eOutCubic(p)) : 1 - eInCubic(1-p);
  const o = {dx:0, dy:0, s:1, a:1, r:0};
  if(style === 'left') o.dx = -(cut.x + cut.w + 8)*(1-e);
  else if(style === 'right') o.dx = (W - cut.x + 8)*(1-e);
  else if(style === 'top') o.dy = -(cut.y + cut.h + 8)*(1-e);
  else if(style === 'bottom') o.dy = (H - cut.y + 8)*(1-e);
  else if(style === 'pop'){ o.s = Math.max(0, e); o.a = clamp(p*3, 0, 1); }
  else if(style === 'rise'){ o.dy = cut.h*.35*(1-e); o.a = clamp(p*1.6, 0, 1); }
  else if(style === 'fade') o.a = p;
  else if(style === 'spin'){ o.s = Math.max(0, e); o.r = (1-e)*Math.PI*1.5; o.a = clamp(p*2, 0, 1); }
  return o;
}
function magicFrame(it, lt, dur){
  const mg = it.magic; if(!mg || !mg.on || !mg.layers.length) return null;
  const rt = MAGIC_RT[it.id]; if(!rt || !rt.ready){ buildMagic(it); return null; }
  const {W, H, bg, cuts, comp} = rt, x = comp.getContext('2d'), n = cuts.length;
  let order = cuts.map((c,i) => i);
  if(mg.order === 'lr') order.sort((a,b) => cuts[a].x - cuts[b].x);
  else if(mg.order === 'size') order.sort((a,b) => cuts[b].w*cuts[b].h - cuts[a].w*cuts[a].h);
  else if(mg.order === 'rand') order.sort((a,b) => ((cuts[a].x*7919 + cuts[a].y*104729) % 97) - ((cuts[b].x*7919 + cuts[b].y*104729) % 97));
  let st = mg.stag, inD = mg.inDur, outD = mg.outS === 'none' ? 0 : mg.outDur;
  const need = inD + outD + st*(n-1)*(outD ? 2 : 1); if(need > dur*.95){ const k = dur*.95/need; st *= k; inD *= k; outD *= k; }
  x.setTransform(1,0,0,1,0,0); x.globalAlpha = 1; x.clearRect(0,0,W,H);
  const bgA = mg.bg === 'fade' ? clamp(lt/Math.max(.2, inD), 0, 1) : 1;
  if(mg.bg === 'haze'){   // like a camera coming into focus: starts bright & soft, clears while the objects arrive
    const e = eOutCubic(clamp(lt/Math.max(.3, inD + st*(n-1)), 0, 1));
    if(e < 1){ x.filter = `blur(${((1-e)*W/160).toFixed(1)}px)`; x.drawImage(bg, 0, 0); x.filter = 'none'; x.fillStyle = `rgba(255,252,246,${(.85*(1-e)).toFixed(3)})`; x.fillRect(0,0,W,H); }
    else x.drawImage(bg, 0, 0);
  }
  else if(mg.bg === 'zoom'){ const z = 1 + .08*(1 - eOutCubic(clamp(lt/Math.max(.3, inD + st*(n-1)), 0, 1))); x.globalAlpha = bgA; x.drawImage(bg, W*(1-z)/2, H*(1-z)/2, W*z, H*z); }
  else { x.globalAlpha = bgA; x.drawImage(bg, 0, 0); }
  order.forEach((ci, k) => {
    const cut = cuts[ci], tIn = (lt - k*st)/inD, tOut = outD ? (dur - lt - (n-1-k)*st)/outD : 9;
    let o;
    if(tIn < 1) o = tIn <= 0 ? null : magicPose(mg.inS, tIn, cut, W, H, true);
    else if(tOut < 1) o = tOut <= 0 ? null : magicPose(mg.outS === 'none' ? 'fade' : mg.outS, tOut, cut, W, H, false);
    else o = {dx:0, dy:0, s:1, a:1, r:0};
    if(!o || o.a <= 0 || o.s <= 0) return;
    const cx = cut.x + cut.w/2 + o.dx, cy = cut.y + cut.h/2 + o.dy;
    x.setTransform(o.s*Math.cos(o.r), o.s*Math.sin(o.r), -o.s*Math.sin(o.r), o.s*Math.cos(o.r), cx, cy); x.globalAlpha = o.a;
    x.drawImage(cut.c, -cut.w/2, -cut.h/2, cut.w, cut.h);
  });
  x.setTransform(1,0,0,1,0,0); x.globalAlpha = 1;
  return comp;
}
