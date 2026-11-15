'use strict';
/* =====================================================================
   ChitraCut UI  –  pro editor layout (left library · player · inspector · timeline)
   Engine lives in core.js
   ===================================================================== */

/* ---------------- ICONS ---------------- */
const IC = {
  media:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>',
  audio:'<path d="M9 18V5.5l11-2V16"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  text:'<path d="M5 7V5h14v2M12 5v14M9 19h6"/>',
  sticker:'<path d="M20 12.5A8.5 8.5 0 1 1 11.5 4"/><path d="M20 12.5h-5a3.5 3.5 0 0 1-3.5-3.5V4l8.5 8.5z"/>',
  effects:'<path d="M11 3l1.9 4.6L17.5 9.5l-4.6 1.9L11 16l-1.9-4.6L4.5 9.5l4.6-1.9z"/><path d="M18.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>',
  trans:'<path d="M3 5l9 7-9 7zM21 5l-9 7 9 7z"/>',
  captions:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 15h3M12 15h5M7 11.5h10"/>',
  filters:'<circle cx="9" cy="9.5" r="5"/><circle cx="15" cy="9.5" r="5"/><circle cx="12" cy="15" r="5"/>',
  adjust:'<path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17" r="2"/>',
  undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  split:'<path d="M12 3v18"/><path d="M8 7H5v10h3M16 7h3v10h-3"/>',
  delL:'<path d="M15 3v18"/><path d="M11 7H5v10h6"/><path d="M6.5 10l3 4M9.5 10l-3 4"/>',
  delR:'<path d="M9 3v18"/><path d="M13 7h6v10h-6"/><path d="M14.5 10l3 4M17.5 10l-3 4"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  flip:'<path d="M12 3v18"/><path d="M8 7L3 17h5zM16 7l5 10h-5z"/>',
  rotate:'<path d="M20 12a8 8 0 1 1-2.3-5.7L20 8.5"/><path d="M20 3.5v5h-5"/>',
  reset:'<path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.5"/><path d="M4 3.5v5h5"/>',
  kf:'<path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
  zin:'<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5l-4.5-4.5M8 11h6M11 8v6"/>',
  zout:'<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5l-4.5-4.5M8 11h6"/>',
  play:'<path d="M7 4.5v15l12.5-7.5z" fill="currentColor" stroke="none"/>',
  pause:'<path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z" fill="currentColor" stroke="none"/>',
  full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  home:'<path d="M4 11l8-7 8 7v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5z"/>',
  export:'<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  import:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><path d="M3 3l18 18"/>',
  vol:'<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
  volx:'<path d="M11 5L6 9H3v6h3l5 4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  chev:'<path d="M6 9l6 6 6-6"/>',
  wave:'<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',
  folder:'<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>',
  wand:'<path d="M4 20L15 9M14 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1zM19 11l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/>',
  ban:'<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
  film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  cursor:'<path d="M5 3l14 8-6 1.5L10 19z"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  center:'<path d="M12 3v18M3 12h18"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  fill:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h8v8H8z"/>',
  fit:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9 9h6v6H9z"/>',
  up:'<path d="M12 19V5M6 11l6-6 6 6"/>', down:'<path d="M12 5v14M6 13l6 6 6-6"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  target:'<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><circle cx="12" cy="12" r="3"/>',
  library:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M15 15.5v5l4.5-2.5z" fill="currentColor"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  sticker2:'<path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6"/>',
  music2:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'
};
const ic = n => `<svg class="i" viewBox="0 0 24 24">${IC[n]||''}</svg>`;
const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#2a8fa8"/><stop offset="1" stop-color="#6d4bd6"/></linearGradient></defs><rect width="160" height="90" fill="url(#g)"/><circle cx="120" cy="28" r="12" fill="#ffd56b"/><path d="M0 90L50 45l30 25 25-18 55 38z" fill="#183a4a"/></svg>');
const IB = $('#inspBody'), LC = $('#lcontent'), TL = $('#tl');
let HEADW = 150, apEl = null;

/* ---------------- HELPERS ---------------- */
function kindOf(it){ if(!it) return null; if(!it.type) return isImg(it) ? 'clipimg' : 'clip'; return it.type === 'video' ? 'ovvideo' : it.type === 'image' ? 'ovimage' : it.type; }
let curveSel = -1, trackRun = null, stabRun = null;
// ---- v20: stabilization panel ----
function stabSec(it){
  const st = it.stab || {mode:'off'}, has = st.raw && st.raw.t && st.raw.t.length > 1, run = stabRun && stabRun.id === it.id;
  let b = `<div class="chiprow">${STAB_MODES.map(([k,n]) => `<button data-stab="${k}" class="${(st.mode||'off')===k?'on':''}">${n}</button>`).join('')}</div>`;
  if(run) b += `<div class="prog"><div id="stabBar" style="width:${Math.round(stabRun.p*100)}%"></div></div><div id="stabStat" style="color:var(--mute);min-height:18px">Analysing camera shake… ${Math.round(stabRun.p*100)}%</div><div class="btns"><button data-stabact="cancel">Cancel</button></div>`;
  else if(st.mode && st.mode !== 'off'){
    if(st.mode === 'smooth') b += sl(it,'Strength','stab.level',0,100);
    b += sl(it,'Max crop (%)','stab.crop',0,50);
    const d = has ? stabData(it) : null;
    if(d) b += `<div class="crow"><span>Auto zoom</span><b style="color:var(--text)">${Math.round((d.z-1)*100)}%${d.auto > d.z + .01 ? ' <small style="color:#ffb44a">(limited by max crop)</small>' : ''}</b></div>`;
    b += `<div class="btns"><button data-stabact="redo">${ic('target')} ${has ? 'Analyse again' : 'Analyse'}</button></div>`;
  }
  b += '<div class="note">🎥 Removes hand shake: ChitraCut tracks the camera movement, smooths it, and zooms slightly so no black edges show. <b>Smooth</b> keeps intentional pans; <b>Tripod</b> locks the shot completely. Higher strength or crop = steadier but more zoom.</div>';
  return sec('stab', '🎥 Stabilization', b);
}
async function runStab(it){
  if(stabRun) return; pause(); stabRun = {id:it.id, flag:false, p:0}; renderInspector();
  try{
    const raw = await analyzeStab(it, p => { stabRun.p = p; const b = $('#stabBar'); if(b) b.style.width = (p*100)+'%'; const s = $('#stabStat'); if(s) s.textContent = `Analysing camera shake… ${Math.round(p*100)}%`; }, stabRun);
    if(raw){ pushUndo(); it.stab.raw = raw; delete stabCache[it.id]; }
  }catch(err){ alert('Stabilization failed: ' + err.message); }
  stabRun = null; renderInspector(); renderTimeline(); render(performance.now());
}
const itemStart = it => it.type ? it.start : derived[it.id].start;
const itemDur = it => it.type ? it.dur : derived[it.id].dur;
function thumbFor(it){ if(it && it.type === 'gfx'){ const c = document.createElement('canvas'); c.width = 160; c.height = 90; paintGfx(c, it.gfx, (GFXMAP[it.gfx]||{}).thumbT||1); return c.toDataURL(); }
  const m = it && media(it.mediaId); return (m && m.thumb && m.type !== 'audio') ? m.thumb : (S.clips[0] && (media(S.clips[0].mediaId)||{}).thumb) || PLACEHOLDER; }
function visTarget(){ const it = selItem(); if(it && (!it.type || isMediaOv(it) || it.type === 'adjust')) return it; return clipAt(S.time); }
function transTarget(){ const c = selClip(); if(c && S.clips.indexOf(c) > 0) return c; const p = clipAt(S.time); if(p && S.clips.indexOf(p) > 0) return p; return S.clips[1] || null; }
const usedMedia = id => S.clips.some(c=>c.mediaId===id) || S.overlays.some(o=>o.mediaId===id) || S.audios.some(a=>a.mediaId===id);
function setFill(el){ const mn=+el.min||0, mx=+el.max||100, v=+el.value; el.style.setProperty('--p', ((v-mn)/(mx-mn||1)*100)+'%'); }
function fillRanges(root){ root.querySelectorAll('input[type=range]').forEach(setFill); }

/* ---------------- CONTROL BUILDERS ---------------- */
function sl(it,label,path,min,max,step=1){
  const isK = kfList(it).includes(path), v = isK ? ev(it,path) : getP(it,path), kk = isK && it.kf && it.kf.length;
  return `<div class="prow"><div class="plab ${kk?'k':''}" title="${label}">${label}</div><input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-p="${path}"><input class="num" type="number" min="${min}" max="${max}" step="${step}" value="${fmtV(v)}" data-p="${path}"></div>`;
}
function chips(it,path,opts,cols=3){
  const v = getP(it,path);
  return `<div class="tiles" style="grid-template-columns:repeat(${cols},1fr)">${opts.map(([k,n])=>`<button class="vtile ${v===k?'on':''}" style="height:auto;padding:8px 4px" data-set="${path}" data-val="${k}">${n}</button>`).join('')}</div><div style="height:10px"></div>`;
}
function sec(id,title,body,o={}){
  const kf = o.kf ? `<span class="kfm"><button class="ib sm" data-kf="prev" title="Previous keyframe">‹</button><button class="ib sm kfbtn" data-kf="toggle" title="Keyframe (K)">${ic('kf')}</button><button class="ib sm" data-kf="next" title="Next keyframe">›</button></span>` : '';
  return `<div class="sec ${S.closed[id]?'closed':''}"><div class="sech"><button class="sect" data-tog="${id}">${title} ${ic('chev')}</button><div class="secr">${o.right||''}${o.reset?`<button class="ib sm" data-act="${o.reset}" title="Reset">${ic('reset')}</button>`:''}${kf}</div></div><div class="secb">${body}</div></div>`;
}
const colorRow = (o,label,path,swatch) => `<div class="crow"><span>${label}</span><input type="color" data-p="${path}" value="${getP(o,path)}"></div>` +
  (swatch ? `<div class="sw">${SWATCHES.map(s=>`<button style="background:${s}" data-set="${path}" data-val="${s}" title="${s}"></button>`).join('')}</div>` : '');
const blendRow = o => `<div class="crow"><span>Blend mode</span><select data-p="blend">${BLENDS.map(([k,n])=>`<option value="${k}" ${o.blend===k?'selected':''}>${n}</option>`).join('')}</select></div>`;
const presetCss = p => `color:${p.color};background:${p.bgOn?hexA(p.bgColor,(p.bgAlpha??100)/100):'#2a2a2f'};-webkit-text-stroke:${p.strokeW?Math.min(1,p.strokeW/7)+'px '+(p.stroke||'#000'):'0'};text-shadow:${p.shadow?`0 0 ${p.shadow/8}px ${p.shadowColor||'#000'}`:'none'};font-family:'${p.font||'Inter'}'`;
function curveSvg(c){
  const W=300,H=90,y=v=>H/2-Math.log10(v)*H/2,pts=[];
  for(let i=0;i<=60;i++){ const p=i/60; pts.push((p*W).toFixed(1)+','+y(clamp(curveAt(c,p),.1,10)).toFixed(1)); }
  return `<svg id="curveSvg" viewBox="0 0 ${W} ${H}" style="width:100%;background:#111113;border-radius:6px;display:block;margin-bottom:12px"><line x1="0" x2="${W}" y1="${H/2}" y2="${H/2}" stroke="#444" stroke-dasharray="4 4"/><polyline fill="none" stroke="#20d5ec" stroke-width="2" points="${pts.join(' ')}"/></svg>`;
}
const FILTER_CSS = {none:'',vivid:'saturate(1.45) contrast(1.15)',warm:'sepia(.35) saturate(1.25)',cool:'hue-rotate(-18deg) saturate(.9) brightness(1.03)',bw:'grayscale(1) contrast(1.2)',
  vintage:'sepia(.55) contrast(.9) brightness(1.05)',cinema:'contrast(1.25) saturate(.8) hue-rotate(-8deg)',fade:'contrast(.78) brightness(1.12)',drama:'contrast(1.5) saturate(.7) brightness(.88)',
  moody:'saturate(.6) brightness(.85) hue-rotate(-10deg)',golden:'sepia(.45) saturate(1.35) brightness(1.08)',film:'sepia(.25) contrast(1.12)'};

/* =====================================================================
   LEFT PANEL
   ===================================================================== */
const LTABS = [['media','Media','media'],['templates','Templates','library'],['audio','Audio','audio'],['text','Text','text'],['stickers','Stickers','sticker'],['effects','Effects','effects'],['transitions','Transitions','trans'],['captions','Captions','captions'],['filters','Filters','filters'],['adjust','Adjustment','adjust']];
const LSUB = {media:[['all','All'],['video','Videos'],['image','Photos'],['audio','Audio'],['library','Library']], audio:[['sfx','Sound effects'],['yours','Yours'],['voice','Voice-over'],['tts','Text to speech']],
  text:[['add','Add text'],['templates','Text templates'],['styles','Text styles'],['effects','Text effects']], stickers:[['emoji','Emoji'],['social','Social'],['badges','Badges & Arrows']], effects:[...FX_CATS.map(c=>[c[0],c[0]]),['All','All'],['body','🧍 Body effects']], transitions:[...TRANS_CATS.map(c=>[c[0],c[0]]),['All','All']],
  templates:TPL_CATS.map(c=>[c,c]), captions:[['auto','Auto captions'],['edit','Edit captions'],['srt','SRT file']], filters:[['filters','Filters']], adjust:[['lut','LUT'],['adjust','Adjust']]};
const TEXT_ADD = [
  ['default','Default text',{text:'Your text here'}],
  ['title','Title',{text:'TITLE',size:96,font:'Anton',shadow:40,y:42}],
  ['subtitle','Subtitle',{text:'Subtitle',size:42,bgOn:true,bgColor:'#000000',bgAlpha:60,shadow:0,y:72}],
  ['kannada','Kannada',{text:'ಕನ್ನಡ',size:84,font:'Baloo Tamma 2',color:'#ffe600',stroke:'#000000',strokeW:7,shadow:0}],
  ['neon','Neon',{text:'NEON',size:80,font:'Montserrat',color:'#ffffff',shadow:90,shadowColor:'#20d5ec'}],
  ['caption','Caption',{text:'Caption text',...CAPTION_STYLE}]
];
function renderLeft(){
  if(S.ltab === 'captions' && capBusy) return;
  $('#ltabs').innerHTML = LTABS.map(([k,n,i])=>`<button data-ltab="${k}" class="${S.ltab===k?'on':''}">${ic(i)}<span>${n}</span></button>`).join('');
  const subs = LSUB[S.ltab], sub = subs.some(s=>s[0]===S.lsub[S.ltab]) ? S.lsub[S.ltab] : subs[0][0];
  $('#lsub').innerHTML = subs.map(([k,n])=>`<button data-lsub="${k}" class="${sub===k?'on':''}">${n}</button>`).join('');
  const q = (S.lq[S.ltab] || '').trim().toLowerCase(), canQ = LSEARCH[S.ltab];
  LSB.style.display = canQ ? '' : 'none'; if(canQ){ LSI.placeholder = 'Search ' + canQ; if(LSI.value !== (S.lq[S.ltab]||'')) LSI.value = S.lq[S.ltab] || ''; LSX.style.display = q ? '' : 'none'; }
  if(canQ && q){ $('#lsub').querySelectorAll('button').forEach(b => b.classList.remove('on')); LC.innerHTML = ''; LC.appendChild(leftSearch(S.ltab, q)); }
  else LC.innerHTML = leftContent(S.ltab, sub);
  fillRanges(LC); paintGfxTiles(); paintV8(LC, visTarget());
}
// ---- v27: search box on every library panel (effects, transitions, filters, sounds, text, stickers, templates…) ----
const LSEARCH = {media:'media & library', audio:'sounds & music', text:'text styles & effects', stickers:'stickers', effects:'effects', transitions:'transitions', templates:'templates', filters:'filters', adjust:'LUTs'};
S.lq = S.lq || {};
const LSB = document.createElement('div'); LSB.id = 'lsearch';
LSB.innerHTML = `<span class="lsico">${ic('target')}</span><input type="search" id="lsq" autocomplete="off"><button id="lsx" title="Clear">✕</button>`;
const LRIGHT = document.createElement('div'); LRIGHT.id = 'lright'; LC.parentNode.insertBefore(LRIGHT, LC); LRIGHT.appendChild(LSB); LRIGHT.appendChild(LC);
const LSI = LSB.querySelector('#lsq'), LSX = LSB.querySelector('#lsx');
let lsT = null;
LSI.addEventListener('input', () => { S.lq[S.ltab] = LSI.value; clearTimeout(lsT); lsT = setTimeout(renderLeft, 120); });
LSI.addEventListener('keydown', e => { if(e.key === 'Escape'){ LSI.value = ''; S.lq[S.ltab] = ''; renderLeft(); } });
LSX.addEventListener('click', () => { LSI.value = ''; S.lq[S.ltab] = ''; renderLeft(); LSI.focus(); });
// a sub-category click leaves search mode
$('#lsub').addEventListener('click', e => { if(e.target.closest('[data-lsub]') && S.lq[S.ltab]){ S.lq[S.ltab] = ''; } }, true);
const EMOJI_NAMES = ["heart love", "laugh lol funny", "love eyes", "fire hot", "like thumbs up", "party celebrate", "sparkle magic", "star", "hundred perfect", "cool sunglasses", "party birthday", "sad cry", "angry", "think", "clap applause", "pray thanks namaste", "strong muscle", "cake birthday", "gift present", "flower", "rose flower", "sun", "moon night", "lightning flash", "boom blast", "dizzy star", "music note", "music notes song", "location pin", "check yes tick", "cross no wrong", "warning", "point right arrow", "point left arrow", "point up arrow", "point down arrow", "wow surprised", "star eyes", "angel", "love hearts", "wink fun", "hands celebrate", "sparkling heart love", "broken heart", "trophy winner", "graduation school", "books study school", "diya lamp deepavali festival"];
const STK_NAMES = {thumb:'like thumbs up',heart:'heart love',bell:'bell subscribe notification',comment:'comment chat',share:'share',verified:'verified tick badge',check:'check tick',play:'play video',follow:'follow subscribe',camera:'camera photo',star:'star',pin:'pin location',music:'music',live:'live',new:'new',sale:'sale offer',hot:'hot',arrowR:'arrow right',arrowD:'arrow down',arrowC:'arrow curve',click:'click mouse',circle:'circle ring',cross:'cross wrong',q:'question',ex:'exclamation',num1:'number 1 one',num2:'number 2 two',num3:'number 3 three'};
function leftSearchAll(tab){
  // every category of the panel, each tagged with its category name (so "glitch" also finds effects in the Glitch group)
  const keep = {sfx:S.sfxCat, gfx:S.gfxCat, pf:S.pfCat}, R = [];
  try{
    switch(tab){
      case 'effects': FX_CATS.forEach(c => R.push([c[0], leftContent('effects', c[0])])); R.push(['', leftContent('effects', 'All')]); break;
      case 'transitions': LSUB.transitions.forEach(([k]) => R.push([k, leftContent('transitions', k)])); break;
      case 'filters': PF_CATS.forEach(c => { S.pfCat = c; R.push([c, leftContent('filters', 'filters')]); }); break;
      case 'audio': SFX_CATS.forEach(c => { S.sfxCat = c; R.push([c + ' sound effect', leftContent('audio', 'sfx')]); }); R.push(['music', leftContent('audio', 'yours')]); break;
      case 'text': [['add','text'],['templates','template'],['effects','effect']].forEach(([k,n]) => R.push([n, leftContent('text', k)])); break;
      case 'stickers': [['emoji','emoji'],['social','social'],['badges','badge arrow']].forEach(([k,n]) => R.push([n, leftContent('stickers', k)])); break;
      case 'templates': LSUB.templates.forEach(([k]) => R.push([k, leftContent('templates', k)])); break;
      case 'media': R.push(['', leftContent('media', 'all')]); GFX_CATS.forEach(c => { S.gfxCat = c; R.push([c + ' graphic', leftContent('media', 'library')]); }); break;
      case 'adjust': R.push(['lut', leftContent('adjust', 'lut')]); break;
    }
  } finally { S.sfxCat = keep.sfx; S.gfxCat = keep.gfx; S.pfCat = keep.pf; }
  return R;
}
function leftSearch(tab, q){
  const box = document.createElement('div'); box.className = 'lsres';
  for(const [cat, html] of leftSearchAll(tab)){ const t = document.createElement('div'); t.innerHTML = html; t.querySelectorAll('.tile, .srow, .mtile').forEach(el => el.setAttribute('data-scat', cat)); while(t.firstChild) box.appendChild(t.firstChild); }
  const words = q.split(/\s+/).filter(Boolean), seen = new Map();
  // keep only the items; drop category chips, titles, notes and the "None" tiles
  box.querySelectorAll('.chiprow, .ltitle, .lnote, .lhead, .dropzone, .segstat, .note').forEach(el => el.remove());
  const items = [...box.querySelectorAll('.tile, .srow, .mtile, .tpl, .tpltile')];
  let n = 0;
  for(const el of items){
    const dkey = o => Object.entries(o.dataset).filter(([k]) => k !== 'scat').map(([k,v]) => k+'='+v).join('&');
    const key = dkey(el) || [...el.querySelectorAll('*')].map(dkey).filter(Boolean).join('|');
    const hay = (el.textContent + ' ' + (el.title||'') + ' ' + Object.values(el.dataset).join(' ') + ' ' + (el.querySelector('img') ? el.querySelector('img').alt || '' : '')).toLowerCase();
    const isNone = /=none(&|$)/.test(key) && !/none/.test(q);
    if(isNone || !words.every(w => hay.includes(w)) || (key && seen.has(key))){ el.remove(); continue; }
    if(key) seen.set(key, 1); n++;
  }
  // merge the results into one grid per kind (instead of one small grid per category)
  const groups = new Map(), loose = [];
  for(const el of box.querySelectorAll('.tile, .srow, .mtile')){ const par = el.parentElement; if(par === box){ loose.push(el); continue; }
    const k = par.className; if(!groups.has(k)) groups.set(k, []); groups.get(k).push(el); }
  box.innerHTML = '';
  for(const [cls, els] of groups){ const g = document.createElement('div'); g.className = cls; els.forEach(e => g.appendChild(e)); box.appendChild(g); }
  loose.forEach(e => box.appendChild(e));
  const head = document.createElement('div'); head.className = 'lsinfo'; head.innerHTML = n ? `<b>${n}</b> result${n>1?'s':''} for “${esc(q)}”` : `No results for “${esc(q)}” — try another word`;
  box.prepend(head); return box;
}
function renderMediaPanel(){ renderLeft(); }
function toast(msg){ let t = $('#toast'); if(!t){ t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); } t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2800); }
let gfxAnim = null;
function paintGfxTiles(){ LC.querySelectorAll('canvas[data-gfxc]').forEach(c => paintGfx(c, c.dataset.gfxc, (GFXMAP[c.dataset.gfxc]||{}).thumbT || 1)); }
LC.addEventListener('mouseover', e => {
  const c = e.target.closest('[data-gfx]'); if(!c) return; const cv_ = c.querySelector('canvas'); if(!cv_ || (gfxAnim && gfxAnim.c === cv_)) return;
  if(gfxAnim) cancelAnimationFrame(gfxAnim.raf);
  const t0 = performance.now(), loop = () => { const g = GFXMAP[cv_.dataset.gfxc]; paintGfx(cv_, cv_.dataset.gfxc, ((performance.now()-t0)/1000) % Math.min(g.dur, 6)); gfxAnim.raf = requestAnimationFrame(loop); };
  gfxAnim = {c:cv_, raf:requestAnimationFrame(loop)};
});
LC.addEventListener('mouseout', e => { const c = e.target.closest('[data-gfx]'); if(!c || c.contains(e.relatedTarget)) return; if(gfxAnim){ cancelAnimationFrame(gfxAnim.raf); const cv_ = gfxAnim.c; gfxAnim = null; paintGfx(cv_, cv_.dataset.gfxc, (GFXMAP[cv_.dataset.gfxc]||{}).thumbT||1); } });
function refreshLeftLive(){ if(['effects','transitions','filters','adjust','captions'].includes(S.ltab) || (S.ltab==='text' && S.lsub.text==='styles')) renderLeft(); }
function mediaTile(m){
  const bg = m.thumb ? `background-image:url(${m.thumb})` : '';
  return `<div class="mtile ${m.type}" draggable="${!m.missing}" data-mid="${m.id}" title="${esc(m.name)}">
    <div class="mth" style="${bg}">${m.thumb?'':`<div class="ph">${m.type==='audio'?'🎵':'⚠️'}</div>`}
      ${usedMedia(m.id)?'<span class="badge">Added</span>':''}<span class="dur">${m.type==='image'?'IMG':fmtT(m.duration)}</span>
      <button class="mdel" data-delm="${m.id}" title="Delete from project">✕</button>
      ${m.missing?'':`<div class="acts">${m.type!=='audio'?`<button class="pip" data-pip="${m.id}" title="Add as overlay (PiP)">PiP</button>`:''}<button data-addm="${m.id}" title="Add to timeline">+</button></div>`}
    </div><div class="mnm">${m.missing?'⚠️ ':''}${esc(m.name)}</div></div>`;
}
function captionsAuto(){
  const src = capSource(), m = src && media(src.mediaId);
  return `<div class="ltitle" style="margin-top:0">✨ AI auto captions</div>
    <div class="crow"><span>Audio source</span><b style="max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m?esc(m.name):'— select a clip / audio'}</b></div>
    <div class="crow"><span>Language</span><select id="cLang">${CAP_LANGS.map(([k,n])=>`<option value="${k}" ${S.capLang===k?'selected':''}>${n}</option>`).join('')}</select></div>
    <div class="crow"><span>Model</span><select id="cModel">${[['tiny','Tiny · 40 MB · fast'],['base','Base · 75 MB'],['small','Small · 250 MB · most accurate']].map(([k,n])=>`<option value="${k}" ${(S.capModel||'base')===k?'selected':''}>${n}</option>`).join('')}</select></div>
    <div id="cStatus" style="color:var(--mute);min-height:18px"></div><div class="prog"><div id="cBar"></div></div>
    <button id="cRun" class="primary" style="width:100%;padding:9px" ${src?'':'disabled'}>✨ Generate captions</button>
    <div class="lnote">The AI model runs inside your browser (free). It downloads once, then stays cached. Accuracy varies by language — you can edit captions afterwards.</div>
    <div class="lnote">🎙 Turn on <b>Live captions</b> while recording a voice-over to get captions instantly.</div>`;
}
function leftContent(tab, sub){
  switch(tab){
    case 'media': {
      if(sub === 'library'){
        const cat = S.gfxCat || 'Social', list = GFX.filter(g => cat === 'All' || g.cat === cat);
        return `<div class="chiprow">${GFX_CATS.map(c=>`<button data-gfxcat="${c}" class="${c===cat?'on':''}">${c}</button>`).join('')}</div>
          <div class="tiles gfx">${list.map(g=>`<button class="tile" data-gfx="${g.id}" draggable="true"><div class="tth gth"><canvas data-gfxc="${g.id}" width="176" height="104"></canvas></div><span>${g.name}</span></button>`).join('')}</div>
          <div class="lnote">✨ Animated stock graphics generated by ChitraCut — <b>copyright free</b>, no download. Hover to preview · click = add at playhead · drag to timeline. Text and colours are editable.</div>`;
      }
      const list = S.media.filter(m => sub === 'all' || m.type === sub);
      return `<div class="lhead"><button class="primary" data-l="import">${ic('import')} Import</button><button data-l="rec">${ic('mic')} Record</button></div>
        ${S.media.length ? '' : `<div class="dropzone" data-l="import"><b>Import media</b>Drag video, photo or music files here, or click</div>`}
        <div class="mgrid">${list.map(mediaTile).join('')}</div>
        ${S.media.length ? `<div class="lnote">💡 Drag onto the <b>main track</b> for a clip · <b>above</b> it for an overlay (PiP) · below it for audio.</div>` : ''}`;
    }
    case 'audio': {
      if(sub === 'sfx'){
        const cat = S.sfxCat || 'All', list = SFX.filter(x => cat === 'All' || x.cat === cat);
        return `<div class="chiprow">${SFX_CATS.map(c=>`<button data-sfxcat="${c}" class="${c===cat?'on':''}">${c}</button>`).join('')}</div>
          ${list.map(x=>`<div class="srow"><button class="sico" data-sfxp="${x.id}" title="Listen">${ic('play')}</button><div class="sinfo"><b>${x.name}</b><span>ChitraCut · ${x.cat} · ${fmtT(Math.max(1,x.dur))}</span></div><button class="sadd" data-sfx="${x.id}" title="Add at playhead">${ic('plus')}</button></div>`).join('')}
          <div class="lnote">🔊 These sound effects are generated by ChitraCut — copyright free, work offline, completely free.</div>`;
      }
      if(sub === 'yours'){
        const list = S.media.filter(m => m.type === 'audio');
        return `<div class="lhead"><button class="primary" data-l="audioimp">${ic('import')} Import music</button></div>
          ${list.length ? list.map(m=>`<div class="srow"><button class="sico" data-ap="${m.id}" title="Listen">${ic(apEl&&apEl.dataset.id===m.id&&!apEl.paused?'pause':'play')}</button><div class="sinfo"><b>${esc(m.name)}</b><span>${fmtT(m.duration)}</span></div><button class="sadd" data-addm="${m.id}" title="Add at playhead">${ic('plus')}</button><button class="sadd" data-delm="${m.id}" title="Delete">${ic('trash')}</button></div>`).join('') : '<div class="lnote">Your music / audio files appear here. MP3, WAV and M4A are supported.</div>'}`;
      }
      if(sub === 'tts') return ttsBody(null);
      return `<div class="dropzone" data-l="rec"><b>🎙 Voice-over record</b>Records your voice from the playhead (${fmtTC(S.time)})</div>
        <div class="lnote">The video plays while you record — headphones are recommended. Turn on Live captions to turn speech into captions instantly (Chrome).</div>`;
    }
    case 'templates': return templatesGrid(sub);
    case 'text': {
      if(sub === 'templates') return `<div class="tiles ttpl">${TEXT_TPL.map(t=>`<button class="tile" data-ttpl="${t.id}"><div class="tth tfxth"><canvas data-ttc="${t.id}" width="150" height="84"></canvas></div><span>${t.name}</span></button>`).join('')}</div><div class="lnote">Click = add at playhead, then edit the text.</div>`;
      if(sub === 'effects'){ const o = selOv(); return `<div class="ltitle" style="margin-top:0">${o && o.type==='text' ? 'Apply effect to selected text' : 'Click = add new text'}</div>` + tfxGrid(o && o.type === 'text' ? o.tfx : null); }
      if(sub === 'styles'){
        const o = selOv(), on = o && o.type === 'text';
        return `<div class="ltitle" style="margin-top:0">${on ? 'Apply style to selected text' : 'Click = add new text'}</div>
          <div class="tiles tstyle">${TEXT_PRESETS.map((p,i)=>`<button class="tile" data-tpreset="${i}"><div class="tth" style="${presetCss(p)}">Aa</div></button>`).join('')}</div>`;
      }
      return `<div class="tiles tstyle">${TEXT_ADD.map(([k,n,p])=>`<button class="tile" data-addtext="${k}"><div class="tth" style="${presetCss({color:'#fff',...p})};font-size:${k==='default'?13:16}px">${k==='default'?'Default text':esc(p.text)}</div><span>${n}</span></button>`).join('')}</div>
        <div class="lnote">After selecting text, change font, colour and animation on the right. 70+ fonts in many languages.</div>`;
    }
    case 'stickers':
      if(sub === 'social' || sub === 'badges') return `<div class="tiles small">${STICKER_SETS[sub].map(k=>`<button class="tile emoji" data-stk="svg:${k}" title="${STK_NAMES[k]||k}"><div class="tth"><img src="${SVG_URL[k]}" style="width:44px;height:44px"></div></button>`).join('')}</div>
        <div class="lnote">These are ChitraCut original generic icons (Like, Bell, Verified ✓, Share…). Real platform logos are trademarks, so they are not included.</div>`;
      return `<div class="tiles small">${EMOJIS.map((e,i)=>`<button class="tile emoji" data-stk="${e}" title="${EMOJI_NAMES[i]||''}"><div class="tth">${e}</div></button>`).join('')}</div>`;
    case 'effects': {
      const it = normItem(visTarget()), th = SCENES.portrait.src, head = `<div class="ltitle" style="margin-top:0">${it ? 'Selected: '+esc((media(it.mediaId)||{}).name||'') : 'Select a clip first'}</div>`;
      if(sub === 'body'){
        const cur = it ? it.bfx.type : '';
        const st = !it || cur === 'none' ? '' : SEG ? '<div class="segstat ok">✓ AI body detection ready</div>' : segErr ? `<div class="segstat err">✗ ${esc(segErr)} — internet needed</div>` : '<div class="segstat">⏳ Loading AI model… (first time only)</div>';
        return head + `<div class="tiles">${BFX.map(([k,n])=>`<button class="tile ${cur===k?'on':''}" data-bfx="${k}"><div class="tth">${k==='none'?ic('ban'):`<div class="pv bfx-${k}" style="background-image:url(${th})"><i></i></div>`}</div><span>${n}</span></button>`).join('')}</div>
          ${it && cur !== 'none' ? `<div style="margin-top:14px">${st}${sl(it,'Intensity','bfx.amount',0,100)}${['bodyGlow','neonOutline','bgTint','ghost'].includes(cur)?colorRow(it,'Color','bfx.color',true):''}</div>` : ''}
          <div class="lnote">🧍 Body effects use AI to find the person and apply the effect around them or to the background only (Portrait blur, Color pop, Glow…). Works best when the person is clearly visible.</div>`;
      }
      const keys = sub === 'All' ? FX.map(f=>f[0]) : ['none', ...(FX_CATS.find(c=>c[0]===sub)||FX_CATS[0])[1]], cur = it ? it.fx.type : '';
      return head + `<div class="tiles gtiles">${keys.map(k=>FX.find(f=>f[0]===k)).filter(Boolean).map(([k,n],i)=>`<button class="tile ${cur===k?'on':''}" data-fx="${k}"><div class="tth">${k==='none'?ic('ban'):`<canvas class="gpv" data-pfx="${k}" data-i="${i}" width="112" height="84"></canvas>`}</div><span>${n}</span></button>`).join('')}</div>
        ${it && cur !== 'none' ? `<div style="margin-top:14px">${sl(it,'Intensity','fx.amount',0,100)}${sl(it,'Speed','fx.speed',0,100)}</div>${!it.type?'<div class="btns"><button data-all="fx">Apply to all clips</button></div>':''}` : ''}
        <div class="lnote">⚡ Hover a tile for a live preview. Click to see it in the player. Use an Adjustment layer to apply to many clips at once.</div>`;
    }
    case 'transitions': {
      const c = transTarget(), i = c ? S.clips.indexOf(c) : -1, cur = c ? c.trans.type : '';
      const keys = sub === 'All' ? TRANS.map(t=>t[0]) : ['none', ...(TRANS_CATS.find(z=>z[0]===sub)||TRANS_CATS[0])[1]];
      return `<div class="ltitle" style="margin-top:0">${c ? `Clip ${i} → Clip ${i+1}` : 'A transition needs at least 2 clips'}</div>
        <div class="tiles gtiles">${keys.map(k=>TRANS.find(t=>t[0]===k)).filter(Boolean).map(([k,n],i)=>`<button class="tile ${cur===k?'on':''}" data-tr="${k}"><div class="tth">${k==='none'?ic('ban'):`<canvas class="gpv" data-ptr="${k}" data-i="${i}" width="112" height="84"></canvas>`}</div><span>${n}</span></button>`).join('')}</div>
        ${c ? '<div class="btns" style="margin-top:12px"><button data-all="trans">Apply to all clips</button></div>' : ''}
        <div class="lnote">Hover a tile for a live preview. You can also click <b>⇄</b> between two clips on the timeline.</div>`;
    }
    case 'captions':
      if(sub === 'edit') return captionsEditor();
      if(sub === 'srt') return `<div class="ltitle" style="margin-top:0">SRT subtitle file</div>
        <div class="btns"><button id="cSrtIn">${ic('import')} Import .srt</button><button id="cSrtOut">${ic('export')} Export .srt</button></div>
        <div class="btns"><button id="cDelAll">${ic('trash')} Delete all captions</button></div>
        <div class="lnote">Use Export .srt for YouTube subtitles. Select a caption on the timeline to edit it.</div>`;
      return captionsAuto();
    case 'filters': {
      const it = visTarget(), cat = S.pfCat || 'Featured', cur = it ? it.filter : '';  // 'All' = every grade (used by search)
      const head = `<div class="ltitle" style="margin-top:0">${it ? 'Selected: '+esc((media(it.mediaId)||{}).name||'') : 'Select a clip first'}</div>
        <div class="chiprow">${PF_CATS.map(c=>`<button data-pfcat="${c}" class="${c===cat?'on':''}">${c}</button>`).join('')}</div>`;
      let tiles;
      if(cat === 'Basic'){ const th = SCENES.portrait.src; tiles = Object.keys(FILTERS).map(k=>`<button class="tile ${cur===k?'on':''}" draggable="true" data-filt="${k}"><div class="tth">${k==='none'?ic('ban'):`<div class="pv" style="background-image:url(${th});filter:${FILTER_CSS[k]}"></div>`}</div><span>${FILTER_NAMES[k]}</span></button>`).join(''); }
      else {
        const list = (cat === 'Featured' ? PF_FEATURED.map(id => PF_MAP[id]) : cat === 'All' ? PRO_FILTERS : PRO_FILTERS.filter(f => f.cat === cat)).filter(Boolean), th = pfThumbs(list);
        tiles = `<button class="tile ${cur==='none'?'on':''}" data-filt="none"><div class="tth">${ic('ban')}</div><span>None</span></button>` +
          list.map(f=>`<button class="tile ${cur==='pf:'+f.id?'on':''}" draggable="true" data-filt="pf:${f.id}"><div class="tth"><img class="pfimg" draggable="false" src="${th[f.id]}"></div><span>${f.name}</span></button>`).join('');
      }
      return head + `<div class="tiles">${tiles}</div>
        ${it && cur !== 'none' ? `<div style="margin-top:14px"><div class="ltitle" style="margin:0 0 6px">${esc(filterName(cur))}</div>${sl(it,'Strength','filterAmt',0,100)}</div><div class="btns">${it.type!=='adjust'?`<button data-all="filter">Apply to all clips</button><button data-addfl="${cur}">${ic('layers')} Add as filter layer</button>`:''}</div>` : ''}
        <div class="lnote">🎬 ${PRO_FILTERS.length} pro colour grades — selective colour (HSL) + real 3D LUTs on the GPU; <b>HD</b> looks also add detail. Use <b>Strength</b> to blend, and <b>Adjust</b> on the right to fine-tune.</div>`;
    }
    case 'adjust': {
      const it = visTarget(), addB = `<div class="lhead"><button class="primary" data-addadj="1">${ic('plus')} Adjustment layer</button></div>`;
      if(!it) return addB + '<div class="lnote">Select a clip first, or add an Adjustment layer to apply to many clips at once.</div>';
      if(sub === 'adjust') return addB + adjustBody(it);
      return addB + lutBody(it);
    }
  }
  return '';
}
function lutBody(it){
  return `<div class="tiles">${[['','None'],...S.luts.map(l=>[l.id,l.name])].map(([k,n],i)=>`<button class="tile ${it.lut===k?'on':''}" data-set="lut" data-val="${k}"><div class="tth" style="${k?`background:linear-gradient(135deg,hsl(${i*47},55%,45%),hsl(${i*47+60},60%,25%))`:''}">${k?'':ic('ban')}</div><span>${esc(n)}</span></button>`).join('')}</div>
    <div style="height:12px"></div>${it.lut?sl(it,'Intensity','lutAmt',0,100):''}
    <div class="btns"><button data-act="importLut">${ic('import')} Import .cube LUT</button>${!it.type?'<button data-all="lut">Apply to all clips</button>':''}</div>`;
}
function adjustBody(it, right){
  const f = it.filter && it.filter !== 'none' ? `<div class="crow"><span>Filter</span><b style="color:var(--text)">${esc(filterName(it.filter))} · ${it.filterAmt}%</b></div>` : '';
  return (right ? '<div style="height:8px"></div>' : '') +
    sec('adjL','Light', sl(it,'Exposure','adj.exposure',-100,100)+sl(it,'Brightness','adj.brightness',-100,100)+sl(it,'Contrast','adj.contrast',-100,100)+
      sl(it,'Highlights','adj.highlights',-100,100)+sl(it,'Shadows','adj.shadows',-100,100), {reset:'resetAdj'}) +
    sec('adjC','Color', sl(it,'Saturation','adj.saturation',-100,100)+sl(it,'Vibrance','adj.vibrance',-100,100)+sl(it,'Temperature','adj.temp',-100,100)+
      sl(it,'Tint','adj.tint',-100,100)+sl(it,'Hue','adj.hue',-100,100)) +
    sec('adjE','Effects', sl(it,'Fade','adj.fade',0,100)+sl(it,'Vignette','adj.vignette',-100,100)+sl(it,'Grain','adj.grain',0,100)+sl(it,'Sharpen','adj.sharpen',0,100)) +
    (right ? sec('adjF','Filter & LUT', f + lutBody(it)) : '') +
    (!it.type ? '<div class="btns"><button data-all="filter">Apply to all clips</button></div>' : '');
}
function addTextPreset(k){
  const p = TEXT_ADD.find(x => x[0] === k); if(!p) return;
  const o = newOverlay('text', deep(p[2])); if(p[2].font) ensureFont(p[2].font);
  addOverlay(o, 'text');
}
function openCaptions(){ S.ltab = 'captions'; S.lsub.captions = 'auto'; renderLeft(); $('#left').scrollIntoView({behavior:'smooth',block:'nearest'}); }

$('#ltabs').addEventListener('click', e => { const b = e.target.closest('[data-ltab]'); if(b){ S.ltab = b.dataset.ltab; renderLeft(); } });
$('#lsub').addEventListener('click', e => { const b = e.target.closest('[data-lsub]'); if(b){ S.lsub[S.ltab] = b.dataset.lsub; renderLeft(); } });
LC.addEventListener('click', async e => {
  const t = e.target.closest('button,[data-l],.mtile'); if(!t) return;
  const d = t.dataset;
  if(d.l === 'import') return $('#fileIn').click();
  if(d.l === 'rec') return openRecord();
  if(d.l === 'audioimp') return $('#audioIn').click();
  if(t.id === 'cRun'){ S.capLang = $('#cLang').value; S.capModel = $('#cModel').value; runCaptions(); return; }
  if(t.id === 'cSrtIn') return $('#srtIn').click();
  if(t.id === 'cSrtOut') return exportSRT();
  if(t.id === 'cDelAll'){ const n = S.overlays.filter(o=>o.caption).length; if(n && confirm(n+' captions — delete?')){ pushUndo(); S.overlays = S.overlays.filter(o=>!o.caption); afterEdit(); } return; }
  if(d.delm){ deleteMedia(d.delm); return; }
  if(d.pip){ addPip(media(d.pip)); return; }
  const mid = d.addm;
  if(!mid && t.classList.contains('mtile')){ LC.querySelectorAll('.mtile.pick').forEach(x => x.classList.remove('pick')); t.classList.add('pick'); return; }
  if(mid){
    const m = media(mid); if(!m || m.missing) return;
    if(m.type === 'audio') addAudioAt(m, {start:S.time}); else insertMediaClip(m, S.mainEnd + 1);
    renderLeft(); return;
  }
  if(d.ap){
    const m = media(d.ap);
    if(apEl && apEl.dataset.id === d.ap && !apEl.paused){ apEl.pause(); }
    else { if(apEl) apEl.pause(); apEl = new Audio(m.url); apEl.dataset.id = d.ap; apEl.onended = renderLeft; apEl.play(); }
    renderLeft(); return;
  }
  if(d.sfxcat){ S.sfxCat = d.sfxcat; renderLeft(); return; }
  if(d.sfxp){ previewSFX(d.sfxp); return; }
  if(d.sfx){ t.disabled = true; try{ await addSFX(d.sfx); }catch(err){ alert(err.message); } renderLeft(); return; }
  if(d.addtext){ addTextPreset(d.addtext); return; }
  if(d.tpreset != null){
    const o = selOv(), p = deep(TEXT_PRESETS[+d.tpreset]);
    if(o && o.type === 'text'){ pushUndo(); Object.assign(o, p); renderInspector(); }
    else addOverlay(newOverlay('text', {text:'Your text here', ...p}), 'text');
    return;
  }
  if(d.gfxcat){ S.gfxCat = d.gfxcat; renderLeft(); return; }
  if(d.gfx){ addGfx(d.gfx, S.time); return; }
  if(d.stk){ addOverlay(newOverlay('sticker', {text:d.stk, anim:{in:'pop',out:'fade',loop:'none',inDur:.5,outDur:.4}}), 'sticker'); return; }
  if(d.fx){
    const it = visTarget(); if(!it) return alert('Select a clip first');
    pushUndo(); it.fx.type = d.fx; S.sel = it.id;
    renderTimeline(); renderInspector();
    if(d.fx !== 'none'){ const st = itemStart(it); previewPlay(clamp(S.time, st, st + Math.max(0, itemDur(it) - 2)), 2); }
    return;
  }
  if(d.fxcat){ S.fxCat = d.fxcat; renderLeft(); return; }
  if(d.pfcat){ S.pfCat = d.pfcat; renderLeft(); return; }
  if(d.bfx){
    const it = normItem(visTarget()); if(!it) return alert('Select a clip first');
    pushUndo(); it.bfx.type = d.bfx; S.sel = it.id; if(d.bfx !== 'none') loadSeg().catch(()=>{});
    renderTimeline(); renderInspector(); renderLeft();
    if(d.bfx !== 'none'){ const st = itemStart(it); previewPlay(clamp(S.time, st, st + Math.max(0, itemDur(it) - 2)), 2); }
    return;
  }
  if(d.tr){
    const c = transTarget(); if(!c) return alert('A transition needs at least 2 clips');
    pushUndo(); c.trans.type = d.tr; S.sel = c.id; S.rt[kindOf(c)] = 'trans'; afterEdit();
    if(d.tr !== 'none'){ const dd = derived[c.id]; previewPlay(Math.max(0, dd.start - .8), dd.td + 1.6); }
    return;
  }
  if(d.filt){
    const it = visTarget(); if(!it) return alert('Select a clip first');
    pushUndo(); it.filter = d.filt; S.sel = it.id; renderTimeline(); renderInspector(); renderLeft(); return;
  }
  const it = visTarget();
  if(doClick(t, it)) return;
});
LC.addEventListener('input', e => { if(v8Input(e)) return; if(e.target.id === 'cLang' || e.target.id === 'cModel') return; onParamInput(e, visTarget()); });
LC.addEventListener('change', e => {
  if(e.target.id === 'cLang') S.capLang = e.target.value;
  else if(e.target.id === 'cModel') S.capModel = e.target.value;
  else { editing = false; renderTimeline(); }
});
let ccDrag = false;   // a drag that started inside the app (never import it as a new file)
document.addEventListener('dragstart', () => { ccDrag = true; }, true);
document.addEventListener('dragend', () => { setTimeout(() => { ccDrag = false; }, 0); TL.classList.remove('dragging'); }, true);
// apply a dragged filter to the clip / layer it was dropped on
function dropFilter(val, it){
  if(!it) return alert('Drop the filter on a clip');
  if(!(!it.type || isMediaOv(it) || it.type === 'adjust')) return;
  pushUndo(); it.filter = val; S.sel = it.id; afterEdit(); renderTimeline(); renderInspector(); renderLeft();
}
LC.addEventListener('dragstart', e => {
  const fl = e.target.closest && e.target.closest('[data-filt]');
  if(fl){ e.dataTransfer.setData('text/plain', 'ccfilt:' + fl.dataset.filt); e.dataTransfer.effectAllowed = 'copy'; TL.classList.add('dragging'); return; }
  const g = e.target.closest('[data-gfx]');
  if(g){ e.dataTransfer.setData('text/plain', 'ccgfx:' + g.dataset.gfx); e.dataTransfer.effectAllowed = 'copy'; TL.classList.add('dragging'); return; }
  const t = e.target.closest('.mtile'); if(!t){ e.preventDefault(); return; }   // preview pictures are not draggable
  e.dataTransfer.setData('text/plain', 'ccmedia:' + t.dataset.mid); e.dataTransfer.effectAllowed = 'copy';
  TL.classList.add('dragging');
});
LC.addEventListener('dragend', () => { TL.classList.remove('dragging'); setZone(null); });

/* =====================================================================
   RIGHT INSPECTOR
   ===================================================================== */
const RT = {
  clip:[['video','Video'],['audio','Audio'],['speed','Speed'],['anim','Animation'],['trans','Transition'],['adjust','Adjust']],
  clipimg:[['video','Video'],['speed','Duration'],['anim','Animation'],['trans','Transition'],['adjust','Adjust']],
  ovvideo:[['video','Video'],['audio','Audio'],['speed','Speed'],['anim','Animation'],['track','Tracking'],['adjust','Adjust']],
  ovimage:[['video','Image'],['anim','Animation'],['track','Tracking'],['adjust','Adjust']],
  gfx:[['gfx','Graphic'],['anim','Animation'],['track','Tracking']],
  adjust:[['adjust','Adjust'],['layer','Layer']],
  text:[['text','Text'],['anim','Animation'],['tts','Text to speech'],['track','Tracking']], sticker:[['sticker','Sticker'],['anim','Animation'],['track','Tracking']], audio:[['audio','Audio']]
};
function rsubFor(tab, kind){
  switch(tab){
    case 'video': return [['basic','Basic'],['rmbg','Remove BG'],['mask','Mask'],['retouch','Retouch']];
    case 'audio': return kind === 'ovvideo' ? null : [['basic','Basic'],['voice','Voice changer'],['fx','Effects']];
    case 'speed': return kind === 'clip' ? [['normal','Normal'],['curve','Curve']] : null;
    case 'anim': return [['in','In'],['out','Out'],['combo',(kind==='clip'||kind==='clipimg')?'Combo':'Loop']];
    case 'adjust': return null;
    case 'text': return [['basic','Basic'],['style','Style'],['effects','Effects'],['bubble','Bubble']];
  }
  return null;
}
function renderInspector(){
  const it = selItem(), kind = kindOf(it);
  if(!it){
    $('#rtabs').innerHTML = ''; $('#rsub').innerHTML = '';
    $('#rtabs').innerHTML = '<button class="on">Details</button>';
    const nV = S.clips.filter(c => !isImg(c)).length, nP = S.clips.length - nV, R = S.ratio === 'orig' ? 'Original' : S.ratio;
    const row = (k, v) => `<div class="drow"><span>${k}</span><b>${v}</b></div>`;
    IB.innerHTML = `<div class="details">${row('Name:', esc(S.project ? S.project.name : 'Project'))}${row('Saved in:', 'This browser (auto-save)')}${row('Duration:', fmtTC(S.total||0))}${row('Clips:', `${nV} video · ${nP} photo · ${S.audios.length} audio · ${S.overlays.length} layers`)}
      <div class="dsep"></div>${row('Aspect ratio:', R)}${row('Resolution:', out.width + ' × ' + out.height)}${row('Preview quality:', (S.quality||720) + 'p')}${row('Frame rate:', '30.00fps')}
      <div class="dsep"></div><div class="dhint">${ic('cursor')}Select a clip, text or audio on the timeline to edit it.</div></div>`;
    refreshLeftLive(); renderMTools(); return;
  }
  let tabs = RT[kind];
  if((kind === 'clip' || kind === 'clipimg') && S.clips.indexOf(it) === 0) tabs = tabs.filter(t => t[0] !== 'trans');
  let tab = S.rt[kind]; if(!tabs.some(t => t[0] === tab)) tab = S.rt[kind] = tabs[0][0];
  $('#rtabs').innerHTML = tabs.map(([k,n])=>`<button data-rtab="${k}" class="${k===tab?'on':''}">${n}</button>`).join('');
  const subs = rsubFor(tab, kind); let sub = null;
  if(subs){
    sub = S.rs[tab]; if(!subs.some(s => s[0] === sub)) sub = S.rs[tab] = subs[0][0];
    $('#rsub').innerHTML = `<div class="seg">${subs.map(([k,n])=>`<button data-rsub="${k}" class="${k===sub?'on':''}">${n}</button>`).join('')}</div>`;
  } else $('#rsub').innerHTML = '';
  normItem(it); IB.innerHTML = inspBody(it, kind, tab, sub); fillRanges(IB); updKfBtn(); refreshLeftLive(); paintV8(IB, it); renderMTools();
}
const KF_NOTE = '<div class="note">◆ <b>Keyframe:</b> place the playhead → press ◆ → move the playhead → change a value. It animates automatically in between.</div>';
function transformSec(it){
  const ov = !!it.type, med = isMediaOv(it);
  let b = ov ? sl(it,'Size','size',5,med?300:400)+sl(it,'Position X','x',-20,120,.5)+sl(it,'Position Y','y',-20,120,.5)
             : sl(it,'Scale','tf.scale',10,400)+sl(it,'Position X','tf.x',-1440,1440)+sl(it,'Position Y','tf.y',-1440,1440);
  b += sl(it,'Rotate',ov?'rot':'tf.rot',-180,180);
  const B = (a,i,t) => `<button data-act="${a}" title="${t}">${ic(i)}</button>`;
  b += `<div class="alignbar">${ov?B('center','center','Center'):B('fit','fit','Fit')}${(!ov||med)?B(ov?'fillv':'fill','fill','Fill / full screen')+B('flip','flip','Mirror'):''}${B('rot90','rotate','Rotate 90°')}${ov?B('up','up','Bring forward')+B('down','down','Send backward'):''}</div>`;
  const k = atKf(it);
  if(k){ const cur = k.ease || 'smooth';
    b += `<div class="ltitle" style="margin:10px 0 6px">Keyframe easing <small style="font-weight:400">(from this ◆ to the next ◆)</small></div><div class="easeg">${EASE_LIST.map(([e,n])=>{ let d=''; for(let i=0;i<=24;i++){ const f=i/24, v=EASE[e](f); d+=(i?'L':'M')+(4+f*40).toFixed(1)+','+(30-v*24).toFixed(1); }
      return `<button class="${cur===e?'on':''}" data-ease="${e}" title="${n}"><svg viewBox="0 0 48 34"><path d="${d}"/></svg><span>${n}</span></button>`; }).join('')}</div>`; }
  return sec('tf','Transform',b,{reset:'resetTf',kf:true});
}
function chromaBody(it){
  const k = it.ck;
  return `<div class="crow"><span>Chroma key</span><input type="checkbox" data-p="ck.on" ${k.on?'checked':''}></div>
    ${k.on ? `<div class="crow"><span>Key color</span><input type="color" data-p="ck.color" value="${k.color}"></div>
    <div class="btns"><button data-act="ckPick" class="${S.pick?'primary':''}">🎯 Pick color</button><button data-act="ckAuto">Auto</button><button data-act="ckGreen">Green</button><button data-act="ckBlue">Blue</button></div>
    ${sl(it,'Intensity','ck.sim',0,100)}${sl(it,'Edge smooth','ck.smooth',0,100)}${sl(it,'Spill remove','ck.spill',0,100)}` : ''}
    <div class="note">🟩 Removes green / blue screen. If it is not clean, press 🎯 and click the green area in the player.</div>`;
}
function rmbgBody(it){
  const st = !it.rmbg ? '' : SEG ? '<div class="segstat ok">✓ AI model ready</div>' : segErr ? `<div class="segstat err">✗ ${esc(segErr)} — internet needed</div>` : '<div class="segstat">⏳ Loading AI model… (first time only)</div>';
  return sec('rm','Auto removal', `<div class="crow"><span>Remove background (keep person)</span><input type="checkbox" data-p="rmbg" ${it.rmbg?'checked':''}></div>${st}
      ${it.rmbg?`<div class="crow"><span>Invert</span><input type="checkbox" data-p="rmbgInv" ${it.rmbgInv?'checked':''}></div>`:''}
      <div class="note">🤖 AI detects the person right in your browser (no server). ${it.type?'The main video below shows through as the background.':'The player Background (Black / White / Blur) shows behind — choose <b>Blur</b> for a portrait effect. For another background, drag this clip to an overlay track.'}</div>`)
    + sec('ck','Chroma key', chromaBody(it));
}
function maskBody(it){
  const m = it.mask, t = m.type;
  let h = `<div class="ltitle" style="margin:10px 0 8px">${t==='none' ? '＋ Add mask — choose a shape' : 'Mask shape'}</div>
    <div class="tiles" style="grid-template-columns:repeat(4,1fr)">${MASKS.map(([k,n])=>`<button class="vtile ${t===k?'on':''}" style="height:52px" data-set="mask.type" data-val="${k}">${k==='none'?'✕ Remove':n}</button>`).join('')}</div><div style="height:12px"></div>`;
  if(t !== 'none'){
    let b = sl(it,'Position X','mask.x',-60,60,.5)+sl(it,'Position Y','mask.y',-60,60,.5);
    if(t === 'mirror') b += sl(it,'Width','mask.h',1,200);
    else if(t === 'circle' || t === 'rect') b += sl(it,'Width','mask.w',1,300)+sl(it,'Height','mask.h',1,300);
    else if(t !== 'linear') b += sl(it,'Size','mask.h',1,300);
    b += sl(it,'Rotate','mask.rot',-180,180)+sl(it,'Feather','mask.feather',0,100);
    if(t === 'rect') b += sl(it,'Round corners','mask.round',0,100);
    b += `<div class="crow"><span>Invert</span><input type="checkbox" data-p="mask.invert" ${m.invert?'checked':''}></div>`;
    h += `<div class="note">🖐 While this tab is open, dragging in the player moves <b>only the mask</b> (not the video). Mouse wheel / two fingers = mask size.</div>` + sec('mk','Mask settings', b, {reset:'resetMask'});
  } else h += '<div class="note">A mask shows only the area inside the shape. Drag the mask in the player to move it.</div>';
  return h;
}
function fxBody(it){
  const th = SCENES.beach.src, f = it.fx;
  return `<div class="tiles" style="margin-top:8px">${FX.map(([k,n])=>`<button class="tile ${f.type===k?'on':''}" data-set="fx.type" data-val="${k}" data-prev="fx"><div class="tth">${k==='none'?ic('ban'):`<div class="pv fx-${k}" style="background-image:url(${th})"></div>`}</div><span>${n}</span></button>`).join('')}</div>
    ${f.type!=='none' ? `<div style="height:12px"></div>${sl(it,'Intensity','fx.amount',0,100)}${sl(it,'Speed','fx.speed',0,100)}` : ''}
    ${!it.type ? '<div class="btns"><button data-all="fx">Apply to all clips</button></div>' : ''}`;
}
const VOICE_TILES = [['orig','Original'],['michog','Mic Hog'],['studio','Studio Voice'],['podcast','Podcast'],['echo','Echo'],['bighouse','Big House'],['cave','Cave'],['megaphone','Megaphone'],['telephone','Telephone'],['radio','Radio'],['robot','Robot'],['lofi','Lo-Fi'],['deep','Deep'],['chipmunk','Chipmunk'],['monster','Monster'],['underwater','Underwater']];
function curVoice(it){ const a = it.audio; if(a.voice !== 'none') return a.voice; if(a.reverb > 0 && !a.echo) return 'bighouse'; if(a.echo > 0 && !a.reverb) return 'echo'; return (a.echo||a.reverb) ? '' : 'orig'; }
const EQ_PRESETS = [['flat','Flat',[0,0,0,0,0,0,0,0,0,0]],['bass','Bass Boost',[6,5,4,2,0,0,0,0,0,0]],['vocal','Vocal',[-3,-2,-1,0,2,3,4,3,1,0]],['treble','Treble Boost',[0,0,0,0,0,1,2,4,5,6]],
  ['podcast','Podcast',[-6,-3,0,1,0,1,3,3,1,-1]],['loud','Loudness',[5,4,1,0,-1,0,1,2,4,5]],['radio','Radio',[-12,-8,-3,2,4,4,2,-2,-8,-12]],['warm','Warm',[2,3,3,1,0,-1,-1,-2,-2,-3]]];
function audioFxBody(it){
  const a = it.audio, eqLab = ['31','62','125','250','500','1k','2k','4k','8k','16k'], ck = (p,t) => `<div class="crow"><span>${t}</span><input type="checkbox" data-p="${p}" ${getP(it,p)?'checked':''}></div>`;
  const eq = `<div class="chiprow" style="margin:2px 0 10px">${EQ_PRESETS.map(([k,n])=>`<button data-act="eqp" data-val="${k}">${n}</button>`).join('')}</div>
    <div class="geq">${a.eq.map((g,i)=>`<div class="band"><input type="range" orient="vertical" min="-12" max="12" step="1" value="${g}" data-p="audio.eq.${i}"><b>${g>0?'+':''}${g}</b><span>${eqLab[i]}</span></div>`).join('')}</div>`;
  return '<div style="height:8px"></div>' +
    sec('aeq','Graphic EQ (10-band)', eq + sl(it,'Bass','audio.bass',-15,15)+sl(it,'Treble','audio.treble',-15,15)) +
    sec('adyn','Dynamics', ck('audio.comp','Compressor') + (a.comp ? sl(it,'Threshold (dB)','audio.compThr',-60,0)+sl(it,'Ratio','audio.compRatio',1,20,.5) : '') +
      ck('audio.gate','Noise gate (silences noise between words)') + (a.gate ? sl(it,'Gate threshold (dB)','audio.gateThr',-80,-10) : '') +
      ck('audio.limiter','Limiter (prevents clipping)') + sl(it,'Amplify (dB)','audio.amp',-20,20,.5)) +
    sec('apit','Pitch', sl(it,'Pitch (semitones)','audio.pitch',-12,12,1) + '<div class="note">Changes pitch without changing speed.</div>') +
    sec('aecho','Echo & Reverb', sl(it,'Echo mix','audio.echo',0,100)+sl(it,'Echo delay (s)','audio.echoTime',.05,1.5,.01)+sl(it,'Echo feedback','audio.echoFb',0,85)+
      sl(it,'Reverb mix','audio.reverb',0,100) + `<div class="crow"><span>Room</span><select data-p="audio.reverbSize">${REVERBS.map(([k,n])=>`<option value="${k}" ${a.reverbSize===k?'selected':''}>${n}</option>`).join('')}</select></div>`) +
    sec('amod','Modulation & Distortion', sl(it,'Phaser','audio.phaser',0,100)+sl(it,'Wah-wah','audio.wah',0,100)+sl(it,'Tremolo','audio.trem',0,100)+sl(it,'Distortion','audio.dist',0,100)) +
    sec('afil','Filters', sl(it,'High-pass (Hz, 0=off)','audio.hp',0,1000,10)+sl(it,'Low-pass (Hz, 0=off)','audio.lp',0,20000,100)) +
    `<div class="btns"><button data-act="aReverse">${ic('undo')} Reverse audio</button><button data-act="aReset">${ic('reset')} Reset effects</button></div>
    <div class="note">🎚 Studio-style effects — all real-time; move sliders while playing to hear them. Included in export.</div>` +
    (!it.type ? '<div class="btns"><button data-all="audio">Apply to all clips</button></div>' : '');
}
function audioBody(it, kind, sub){
  if(sub === 'fx') return audioFxBody(it);
  if(sub === 'voice') return voiceBody(it);
  if(sub === 'voiceOld'){
    const cv_ = curVoice(it);
    return `<div style="height:8px"></div><div class="vtiles">${VOICE_TILES.map(([k,n])=>`<button class="vtile ${cv_===k?'on':''}" data-voice="${k}">${n}</button>`).join('')}</div>
      ${sec('vfx','Fine tune', sl(it,'Echo','audio.echo',0,100)+sl(it,'Reverb','audio.reverb',0,100))}
      <div class="note">🎧 Click a voice to hear a 3-second preview.</div>
      ${!it.type?'<div class="btns"><button data-all="audio">Apply to all clips</button></div>':''}`;
  }
  let h = '';
  if(kind === 'audio'){ const m = media(it.mediaId) || {}; h += `<div class="note">${{voice:'🎙 Voice-over',extract:'🔊 Extracted audio',sfx:'🔔 Sound effect'}[it.kind]||'🎵 Music'} · <b>${esc(m.name||'')}</b></div>`; }
  let vb = sl(it,'Volume','volume',0,200);
  if(kind !== 'ovvideo') vb += sl(it,'Fade in','fadeIn',0,5,.1)+sl(it,'Fade out','fadeOut',0,5,.1);
  if(kind === 'audio') vb += sl(it,'Duration','dur',.2,Math.max(.2,((media(it.mediaId)||{duration:1}).duration-it.in)/it.speed),.1);
  h += sec('vol','Basic', vb);
  if(kind !== 'ovvideo'){
    const a = it.audio, chk = (p,t,d,on) => `<div class="chk"><label><input type="checkbox" data-p="${p}" ${on?'checked':''}><b>${t}</b></label><div class="cdesc">${d}</div></div>`;
    const dnOn = kind === 'audio' && !!it.origMediaId;
    h += sec('vt','Voice tools',
      chk('audio.norm','Normalize loudness', `Brings volume to a standard level${a.norm&&it.normGain?` · ×${it.normGain.toFixed(2)}`:''}`, a.norm) +
      chk('audio.enhance','Enhance voice','Clearer, louder voice (EQ + compressor)', a.enhance) +
      `<div class="chk"><label><input type="checkbox" data-dn="1" ${dnOn?'checked':''}><b>Reduce noise</b></label><select data-dnlvl style="margin-left:auto;padding:2px 4px">${['Low','Medium','High'].map((n,i)=>`<option value="${i}" ${(S.dnLvl??1)===i?'selected':''}>${n}</option>`).join('')}</select>
        <div class="cdesc">Removes background noise like fans, hiss and traffic${kind!=='audio'?' — clean audio is added as a new track':''}</div><div class="prog" id="dnProg" style="display:none;margin:6px 0 0"><div></div></div></div>` +
      chk('audio.isolate','Isolate voice','Keeps only speech frequencies (basic)', a.isolate));
    h += sec('eq','Equalizer', sl(it,'Bass boost','audio.bass',-15,15)+sl(it,'Treble','audio.treble',-15,15));
  } else h += '<div class="note">For voice tools on a PiP video, drag it to the main track or use Extract audio.</div>';
  if(kind === 'audio' || kind === 'clip') h += sec('stem','🎤 Vocal remover / BGM remover', `
      <div class="sepg"><button data-sep="inst">🎵<b>Vocal remover</b><span>Remove the singing, keep the music</span></button>
      <button data-sep="vocals">🎤<b>BGM remover</b><span>Remove the music, keep the voice</span></button>
      <button data-sep="both">🎚<b>Both (2 tracks)</b><span>Vocals + music separately</span></button>
      <button data-sep="quick">⚡<b>Quick karaoke</b><span>Instant, no AI (stereo songs)</span></button></div>
      <div id="sepStat" style="color:var(--mute);min-height:18px;margin-top:8px"></div><div class="prog" id="sepProg" style="display:none"><div id="sepBar"></div></div>
      <div class="btns" id="sepStopB" style="display:none"><button data-sep="stop">✕ Stop</button></div>
      <div class="note">AI (UVR MDX-Net) runs in your browser — the song is never uploaded. ~67 MB model downloads once, then works offline. Fast on PCs with a GPU; on phones a 3-minute song can take 10+ minutes. The original audio is muted (right-click › Restore).</div>`);
  if(kind === 'audio') h += sec('beat','🥁 Beat sync', `<div class="crow"><span>Beats</span><b style="color:var(--text)">${it.beats ? `${beatTimes(it).length} · ${it.bpm} BPM` : '—'}</b></div>
      <div class="btns"><button data-beat="detect">🥁 Detect beats</button></div>
      ${it.beats ? `<div class="crow"><span>Cut every N beats</span><select id="beatEvery">${[1,2,4,8].map(n=>`<option value="${n}" ${(S.beatEvery||2)===n?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="btns"><button class="primary" data-beat="cut">✂ Cut clips to the beat</button></div>` : ''}
      <div class="note">Detects the beats of the song (yellow lines on the timeline) and cuts the main-track photos / clips to match.</div>`);
  if(kind === 'clip') h += sec('sil','✂ Auto cut silence', `<div class="prow"><div class="plab">Threshold dB</div><input type="range" id="silThr" min="-70" max="-15" step="1" value="${S.silThr??-40}"><input class="num" type="number" id="silThrN" min="-70" max="-15" value="${S.silThr??-40}"></div>
      <div class="crow"><span>Auto threshold</span><input type="checkbox" id="silAuto" ${S.silAuto!==false?'checked':''}></div>
      <div class="prow"><div class="plab">Min silence (s)</div><input type="range" id="silMin" min="0.2" max="3" step="0.1" value="${S.silMin??.6}"><input class="num" type="number" id="silMinN" min="0.2" max="3" step="0.1" value="${S.silMin??.6}"></div>
      <div id="silStat" style="color:var(--mute);min-height:18px"></div>
      <div class="btns"><button data-sil="analyze">🔍 Analyze</button><button class="primary" data-sil="apply">✂ Remove silence</button></div>
      <div class="note">Automatically removes silent parts of a talking video and splits the clip. Undo with Ctrl+Z.</div>`);
  const B = (a,i,t) => `<button data-act="${a}">${ic(i)} ${t}</button>`;
  h += `<div class="btns">${kind==='clip'?(it.extracted?B('restoreAudio','undo','Restore audio'):B('extract','wave','Extract audio')):''}${kind==='audio'&&it.linkClip?B('restoreLinked','undo','Return to video'):''}${B('cap','captions','Auto captions')}${kind==='audio'?B('dup','copy','Duplicate')+B('del','trash','Delete'):''}</div>`;
  if(kind === 'clip') h += '<div class="btns"><button data-all="audio">Apply to all clips</button></div>';
  return h;
}
function animList(it, sub){
  const clipLike = !it.type, txt = it.type === 'text';
  if(sub === 'combo'){ const base = clipLike ? ANIM_LOOP : OV_LOOP; return [...base.filter(x=>x[0]!=='none').map(([k,n])=>[k,n,'Loop']), ...LOOP_LIB.map(([k,n])=>[k,n,'Loop'])]; }
  const base = sub === 'in' ? (clipLike ? ANIM_IN : OV_IN) : (clipLike ? ANIM_OUT : OV_OUT);
  const lib = ANIM_LIB.map(([k,n,c]) => [k, sub === 'out' ? n.replace(/ In$/,' Out').replace(/^Pop Up$/,'Pop Down') : n, c]);
  return [...base.filter(x=>x[0]!=='none').map(([k,n])=>[k,n,ANIM_OLD_CAT[k]||'Basic']), ...lib].filter(x => txt || x[2] !== 'Text');
}
// ---- v23: Magic animate panel ----
let MG_BUSY = '';
function magicBody(it){
  const mg = ensureMagic(it), L = mg.layers, chips = (path, cur, list) => `<div class="chiprow mgchips">${list.map(([k,n]) => `<button data-set="${path}" data-val="${k}" class="${cur===k?'on':''}">${n}</button>`).join('')}</div>`;
  let h = `<div class="mghero"><b>✨ Magic animate</b><span>Every person and object in this photo animates in separately.</span></div>
    <div class="btns mgbtns"><button class="primary" data-mg="auto" ${MG_BUSY?'disabled':''}>🤖 Auto-detect objects</button><button data-mg="tap" class="${S.magicPick?'on':''}" ${MG_BUSY?'disabled':''}>👆 ${S.magicPick?'Tapping… (done)':'Tap to add object'}</button></div>
    <div class="mgprog" id="mgProg">${MG_BUSY}</div>`;
  if(S.magicPick) h += `<div class="note">👆 Tap any person or object in the player to cut it out. Tap <b>Tapping… (done)</b> when finished.</div>`;
  if(L.length){
    h += `<div class="crow"><span><b>${L.length}</b> object${L.length>1?'s':''} found</span><label class="sw"><input type="checkbox" data-mg="on" ${mg.on?'checked':''}> Magic on</label></div>
      <div class="mglayers">${L.map((l,i) => `<div class="mgl"><span class="mgn">${i+1}</span><img src="${l.t || l.m}" alt=""><span class="mglab">${esc(l.label)}</span><button data-mg="del" data-id="${l.id}" title="Remove">✕</button></div>`).join('')}</div>
      <div class="ltitle">In — objects come from</div>${chips('magic.inS', mg.inS, MAGIC_STYLES)}
      ${sl(it,'In duration','magic.inDur',.2,2,.05)}
      <div class="ltitle">Out — objects leave to</div>${chips('magic.outS', mg.outS, [['none','None'], ...MAGIC_STYLES])}
      ${mg.outS !== 'none' ? sl(it,'Out duration','magic.outDur',.2,2,.05) : ''}
      ${sl(it,'Delay between objects','magic.stag',0,.6,.01)}
      <div class="crow"><span>Order</span><select data-mgsel="order">${[['lr','Left → right'],['size','Biggest first'],['rand','Random']].map(([k,n]) => `<option value="${k}" ${mg.order===k?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="crow"><span>Background</span><select data-mgsel="bg">${[['haze','Soft focus-in'],['static','Stays'],['fade','Fades in'],['zoom','Zooms in']].map(([k,n]) => `<option value="${k}" ${mg.bg===k?'selected':''}>${n}</option>`).join('')}</select></div>
      <div class="btns"><button data-mg="play">▶ Preview</button><button data-mg="clear">🗑 Remove all</button></div>`;
  }
  h += `<div class="note">🧠 Runs in your browser — the picture is never uploaded. First use downloads the AI once (object finder ≈45 MB, cut-out ≈6 MB), then it is cached. Works best on clear photos and illustrations; if something is missed, use <b>Tap to add object</b>. The photo is lengthened automatically so every object has time to arrive.</div>`;
  return h;
}
// give the photo enough time on screen for every object to arrive (and leave) — like Canva, never squeeze them together
function fitMagicDur(it){
  const mg = it.magic; if(!mg || !mg.on) return; const n = Math.max(1, mg.layers.length);
  const need = mg.inDur + mg.stag*(n-1) + 2 + (mg.outS === 'none' ? 0 : mg.outDur + mg.stag*(n-1));
  if(it.type){ if(it.dur < need) it.dur = +need.toFixed(2); }
  else { const len = (it.out - it.in)/(it.speed||1); if(len < need) it.out = +(it.in + need*(it.speed||1)).toFixed(2); }
}
function mgProg(m){ MG_BUSY = m; const e = $('#mgProg'); if(e) e.innerHTML = m; }
async function magicTap(it, u, v){
  if(it.type ? it.flip : (it.tf && it.tf.flip)) u = 1 - u;
  mgProg('✂️ Cutting out…');
  try{ const L = await magicAddAt(it, u, v);
    if(!L){ mgProg('⚠ Nothing found there — tap right on the object'); setTimeout(() => { if(MG_BUSY.startsWith('⚠')) mgProg(''); }, 2500); return; }
    pushUndo(); const mg = ensureMagic(it); mg.layers.push(L); mg.on = true; fitMagicDur(it); mgProg(''); renderInspector(); afterEdit();
  }catch(e){ mgProg('⚠ Cut-out AI could not load (internet needed the first time): ' + esc(e.message||e)); }
}
IB.addEventListener('click', async e => {
  const b = e.target.closest('[data-mg]'); if(!b || b.tagName === 'INPUT') return; const it = selItem(); if(!it) return; const mg = ensureMagic(it), a = b.dataset.mg;
  if(a === 'tap'){ S.magicPick = !S.magicPick; out.classList.toggle('pick', S.magicPick); renderInspector(); return; }
  if(a === 'del'){ pushUndo(); mg.layers = mg.layers.filter(l => l.id !== b.dataset.id); if(!mg.layers.length) mg.on = false; renderInspector(); afterEdit(); return; }
  if(a === 'clear'){ pushUndo(); mg.layers = []; mg.on = false; renderInspector(); afterEdit(); return; }
  if(a === 'play'){ const st = it.type ? it.start : derived[it.id].start; seek(st); play(); return; }
  if(a === 'auto'){
    mgProg('⏳ Starting…'); renderInspector();
    try{ const layers = await magicAuto(it, (m) => mgProg(m));
      if(!layers.length){ mgProg('No clear objects found — use 👆 Tap to add object'); }
      else { pushUndo(); mg.layers = layers.concat(mg.layers.filter(l => !layers.some(n => iou(n.box, l.box) > .7))); mg.on = true; fitMagicDur(it); mgProg(''); }
    }catch(err){ console.error(err); mgProg('⚠ AI could not load (internet needed the first time): ' + esc(err.message||err)); }
    renderInspector(); afterEdit(); if(mg.on){ const st = it.type ? it.start : derived[it.id].start; seek(st); play(); }
  }
});
IB.addEventListener('change', e => {
  const it = selItem(); if(!it) return;
  if(e.target.dataset.mg === 'on'){ pushUndo(); ensureMagic(it).on = e.target.checked; afterEdit(); return; }
  if(e.target.dataset.mgsel){ pushUndo(); ensureMagic(it)[e.target.dataset.mgsel] = e.target.value; fitMagicDur(it); afterEdit(); }
});
function animGrid(it, sub){
  const path = sub === 'in' ? 'anim.in' : sub === 'out' ? 'anim.out' : 'anim.loop', cur = getP(it, path), q = (S.animQ||'').toLowerCase().trim();
  let list = animList(it, sub), cat = sub === 'combo' ? 'All' : (S.animCat || 'Trending');
  if(q) list = list.filter(x => x[1].toLowerCase().includes(q));
  else if(cat === 'Trending') list = ANIM_TREND.map(id => list.find(x => x[0] === id)).filter(Boolean);
  else if(cat !== 'All') list = list.filter(x => x[2] === cat);
  const mgOn = it.magic && it.magic.on, mgT = sub === 'in' && isImg(it) && (!q || 'magic animate'.includes(q)) ? `<button class="tile mgtile ${mgOn?'on':''}" data-gomagic="1"><div class="tth" style="display:grid;place-items:center;font-size:26px;background:linear-gradient(120deg,#3b1f6e,#16323a)">✨</div><span>✨ Magic</span></button>` : '';
  return mgT + `<button class="tile ${cur==='none'&&!(sub==='in'&&mgOn)?'on':''}" data-set="${path}" data-val="none"><div class="tth">${ic('ban')}</div><span>None</span></button>` +
    list.map(([k,n])=>`<button class="tile ${cur===k?'on':''}" data-set="${path}" data-val="${k}" data-prev="${sub}"><div class="tth"><canvas class="apv" data-an="${k}" data-sub="${sub}" width="96" height="64"></canvas></div><span>${n}</span></button>`).join('');
}
function animBody(it, kind, sub){
  const clipLike = !it.type, txt = it.type === 'text', path = sub === 'in' ? 'anim.in' : sub === 'out' ? 'anim.out' : 'anim.loop', cur = getP(it, path);
  const cats = ['All', ...ANIM_CATS.filter(c => txt || c !== 'Text')], cat = S.animCat || 'Trending';
  let h = `<div class="srch">${ic('target')}<input type="text" id="animQ" placeholder="Search animations" value="${esc(S.animQ||'')}"></div>`;
  if(sub !== 'combo') h += `<div class="chiprow scrollx">${cats.map(c=>`<button data-anicat="${c}" class="${c===cat&&!S.animQ?'on':''}">${c}</button>`).join('')}</div>`;
  h += `<div class="tiles atiles" id="animGrid">${animGrid(it, sub)}</div><div style="height:12px"></div>`;
  if(sub === 'in' && it.magic && it.magic.on && isImg(it)) h += magicBody(it);
  else if(sub === 'in' && cur !== 'none') h += sl(it,'Duration','anim.inDur',.1,3,.1);
  if(sub === 'out' && cur !== 'none') h += sl(it,'Duration','anim.outDur',.1,3,.1);
  h += `<div class="note">▶ Hover a tile for a live preview; click to see it in the player. ${ANIM_LIB.length + 25}+ animations.</div>`;
  h += clipLike ? '<div class="btns"><button data-all="anim">Apply to all clips</button></div>' : '<div class="btns"><button data-all="ovanim">Apply to all similar items</button></div>';
  return h;
}
const CW = 300, CH = 150, cY = v => CH/2 - Math.log10(clamp(v,.1,10))*CH/2*.86, cV = y => Math.pow(10, (CH/2 - y)/(CH/2*.86));
function curveEditor(c){
  const pts = c.curve; let d = '';
  for(let i=0;i<=90;i++){ const p = i/90; d += (i?'L':'M') + (p*CW).toFixed(1) + ',' + cY(curveAt(c,p)).toFixed(1); }
  const dd = derived[c.id], ph = dd && S.time >= dd.start && S.time <= dd.start+dd.dur ? (localToSrc(c, S.time-dd.start)-c.in)/(c.out-c.in) : -1;
  return `<svg id="curveEd" viewBox="0 0 ${CW} ${CH}" style="width:100%;background:#111113;border-radius:8px;display:block;touch-action:none;cursor:crosshair">
    ${[10,5,2,1,.5,.2,.1].map(v=>`<line x1="0" x2="${CW}" y1="${cY(v)}" y2="${cY(v)}" stroke="${v===1?'#555':'#26262b'}" ${v===1?'stroke-dasharray="4 4"':''}/><text x="4" y="${cY(v)-2}" fill="#666" font-size="8">${v}x</text>`).join('')}
    ${ph>=0?`<line x1="${ph*CW}" x2="${ph*CW}" y1="0" y2="${CH}" stroke="#fff" stroke-width="1"/>`:''}
    <path d="${d}" fill="none" stroke="#20d5ec" stroke-width="2.2"/>
    <path d="${d}" fill="none" stroke="transparent" stroke-width="18" style="cursor:copy" data-line="1"/>
    ${pts.map((p,i)=>`<circle data-ci="${i}" cx="${p[0]*CW}" cy="${cY(p[1])}" r="13" fill="transparent" style="cursor:grab"/><circle data-ci="${i}" cx="${p[0]*CW}" cy="${cY(p[1])}" r="${curveSel===i?7:5.5}" fill="${curveSel===i?'#20d5ec':'#fff'}" stroke="#111" stroke-width="2" style="cursor:grab"/>`).join('')}
  </svg>`;
}
function refreshCurve(c){
  layout(); renderTimeline();
  const w = $('#curveWrap'); if(w) w.innerHTML = curveEditor(c);
  const di = $('#durInfo'); if(di) di.textContent = fmtTC(c.out-c.in) + ' → ' + fmtTC(derived[c.id].dur);
  const cv2 = $('#curveVal'), sp = c.curve[curveSel]; if(cv2) cv2.textContent = sp ? sp[1].toFixed(2)+'x' : '—';
}
let cdragC = null;
function curvePt(e){ const r = $('#curveEd').getBoundingClientRect(); return {x:clamp((e.clientX-r.left)/r.width,0,1), y:(e.clientY-r.top)/r.height*CH}; }
IB.addEventListener('pointerdown', e => {
  const svg = e.target.closest('#curveEd'); if(!svg) return; const c = selClip(); if(!c || !c.curve) return;
  let ci = e.target.dataset ? e.target.dataset.ci : null;
  const p = curvePt(e);
  if(ci == null){
    const near = Math.abs(cY(curveAt(c, p.x)) - p.y) < 16 || e.target.dataset.line;
    if(near){   // grab the line itself: a new point appears under the finger and follows it
      const pts = c.curve, hit = pts.findIndex(q => Math.abs(q[0]-p.x) < .03);
      if(hit >= 0) ci = hit;
      else { pushUndo(); pts.push([p.x, curveAt(c,p.x)]); pts.sort((a,b)=>a[0]-b[0]); ci = pts.findIndex(q => q[0] === p.x); c.curveName = 'custom'; }
      curveSel = +ci; cdragC = c; cdragC.noUndo = true; e.preventDefault(); refreshCurve(c);
      const btn = IB.querySelector('[data-act="cDel"]'); if(btn) btn.disabled = !(curveSel>0 && curveSel<c.curve.length-1);
      return;
    }
    curveScrub = c; scrubCurve(c, p.x); e.preventDefault(); return;   // empty area = move the playhead
  }
  pushUndo(); curveSel = +ci; cdragC = c; e.preventDefault(); refreshCurve(c);
  const btn = IB.querySelector('[data-act="cDel"]'); if(btn) btn.disabled = !(curveSel>0 && curveSel<c.curve.length-1);
});
let curveScrub = null;
function scrubCurve(c, x){ const d = derived[c.id]; if(!d) return; seek(d.start + srcToLocal(c, c.in + x*(c.out-c.in))); const w = $('#curveWrap'); if(w) w.innerHTML = curveEditor(c); }
window.addEventListener('pointermove', e => {
  if(curveScrub){ if($('#curveEd')) scrubCurve(curveScrub, curvePt(e).x); return; }
  if(!cdragC) return; const c = cdragC, p = curvePt(e), pts = c.curve, i = curveSel;
  if(i > 0 && i < pts.length-1) pts[i][0] = clamp(p.x, pts[i-1][0]+.02, pts[i+1][0]-.02);
  pts[i][1] = clamp(cV(p.y), .1, 10); c.curveName = 'custom'; refreshCurve(c);
});
window.addEventListener('pointerup', () => { curveScrub = null; if(cdragC){ cdragC = null; if(!S.playing) seek(Math.min(S.time,S.total)); } });
IB.addEventListener('dblclick', e => {
  if(!e.target.closest('#curveEd')) return; const c = selClip(); if(!c || !c.curve) return;
  const p = curvePt(e); addCurvePoint(c, p.x, clamp(cV(p.y),.1,10));
});
function addCurvePoint(c, x, v){
  pushUndo(); const pts = c.curve; if(pts.some(p => Math.abs(p[0]-x) < .03)) return;
  pts.push([x, v ?? curveAt(c,x)]); pts.sort((a,b)=>a[0]-b[0]); curveSel = pts.findIndex(p => p[0] === x); c.curveName = 'custom'; renderInspector(); refreshCurve(c);
}
function speedBody(it, kind, sub){
  if(kind === 'clipimg') return sec('du','Duration', sl(it,'Duration','__imgdur',.3,30,.1)+'<div class="note">How many seconds the photo is shown</div>');
  if(kind === 'ovvideo') return sec('sp','Speed', sl(it,'Speed','speed',.25,4,.05)+sl(it,'Duration','dur',.3,Math.max(.3,(media(it.mediaId).duration-it.in)/it.speed),.1));
  if(sub === 'curve'){
    let h = `<div class="tiles" style="grid-template-columns:repeat(4,1fr);margin-top:8px">${CURVE_OPTS.map(([k,n])=>`<button class="vtile ${it.curveName===k?'on':''}" style="height:48px" data-act="curve" data-val="${k}">${n}</button>`).join('')}</div><div style="height:12px"></div>`;
    if(it.curve){
      if(typeof it.curve[0] === 'number') it.curve = curvePairs(it.curve);
      const sp = it.curve[curveSel];
      h += `<div id="curveWrap">${curveEditor(it)}</div>
        <div class="btns"><button data-act="cAdd">${ic('plus')} Add point</button><button data-act="cDel" ${curveSel>0&&curveSel<it.curve.length-1?'':'disabled'}>${ic('trash')} Delete point</button><button data-act="curve" data-val="custom">${ic('reset')} Reset</button></div>
        <div class="crow"><span>Selected point</span><b id="curveVal" style="color:var(--text)">${sp?sp[1].toFixed(2)+'x':'—'}</b></div>
        <div class="crow"><span>Duration</span><b id="durInfo" style="color:var(--text)">${fmtTC(it.out-it.in)} → ${fmtTC(derived[it.id].dur)}</b></div>`;
    }
    return h + '<div class="note">◉ Grab the <b>blue line</b> and drag up (faster) / down (slower) — a new point is added there. Points can be dragged · click empty space = move playhead · <b>+ Add point</b> also works.</div>';
  }
  return sec('sp','Speed', sl(it,'Speed','speed',.1,10,.1)+`<div class="crow"><span>Duration</span><b id="durInfo" style="color:var(--text)">${fmtTC(it.out-it.in)} → ${fmtTC(derived[it.id].dur)}</b></div>`);
}
function transBody(it){
  return `<div class="tiles gtiles" style="margin-top:10px">${TRANS.map(([k,n],i)=>`<button class="tile ${it.trans.type===k?'on':''}" data-set="trans.type" data-val="${k}" data-prev="trans"><div class="tth">${k==='none'?ic('ban'):`<canvas class="gpv" data-ptr="${k}" data-i="${i}" width="112" height="84"></canvas>`}</div><span>${n}</span></button>`).join('')}</div><div style="height:12px"></div>
    ${it.trans.type!=='none'?sl(it,'Duration','trans.dur',.1,2,.1):''}
    <div class="btns"><button data-all="trans">Apply to all clips</button></div>`;
}
function filterBody(it){
  const th = SCENES.portrait.src;
  return `<div class="tiles" style="margin-top:10px">${Object.keys(FILTERS).map(k=>`<button class="tile ${it.filter===k?'on':''}" data-set="filter" data-val="${k}"><div class="tth">${k==='none'?ic('ban'):`<div class="pv" style="background-image:url(${th});filter:${FILTER_CSS[k]}"></div>`}</div><span>${FILTER_NAMES[k]}</span></button>`).join('')}</div><div style="height:12px"></div>
    ${it.filter!=='none'?sl(it,'Strength','filterAmt',0,100):''}${!it.type?'<div class="btns"><button data-all="filter">Apply to all clips</button></div>':''}`;
}
function trackBody(it){
  const on = S.trackEdit === it.id;
  let h = `<div class="tiles" style="grid-template-columns:repeat(3,1fr);margin-top:10px">
    <button class="tile ${!on?'on':''}" data-trk="none"><div class="tth">${ic('ban')}</div><span>None</span></button>
    <button class="tile ${on?'on':''}" data-trk="motion"><div class="tth">${ic('target')}</div><span>Motion tracking</span></button></div><div style="height:10px"></div>`;
  if(on) h += `<div class="note">① Place the <b style="color:var(--acc)">blue box</b> in the player over the object to follow (face, ball…) — drag its corner to resize.<br>② Press <b>Start tracking</b>. This item will follow that object.</div>
    <div class="prog"><div id="trkBar" style="width:${trackRun?Math.round(trackRun.p*100):0}%"></div></div><div id="trkStat" style="color:var(--mute);min-height:18px">${trackRun?'Tracking…':''}</div>
    <div class="btns">${trackRun?'<button data-trk="cancel">Cancel</button>':`<button class="primary" data-trk="start">${ic('target')} Start tracking</button>`}</div>`;
  if(it.tracked) h += `<div class="note">✓ Tracked (${(it.kf||[]).length} keyframes). Run again or <button data-trk="clear" style="padding:2px 8px">Clear</button></div>`;
  return h;
}
function opacitySec(it){ return sec('op', it.type ? 'Opacity & Blend' : 'Opacity', sl(it,'Opacity','opacity',0,100)+(it.type?blendRow(it):'')); }
function inspBody(it, kind, tab, sub){
  switch(tab){
    case 'video':
      if(sub === 'rmbg') return rmbgBody(it);
      if(sub === 'mask') return maskBody(it);
      if(sub === 'retouch') return sec('rt','Skin', sl(it,'Smooth','rt.smooth',0,100)+sl(it,'Whitening','rt.bright',0,100)+sl(it,'Clear','rt.clear',0,100)+
        '<div class="note">💆 Detects skin tones and smooths / brightens them. 30–60 is enough — more looks artificial.</div>', {reset:'resetRt'})
        + (!it.type ? '<div class="btns"><button data-all="rt">Apply to all clips</button></div>' : '');
      if(sub === 'effect') return fxBody(it);
      return transformSec(it) + opacitySec(it) + (kind === 'clip' ? stabSec(it) : '') +
        (it.type ? sec('tm','Timing', sl(it,'Start','start',0,Math.max(10,S.total),.05)+(kind==='ovimage'?sl(it,'Duration','dur',.3,60,.1):'')) +
                   '<div class="btns">'+[['dup','copy','Duplicate'],['del','trash','Delete']].map(([a,i,t])=>`<button data-act="${a}">${ic(i)} ${t}</button>`).join('')+'</div>'
                 : sec('cv','Canvas', `<div class="crow"><span>Background</span><select data-g="bg">${[['black','Black'],['blur','Blur'],['white','White']].map(([k,n])=>`<option value="${k}" ${S.bg===k?'selected':''}>${n}</option>`).join('')}</select></div>
                     <div class="crow"><span>Ratio</span><select data-g="ratio">${['9:16','16:9','1:1','4:5','4:3','21:9','orig'].map(k=>`<option value="${k}" ${S.ratio===k?'selected':''}>${k==='orig'?'Original':k}</option>`).join('')}</select></div>`)) + KF_NOTE;
    case 'audio': return audioBody(it, kind, sub);
    case 'speed': return speedBody(it, kind, sub);
    case 'anim': return animBody(it, kind, sub);
    case 'trans': return transBody(it);
    case 'gfx': { const g = GFXMAP[it.gfx] || {}; let b = '';
      if(g.text != null) b += `<div class="crow"><span>Text</span></div><input type="text" data-p="text" value="${esc(it.text||'')}" style="width:100%;margin:-6px 0 10px">`;
      if(g.text2 != null) b += `<div class="crow"><span>Text 2</span></div><input type="text" data-p="text2" value="${esc(it.text2||'')}" style="width:100%;margin:-6px 0 10px">`;
      b += colorRow(it,'Color','color',true) + sl(it,'Animation speed','gspeed',.25,3,.05);
      return sec('gx', g.name || 'Graphic', b) + (g.full ? '<div class="note">This is a full-screen graphic. Change Opacity / Blend to mix it with the main video.</div>' : transformSec(it)) + opacitySec(it) +
        sec('tm','Timing', sl(it,'Start','start',0,Math.max(10,S.total),.05)+sl(it,'Duration','dur',.3,60,.1)) +
        `<div class="btns"><button data-act="dup">${ic('copy')} Duplicate</button><button data-act="del">${ic('trash')} Delete</button></div>`; }
    case 'track': return trackBody(it);
    case 'adjust': return adjustBody(normItem(it), true);
    case 'tts': return ttsBody(it);
    case 'layer': return '<div style="height:8px"></div>' + sec('op','Layer', sl(it,'Intensity','opacity',0,100)) + sec('tm','Timing', sl(it,'Start','start',0,Math.max(10,S.total),.05)+sl(it,'Duration','dur',.3,600,.1)) +
      `<div class="note">🎚 An adjustment layer applies filter / adjust / effect to <b>all tracks below</b> it (main video, overlays, text). Stretch it on the timeline to cover many clips. Use Filters / Effects on the left.</div>
      <div class="btns"><button data-act="dup">${ic('copy')} Duplicate</button><button data-act="del">${ic('trash')} Delete</button></div>`;
    case 'text':
      if(sub === 'bubble') return bubbleBody(it);
      if(sub === 'effects') return '<div style="height:8px"></div>' + tfxGrid(it.tfx) + (it.tfx ? '<div class="note">With an effect, colour/outline/shadow come from the effect. Press ✕ None for normal styling.</div>' : '');
      if(sub === 'style') return `<div style="height:10px"></div><div class="tiles tstyle">${TEXT_PRESETS.map((p,i)=>`<button class="tile" data-preset="${i}"><div class="tth" style="${presetCss(p)}">Aa</div></button>`).join('')}</div><div style="height:6px"></div>` +
        sec('ol','Outline', colorRow(it,'Color','stroke')+sl(it,'Width','strokeW',0,20)) +
        sec('bx','Background', `<div class="crow"><span>Background box</span><input type="checkbox" data-p="bgOn" ${it.bgOn?'checked':''}></div>`+colorRow(it,'Color','bgColor')+sl(it,'Opacity','bgAlpha',0,100)) +
        sec('sh','Shadow / Glow', colorRow(it,'Color','shadowColor')+sl(it,'Amount','shadow',0,100)) +
        (it.caption ? '<div class="btns"><button data-act="capall">💬 Apply style to all captions</button></div>' : '');
      return sec('tc','Text', `<textarea data-p="text" rows="3" placeholder="Type here…">${esc(it.text)}</textarea>` + sl(it,'Curve','curve',-100,100)) +
        sec('fn','Font', fontPicker(it.font) + `
          <div class="tbtns"><button class="${it.bold?'on':''}" data-toggle="bold"><b>B</b></button><button class="${it.italic?'on':''}" data-toggle="italic"><i>I</i></button>${[['left','⯇≡'],['center','≡'],['right','≡⯈']].map(([k,n])=>`<button class="${it.align===k?'on':''}" data-set="align" data-val="${k}">${n}</button>`).join('')}</div>
          ${colorRow(it,'Color','color',true)}`) +
        transformSec(it) + opacitySec(it) + sec('tm','Timing', sl(it,'Start','start',0,Math.max(10,S.total),.05)+sl(it,'Duration','dur',.3,60,.1)) +
        `<div class="btns">${it.caption?'<button data-act="capall">💬 Apply style to all captions</button>':''}<button data-act="dup">${ic('copy')} Duplicate</button><button data-act="del">${ic('trash')} Delete</button></div>`;
    case 'sticker':
      return `<div style="height:10px"></div><div class="tiles small">${[...STICKER_SETS.social,...STICKER_SETS.badges].map(k=>`<button class="tile emoji ${it.text==='svg:'+k?'on':''}" data-set="text" data-val="svg:${k}"><div class="tth"><img src="${SVG_URL[k]}" style="width:36px;height:36px"></div></button>`).join('')}${EMOJIS.map(e=>`<button class="tile emoji ${it.text===e?'on':''}" data-set="text" data-val="${e}"><div class="tth">${e}</div></button>`).join('')}</div><div style="height:6px"></div>` +
        transformSec(it) + opacitySec(it) + sec('tm','Timing', sl(it,'Start','start',0,Math.max(10,S.total),.05)+sl(it,'Duration','dur',.3,60,.1)) +
        `<div class="btns"><button data-act="dup">${ic('copy')} Duplicate</button><button data-act="del">${ic('trash')} Delete</button></div>`;
  }
  return '';
}
function updKfBtn(){
  const it = selItem(), on = !!(it && atKf(it));
  IB.querySelectorAll('[data-kf="toggle"]').forEach(b => b.classList.toggle('on', on));
  const t = $('#tKf'); if(t) t.classList.toggle('on', on);
}
function syncInsp(){
  if(S.playing || editing || cdrag || S.time === lastSyncT) return; lastSyncT = S.time;
  const it = selItem(); if(!it) return;
  if(it.kf && it.kf.length){
    const L = kfList(it);
    IB.querySelectorAll('input[data-p]').forEach(el => {
      const p = el.dataset.p; if(!L.includes(p)) return; const v = ev(it,p);
      el.value = el.type === 'number' ? fmtV(v) : v; if(el.type === 'range') setFill(el);
    });
  }
  updKfBtn();
}
function applyChange(p, it){
  it = it || selItem(); if(!it) return;
  if(it.type === 'audio'){
    if(p.startsWith('audio')) rebuildAudChain(it);
    if(p === 'dur'){ it.dur = Math.min(it.dur, (media(it.mediaId).duration - it.in)/it.speed); layout(); renderTimeline(); }
    return;
  }
  if(it.type){
    if(p === 'dur' || p === 'speed' || p === 'start'){
      if(it.type === 'video') it.dur = Math.min(it.dur, (media(it.mediaId).duration - it.in)/it.speed);
      layout(); renderTimeline();
    }
    return;
  }
  if(p === 'speed' || p === '__imgdur' || p.startsWith('curve') || p.startsWith('trans')){
    layout(); renderTimeline();
    const di = $('#durInfo'); if(di) di.textContent = fmtTC(it.out-it.in) + ' → ' + fmtTC(derived[it.id].dur);
    const sv = $('#curveSvg'); if(sv) sv.outerHTML = curveSvg(it);
    if(!S.playing) seek(Math.min(S.time, S.total));
  } else if(p.startsWith('audio')) rebuildChain(it);
}
function onParamInput(e, it){
  const el = e.target;
  if(el.dataset.g){ if(el.dataset.g === 'bg'){ S.bg = el.value; $('#selBg').value = S.bg; } else { S.ratio = el.value; $('#selRatio').value = S.ratio; setCanvas(); } updatePInfo(); return; }
  const p = el.dataset.p; if(!p || !it) return;
  let val = el.type === 'range' || el.type === 'number' ? parseFloat(el.value) : el.type === 'checkbox' ? el.checked : el.value;
  if(el.type === 'number' && isNaN(val)) return;
  if(!editing){ pushUndo(); editing = true; }
  if(p === '__imgdur') it.out = it.in + Math.max(.2, val);
  else if(kfList(it).includes(p)) setVal(it, p, val); else setP(it, p, val);
  if(p.startsWith('curve.')) it.curveName = 'custom';
  if(p === 'ck.on' && val) autoKey(it);
  if(p === 'rmbg' && val) loadSeg().catch(()=>{});
  if(p.startsWith('audio.') && (el.type === 'range' || el.type === 'number')){ const b = el.closest('.band'); if(b) b.querySelector('b').textContent = (val>0?'+':'') + val; }
  const row = el.closest('.prow');
  if(row) row.querySelectorAll('[data-p]').forEach(x => { if(x !== el) x.value = x.type === 'number' ? fmtV(val) : val; if(x.type === 'range') setFill(x); });
  applyChange(p, it); updKfBtn();
  if(el.type === 'checkbox' || el.tagName === 'SELECT' || el.type === 'number'){ editing = false; if(['ck.on','rmbg','rmbgInv','bgOn'].includes(p)) renderInspector(); renderTimeline(); }
}
function animPreview(it, kind){
  const st = itemStart(it), du = itemDur(it);
  if(kind === 'in') previewPlay(st, Math.min(du, it.anim.inDur + .8));
  else if(kind === 'out') previewPlay(Math.max(st, st + du - it.anim.outDur - .6), it.anim.outDur + .6);
  else if(kind === 'trans'){ const d = derived[it.id]; previewPlay(Math.max(0, d.start - .8), d.td + 1.6); }
  else if(kind === 'fx') previewPlay(clamp(S.time, st, st + Math.max(0, du - 2)), 2);
  else previewPlay(st, Math.min(du, 2.5));
}
function applyVoice(it, k){
  pushUndo(); const a = it.audio;
  a.echo = 0; a.reverb = 0; a.voice = 'none';
  if(k === 'echo') a.echo = 55; else if(k === 'bighouse') a.reverb = 65; else if(k !== 'orig') a.voice = k;
  if(it.type === 'audio') rebuildAudChain(it); else rebuildChain(it);
  renderInspector(); renderTimeline();
  const st = itemStart(it), du = itemDur(it);
  previewPlay(S.time >= st && S.time < st + du - .5 ? S.time : st, Math.min(3, du));
}
function applyAll(k, it, btn){
  if(k === 'ovanim'){ pushUndo(); for(const x of S.overlays) if(x !== it && x.type === it.type) x.anim = deep(it.anim); btn.textContent = '✓ Applied'; return; }
  const c = it && !it.type ? it : (k === 'trans' ? transTarget() : selClip()); if(!c) return;
  pushUndo();
  const keys = {filter:['filter','filterAmt','adj'],lut:['lut','lutAmt'],audio:['audio','volume','fadeIn','fadeOut'],anim:['anim'],trans:['trans'],fx:['fx'],rt:['rt']}[k];
  for(const o of S.clips) if(o !== c) for(const key of keys) o[key] = deep(c[key]);
  if(k === 'trans') S.clips[0].trans = {type:'none',dur:.6};
  if(k === 'audio') S.clips.forEach(rebuildChain);
  layout(); renderTimeline(); if(k === 'trans') seek(Math.min(S.time, S.total));
  btn.textContent = '✓ Applied to all';
}
function doAct(a, it, btn){
  switch(a){
    case 'importLut': $('#lutIn').click(); return;
    case 'cAdd': { const dd = derived[it.id]; let x = dd && S.time > dd.start && S.time < dd.start+dd.dur ? (localToSrc(it,S.time-dd.start)-it.in)/(it.out-it.in) : -1;
      if(x < .03 || x > .97){ let g = 0; for(let i=0;i<it.curve.length-1;i++){ const w = it.curve[i+1][0]-it.curve[i][0]; if(w > g){ g = w; x = it.curve[i][0]+w/2; } } }
      addCurvePoint(it, x); return; }
    case 'cDel': if(curveSel > 0 && curveSel < it.curve.length-1){ pushUndo(); it.curve.splice(curveSel,1); curveSel = -1; it.curveName = 'custom'; renderInspector(); refreshCurve(it); } return;
    case 'ckPick': setPick(!S.pick); renderInspector(); return;
    case 'extract': extractAudio(it); return;
    case 'restoreAudio': restoreAudio(it); return;
    case 'restoreLinked': { const own = S.clips.find(c => c.id === it.linkClip) || S.overlays.find(o => o.id === it.linkClip); if(own) restoreAudio(own); else { pushUndo(); S.audios.splice(S.audios.indexOf(it),1); afterEdit(); } return; }
    case 'eqp': { const p = EQ_PRESETS.find(x => x[0] === btn.dataset.val); if(!p) return; pushUndo(); it.audio.eq = p[2].slice(); it.type === 'audio' ? rebuildAudChain(it) : rebuildChain(it); renderInspector(); return; }
    case 'aReset': { pushUndo(); const keep = {voice:it.audio.voice, enhance:it.audio.enhance, isolate:it.audio.isolate, norm:it.audio.norm}; it.audio = Object.assign(defAudio(), keep); it.type === 'audio' ? rebuildAudChain(it) : rebuildChain(it); renderInspector(); return; }
    case 'aReverse': reverseItem(it, btn); return;
    case 'cap': openCaptions(); return;
    case 'del': del(); return;
    case 'dup': dup(); return;
    case 'flip': flipSel(); renderTimeline(); return;
    case 'rot90': rotateSel(); return;
    case 'up': case 'down': case 'center': case 'fillv': case 'capall': ovAction(a); return;
  }
  pushUndo();
  const m = media(it.mediaId);
  switch(a){
    case 'resetTf':
      if(it.type){ setVal(it,'size',ovDefaults(it.type).size); setVal(it,'x',50); setVal(it,'y',50); setVal(it,'rot',0); it.flip = false; }
      else { setVal(it,'tf.scale',100); setVal(it,'tf.x',0); setVal(it,'tf.y',0); setVal(it,'tf.rot',0); it.tf.flip = false; }
      break;
    case 'fit': setVal(it,'tf.scale',100); setVal(it,'tf.x',0); setVal(it,'tf.y',0); break;
    case 'fill': { const W=cv.width, H=cv.height; setVal(it,'tf.scale',Math.round(Math.max(W/m.w,H/m.h)/Math.min(W/m.w,H/m.h)*100)); setVal(it,'tf.x',0); setVal(it,'tf.y',0); break; }
    case 'resetAdj': for(const k in it.adj) it.adj[k] = 0; break;
    case 'resetMask': it.mask = {...defMask(), type:it.mask.type}; break;
    case 'resetRt': it.rt = {smooth:0,bright:0,clear:0}; break;
    case 'ckAuto': autoKey(it); it.ck.on = true; break;
    case 'ckGreen': it.ck.color = '#00ff00'; it.ck.on = true; break;
    case 'ckBlue': it.ck.color = '#0047bb'; it.ck.on = true; break;
    case 'curve': {
      const v = btn.dataset.val; it.curveName = v;
      it.curve = v === 'none' ? null : v === 'custom' ? [[0,1],[.25,1],[.5,1],[.75,1],[1,1]] : curvePairs(CURVES[v]); curveSel = -1;
      layout(); seek(Math.min(S.time, S.total)); break;
    }
  }
  renderInspector(); renderTimeline();
}
function doClick(t, it){
  const d = t.dataset;
  if(v8Click(t, it)) return true;
  if(d.tog){ S.closed[d.tog] = !S.closed[d.tog]; t.closest('.sec').classList.toggle('closed'); return true; }
  if(!it) return false;
  if(d.kf){ if(d.kf === 'toggle') toggleKf(); else jumpKf(d.kf === 'next' ? 1 : -1); return true; }
  if(d.voice){ applyVoice(it, d.voice); return true; }
  if(d.set){
    pushUndo(); setP(it, d.set, d.val);
    if(d.set === 'anim.in' && it.magic) it.magic.on = false;
    if(d.set.startsWith('magic.')) fitMagicDur(it);
    if(d.set === 'font') ensureFont(d.val);
    if(d.set === 'fx.type' || d.set.startsWith('trans')) layout();
    renderInspector(); renderTimeline(); applyChange(d.set, it);
    if(d.prev && d.val !== 'none') animPreview(it, d.prev);
    return true;
  }
  if(d.toggle){ pushUndo(); it[d.toggle] = !it[d.toggle]; renderInspector(); return true; }
  if(d.preset != null){ pushUndo(); Object.assign(it, deep(TEXT_PRESETS[+d.preset])); renderInspector(); return true; }
  if(d.act){ doAct(d.act, it, t); return true; }
  if(d.all){ applyAll(d.all, it, t); return true; }
  return false;
}
$('#rtabs').addEventListener('click', e => { const b = e.target.closest('[data-rtab]'); if(!b) return; S.rt[kindOf(selItem())] = b.dataset.rtab; renderInspector(); });
$('#rsub').addEventListener('click', e => { const b = e.target.closest('[data-rsub]'); if(!b) return; const tab = $('#rtabs .on'); if(tab) S.rs[tab.dataset.rtab] = b.dataset.rsub; renderInspector(); });
IB.addEventListener('input', e => {
  if(v8Input(e)) return;
  const el = e.target, it = selItem();
  if(el.dataset.dnlvl != null){ S.dnLvl = +el.value; return; }
  if(el.dataset.dn){ doDenoise(it, el.checked); return; }
  onParamInput(e, it);
  if(el.dataset.p === 'audio.norm' && el.checked && it){ computeNorm(it).then(() => { renderInspector(); }).catch(err => alert(err.message)); }
});
async function doDenoise(it, on){
  if(!it) return;
  if(!on){ if(it.type === 'audio' && it.origMediaId){ pushUndo(); it.mediaId = it.origMediaId; it.in = it.origIn; delete it.origMediaId; delete it.origIn; afterEdit(); } return; }
  const pr = $('#dnProg'), bar = pr && pr.firstElementChild; if(pr) pr.style.display = 'block';
  IB.querySelectorAll('[data-dn]').forEach(x => x.disabled = true);
  try{
    const nm = await reduceNoise(it, S.dnLvl ?? 1, p => { if(bar) bar.style.width = (p*100) + '%'; });
    pushUndo();
    if(it.type === 'audio'){ it.origMediaId = it.mediaId; it.origIn = it.in; it.mediaId = nm.id; it.in = 0; }
    else {
      const st = it.type ? it.start : derived[it.id].start, a = newAudioItem(nm, {kind:'extract', start:st, in:0, dur:nm.duration/(it.speed||1), speed:it.speed||1, volume:it.volume, audio:deep(it.audio||defAudio())});
      a.origMediaId = it.mediaId; a.origIn = it.in; it.volume = 0; S.audios.push(a); S.sel = a.id;
    }
    afterEdit(); renderLeft();
  }catch(err){ alert('Noise reduction failed: ' + err.message); renderInspector(); }
}
IB.addEventListener('change', e => { editing = false; if(e.target.type === 'range') e.target.blur(); renderTimeline(); });
IB.addEventListener('click', e => {
  const sbm = e.target.closest('[data-stab]'), sba = e.target.closest('[data-stabact]');
  if(sbm || sba){ const it = selItem(); if(!it || it.type) return;
    if(sba){ if(sba.dataset.stabact === 'cancel'){ if(stabRun) stabRun.flag = true; return; } runStab(it); return; }
    const mode = sbm.dataset.stab; pushUndo(); it.stab = Object.assign({mode:'off', level:60, crop:25}, it.stab || {}, {mode});
    renderInspector(); render(performance.now());
    if(mode !== 'off' && !(it.stab.raw && it.stab.raw.t && it.stab.raw.t.length > 1)) runStab(it);
    return; }
  const t = e.target.closest('button'); if(!t) return; const it = selItem();
  if(t.dataset.trk){ trackAction(t.dataset.trk, it); return; }
  doClick(t, it);
});
function defaultTrackBox(o){
  const g = geo[o.id], W = out.width, H = out.height, s = Math.min(W,H)*.18;
  const cx = g ? g.cx : ev(o,'x')/100*W, cy = g ? g.cy : ev(o,'y')/100*H;
  return {x:cx-s/2, y:cy-s/2, w:s, h:s};
}
async function trackAction(a, o){
  if(!o) return;
  if(a === 'none'){ S.trackEdit = null; renderInspector(); return; }
  if(a === 'motion'){ if(!S.clips.length) return alert('Add a video to the main track first'); seek(o.start + .01); S.trackEdit = o.id; S.trackBox = defaultTrackBox(o); renderInspector(); return; }
  if(a === 'clear'){ pushUndo(); o.kf = []; o.tracked = false; renderInspector(); renderTimeline(); return; }
  if(a === 'cancel'){ if(trackRun) trackRun.flag = true; return; }
  if(a === 'start'){
    pause(); trackRun = {flag:false, p:0}; renderInspector();
    try{
      const pts = await runTracking(o, S.trackBox, p => { trackRun.p = p; const b = $('#trkBar'); if(b) b.style.width = (p*100)+'%'; const st = $('#trkStat'); if(st) st.textContent = `Tracking… ${Math.round(p*100)}%`; }, trackRun);
      if(!trackRun.flag){ applyTracking(o, pts, S.trackBox); S.trackEdit = null; }
    }catch(err){ alert('Tracking failed: ' + err.message); }
    trackRun = null; renderInspector(); renderTimeline(); seek(o.start + .01);
  }
}
function onSegReady(){ if(IB.querySelector('[data-p="rmbg"]')) renderInspector(); if(S.ltab === 'effects') renderLeft(); }
async function reverseItem(it, btn){
  if(btn){ btn.disabled = true; btn.textContent = '⏳ Reversing…'; }
  try{
    const nm = await reverseAudioItem(it); pushUndo();
    if(it.type === 'audio'){ it.mediaId = nm.id; it.in = 0; it.dur = nm.duration/(it.speed||1); }
    else { const st = itemStart(it), a = newAudioItem(nm, {kind:'extract', start:st, in:0, dur:nm.duration/(it.speed||1), speed:it.speed||1, volume:it.volume||100, audio:deep(it.audio), linkClip:it.id});
      it.prevVolume = it.volume || 100; it.extracted = a.id; it.volume = 0; S.audios.push(a); S.sel = a.id; }
    afterEdit(); renderLeft();
  }catch(err){ alert('Reverse failed: ' + err.message); renderInspector(); }
}

/* =====================================================================
   TIMELINE
   ===================================================================== */
function lanes(items){
  const lane = {}, ends = [];
  for(const o of [...items].sort((a,b)=>a.start-b.start)){
    let l = ends.findIndex(e => e <= o.start + 1e-6); if(l < 0){ l = ends.length; ends.push(0); }
    ends[l] = o.start + o.dur; lane[o.id] = l;
  }
  return {lane, n:ends.length};
}
function kfDots(it){
  if(!it.kf || !it.kf.length) return '';
  return it.kf.map(k => {
    let x;
    if(it.type){ if(k.t < 0 || k.t > it.dur) return ''; x = k.t*S.pps; }
    else { if(k.t < it.in-1e-6 || k.t > it.out+1e-6) return ''; x = srcToLocal(it,k.t)*S.pps; }
    return `<i class="kfd" style="left:${x}px"></i>`;
  }).join('');
}
function waveStyle(m, inP, speed){
  if(!m || !m.wave) return '';
  return `background-image:url(${m.wave});background-size:${m.duration*S.pps/speed}px 100%;background-position:${-inP*S.pps/speed}px 0;`;
}
function ovItemHTML(o){
  const m = media(o.mediaId), nm = esc(m ? m.name : '');
  const label = o.type==='adjust' ? '🎚 '+esc(o.filter&&o.filter!=='none'?filterName(o.filter)+' layer':'Adjustment layer') : o.type==='gfx' ? '✨ '+esc((GFXMAP[o.gfx]||{}).name||'Graphic') : o.type==='text' ? (o.caption?'💬 ':'T  ')+esc((o.text||'').replace(/\n/g,' ')) : o.type==='sticker' ? (o.text.startsWith('svg:')?'⭐':o.text)+' Sticker' : o.type==='video' ? '🎞 '+nm : '🖼 '+nm;
  const fx = [o.mask&&o.mask.type!=='none'?'◐':'', o.ck&&o.ck.on?'🟩':'', o.rmbg?'✂':'', o.blend&&o.blend!=='source-over'?'⧉':'', o.fx&&o.fx.type!=='none'&&isMediaOv(o)?'⚡':''].join('');
  const bg = o.type==='image' && m && m.thumb ? `background-image:url(${m.thumb});background-size:auto 100%;background-repeat:repeat-x;` : '';
  const strip = o.type==='video' && m ? ovStrip(o, m) : '';
  return `<div class="it ${o.type} ${o.caption?'cap':''} ${S.sel===o.id?'sel':''} ${selMulti.has(o.id)?'msel':''}" data-oid="${o.id}" style="left:${o.start*S.pps}px;width:${Math.max(14,o.dur*S.pps-2)}px;${bg}">${strip}<span class="lbl">${fx} ${label}${o.type==='video'&&o.volume===0?' 🔇':''}</span>${kfDots(o)}<div class="h l" data-h="l"></div><div class="h r" data-h="r"></div></div>`;
}
function ovStrip(o, m){
  const TH = 30, wpx = Math.max(14, o.dur*S.pps - 2);
  if(!m.strip) return m.thumb ? `<div class="thumbs" style="background-image:url(${m.thumb})"></div>` : '';
  const tw = Math.max(12, Math.round(TH*m.w/m.h)), n = Math.min(120, Math.ceil(wpx/tw)); let h = '';
  for(let j=0;j<n;j++){ const src = o.in + (j*tw + tw/2)/S.pps*o.speed, idx = clamp(Math.floor(src/m.duration*m.stripN), 0, m.stripN-1);
    h += `<i style="left:${j*tw}px;width:${tw}px;background-position:${-idx*tw}px 0"></i>`; }
  return `<div class="thumbs strip" style="--strip:url(${m.strip});--sw:${m.stripN*tw}px">${h}</div>`;
}
function filmstrip(c, m, d){
  const TH = 36, wpx = Math.max(6, d.dur*S.pps - 2);
  if(!m.strip || m.type !== 'video') return `<div class="thumbs" style="background-image:url(${m.thumb||''})"></div>`;
  const tw = Math.max(14, Math.round(TH*m.w/m.h)), n = Math.min(120, Math.ceil(wpx/tw)); let h = '';
  for(let j=0;j<n;j++){ const lt = (j*tw + tw/2)/S.pps, src = localToSrc(c, Math.min(lt, d.dur)), idx = clamp(Math.floor(src/m.duration*m.stripN), 0, m.stripN-1);
    h += `<i style="left:${j*tw}px;width:${tw}px;background-position:${-idx*tw}px 0"></i>`; }
  return `<div class="thumbs strip" style="--strip:url(${m.strip});--sw:${m.stripN*tw}px">${h}</div>`;
}
function clipHTML(c, i){
  const d = derived[c.id]; if(!d) return '';
  const m = media(c.mediaId) || {}, pps = S.pps;
  const badges = [m.type==='image'?'🖼':'', (c.speed!==1||c.curve)?'⏱':'', c.fx&&c.fx.type!=='none'?'⚡':'', c.rmbg?'✂':'', c.filter!=='none'?'🎨':'', c.lut?'LUT':'', c.mask.type!=='none'?'◐':'', c.volume===0&&m.type==='video'?'🔇':'', (c.audio.voice!=='none'||c.audio.echo||c.audio.reverb)?'🎤':'', (c.anim.in!=='none'||c.anim.out!=='none'||c.anim.loop!=='none')?'✨':''].filter(Boolean).join(' ');
  const hasT = c.trans && c.trans.type !== 'none';
  const tm = i > 0 ? `<div class="tmark ${hasT?'on':''}" data-tid="${c.id}" title="Transition" style="left:${(d.start+d.td/2)*pps-10}px">⇄</div>` : '';
  const wv = m.wave && c.volume > 0 && !c.curve && !S.mainMute ? `<div class="wave" style="${waveStyle(m,c.in,c.speed)}"></div>` : '';
  return `<div class="clip ${S.sel===c.id?'sel':''} ${selMulti.has(c.id)?'msel':''} ${S.mainHide?'hidden':''}" data-id="${c.id}" style="left:${d.start*pps}px;width:${Math.max(6,d.dur*pps-2)}px">
    <div class="cn">${badges} ${esc(m.name||'missing')} &nbsp;${fmtTC(d.dur)}</div>${filmstrip(c,m,d)}${wv}${kfDots(c)}
    <div class="h l" data-h="l"></div><div class="h r" data-h="r"></div></div>${tm}`;
}
function trackHead(kind, t, items){
  const ts = (S.trk && S.trk[kind] && S.trk[kind][t]) || {};
  let icon = 'layers', name = 'Overlay';
  if(kind === 'au'){ icon = 'music2'; name = items.some(a => a.kind === 'voice') ? 'Voice' : items.every(a => a.kind === 'sfx') ? 'Sound FX' : 'Audio'; }
  else if(items.length && items.every(o => o.caption)){ icon = 'captions'; name = 'Captions'; }
  else if(items.length && items.every(o => o.type === 'text')){ icon = 'text'; name = 'Text'; }
  else if(items.length && items.every(o => o.type === 'sticker' || o.type === 'gfx')){ icon = 'sticker'; name = 'Sticker'; }
  const B = (k,on,i,t2) => `<button class="ib ${on?'off':''}" data-tk="${kind}:${t}:${k}" title="${t2}">${ic(i)}</button>`;
  const hasA = kind === 'au' || items.some(o => o.type === 'video');
  return `<div class="thead">${ic(icon)}<span class="tl">${name} ${t+1}</span>${kind==='ov'?B('hide',ts.hide,ts.hide?'eyeoff':'eye','Show / hide'):''}${hasA?B('mute',ts.mute,ts.mute?'volx':'vol','Mute'):''}${B('lock',ts.lock,ts.lock?'lock':'unlock','Lock')}</div>`;
}
function renderTimeline(){
  const pps = S.pps;
  const w = Math.max(Math.max(S.total, S.allEnd||0)*pps + 400, TL.clientWidth - HEADW);
  $('#tlInner').style.width = (HEADW + w) + 'px';
  const step = pps>=80?1:pps>=30?2:pps>=12?5:10, minor = step/(step===2?4:5);
  let r = '';
  for(let t=0; t*pps<w; t+=step) r += `<div class="tick" style="left:${t*pps}px">${fmtT(t)}</div>`;
  for(let t=minor; t*pps<w; t+=minor) if(Math.abs(t/step - Math.round(t/step)) > 1e-6) r += `<div class="tick m" style="left:${t*pps}px"></div>`;
  const nOv = S.overlays.length ? Math.max(...S.overlays.map(o => o.track|0)) + 1 : 0, nAu = S.audios.length ? Math.max(...S.audios.map(a => a.track|0)) + 1 : 0;
  let h = `<div class="trow ruler"><div class="thead"></div><div class="tbody" id="rulerBody">${r}</div></div>`;
  h += `<div class="trow drop ovz" data-zone="overlay"><div class="thead"></div><div class="tbody">⬆ New track: drop video / photo / text here</div></div>`;
  for(let t = nOv-1; t >= 0; t--){
    const items = S.overlays.filter(o => o.track === t), ts = (S.trk && S.trk.ov[t]) || {};
    h += `<div class="trow ovrow ${ts.hide?'thide':''} ${ts.lock?'tlock':''}" data-zone="overlay" data-track="${t}">${trackHead('ov',t,items)}<div class="tbody">${items.map(ovItemHTML).join('')}</div></div>`;
  }
  h += `<div class="trow main" data-zone="main"><div class="thead"><button class="ib ${S.mainHide?'off':''}" data-th="hide" title="Show / hide main track">${ic(S.mainHide?'eyeoff':'eye')}</button><button class="ib ${S.mainMute?'off':''}" data-th="mute" title="Main track mute">${ic(S.mainMute?'volx':'vol')}</button><span class="tl">Main</span></div>
    <div class="tbody" id="track">${S.clips.length ? S.clips.map(clipHTML).join('') : '<div style="padding:24px 14px;color:var(--mute)">🎬 Drag a video / photo here</div>'}</div></div>`;
  for(let t = 0; t < nAu; t++){
    const items = S.audios.filter(a => a.track === t), ts = (S.trk && S.trk.au[t]) || {};
    h += `<div class="trow aurow ${ts.mute?'thide':''} ${ts.lock?'tlock':''}" data-zone="audio" data-track="${t}">${trackHead('au',t,items)}<div class="tbody">${items.map(a => {
      const m = media(a.mediaId), icon = {voice:'🎙',extract:'🔊',sfx:'🔔',tts:'🗣'}[a.kind] || '🎵';
      const fx = (a.audio.voice!=='none'||a.audio.echo||a.audio.reverb||a.audio.bass||a.audio.treble||a.audio.pitch) ? ' 🎛' : '';
      const bts = a.beats ? beatTimes(a).map(t=>`<i class="bt" style="left:${(t-a.start)*pps}px"></i>`).join('') : '';
      return `<div class="it audio ${a.kind} ${S.sel===a.id?'sel':''} ${selMulti.has(a.id)?'msel':''}" data-oid="${a.id}" style="left:${a.start*pps}px;width:${Math.max(14,a.dur*pps-2)}px;${waveStyle(m,a.in,a.speed)}">${bts}<span class="lbl">${icon} ${esc(m?m.name:'')}${fx}${a.volume===0?' 🔇':''}</span><div class="h l" data-h="l"></div><div class="h r" data-h="r"></div></div>`;
    }).join('')}</div></div>`;
  }
  h += `<div class="trow drop auz" data-zone="audio"><div class="thead"></div><div class="tbody">🎵 Audio: drop music / sound here</div></div>`;
  const endM = S.allEnd > S.total + .05 ? `<div class="tlend" style="left:${HEADW + S.total*pps}px;width:${(S.allEnd - S.total)*pps}px" title="Not played or exported — the video ends here. Trim or move the audio."><span>END</span></div>` : '';
  $('#tlRows').innerHTML = h + endM + '<div id="snapL"></div><div id="marq"></div>';
  updatePH();
}
function updatePH(){
  const x = S.time*S.pps, ph = $('#ph'); ph.style.left = (HEADW + x) + 'px';
  ph.style.visibility = (x < TL.scrollLeft - 1 || x > TL.scrollLeft + TL.clientWidth - HEADW + 1) ? 'hidden' : '';
  $('#tcCur').textContent = fmtF(S.time); $('#tcTot').textContent = fmtF(S.total);
  if(S.playing){ const vis = TL.clientWidth - HEADW; if(x > TL.scrollLeft + vis - 40 || x < TL.scrollLeft) TL.scrollLeft = x - 40; }
}
// playhead drag: the pointer is kept inside the visible track area; holding it at (or past) an edge keeps scrolling,
// so you can always drag back to 0:00 even when the timeline is scrolled far to the right
function seekDragStep(){
  if(!drag || drag.type !== 'seek') return;
  const r = TL.getBoundingClientRect(), L = r.left + HEADW, R = r.left + TL.clientWidth, x = drag.cx;
  // auto-scroll only when the pointer is pushed OUTSIDE the track area (not while dragging inside it)
  if(x < L - 2 && TL.scrollLeft > 0) TL.scrollLeft -= Math.min(40, 3 + (L - x)*.4);
  else if(x > R + 2) TL.scrollLeft += Math.min(40, 3 + (x - R)*.4);
  seek(Math.max(0, tAt(clamp(x, L, R))));
}
function seekEdgeLoop(){
  if(!drag || drag.type !== 'seek'){ return; }
  const r = TL.getBoundingClientRect(), L = r.left + HEADW, R = r.left + TL.clientWidth;
  if((drag.cx < L - 2 && TL.scrollLeft > 0) || drag.cx > R + 2) seekDragStep();
  drag.loop = setTimeout(seekEdgeLoop, 16);
}
const tAt = x => { const rb = $('#rulerBody'); return rb ? (x - rb.getBoundingClientRect().left)/S.pps : 0; };
function zoneAt(y){ const m = $('.trow.main'); if(!m) return 'main'; const r = m.getBoundingClientRect(); return y < r.top ? 'overlay' : y <= r.bottom ? 'main' : 'audio'; }
function setZone(z){ TL.classList.remove('z-overlay','z-main','z-audio'); if(z) TL.classList.add('z-' + z); }

const isLocked = it => !!(it && it.type && S.trk && S.trk[it.type === 'audio' ? 'au' : 'ov'][it.track] && S.trk[it.type === 'audio' ? 'au' : 'ov'][it.track].lock);
// a press on the timeline's own scrollbar must only scroll — never move the playhead or start a selection box
const onTLScrollbar = e => { if(e.target !== TL && e.target !== $('#tlInner')) return false; const r = TL.getBoundingClientRect(); return e.clientY > r.top + TL.clientHeight || e.clientX > r.left + TL.clientWidth; };
TL.addEventListener('pointerdown', e => {
  if(exporting || recState || e.button > 0 || onTLScrollbar(e)) return;
  const tk = e.target.closest('[data-tk]');
  if(tk){ const [kind,t,key] = tk.dataset.tk.split(':'), st = trkState(kind, +t); st[key] = !st[key]; renderTimeline(); seek(S.time); return; }
  const th = e.target.closest('[data-th]');
  if(th){ if(th.dataset.th === 'hide') S.mainHide = !S.mainHide; else { S.mainMute = !S.mainMute; } renderTimeline(); return; }
  if(e.target.closest('.thead')) return;
  if(e.target.closest('.ruler')){ drag = {type:'seek'}; seek(tAt(e.clientX)); TL.setPointerCapture(e.pointerId); e.preventDefault(); return; }
  const tm = e.target.closest('.tmark');
  if(tm){ S.sel = tm.dataset.tid; S.rt[kindOf(selItem())] = 'trans'; renderTimeline(); renderInspector(); return; }
  const itEl = e.target.closest('.it'), h = e.target.closest('.h'), cl = e.target.closest('.clip');
  const multiKey = e.ctrlKey || e.metaKey || e.shiftKey;
  if(itEl){
    const o = findFree(itEl.dataset.oid); if(!o || isLocked(o)) return;
    if(multiKey){ if(S.sel && !selMulti.size) selMulti.add(S.sel); selMulti.has(o.id) ? selMulti.delete(o.id) : selMulti.add(o.id); S.sel = o.id; renderTimeline(); renderInspector(); return; }
    if(!selMulti.has(o.id)) selMulti.clear();
    select(o.id);
    const group = selMulti.size > 1 ? [...S.overlays, ...S.audios].filter(x => selMulti.has(x.id)).map(x => [x, x.start]) : null;
    drag = h ? {type:'ovtrim', side:h.dataset.h, o, x0:e.clientX, start0:o.start, dur0:o.dur, in0:o.in, undo:false}
             : {type:'ovmove', o, x0:e.clientX, y0:e.clientY, start0:o.start, track0:o.track, group, undo:false};
    TL.setPointerCapture(e.pointerId); e.preventDefault(); return;
  }
  if(h && cl){
    const c = S.clips.find(x => x.id === cl.dataset.id); S.sel = c.id; pushUndo();
    drag = {type:'trim', side:h.dataset.h, c, x0:e.clientX, in0:c.in, out0:c.out};
    TL.setPointerCapture(e.pointerId); e.preventDefault(); return;
  }
  if(cl){
    const c = S.clips.find(x => x.id === cl.dataset.id);
    if(multiKey){
      if(S.sel && !selMulti.size) selMulti.add(S.sel);
      if(e.shiftKey && selClip()){ const a = S.clips.indexOf(selClip()), b = S.clips.indexOf(c); for(let k=Math.min(a,b);k<=Math.max(a,b);k++) selMulti.add(S.clips[k].id); }
      else if(selMulti.has(c.id)) selMulti.delete(c.id); else selMulti.add(c.id);
      S.sel = c.id; renderTimeline(); renderInspector(); return;
    }
    if(!selMulti.has(c.id)) selMulti.clear(); select(c.id);
    drag = {type:'clipmaybe', c, x0:e.clientX, y0:e.clientY, start0:derived[c.id].start};
    TL.setPointerCapture(e.pointerId); return;
  }
  // empty area: rubber-band selection (a simple click = move playhead)
  drag = {type:'marquee', x0:e.clientX, y0:e.clientY, add:multiKey, base:new Set(multiKey ? selMulti : []), moved:false};
  TL.setPointerCapture(e.pointerId); e.preventDefault();
});
function snapTime(t, skip){
  const th = 8/S.pps; let best = null, bd = th;
  const cands = [S.time, 0];
  for(const c of S.clips){ const d = derived[c.id]; if(d) cands.push(d.start, d.start + d.dur); }
  for(const x of [...S.overlays, ...S.audios]) if(!skip.has(x.id)) cands.push(x.start, x.start + x.dur);
  for(const c of cands){ const d = Math.abs(c - t); if(d < bd){ bd = d; best = c; } }
  return best;
}
function showSnap(t){ const l = $('#snapL'); if(!l) return; if(t == null){ l.style.display = 'none'; return; } l.style.display = 'block'; l.style.left = (HEADW + t*S.pps) + 'px'; }
function trackAtY(y, cls){
  const rows = [...TL.querySelectorAll('.trow.' + cls)];
  for(const r of rows){ const b = r.getBoundingClientRect(); if(y >= b.top && y <= b.bottom) return +r.dataset.track; }
  if(!rows.length) return 0;
  const n = rows.length;
  if(cls === 'ovrow'){ const top = rows[0].getBoundingClientRect().top; if(y < top) return n; }
  else { const bot = rows[rows.length-1].getBoundingClientRect().bottom; if(y > bot) return n; }
  return null;
}
TL.addEventListener('pointermove', e => {
  if(!drag) return;
  const pps = S.pps;
  if(drag.type === 'trim'){
    const c = drag.c, ds = (e.clientX - drag.x0)/pps*c.speed, m = media(c.mediaId);
    if(drag.side === 'l') c.in = clamp(drag.in0 + ds, 0, c.out - .2); else c.out = clamp(drag.out0 + ds, c.in + .2, m.type==='image' ? 3600 : m.duration);
    layout(); renderTimeline();
  } else if(drag.type === 'clipmaybe' || drag.type === 'clipdrag'){
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if(drag.type === 'clipmaybe'){ if(Math.hypot(dx,dy) < 6) return; drag.type = 'clipdrag'; TL.classList.add('dragging'); }
    const el = TL.querySelector(`.clip[data-id="${drag.c.id}"]`);
    if(el){ el.classList.add('dragging'); el.style.transform = `translate(${dx}px,${dy}px)`; }
    setZone(zoneAt(e.clientY) === 'audio' ? null : zoneAt(e.clientY));
  } else if(drag.type === 'marquee'){
    const x0 = Math.min(drag.x0, e.clientX), x1 = Math.max(drag.x0, e.clientX), y0 = Math.min(drag.y0, e.clientY), y1 = Math.max(drag.y0, e.clientY);
    if(!drag.moved && x1 - x0 < 5 && y1 - y0 < 5) return;
    drag.moved = true;
    const mq = $('#marq'), tb = $('#tlInner').getBoundingClientRect();
    if(mq){ mq.style.display = 'block'; mq.style.left = (x0 - tb.left) + 'px'; mq.style.top = (y0 - tb.top) + 'px'; mq.style.width = (x1 - x0) + 'px'; mq.style.height = (y1 - y0) + 'px'; }
    const sel = new Set(drag.base);
    TL.querySelectorAll('.clip,.it').forEach(el => { const b = el.getBoundingClientRect(), id = el.dataset.id || el.dataset.oid;
      const hit = b.right > x0 && b.left < x1 && b.bottom > y0 && b.top < y1 && !isLocked(findFree(id));
      if(hit) sel.add(id); el.classList.toggle('msel', sel.has(id)); });
    selMulti.clear(); sel.forEach(id => selMulti.add(id));
  } else if(drag.type === 'ovmove' || drag.type === 'ovtrim'){
    const dt = (e.clientX - drag.x0)/pps, o = drag.o;
    if(!drag.undo){ if(Math.abs(e.clientX - drag.x0) < 3 && Math.abs(e.clientY - (drag.y0||e.clientY)) < 3) return; pushUndo(); drag.undo = true; }
    const timed = o.type === 'video' || o.type === 'audio', mdur = timed ? media(o.mediaId).duration : Infinity;
    if(drag.type === 'ovmove'){
      if(drag.group){
        const mn = Math.min(...drag.group.map(g => g[1])), d2 = Math.max(-mn, dt);
        drag.group.forEach(([x,s0]) => x.start = s0 + d2);
      } else {
        let ns = Math.max(0, drag.start0 + dt), sn = null;
        if(!e.altKey){ const skip = new Set([o.id]), a = snapTime(ns, skip), b = snapTime(ns + o.dur, skip);
          if(a != null && (b == null || Math.abs(a-ns) <= Math.abs(b-ns-o.dur))){ ns = a; sn = a; } else if(b != null){ ns = Math.max(0, b - o.dur); sn = b; } }
        o.start = ns; showSnap(sn);
        const z = zoneAt(e.clientY);
        if(!(isMediaOv(o) && z === 'main')){ const t = trackAtY(e.clientY, o.type === 'audio' ? 'aurow' : 'ovrow'); if(t != null && t !== o.track){ o.track = t; } o._pri = true; }
        setZone(isMediaOv(o) && z === 'main' ? 'main' : null);
      }
    } else if(drag.side === 'l'){
      const minS = timed ? Math.max(0, drag.start0 - drag.in0/o.speed) : 0;
      const ns = clamp(drag.start0 + dt, minS, drag.start0 + drag.dur0 - .2), sh = ns - drag.start0;
      o.dur = drag.dur0 - sh; o.start = ns;
      if(timed) o.in = drag.in0 + sh*o.speed;
      if(o.kf) o.kf.forEach(k => { if(k._t0 === undefined) k._t0 = k.t; k.t = k._t0 - sh; });
    } else {
      let ne = drag.start0 + clamp(drag.dur0 + dt, .2, (mdur - o.in)/o.speed); const sn = e.altKey ? null : snapTime(ne, new Set([o.id]));
      if(sn != null && sn - drag.start0 >= .2 && sn - drag.start0 <= (mdur - o.in)/o.speed){ ne = sn; showSnap(sn); } else showSnap(null);
      o.dur = ne - drag.start0;
    }
    layout(); renderTimeline();
  } else if(drag.type === 'seek' && e.buttons){ drag.cx = e.clientX; seekDragStep(); if(!drag.loop) drag.loop = setTimeout(seekEdgeLoop, 16); }
});
function endDrag(e){
  const d = drag; drag = null; if(!d) return;
  TL.classList.remove('dragging'); setZone(null); showSnap(null);
  if(d.type === 'marquee'){
    const mq = $('#marq'); if(mq) mq.style.display = 'none';
    if(!d.moved){ if(selMulti.size){ selMulti.clear(); renderTimeline(); } seek(tAt(e.clientX)); return; }
    if(selMulti.size === 1){ select([...selMulti][0]); selMulti.clear(); }
    else if(selMulti.size){ S.sel = [...selMulti][0]; }
    renderTimeline(); renderInspector(); return;
  }
  if(d.type === 'trim') afterEdit();
  else if(d.type === 'clipdrag'){
    const z = zoneAt(e.clientY), t = d.start0 + (e.clientX - d.x0)/S.pps;
    if(z === 'overlay') clipToOverlay(d.c, t);
    else if(z === 'main'){ moveClipTo(d.c, t + derived[d.c.id].dur/2); renderTimeline(); }
    else renderTimeline();
  }
  else if(d.type === 'ovmove' || d.type === 'ovtrim'){
    if(d.o.kf) d.o.kf.forEach(k => delete k._t0);
    if(d.type === 'ovmove' && isMediaOv(d.o) && e && zoneAt(e.clientY) === 'main'){ d.o.start = d.start0; overlayToClip(d.o, tAt(e.clientX)); return; }
    if(d.type === 'ovmove') d.o._pri = true;
    layout(); renderTimeline();
    if(d.undo){ renderInspector(); seek(S.time); }
  }
}
TL.addEventListener('pointerup', endDrag);
TL.addEventListener('scroll', () => { const x = S.time*S.pps, ph = $('#ph'); if(ph) ph.style.visibility = (x < TL.scrollLeft - 1 || x > TL.scrollLeft + TL.clientWidth - HEADW + 1) ? 'hidden' : ''; }, {passive:true});
TL.addEventListener('pointercancel', e => endDrag(e));
// drag & drop from library / OS
TL.addEventListener('dragover', e => { e.preventDefault(); e.stopPropagation(); TL.classList.add('dragging'); setZone(zoneAt(e.clientY)); });
TL.addEventListener('dragleave', e => { if(!TL.contains(e.relatedTarget)){ setZone(null); TL.classList.remove('dragging'); } });
TL.addEventListener('drop', async e => {
  e.preventDefault(); e.stopPropagation();
  const z = zoneAt(e.clientY), t = Math.max(0, tAt(e.clientX)); setZone(null); TL.classList.remove('dragging');
  const d = e.dataTransfer.getData('text/plain');
  if(d && d.startsWith('ccmedia:')){ dropMedia(media(d.slice(8)), z, t); renderLeft(); return; }
  if(d && d.startsWith('ccgfx:')){ addGfx(d.slice(6), t); return; }
  if(d && d.startsWith('ccfilt:')){ const el = e.target.closest && e.target.closest('.clip[data-id], .it[data-oid]');
    const it = el ? (el.dataset.id ? S.clips.find(c => c.id === el.dataset.id) : S.overlays.find(o => o.id === el.dataset.oid)) : clipAt(t);
    dropFilter(d.slice(7), it); return; }
  if(!S.project || ccDrag) return;
  for(const f of e.dataTransfer.files){
    let m = null;
    try{ m = f.type.startsWith('video/') ? await addVideoMedia(f) : f.type.startsWith('image/') ? await addImageMedia(f) : f.type.startsWith('audio/') ? await addAudioMedia(f) : null; }
    catch(err){ alert(f.name + ': ' + err.message); }
    if(m) dropMedia(m, z, t);
  }
  renderLeft();
});
function dropMedia(m, z, t){
  if(!m || m.missing) return;
  if(m.type === 'audio' || z === 'audio'){ addAudioAt(m, {start:t, kind:m.type === 'audio' ? 'music' : 'extract'}); return; }
  if(z === 'overlay'){ S.time = t; addPip(m); return; }
  insertMediaClip(m, t);
}

/* ---------------- TOOLBAR ---------------- */
function renderTools(){
  const b = (id,i,t,cls='') => `<button id="${id}" class="ib ${cls}" title="${t}">${ic(i)}</button>`;
  $('#tools').innerHTML = b('tSel','cursor','Select','on') + '<span class="sep"></span>' + b('tUndo','undo','Undo (Ctrl+Z)') + b('tRedo','redo','Redo (Ctrl+Y)') + '<span class="sep"></span>' +
    b('tSplit','split','Split (S / Ctrl+B)') + b('tDelL','delL','Delete left (Q)') + b('tDelR','delR','Delete right (W)') + b('tDel','trash','Delete (Del)') + b('tDup','copy','Duplicate (Ctrl+D)') + '<span class="sep"></span>' +
    b('tFlip','flip','Mirror') + b('tRot','rotate','Rotate 90°') + b('tKf','kf','Keyframe (K)') + '<span class="sp"></span>' +
    b('tRec','mic','Voice-over record') + '<span class="sep"></span>' + b('tZo','zout','Zoom out') + `<input type="range" id="zoom" min="8" max="200" value="${S.pps}">` + b('tZi','zin','Zoom in');
  fillRanges($('#tools'));
}
$('#tools').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b || exporting) return;
  ({tUndo:undo, tRedo:redo, tSplit:split, tDelL:()=>trimSide('left'), tDelR:()=>trimSide('right'), tDel:del, tDup:dup, tFlip:flipSel, tRot:rotateSel, tKf:toggleKf, tRec:openRecord,
    tZo:()=>setZoom(S.pps/1.4), tZi:()=>setZoom(S.pps*1.4)}[b.id] || (()=>{}))();
});
$('#tools').addEventListener('input', e => { if(e.target.id === 'zoom') setZoom(+e.target.value); });
function delMulti(){
  if(!selMulti.size) return; pushUndo();
  for(const c of S.clips) if(selMulti.has(c.id) && vids[c.id]) vids[c.id].pause();
  S.clips = S.clips.filter(c => !selMulti.has(c.id)); S.overlays = S.overlays.filter(o => !selMulti.has(o.id)); S.audios = S.audios.filter(a => !selMulti.has(a.id));
  active = null; dropAllChains(); pairKey = ''; selMulti.clear(); S.sel = S.clips[0] ? S.clips[0].id : null; afterEdit();
}
TL.addEventListener('wheel', e => {   // Ctrl + wheel = zoom around the mouse
  if(!(e.ctrlKey || e.metaKey)) return; e.preventDefault();
  const t = tAt(e.clientX), px = e.clientX - TL.getBoundingClientRect().left;
  setZoom(S.pps * (e.deltaY < 0 ? 1.15 : 1/1.15));
  TL.scrollLeft = Math.max(0, HEADW + t*S.pps - px);
}, {passive:false});
function setZoom(v){ S.pps = clamp(v, 8, 200); const z = $('#zoom'); if(z){ z.value = S.pps; setFill(z); } renderTimeline(); }

/* =====================================================================
   HOME (start page)
   ===================================================================== */
function hideHome(){ $('#home').style.display = 'none'; }
async function showHome(){
  pause(); await saveProject();
  let list = [], store = '';
  if(DB){ try{ list = (await idbAll('projects')).sort((a,b)=>b.updated-a.updated); }catch(e){} }
  try{ const est = await navigator.storage.estimate(); store = `💾 ${(est.usage/1048576).toFixed(0)} MB used · ${(est.quota/1073741824).toFixed(1)} GB available on this device`; }catch(e){}
  const Q = [['captions','captions','Auto captions','Turn speech into text'],['rmbg','wand','Remove background','Remove backgrounds with AI'],['voice','mic','Voice-over','Record your voice'],['sfx','wave','Sound effects','Free sound effects']];
  $('#homeBox').innerHTML = `<aside class="hside"><div class="hlogo"><span class="logo"><i>${ic('play')}</i></span>ChitraCut</div>
      <button class="hnav on">${ic('home')} Home</button><button class="hnav" data-hscroll="1">${ic('folder')} Projects</button>
      ${S.project ? `<button class="hnav" id="hBack">${ic('edit')} Back to editor</button>` : ''}
      <div class="hsp"></div><div class="hpro">ChitraCut<small>Free professional video editor</small></div></aside>
    <main class="hmain">
      <button class="hbanner" data-new="1"><span class="hplus">${ic('plus')}</span>Create project</button>
      <div class="hquick">${Q.map(([k,i,t,d])=>`<button class="hq" data-quick="${k}"><span class="qi">${ic(i)}</span><b>${t}</b><span>${d}</span></button>`).join('')}</div>
      <h3 id="hProj">Projects ${list.length?`<span style="color:var(--mute);font-weight:400">(${list.length})</span>`:''}</h3>
      ${!DB ? '<div class="note">⚠ Projects cannot be saved in this browser (private mode?). You can still edit and export.</div>' : ''}
      ${list.length ? `<div class="plist">${list.map(p=>`<div class="pcard" data-open="${p.id}"><div class="pt" style="${p.thumb?`background-image:url(${p.thumb})`:''}">${p.thumb?'':ic('film')}</div><div class="pn">${esc(p.name)}</div>
          <div class="pd"><span>${new Date(p.updated).toLocaleDateString()} ${new Date(p.updated).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span><span class="pb"><button class="ib sm" data-ren="${p.id}" title="Rename">${ic('edit')}</button><button class="ib sm" data-delp="${p.id}" title="Delete">${ic('trash')}</button></span></div></div>`).join('')}</div>`
        : '<div class="hempty">No projects yet — press <b>Create project</b> above to start</div>'}
      <div class="hoff">${offlineCard()}</div>
      <div class="hstore">${store}</div></main>`;
  $('#home').style.display = 'flex';
}
$('#home').addEventListener('click', async e => {
  const t = e.target;
  if(t.closest('#hOffline')){ prepareOffline(t.closest('#hOffline')); return; }
  if(t.closest('#hInstall')){ doInstall(); return; }
  if(t.closest('#hBack')){ hideHome(); return; }
  if(t.closest('[data-hscroll]')){ $('#hProj').scrollIntoView({behavior:'smooth'}); return; }
  const ren = t.closest('[data-ren]'), dp = t.closest('[data-delp]');
  if(ren){
    const rec = await idbGet('projects', ren.dataset.ren), nm = prompt('Project name', rec.name);
    if(nm && nm.trim()){ rec.name = nm.trim(); await idbPut('projects', rec); if(S.project && S.project.id === rec.id){ S.project.name = rec.name; updateProjName(); } showHome(); }
    return;
  }
  if(dp){
    if(!confirm('Delete this project permanently?')) return;
    const id = dp.dataset.delp; await idbDel('projects', id); await idbDelBlobs(id);
    if(S.project && S.project.id === id){ resetState(); S.project = null; afterEdit(); renderLeft(); }
    showHome(); return;
  }
  const q = t.closest('[data-quick]');
  if(q){
    await newProject();
    const k = q.dataset.quick;
    if(k === 'captions'){ S.ltab = 'captions'; S.lsub.captions = 'auto'; }
    if(k === 'rmbg'){ S.ltab = 'media'; S.rt.clip = 'video'; S.rs.video = 'rmbg'; }
    if(k === 'voice'){ S.ltab = 'audio'; S.lsub.audio = 'voice'; }
    if(k === 'sfx'){ S.ltab = 'audio'; S.lsub.audio = 'sfx'; }
    renderLeft(); if(k === 'rmbg' || k === 'captions') $('#fileIn').click();
    return;
  }
  if(t.closest('[data-new]')){ await newProject(); S.ltab = 'media'; renderLeft(); return; }
  const op = t.closest('[data-open]'); if(op) openProject(op.dataset.open);
});
$('#projName').onclick = () => { if(!S.project) return; const nm = prompt('Project name', S.project.name); if(nm && nm.trim()){ S.project.name = nm.trim(); updateProjName(); saveProject(true); } };
function syncSelects(){ $('#selRatio').value = S.ratio; $('#selBg').value = S.bg; updatePInfo(); }
function updatePInfo(){ $('#pInfo').textContent = `${S.ratio==='orig'?'Original':S.ratio} · ${out.width}×${out.height}`; }

/* ---------------- EXPORT DIALOG ---------------- */
const EXP_RES = [[480,'480p'],[720,'720p'],[1080,'1080p'],[1440,'2K'],[2160,'4K']];
const EXP_BR = [['low','Lower',.6],['rec','Recommended',1],['high','Higher',2]];
function expDims(q){ let a,b; if(S.ratio==='orig'){ const m=S.media.find(x=>x.w); a=m?m.w:9; b=m?m.h:16; } else [a,b]=S.ratio.split(':').map(Number); let W,H; if(a>=b){ H=q; W=Math.round(q*a/b); } else { W=q; H=Math.round(q*b/a); } return [W-W%2, H-H%2]; }
function expBitrate(E){ const [W,H] = expDims(E.q), base = W*H*E.fps*.15; return E.br === 'custom' ? E.cbr*1e6 : Math.round(base*(EXP_BR.find(b=>b[0]===E.br)||EXP_BR[1])[2]); }
function openExport(){
  if(!S.total) return alert('Add media first');
  pause();
  const E = S.exp = Object.assign({name:S.project?S.project.name:'ChitraCut', q:1080, br:'rec', cbr:10, fps:30, codec:'h264', fmt:'mp4', video:true, audio:true, gif:false, gifRes:320}, S.exp||{});
  const prev = (() => { const c=document.createElement('canvas'), k=260/Math.max(out.width,out.height); c.width=out.width*k; c.height=out.height*k; c.getContext('2d').drawImage(out,0,0,c.width,c.height); return c.toDataURL('image/jpeg',.8); })();
  showModal(`<div class="xwrap"><div class="xprev"><img src="${prev}"><div class="xmeta"><b>${fmtTC(S.total)}</b><span>${S.ratio==='orig'?'Original':S.ratio}</span></div></div>
    <div class="xform"><h3 style="margin:0 0 12px">${ic('export')} Export</h3>
    <div class="xrow"><span>Name</span><input type="text" id="xName" value="${esc(E.name)}"></div>
    <div class="xrow"><span>Export to</span><div class="xto" id="xSave"></div></div><div id="xSaveHint"></div>
    <div class="xsec"><label class="xchk"><input type="checkbox" id="xVideo" ${E.video?'checked':''}> <b>Video</b></label>
      <div class="xbody" id="xVBody"></div></div>
    <div class="xsec"><label class="xchk"><input type="checkbox" id="xAudio" ${E.audio?'checked':''}> <b>Audio</b></label>
      <div class="xbody"><div class="xrow"><span>Format</span><b class="xval">${MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')?'AAC / M4A':'Opus / WebM'} · 192 kbps</b></div><div class="xhint">Choose only Audio (without Video) to export an audio file.</div></div></div>
    <div class="xsec"><label class="xchk"><input type="checkbox" id="xGif" ${E.gif?'checked':''}> <b>Export GIF</b></label>
      <div class="xbody"><div class="xrow"><span>Resolution</span><select id="xGifRes">${[[240,'240p'],[320,'320p'],[480,'480p']].map(([v,n])=>`<option value="${v}" ${E.gifRes===v?'selected':''}>${n}</option>`).join('')}</select></div></div></div>
    <div class="xfoot"><span id="xSize"></span><div class="btns" style="margin:0"><button id="xCancel">Cancel</button><button class="primary" id="xGo">${ic('export')} Export</button></div></div>
    </div></div>`);
  $('#modalBox').classList.add('wide'); renderSaveTo();
  renderExpVideo();
}
function renderExpVideo(){
  const E = S.exp, sup = exportSupport(E.q), fmts = Object.keys(sup);
  if(!fmts.includes(E.fmt)) E.fmt = fmts[0] || 'webm';
  const cods = sup[E.fmt] || ['vp8']; if(!cods.includes(E.codec)) E.codec = cods[0];
  const [W,H] = expDims(E.q), sel = (id,opts,v) => `<select id="${id}">${opts.map(([k,n])=>`<option value="${k}" ${String(v)===String(k)?'selected':''}>${n}</option>`).join('')}</select>`;
  $('#xVBody').innerHTML = `
    <div class="xrow"><span>Resolution</span>${sel('xRes',EXP_RES,E.q)}</div>
    <div class="xrow"><span>Bit rate</span>${sel('xBr',[...EXP_BR.map(b=>[b[0],b[1]]),['custom','Custom']],E.br)}${E.br==='custom'?`<input type="number" id="xCbr" min="1" max="120" value="${E.cbr}" style="width:64px;margin-left:6px"> <small>Mbps</small>`:''}</div>
    <div class="xrow"><span>Codec</span>${sel('xCodec',VCODECS.filter(c=>cods.includes(c[0])).map(c=>[c[0],c[1]]),E.codec)}</div>
    <div class="xrow"><span>Format</span>${sel('xFmt',fmts.map(f=>[f,f]),E.fmt)}</div>
    <div class="xrow"><span>Frame rate</span>${sel('xFps',[24,25,30,50,60].map(f=>[f,f+'fps']),E.fps)}</div>
    <div class="xhint">${W}×${H} · ${(expBitrate(E)/1e6).toFixed(1)} Mbps${E.q>=1440?' · ⚠ 2K/4K needs a powerful PC; slow devices may drop frames':''}</div>`;
  const vb = $('#xVBody'); vb.style.opacity = E.video ? 1 : .4; vb.style.pointerEvents = E.video ? '' : 'none';
  const sz = ((E.video ? expBitrate(E) : 0) + (E.audio ? 192000 : 0))*S.total/8/1048576;
  $('#xSize').innerHTML = `Size: ~${sz < 1 ? sz.toFixed(2) : sz.toFixed(0)} MB${E.gif?' + GIF':''} · ${fmtT(S.total)} <small>(exports in real time)</small>`;
}
$('#modal').addEventListener('change', e => {
  const E = S.exp, id = e.target.id; if(!E || !id || !id.startsWith('x')) return;
  const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  const map = {xRes:['q',+v], xBr:['br',v], xCbr:['cbr',+v], xCodec:['codec',v], xFmt:['fmt',v], xFps:['fps',+v], xVideo:['video',v], xAudio:['audio',v], xGif:['gif',v], xGifRes:['gifRes',+v], xName:['name',v]};
  if(map[id]){ E[map[id][0]] = map[id][1]; if(id !== 'xName') renderExpVideo(); }
});
function renderSaveTo(hint){
  const box = $('#xSave'); if(!box) return;
  const label = saveDir ? '📁 ' + esc(saveDir.name) : FS_SAVE ? 'Asks when you export (Save as…)' : '⬇ Downloads';
  box.innerHTML = `<span class="xpath" title="${saveDir ? 'Folder: ' + esc(saveDir.name) : ''}">${label}</span>${saveDir ? '<button class="ib sm" id="xClrDir" type="button" title="Clear folder (ask every time)">✕</button>' : ''}${FS_DIR ? `<button class="ib" id="xPickDir" type="button" title="Choose folder">${ic('folder')}</button>` : ''}`;
  const h = $('#xSaveHint'); if(h) h.innerHTML = hint || (!FS_DIR && !FS_SAVE ? '<div class="xhint">In this browser (phone / Firefox) files go to <b>Downloads</b>.</div>' : '');
}
async function pickSaveDir(){
  try{ const h = await showDirectoryPicker({id:'chitracut-export', mode:'readwrite', startIn:'videos'}); saveDir = h; await setSetting('saveDir', h); renderSaveTo(); }
  catch(err){ renderSaveTo(err && err.name === 'AbortError' ? '<div class="xhint">💡 Browsers do not allow picking main folders like <b>Desktop, Documents, Downloads</b> directly (they contain system files). Create a new folder inside (e.g. <b>Desktop › ChitraCut</b>) and pick that. Or skip the folder — Export will open a Save-as window where you can save to the Desktop.</div>' : ''); }
}
$('#modal').addEventListener('click', async e => {
  if(e.target.closest('#xPickDir')){ e.preventDefault(); pickSaveDir(); return; }
  if(e.target.closest('#xClrDir')){ e.preventDefault(); saveDir = null; setSetting('saveDir', null); renderSaveTo(); return; }
  if(e.target.closest('#xCancel')){ hideModal(); $('#modalBox').classList.remove('wide'); return; }
  if(!e.target.closest('#xGo')) return;
  const E = S.exp; E.name = ($('#xName')||{}).value || E.name;
  if(!E.video && !E.audio && !E.gif) return alert('Choose Video, Audio or GIF');
  // choose where to save NOW (the browser only allows these dialogs right after a click)
  const vopt = {q:E.q, fps:E.fps, bitrate:expBitrate(E), fmt:E.fmt, codec:E.codec, audioOnly:!E.video, name:E.name}, gopt = {gif:true, q:E.gifRes, fps:12, name:E.name};
  const mode = saveDir ? 'folder' : FS_SAVE ? 'ask' : 'downloads';
  try{
    if(mode === 'ask' && FS_SAVE){
      const first = (E.video || E.audio) ? vopt : gopt, {mime, ext} = chooseMime(first), base = mime.split(';')[0];
      first.fileHandle = await showSaveFilePicker({suggestedName:cleanName(E.name) + ext, id:'chitracut-export', startIn:'videos', types:[{description:ext.slice(1).toUpperCase() + ' file', accept:{[base]:[ext]}}]});
    } else if(mode === 'folder' && saveDir){
      let p = await saveDir.queryPermission({mode:'readwrite'}); if(p !== 'granted') p = await saveDir.requestPermission({mode:'readwrite'});
      if(p === 'granted'){ vopt.dirHandle = saveDir; gopt.dirHandle = saveDir; }
    }
  }catch(err){ if(err && err.name === 'AbortError') return; }   // user closed the Save dialog → stay in export window
  hideModal(); $('#modalBox').classList.remove('wide');
  if(E.video || E.audio){ const ok = await exportVideo(vopt); if(ok === false) return; }
  if(E.gif) await exportVideo(gopt);
});

/* =====================================================================
   WIRING
   ===================================================================== */
$('#btnHome').innerHTML = ic('home'); $('#logoIc').innerHTML = ic('play');
$('#btnExport').innerHTML = ic('export') + '<span>Export</span>';
IC.sparkle = '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>';
{ const cb = document.createElement('button'); cb.id = 'btnCover'; cb.innerHTML = ic('sparkle') + '<span>Thumbnail</span>'; cb.title = 'AI Auto Thumbnail'; cb.onclick = () => openThumb(); $('#btnExport').before(cb); } $('#btnFull').innerHTML = ic('full');
$('#btnHome').onclick = showHome;
$('#btnExport').onclick = openExport;
$('#btnPlay').onclick = () => S.playing ? pause() : play();
$('#btnFull').onclick = () => { const s = $('#stage'); if(document.fullscreenElement) document.exitFullscreen(); else if(s.requestFullscreen) s.requestFullscreen(); };
$('#selRatio').onchange = e => { S.ratio = e.target.value; setCanvas(); updatePInfo(); renderInspector(); };
$('#selBg').onchange = e => { S.bg = e.target.value; renderInspector(); };
$('#fileIn').onchange = e => { importFiles([...e.target.files]); e.target.value = ''; };
$('#audioIn').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if(!f) return;
  try{ const m = await addAudioMedia(f); addAudioAt(m, {start:S.audios.length ? S.time : 0}); renderLeft(); }catch(err){ alert(err.message); }
};
$('#lutIn').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if(!f) return;
  try{ const {n,data} = parseCube(await f.text()); const l = addLut(f.name.replace(/\.cube$/i,''), n, data, null, true); const it = visTarget(); if(it){ pushUndo(); it.lut = l.id; } renderInspector(); renderLeft(); renderTimeline(); }
  catch(err){ alert(err.message); }
};
$('#pipIn').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if(!f) return;
  try{ const m = f.type.startsWith('video/') ? await addVideoMedia(f) : await addImageMedia(f); renderLeft(); addPip(m); }catch(err){ alert(err.message); }
};
document.addEventListener('keydown', e => {
  if(exporting || recState || e.target.matches('input,select,textarea')) return;
  if($('#home').style.display === 'flex' || $('#modal').style.display === 'flex') return;
  const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
  if(e.code === 'Space'){ e.preventDefault(); S.playing ? pause() : play(); }
  else if(mod && k === 'z'){ e.preventDefault(); e.shiftKey ? redo() : undo(); }
  else if(mod && k === 'y'){ e.preventDefault(); redo(); }
  else if(mod && k === 's'){ e.preventDefault(); saveProject(true); }
  else if(mod && k === 'd'){ e.preventDefault(); dup(); }
  else if((mod && k === 'b') || (!mod && k === 's')){ e.preventDefault(); split(); }
  else if(!mod && k === 'q'){ trimSide('left'); }
  else if(!mod && k === 'w'){ trimSide('right'); }
  else if(!mod && k === 't'){ e.preventDefault(); addTextPreset('default'); }
  else if(!mod && k === 'k'){ e.preventDefault(); toggleKf(); }
  else if(k === 'escape'){ setPick(false); renderInspector(); }
  else if(k === 'delete' || k === 'backspace'){ selMulti.size > 1 ? delMulti() : del(); }
  else if(mod && k === 'a'){ e.preventDefault(); selMulti.clear(); [...S.clips, ...S.overlays, ...S.audios].forEach(x => { if(!isLocked(x)) selMulti.add(x.id); }); renderTimeline(); }
  else if(k === 'arrowleft'){ seek(S.time - 1/30); }
  else if(k === 'arrowright'){ seek(S.time + 1/30); }
  else if(k === 'home'){ seek(0); }
  else if(k === 'end'){ seek(S.total); }
});
window.addEventListener('dragover', e => e.preventDefault());
window.addEventListener('drop', e => { e.preventDefault();
  const d = e.dataTransfer.getData('text/plain');
  if(d && d.startsWith('ccfilt:') && e.target.closest && e.target.closest('#stage')){ dropFilter(d.slice(7), visTarget()); return; }
  if(ccDrag) return;   // pictures dragged out of the side panels are never imported as media
  if(S.project && e.dataTransfer.files.length) importFiles([...e.dataTransfer.files]); });
new ResizeObserver(fitCanvas).observe($('#stage'));
window.addEventListener('resize', () => { HEADW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--head')) || 150; renderTimeline(); });
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});

/* =====================================================================
   PREVIEW GIZMOS: mask editing & tracking box (captures pointer before default drag)
   ===================================================================== */
function maskEditTarget(){
  const it = selItem(); if(!it || it.type === 'audio' || it.type === 'text' || it.type === 'sticker' || it.type === 'gfx') return null;
  const k = kindOf(it); if(S.rt[k] !== 'video' || S.rs.video !== 'mask' || !it.mask || it.mask.type === 'none' || !geo[it.id]) return null;
  return it;
}
const trackEditTarget = () => { const it = selItem(); return it && S.trackEdit === it.id && S.trackBox ? it : null; };
function drawGizmos(ctx){
  drawTfGizmo(ctx);
  const u = Math.min(out.width, out.height), lw = Math.max(2, u/320);
  const mi = maskEditTarget();
  if(mi){
    const g = geo[mi.id], m = mi.mask, L = 2*g.hh;
    ctx.save(); ctx.translate(g.cx, g.cy); ctx.rotate(g.rot); if(g.flip) ctx.scale(-1,1);
    ctx.translate(m.x/100*2*g.hw, m.y/100*2*g.hh); ctx.rotate(m.rot*Math.PI/180);
    const sx = m.w/200*L, sy = m.h/200*L;
    ctx.lineWidth = lw; ctx.strokeStyle = '#fff'; ctx.shadowColor = '#000'; ctx.shadowBlur = 4; ctx.setLineDash([lw*5, lw*3]);
    ctx.beginPath();
    if(m.type === 'circle') ctx.ellipse(0,0,Math.max(1,sx),Math.max(1,sy),0,0,Math.PI*2);
    else if(m.type === 'rect') rr(ctx,-sx,-sy,sx*2,sy*2,m.round/100*Math.min(sx,sy));
    else if(m.type === 'linear'){ ctx.moveTo(-L*3,0); ctx.lineTo(L*3,0); }
    else if(m.type === 'mirror'){ ctx.moveTo(-L*3,-sy); ctx.lineTo(L*3,-sy); ctx.moveTo(-L*3,sy); ctx.lineTo(L*3,sy); }
    else if(m.type === 'star'){ for(let i=0;i<10;i++){ const a = -Math.PI/2 + i*Math.PI/5, r = i%2 ? sy*.42 : sy; ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r); } ctx.closePath(); }
    else if(m.type === 'heart'){ const s = sy*1.8; ctx.moveTo(0,s*.55); ctx.bezierCurveTo(-s*.95,-.05*s,-s*.5,-s*.62,0,-s*.25); ctx.bezierCurveTo(s*.5,-s*.62,s*.95,-.05*s,0,s*.55); }
    ctx.stroke(); ctx.setLineDash([]); ctx.shadowBlur = 0;
    ctx.fillStyle = '#20d5ec'; ctx.beginPath(); ctx.arc(0,0,lw*3.5,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
  const ti = trackEditTarget();
  if(ti){
    const b = S.trackBox; ctx.save(); ctx.lineWidth = lw; ctx.strokeStyle = '#20d5ec'; ctx.fillStyle = 'rgba(32,213,236,.12)';
    ctx.fillRect(b.x,b.y,b.w,b.h); ctx.strokeRect(b.x,b.y,b.w,b.h);
    ctx.fillStyle = '#20d5ec'; ctx.fillRect(b.x+b.w-lw*5, b.y+b.h-lw*5, lw*10, lw*10);
    ctx.font = `700 ${Math.round(u/36)}px Inter,sans-serif`; ctx.fillText('TRACK', b.x, b.y - lw*3); ctx.restore();
  }
}
let gz = null;
const gzPts = new Map();
out.addEventListener('pointerdown', e => {
  if(exporting || S.pick) return;
  const ti = trackEditTarget(), mi = !ti && maskEditTarget(); if(!ti && !mi) return;
  e.stopImmediatePropagation(); e.preventDefault();
  const p = toCv(e); gzPts.set(e.pointerId, p); out.setPointerCapture(e.pointerId);
  if(gzPts.size === 2 && gz && gz.kind === 'mask'){ const [a,b] = [...gzPts.values()]; gz.pinch = {d0:Math.hypot(a.x-b.x,a.y-b.y), w0:mi.mask.w, h0:mi.mask.h}; return; }
  if(ti){ const b = S.trackBox, near = Math.abs(p.x-(b.x+b.w)) < 26 && Math.abs(p.y-(b.y+b.h)) < 26; gz = {kind:'track', mode:near?'size':'move', p0:p, b0:{...b}}; return; }
  pushUndo(); gz = {kind:'mask', it:mi, p0:p, x0:mi.mask.x, y0:mi.mask.y};
}, true);
out.addEventListener('pointermove', e => {
  if(!gz || !gzPts.has(e.pointerId)) return; e.stopImmediatePropagation();
  const p = toCv(e); gzPts.set(e.pointerId, p); const dx = p.x - gz.p0.x, dy = p.y - gz.p0.y;
  if(gz.kind === 'track'){
    const b = S.trackBox, b0 = gz.b0;
    if(gz.mode === 'move'){ b.x = b0.x + dx; b.y = b0.y + dy; } else { b.w = Math.max(16, b0.w + dx); b.h = Math.max(16, b0.h + dy); }
    return;
  }
  const it = gz.it, g = geo[it.id]; if(!g) return;
  if(gz.pinch && gzPts.size >= 2){ const [a,b] = [...gzPts.values()], k = Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,gz.pinch.d0); it.mask.w = clamp(gz.pinch.w0*k,1,300); it.mask.h = clamp(gz.pinch.h0*k,1,300); syncMaskInputs(it); return; }
  const c = Math.cos(g.rot), s = Math.sin(g.rot); let lx = dx*c + dy*s, ly = -dx*s + dy*c; if(g.flip) lx = -lx;
  it.mask.x = clamp(gz.x0 + lx/(2*g.hw)*100, -60, 60); it.mask.y = clamp(gz.y0 + ly/(2*g.hh)*100, -60, 60);
  syncMaskInputs(it);
}, true);
const gzEnd = e => { gzPts.delete(e.pointerId); if(!gz) return; e.stopImmediatePropagation(); if(gzPts.size === 0) gz = null; else if(gz.kind === 'mask'){ gz.pinch = null; const p = [...gzPts.values()][0]; gz.p0 = p; gz.x0 = gz.it.mask.x; gz.y0 = gz.it.mask.y; } };
out.addEventListener('pointerup', gzEnd, true);
out.addEventListener('pointercancel', gzEnd, true);
out.addEventListener('wheel', e => {
  const mi = maskEditTarget(); if(!mi) return; e.preventDefault(); e.stopImmediatePropagation();
  const k = e.deltaY < 0 ? 1.06 : 1/1.06; mi.mask.w = clamp(mi.mask.w*k,1,300); mi.mask.h = clamp(mi.mask.h*k,1,300); syncMaskInputs(mi);
}, {capture:true, passive:false});
function syncMaskInputs(it){
  IB.querySelectorAll('input[data-p^="mask."]').forEach(el => { const v = getP(it, el.dataset.p); if(typeof v !== 'number') return; el.value = el.type === 'number' ? fmtV(v) : v; if(el.type === 'range') setFill(el); });
}

/* ---------------- INIT ---------------- */
HEADW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--head')) || 150;
renderTools(); updatePlayBtn();
makeBuiltinLuts(); setCanvas(); updatePInfo(); layout(); renderLeft(); renderTimeline(); renderInspector();
requestAnimationFrame(tick);
(async () => {
  try{ DB = await idbOpen(); if(navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(()=>{}); }catch(e){ DB = null; }
  showHome();
})();

/* =====================================================================
   RIGHT-CLICK MENUS (timeline items, media tiles)
   ===================================================================== */
const CTX = document.createElement('div'); CTX.id = 'ctx'; document.body.appendChild(CTX);
let ctxFns = [];
function showCtx(x, y, items){
  ctxFns = [];
  CTX.innerHTML = items.filter(Boolean).map(it => {
    if(it === '-') return '<div class="csep"></div>';
    const [label, fn, opt] = it; ctxFns.push(fn);
    return `<button data-ci="${ctxFns.length-1}" ${opt && opt.dis ? 'disabled' : ''}>${opt && opt.icon ? ic(opt.icon) : '<i class="ci0"></i>'}<span>${label}</span>${opt && opt.key ? `<kbd>${opt.key}</kbd>` : ''}</button>`;
  }).join('');
  CTX.style.display = 'block';
  const r = CTX.getBoundingClientRect();
  CTX.style.left = Math.min(x, innerWidth - r.width - 6) + 'px'; CTX.style.top = Math.min(y, innerHeight - r.height - 6) + 'px';
}
function hideCtx(){ CTX.style.display = 'none'; }
CTX.addEventListener('click', e => { const b = e.target.closest('[data-ci]'); if(!b || b.disabled) return; hideCtx(); const f = ctxFns[+b.dataset.ci]; if(f) f(); });
document.addEventListener('pointerdown', e => { if(!CTX.contains(e.target)) hideCtx(); }, true);
document.addEventListener('keydown', e => { if(e.key === 'Escape') hideCtx(); });
window.addEventListener('blur', hideCtx);
function extractOvAudio(o){
  const m = media(o.mediaId); if(!m) return; pushUndo();
  const a = newAudioItem(m, {kind:'extract', start:o.start, in:o.in, dur:o.dur, speed:o.speed, volume:o.volume||100, linkClip:o.id});
  o.prevVolume = o.volume || 100; o.extracted = a.id; o.volume = 0; S.audios.push(a); S.sel = a.id; afterEdit();
}
function ctxForItem(it){
  const k = kindOf(it), m = media(it.mediaId) || {}, hasA = m.type === 'video';
  const base = [['Split', split, {icon:'split', key:'S'}], ['Duplicate', dup, {icon:'copy', key:'Ctrl+D'}], ['Delete', del, {icon:'trash', key:'Del'}], '-'];
  const attrs = [['Copy attributes', () => copyAttrs(it), {icon:'copy'}], ['Paste attributes', () => pasteAttrs(it), {icon:'import', dis:!attrClip}]];
  const lay = [['Bring forward', () => ovAction('up'), {icon:'up'}], ['Send backward', () => ovAction('down'), {icon:'down'}]];
  if(k === 'clip' || k === 'clipimg'){
    const multi = selMulti.size >= 2;
    return [...base,
      hasA ? (it.extracted ? ['Restore audio (undo extract)', () => restoreAudio(it), {icon:'undo'}] : ['Extract audio', () => extractAudio(it), {icon:'wave'}]) : null,
      hasA ? [it.volume > 0 ? 'Mute' : 'Unmute', () => toggleMuteItem(it), {icon:it.volume > 0 ? 'volx' : 'vol'}] : null,
      hasA ? ['Freeze frame (3s)', freezeFrame, {icon:'pause'}] : null,
      [multi ? `Compound clip (${selMulti.size} clips)` : 'Compound clip… (Ctrl+click to select several)', () => compoundClips([...selMulti]), {icon:'layers', dis:!multi}],
      hasA ? ['Reverse audio', () => reverseItem(it), {icon:'undo'}] : null,
      hasA ? ['Vocal / BGM remover…', () => { S.rt.clip = 'audio'; S.rs.audio = 'basic'; S.closed.stem = false; renderInspector(); const x = IB.querySelector('[data-sep]'); if(x) x.scrollIntoView({block:'center'}); }, {icon:'mic'}] : null,
      hasA ? ['Remove silences…', () => { S.rt.clip = 'audio'; S.rs.audio = 'basic'; S.closed.sil = false; renderInspector(); const x = IB.querySelector('[data-sil]'); if(x) x.scrollIntoView({block:'center'}); }, {icon:'wave'}] : null,
      '-', ['Move to overlay track', () => clipToOverlay(it, derived[it.id].start), {icon:'layers'}],
      ['Mirror', () => { flipSel(); renderTimeline(); }, {icon:'flip'}], ['Rotate 90°', rotateSel, {icon:'rotate'}],
      ['Delete left of playhead', () => trimSide('left'), {icon:'delL', key:'Q'}], ['Delete right of playhead', () => trimSide('right'), {icon:'delR', key:'W'}],
      '-', ...attrs];
  }
  if(k === 'ovvideo' || k === 'ovimage') return [...base,
      k === 'ovvideo' ? (it.extracted ? ['Restore audio', () => restoreAudio(it), {icon:'undo'}] : ['Extract audio', () => extractOvAudio(it), {icon:'wave'}]) : null,
      k === 'ovvideo' ? [it.volume > 0 ? 'Mute' : 'Unmute', () => toggleMuteItem(it), {icon:it.volume > 0 ? 'volx' : 'vol'}] : null,
      ['Move to main track', () => overlayToClip(it, it.start), {icon:'film'}], ...lay, ['Mirror', () => { flipSel(); renderTimeline(); }, {icon:'flip'}], '-', ...attrs];
  if(k === 'audio'){
    const own = it.linkClip && (S.clips.find(c => c.id === it.linkClip) || S.overlays.find(o => o.id === it.linkClip));
    return [...base, own ? ['Return audio to video (Restore)', () => restoreAudio(own), {icon:'undo'}] : null,
      it.extracted ? ['Restore original audio', () => restoreAudio(it), {icon:'undo'}] : null,
      ['Vocal / BGM remover…', () => { S.rt.audio = 'audio'; S.rs.audio = 'basic'; S.closed.stem = false; renderInspector(); const x = IB.querySelector('[data-sep]'); if(x) x.scrollIntoView({block:'center'}); }, {icon:'mic'}],
      [it.volume > 0 ? 'Mute' : 'Unmute', () => toggleMuteItem(it), {icon:it.volume > 0 ? 'volx' : 'vol'}], ['Reverse audio', () => reverseItem(it), {icon:'undo'}],
      ['Detect beats / Beat sync', () => { S.rt.audio = 'audio'; S.rs.audio = 'basic'; renderInspector(); doBeat('detect', it); }, {icon:'music2'}],
      ['Audio effects…', () => { S.rt.audio = 'audio'; S.rs.audio = 'fx'; renderInspector(); }, {icon:'wave'}], '-', ...attrs];
  }
  return [...base, ...lay];
}
TL.addEventListener('contextmenu', e => {
  e.preventDefault();
  const itEl = e.target.closest('.it'), cl = e.target.closest('.clip');
  const it = itEl ? findFree(itEl.dataset.oid) : cl ? S.clips.find(c => c.id === cl.dataset.id) : null;
  if(!it){ seek(tAt(e.clientX)); showCtx(e.clientX, e.clientY, [['Undo', undo, {icon:'undo', key:'Ctrl+Z', dis:!undoS.length}], ['Redo', redo, {icon:'redo', key:'Ctrl+Y', dis:!redoS.length}], '-', ['Add text here', () => addTextPreset('default'), {icon:'text'}], ['Freeze frame here', freezeFrame, {icon:'pause'}]]); return; }
  if(it.type !== undefined || !selMulti.has(it.id)){ if(!selMulti.has(it.id)) selMulti.clear(); }
  if(S.sel !== it.id){ S.sel = it.id; renderTimeline(); renderInspector(); }
  if(!it.type || it.type === 'audio' || S.time < itemStart(it) || S.time > itemStart(it) + itemDur(it)){ const t = tAt(e.clientX); if(t >= itemStart(it) && t <= itemStart(it) + itemDur(it)) seek(t); }
  showCtx(e.clientX, e.clientY, ctxForItem(it));
});
LC.addEventListener('contextmenu', e => {
  const t = e.target.closest('.mtile,[data-delm]'); if(!t) return; e.preventDefault();
  const m = media(t.dataset.mid || t.dataset.delm); if(!m) return;
  showCtx(e.clientX, e.clientY, [
    !m.missing ? ['Add to timeline', () => { m.type === 'audio' ? addAudioAt(m, {start:S.time}) : insertMediaClip(m, S.mainEnd + 1); renderLeft(); }, {icon:'plus'}] : null,
    !m.missing && m.type !== 'audio' ? ['Add as overlay (PiP)', () => addPip(m), {icon:'layers'}] : null,
    !m.missing && m.type !== 'audio' ? ['Add to audio track', () => addAudioAt(m, {start:S.time, kind:'extract'}), {icon:'wave', dis:m.type === 'image'}] : null,
    '-', ['Delete from project', () => deleteMedia(m.id), {icon:'trash'}]]);
});
$('#out').addEventListener('contextmenu', e => { const it = selItem(); if(!it) return; e.preventDefault(); showCtx(e.clientX, e.clientY, ctxForItem(it)); });

/* =====================================================================
   RESIZABLE PANELS (drag the gaps between left / player / right / timeline)
   ===================================================================== */
const SPL = ['spL','spR','spB'].map(id => { const d = document.createElement('div'); d.id = id; d.className = 'split ' + (id === 'spB' ? 'h' : 'v'); document.body.appendChild(d); return d; });
function applyLayout(L){
  const a = $('#app');
  if(L.lw) a.style.setProperty('--lw', L.lw + 'px'); if(L.rw) a.style.setProperty('--rw', L.rw + 'px'); if(L.th) a.style.setProperty('--th', L.th + 'px');
}
function placeSplitters(){
  const l = $('#left').getBoundingClientRect(), p = $('#player').getBoundingClientRect(), r = $('#right').getBoundingClientRect(), b = $('#bottom').getBoundingClientRect();
  const hidden = $('#home').style.display === 'flex';
  SPL.forEach(s => s.style.visibility = hidden ? 'hidden' : '');
  Object.assign(SPL[0].style, {left:(l.right)+'px', top:l.top+'px', height:l.height+'px'});
  Object.assign(SPL[1].style, {left:(p.right)+'px', top:p.top+'px', height:p.height+'px'});
  Object.assign(SPL[2].style, {left:b.left+'px', top:(b.top-6)+'px', width:b.width+'px'});
}
let LAY = {}; try{ LAY = JSON.parse(localStorage.getItem('cc_layout') || '{}'); }catch(e){}
applyLayout(LAY);
SPL.forEach(sp => sp.addEventListener('pointerdown', e => {
  e.preventDefault(); sp.setPointerCapture(e.pointerId); sp.classList.add('on'); document.body.classList.add('resizing'); if(sp.id === 'spB') document.body.classList.add('hz');
  const app = $('#app').getBoundingClientRect(), top = $('#player').getBoundingClientRect().top;
  const mv = ev2 => {
    if(sp.id === 'spL') LAY.lw = clamp(ev2.clientX - app.left - 5, 240, app.width*.5);
    else if(sp.id === 'spR') LAY.rw = clamp(app.right - ev2.clientX - 5, 240, app.width*.45);
    else LAY.th = clamp(ev2.clientY - top - 3, 180, app.height - 200);
    applyLayout(LAY); placeSplitters();
  };
  const up = () => { sp.classList.remove('on'); document.body.classList.remove('resizing','hz'); sp.removeEventListener('pointermove', mv); sp.removeEventListener('pointerup', up);
    try{ localStorage.setItem('cc_layout', JSON.stringify(LAY)); }catch(e){} fitCanvas(); renderTimeline(); };
  sp.addEventListener('pointermove', mv); sp.addEventListener('pointerup', up);
}));
SPL.forEach(sp => sp.addEventListener('dblclick', () => { LAY = {}; const a = $('#app'); ['--lw','--rw','--th'].forEach(v => a.style.removeProperty(v)); try{ localStorage.removeItem('cc_layout'); }catch(e){} setTimeout(placeSplitters, 30); }));
new ResizeObserver(placeSplitters).observe($('#app'));
['#left','#right','#bottom','#player'].forEach(q => new ResizeObserver(placeSplitters).observe($(q)));
setInterval(() => { const h = $('#home').style.display === 'flex'; if(SPL[0].style.visibility !== (h ? 'hidden' : '')) placeSplitters(); }, 500);
placeSplitters();

/* =====================================================================
   v8 PANELS: voice library, text effects, text-to-speech, animation previews
   ===================================================================== */
const VCOL = id => { let h = 0; for(const c of id) h = (h*31 + c.charCodeAt(0)) % 360; return h; };
function voiceBody(it){
  const a = it.audio, cat = S.vcat || 'filters', q = (S.vq||'').toLowerCase().trim();
  let list = VOICE_LIB.filter(v => q ? v[1].toLowerCase().includes(q) : v[2] === cat);
  const cur = a.vpreset || (a.voice === 'none' && !a.echo && !a.reverb && !a.pitch ? 'orig' : '');
  return `<div style="height:8px"></div><div class="seg">${[['filters','Voice filters'],['chars','Voice characters']].map(([k,n])=>`<button data-vcat="${k}" class="${cat===k&&!q?'on':''}">${n}</button>`).join('')}</div>
    <div class="srch">${ic('target')}<input type="text" id="vQ" placeholder="Search voices" value="${esc(S.vq||'')}"></div>
    <div class="vgrid" id="vGrid">${list.map(([id,n])=>`<button class="vt2 ${cur===id?'on':''}" data-vp="${id}"><i style="--h:${VCOL(id)}">${id==='orig'?'✕':'♪'}</i><span>${n}</span></button>`).join('')}</div>
    ${sec('vfx','Fine tune', sl(it,'Pitch','audio.pitch',-12,12,1)+sl(it,'Echo','audio.echo',0,100)+sl(it,'Reverb','audio.reverb',0,100)+
      `<div class="crow"><span>Room</span><select data-p="audio.reverbSize">${REVERBS.map(([k,n])=>`<option value="${k}" ${a.reverbSize===k?'selected':''}>${n}</option>`).join('')}</select></div>`+
      sl(it,'Chorus','audio.chorus',0,100)+sl(it,'Vibrato','audio.vibrato',0,100)+sl(it,'Tremolo','audio.trem',0,100)+sl(it,'Distortion','audio.dist',0,100)+sl(it,'8D pan','audio.pan8d',0,100))}
    <div class="note">🎧 Click a voice to hear a 3-second preview. ${VOICE_LIB.length} voices — all in your browser, no download.</div>
    ${!it.type?'<div class="btns"><button data-all="audio">Apply to all clips</button></div>':''}`;
}
function tfxGrid(cur){
  const cat = S.tfxCat || 'All', list = TFX.filter(t => cat === 'All' || t[2] === cat);
  return `<div class="chiprow scrollx">${TFX_CATS.map(c=>`<button data-tfxcat="${c}" class="${c===cat?'on':''}">${c}</button>`).join('')}</div>
    <div class="tiles tfxtiles"><button class="tile ${!cur?'on':''}" data-tfx="none"><div class="tth">${ic('ban')}</div><span>None</span></button>${list.map(([id,n])=>`<button class="tile ${cur===id?'on':''}" data-tfx="${id}"><div class="tth tfxth"><canvas data-tfxc="${id}" width="132" height="72"></canvas></div><span>${n}</span></button>`).join('')}</div>`;
}
function ttsBody(it){
  const L = S.ttsLang || 'kan', st = S.ttsStyle || 'natural', sp = S.ttsSpeed || 1;
  return `<div style="height:8px"></div>${it ? `<div class="note">🗣 Converts this text to speech and adds it as an audio track: <b>${esc((it.text||'').slice(0,60))}</b></div>` : `<div class="ltitle" style="margin-top:0">🗣 Text to speech</div><textarea id="ttsText" rows="4" placeholder="Type here… (English / ಕನ್ನಡ / हिन्दी)">${esc(S.ttsText||'')}</textarea>`}
    <div class="ltitle">Language</div><div class="chiprow">${TTS_LANGS.map(([k,n])=>`<button data-ttsl="${k}" class="${L===k?'on':''}">${n}</button>`).join('')}</div>
    <div class="ltitle">Voice style</div><div class="vgrid">${TTS_STYLES.map(([k,n])=>`<button class="vt2 ${st===k?'on':''}" data-ttss="${k}"><i style="--h:${VCOL(k)}">🗣</i><span>${n}</span></button>`).join('')}</div>
    <div class="prow"><div class="plab">Speed</div><input type="range" id="ttsSpeed" min="0.7" max="1.5" step="0.05" value="${sp}"><input class="num" type="number" id="ttsSpeedN" min="0.7" max="1.5" step="0.05" value="${sp}"></div>
    <div id="ttsStat" style="color:var(--mute);min-height:18px;margin-top:6px"></div><div class="prog"><div id="ttsBar"></div></div>
    <button class="primary" data-tts="gen" style="width:100%;padding:9px">🗣 Generate speech</button>
    <div class="lnote">AI voice is generated in your browser. The voice model downloads once (~38 MB), then stays cached. ⚠ These voice models (Meta MMS) have a <b>non-commercial license</b>.</div>`;
}
const imgCache = {};
function imgOf(url){ if(!imgCache[url]){ const i = new Image(); i.src = url; imgCache[url] = i; } return imgCache[url]; }
function animProbe(it, sub, name, p){
  const f = {anim:{in:'none',out:'none',loop:'none',inDur:1,outDur:1}, dur:10};
  if(sub === 'in') f.anim.in = name; else if(sub === 'out') f.anim.out = name; else f.anim.loop = name;
  const lt = sub === 'in' ? p : sub === 'out' ? 10 - (1-p) : p*3;
  if(!it.type) return {R:animState(f, lt, 10), W:cv.width, H:cv.height};
  const u = Math.min(out.width, out.height); return {R:ovAnim(f, lt, u), W:u, H:u};
}
function drawAnimTile(c, it, sub, name, p){
  const x = c.getContext('2d'), w = c.width, h = c.height, {R, W, H} = animProbe(it, sub, name, p);
  x.setTransform(1,0,0,1,0,0); x.clearRect(0,0,w,h); x.fillStyle = '#1c1c20'; x.fillRect(0,0,w,h);
  const isTxt = it.type === 'text' || it.type === 'sticker', img = isTxt ? null : SCENES.list[[...name].reduce((a,ch)=>a+ch.charCodeAt(0),0) % SCENES.list.length];
  const draw = (ox, oy) => { if(isTxt){ x.fillStyle = '#fff'; x.font = '800 26px Inter,"Noto Sans Kannada",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(it.type === 'sticker' && !String(it.text).startsWith('svg:') ? it.text : 'Aa', ox, oy); }
    else if(img && img.complete && img.naturalWidth){ const k = Math.max(w*.8/img.naturalWidth, h*.8/img.naturalHeight), iw = img.naturalWidth*k, ih = img.naturalHeight*k; x.drawImage(img, ox - iw/2, oy - ih/2, iw, ih); } };
  x.save();
  if(R.mT){ const m = R.mT, q = clamp(R.mP,0,1); x.beginPath();
    if(m === 13) x.rect(0,0,w*q,h); else if(m === 8 || m === 9){ m === 8 ? x.rect(w/2*(1-q),0,w*q,h) : x.rect(0,h/2*(1-q),w,h*q); }
    else if(m === 5 || m === 6){ for(let i=0;i<8;i++) m === 5 ? x.rect(0,i*h/8,w,h/8*q) : x.rect(i*w/8,0,w/8*q,h); }
    else if(m === 2){ x.rect(0,0,w,h); x.arc(w/2,h/2,Math.max(.1,(1-q)*w*.7),0,7,true); }
    else if(m === 1 || m === 3 || m === 10 || m === 11 || m === 4) x.arc(w/2,h/2,Math.max(.1,q*w*.7),0,7);
    else x.rect(0,0,w,h);
    x.clip(); if(m === 7 || m === 12) x.globalAlpha = q; }
  const sc = w/W;
  x.translate(w/2 + R.dx*sc, h/2 + R.dy*(h/H)); x.rotate(R.r||0); x.scale((R.s||1)*(R.sx||1), (R.s||1)*(R.sy||1));
  x.globalAlpha *= clamp(R.a, 0, 1);
  const fx = R.fx || [], fa = fx[1] || 0, bl = (R.blur ? R.blur*w/720 : 0) + (fx[0] === 'blur' ? fa*6 : 0);
  let f = ''; if(bl > .3) f += `blur(${bl}px) `; if(fx[0] === 'bright' || fx[0] === 'glow' || fx[0] === 'lightleak') f += `brightness(${1+fa*1.6}) `; if(fx[0] === 'vhs' || fx[0] === 'crt') f += `contrast(1.3) saturate(.7) `;
  x.filter = f || 'none';
  if(fx[0] === 'pixelate' && fa > .05) x.filter = f + `blur(${fa*3}px) contrast(1.25)`;
  draw(0, 0);
  if(['rgbsplit','glitch','chroma'].includes(fx[0]) && fa > .05){ x.globalCompositeOperation = 'screen'; x.globalAlpha *= .6; x.filter = 'hue-rotate(160deg) saturate(3)'; draw(fa*6, 0); }
  x.restore();
}
let aTile = null;
/* ---- live WebGL previews for effect / transition tiles ---- */
const SAMPLE_IMG = (() => { const mk = (a,b,sun) => { const c = document.createElement('canvas'); c.width = 160; c.height = 120; const x = c.getContext('2d'), g = x.createLinearGradient(0,0,0,120); g.addColorStop(0,a); g.addColorStop(.6,b); g.addColorStop(.61,'#2f6b35'); g.addColorStop(1,'#1d3d22'); x.fillStyle = g; x.fillRect(0,0,160,120);
  x.fillStyle = sun; x.beginPath(); x.arc(118,34,15,0,7); x.fill(); x.fillStyle = '#d9a07a'; x.beginPath(); x.ellipse(62,70,16,20,0,0,7); x.fill(); x.fillStyle = '#3a2618'; x.beginPath(); x.ellipse(62,55,17,9,0,Math.PI,0); x.fill(); x.fillStyle = '#c0303a'; x.fillRect(44,88,36,32); const i = new Image(); i.src = c.toDataURL(); return i; };
  return [mk('#5d9be0','#f2c79a','#ffe9a8'), mk('#3b1d5e','#ff7a59','#ffd36e')]; })();
// ---- v14: font picker (178 fonts · English + 10 Indian scripts + Urdu) ----
function fontOptions(cur, auto){ return (auto ? `<option value=>✨ Auto (best for title)</option>` : '') + FONT_GROUPS.map(g => `<optgroup label="${g}">${FONT_LIB.filter(x => x[1] === g).map(([f]) => `<option value="${esc(f)}" ${cur===f?'selected':''}>${esc(f)}</option>`).join('')}</optgroup>`).join(''); }
function fontPicker(cur){
  const g = S.fontGrp || (FONT_LIB.find(x => x[0] === cur) || [,'Sans'])[1], q = (S.fontQ || '').toLowerCase();
  const list = FONT_LIB.filter(x => q ? x[0].toLowerCase().includes(q) : (g === 'All' || x[1] === g));
  return `<input class="fsearch" id="fontQ" placeholder="Search ${FONT_LIB.length} fonts…" value="${esc(S.fontQ||'')}">
    <div class="chiprow fgrp">${['All', ...FONT_GROUPS].map(k => `<button data-fgrp="${k}" class="${!q && g===k?'on':''}">${k}</button>`).join('')}</div>
    <div class="fonts">${list.map(([f,gr,smp]) => `<button class="${cur===f?'on':''}" data-set="font" data-val="${esc(f)}" data-lazyfont="${esc(f)}" style="font-family:'${f}',Inter,sans-serif" title="${esc(f)}"><b>${smp || 'Aa'}</b><span>${esc(f)}</span></button>`).join('')}</div>`;
}
const fontIO = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ fontLink(e.target.dataset.lazyfont); fontIO.unobserve(e.target); } }), {rootMargin:'120px'}) : null;
function lazyFonts(root){ root.querySelectorAll('[data-lazyfont]').forEach(b => fontIO ? fontIO.observe(b) : fontLink(b.dataset.lazyfont)); }
new MutationObserver(() => lazyFonts(IB)).observe(IB, {childList:true});
IB.addEventListener('click', e => { const b = e.target.closest('[data-fgrp]'); if(!b) return; S.fontGrp = b.dataset.fgrp; S.fontQ = ''; renderInspector(); });
IB.addEventListener('input', e => { if(e.target.id !== 'fontQ') return; S.fontQ = e.target.value; const it = selItem(); const box = e.target.closest('.sbody') || e.target.parentNode; const html = fontPicker(it && it.font); const tmp = document.createElement('div'); tmp.innerHTML = html; box.querySelector('.fonts').replaceWith(tmp.querySelector('.fonts')); box.querySelector('.fgrp').replaceWith(tmp.querySelector('.fgrp')); lazyFonts(box); });
function refreshPreviews(){
  const a = document.activeElement; if(a && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) return;
  if(['effects','transitions','filters','stickers','text'].includes(S.ltab)) renderLeft();
  if(IB.querySelector('canvas.apv, .pv, canvas.gpv')) renderInspector();
}
function tileImgs(c){
  const i = +(c.dataset.i || 0), L = SCENES.list, n = L.length;
  if(c.dataset.pfx){ const cat = S.ltab === 'effects' ? (S.lsub.effects || 'Trending') : 'All', off = [...cat].reduce((a,ch) => a + ch.charCodeAt(0), 0); return {fx: L[(i + off) % n]}; }
  return {A: L[i % n], B: L[(i + 3) % n]};
}
function drawGpv(c, t){
  const im = tileImgs(c);
  if(c.dataset.pfx){ if(im.fx.complete) fxPreview(c, im.fx, c.dataset.pfx, t == null ? 1.3 : 1 + t); }
  else if(im.A.complete && im.B.complete) transPreview(c, im.A, im.B, c.dataset.ptr, t == null ? .5 : Math.min(1, Math.max(0, (t % 1.8 - .3)/1.1)));
}
function paintGL(root){
  const cs = root.querySelectorAll('canvas.gpv'); if(!cs.length) return;
  if(SCENES.list.some(i => !i.complete)){ setTimeout(() => paintGL(root), 150); return; }
  cs.forEach(c => { try{ drawGpv(c); }catch(e){} });
}
let gTile = null;
function gpvHover(root){
  root.addEventListener('mouseover', e => {
    const c = e.target.closest('.tile') && e.target.closest('.tile').querySelector('canvas.gpv'); if(!c || (gTile && gTile.c === c)) return;
    if(gTile) cancelAnimationFrame(gTile.raf);
    const t0 = performance.now();
    const loop = () => { try{ drawGpv(c, (performance.now() - t0)/1000); }catch(err){} gTile.raf = requestAnimationFrame(loop); };
    gTile = {c, raf:requestAnimationFrame(loop)};
  });
  root.addEventListener('mouseout', e => { const tl = e.target.closest('.tile'); if(!tl || tl.contains(e.relatedTarget) || !gTile) return; cancelAnimationFrame(gTile.raf); const c = gTile.c; gTile = null; try{ drawGpv(c); }catch(err){} });
}
gpvHover(LC); gpvHover(IB);
function paintV8(root, it){
  paintGL(root);
  if(it) root.querySelectorAll('canvas.apv').forEach(c => { const sub = c.dataset.sub; drawAnimTile(c, it, sub, c.dataset.an, sub === 'combo' ? .3 : sub === 'in' ? .4 : .5); });
  paintV9(root);
  root.querySelectorAll('canvas[data-tfxc]').forEach(c => { const t = TFX_MAP[c.dataset.tfxc]; if(!t) return; const x = c.getContext('2d'); x.clearRect(0,0,c.width,c.height);
    x.font = '900 40px Anton,"Baloo Tamma 2",Inter,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; drawStyledText(x, t.id === 'kannadaGold' ? 'ಕನ್ನಡ' : 'ART', c.width/2, c.height/2+2, 40, t.st); });
  // images may still be loading the first time
  if(it && root.querySelector('canvas.apv') && SCENES.list.some(i => !i.complete)) setTimeout(() => paintV8(root, it), 200);
}
function hoverAnim(root, getIt){
  root.addEventListener('mouseover', e => {
    const c = e.target.closest('.tile') && e.target.closest('.tile').querySelector('canvas.apv'); if(!c || (aTile && aTile.c === c)) return;
    if(aTile) cancelAnimationFrame(aTile.raf);
    const it = getIt(); if(!it) return; const t0 = performance.now(), sub = c.dataset.sub;
    const loop = () => { const t = (performance.now() - t0)/1000, p = sub === 'combo' ? t/3 % 1 : Math.min(1, (t % 1.6)/1.0); drawAnimTile(c, it, sub, c.dataset.an, p); aTile.raf = requestAnimationFrame(loop); };
    aTile = {c, raf:requestAnimationFrame(loop)};
  });
  root.addEventListener('mouseout', e => { const tl = e.target.closest('.tile'); if(!tl || tl.contains(e.relatedTarget) || !aTile) return; cancelAnimationFrame(aTile.raf); const c = aTile.c; aTile = null; const it = getIt(); if(it) drawAnimTile(c, it, c.dataset.sub, c.dataset.an, c.dataset.sub === 'combo' ? .3 : c.dataset.sub === 'in' ? .4 : .5); });
}
hoverAnim(IB, () => selItem());
function v8Input(e){
  if(v9Input(e)) return true;
  const el = e.target, it = selItem();
  if(el.id === 'animQ'){ S.animQ = el.value; const g = $('#animGrid'); if(g && it){ const sub = S.rs.anim || 'in'; g.innerHTML = animGrid(it, sub); paintV8(g, it); } IB.querySelectorAll('[data-anicat]').forEach(b => b.classList.toggle('on', !S.animQ && b.dataset.anicat === (S.animCat||'Trending'))); return true; }
  if(el.id === 'vQ'){ S.vq = el.value; const pos = el.selectionStart; renderInspector(); const n = $('#vQ'); if(n){ n.focus(); n.setSelectionRange(pos,pos); } return true; }
  if(el.id === 'ttsText'){ S.ttsText = el.value; return true; }
  if(el.id === 'ttsSpeed' || el.id === 'ttsSpeedN'){ S.ttsSpeed = clamp(+el.value || 1, .7, 1.5); const o = el.id === 'ttsSpeed' ? $('#ttsSpeedN') : $('#ttsSpeed'); if(o) o.value = S.ttsSpeed; if(el.type === 'range') setFill(el); return true; }
  return false;
}
async function runTTS(it, btn){
  const text = it ? it.text : (S.ttsText || ($('#ttsText')||{}).value || ''); if(!text.trim()) return alert('Type some text first');
  const st = $('#ttsStat'), bar = $('#ttsBar'); btn.disabled = true;
  try{
    await ttsToTimeline(text, S.ttsLang || 'kan', S.ttsStyle || 'natural', it ? it.start : S.time, S.ttsSpeed || 1, (m,p) => { if(st) st.textContent = m; if(bar) bar.style.width = (p*100) + '%'; });
    const st2 = $('#ttsStat'); if(st2) st2.textContent = '✅ Added to audio track';
  }catch(err){ const st2 = $('#ttsStat'); if(st2) st2.textContent = '❌ ' + err.message; else alert(err.message); }
  btn.disabled = false;
}
function v8Click(t, it){
  const d = t.dataset;
  if(v9Click(t, it)) return true;
  if(d.gomagic){ const mg = ensureMagic(it); pushUndo(); mg.on = true; setP(it, 'anim.in', 'none'); fitMagicDur(it); afterEdit(); renderInspector();
    if(!mg.layers.length && !MG_BUSY) setTimeout(() => { const b = IB.querySelector('[data-mg=auto]'); b && b.click(); }, 50);
    else { seek(it.type ? it.start : derived[it.id].start); play(); }
    return true; }
  if(d.anicat){ S.animCat = d.anicat; S.animQ = ''; renderInspector(); return true; }
  if(d.vcat){ S.vcat = d.vcat; S.vq = ''; renderInspector(); return true; }
  if(d.tfxcat){ S.tfxCat = d.tfxcat; t.closest('#lcontent') ? renderLeft() : renderInspector(); return true; }
  if(d.ttsl){ S.ttsLang = d.ttsl; t.closest('#lcontent') ? renderLeft() : renderInspector(); return true; }
  if(d.ttss){ S.ttsStyle = d.ttss; t.closest('#lcontent') ? renderLeft() : renderInspector(); return true; }
  if(d.tts){ runTTS(t.closest('#lcontent') ? null : (selOv() && selOv().type === 'text' ? selOv() : null), t); return true; }
  if(d.tfx){
    const o = selOv();
    if(o && o.type === 'text'){ pushUndo(); o.tfx = d.tfx === 'none' ? '' : d.tfx; if(o.tfx && !o.size0){ o.bgOn = false; } renderInspector(); renderLeft(); }
    else if(d.tfx !== 'none') addOverlay(newOverlay('text', {text:'Your text', size:80, font:'Anton', tfx:d.tfx, shadow:0}), 'text');
    return true;
  }
  if(d.vp){
    const x = it && it.audio ? it : null; if(!x) return true;
    pushUndo(); applyVoicePreset(x, d.vp); x.type === 'audio' ? rebuildAudChain(x) : rebuildChain(x); renderInspector(); renderTimeline();
    const st = itemStart(x), du = itemDur(x); previewPlay(S.time >= st && S.time < st + du - .5 ? S.time : st, Math.min(3, du));
    return true;
  }
  return false;
}

/* =====================================================================
   v9 PANELS: templates, captions editor, bubbles, beats, silence, cover
   ===================================================================== */
function templatesGrid(cat){
  const list = TPL.filter(t => cat === 'All' || t.cat === cat);
  return `<div class="tiles tplt">${list.map(t=>`<button class="tile" data-tpl="${t.id}"><div class="tth tplth r${t.ratio.replace(':','x')}"><canvas data-tplc="${t.id}" width="${t.ratio==='16:9'?192:108}" height="${t.ratio==='16:9'?108:192}"></canvas></div><span>${t.name}</span><small>${t.ratio} · ${t.n} media</small></button>`).join('')}</div>
    <div class="lnote">✨ Pick a template → pick your photos / videos → video ready. Everything stays editable. Add music and use <b>Beat sync</b> for even better results.</div>`;
}
function paintTplCanvas(c, t){
  const x = c.getContext('2d'), W = c.width, H = c.height, g = x.createLinearGradient(0,0,W,H);
  g.addColorStop(0, t.col[0]); g.addColorStop(1, t.col[1]); x.fillStyle = g; x.fillRect(0,0,W,H);
  x.globalAlpha = .18; for(let i=0;i<6;i++){ x.fillStyle = '#fff'; x.fillRect((i%3)*W/3+4, Math.floor(i/3)*H/2+4, W/3-8, H/2-8); } x.globalAlpha = 1;
  const tt = t.texts.find(z => z.key === 'title') || t.texts[0], px = Math.min(W, H)*.2*(tt.size/80);
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `900 ${px}px "${tt.font||'Inter'}","Noto Sans Kannada",sans-serif`;
  const st = tt.tfx && TFX_MAP[tt.tfx] ? TFX_MAP[tt.tfx].st : {fill:tt.color||'#fff', shadow:[0,2,6,'#000a']};
  if(tt.bubble) drawBubble(x, tt.bubble, x.measureText(tt.text).width + px*.6, px*1.3, px, tt.bubColor||'#fff', tt.bubStroke||'#111');
  let txt = tt.text; while(x.measureText(txt).width > W*.92 && px > 6){ x.font = x.font.replace(/\d+(\.\d+)?px/, m => (parseFloat(m)*.9)+'px'); }
  drawStyledText(x, txt, W/2, H*.5, px, st);
}
function paintV9(root){
  root.querySelectorAll('canvas[data-tplc]').forEach(c => { const t = TPL.find(z => z.id === c.dataset.tplc); if(t) paintTplCanvas(c, t); });
  root.querySelectorAll('canvas[data-ttc]').forEach(c => { const t = TEXT_TPL.find(z => z.id === c.dataset.ttc); if(!t) return; const x = c.getContext('2d'), W = c.width, H = c.height; x.fillStyle = '#2a2a2f'; x.fillRect(0,0,W,H);
    t.items.forEach((it, i) => { const px = Math.min(30, it.size*.3), y = H*(t.items.length > 1 ? (i ? .7 : .38) : .5); x.save(); x.translate(W/2, y); x.font = `900 ${px}px "${it.font||'Inter'}","Noto Sans Kannada",sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
      const tw = Math.min(W*.9, x.measureText(it.text).width); if(it.bubble) drawBubble(x, it.bubble, tw + px*.5, px*1.25, px, it.bubColor||'#fff', it.bubStroke||'#111');
      if(it.tfx && TFX_MAP[it.tfx]) drawStyledText(x, it.text, 0, 0, px, TFX_MAP[it.tfx].st); else { x.fillStyle = it.color || '#fff'; x.fillText(it.text, 0, 0, W*.9); } x.restore(); }); });
  root.querySelectorAll('canvas[data-bubc]').forEach(c => { const x = c.getContext('2d'), W = c.width, H = c.height; x.clearRect(0,0,W,H); x.save(); x.translate(W/2, H/2); drawBubble(x, c.dataset.bubc, W*.55, H*.38, 22, '#ffffff', '#111111'); x.fillStyle = '#111'; x.font = '700 15px Inter'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Aa', 0, 0); x.restore(); });
}
function bubbleBody(it){
  return `<div style="height:8px"></div><div class="tiles bubt"><button class="tile ${!it.bubble?'on':''}" data-bub="none"><div class="tth">${ic('ban')}</div><span>None</span></button>${BUBBLES.map(([k,n])=>`<button class="tile ${it.bubble===k?'on':''}" data-bub="${k}"><div class="tth tfxth"><canvas data-bubc="${k}" width="120" height="72"></canvas></div><span>${n}</span></button>`).join('')}</div><div style="height:10px"></div>
    ${it.bubble ? colorRow(it,'Bubble color','bubColor',true) + colorRow(it,'Border','bubStroke') : ''}
    <div class="note">💬 A bubble adds a shape behind the text. Change text colour in the Basic tab.</div>`;
}
function captionsEditor(){
  const caps = S.overlays.filter(o => o.type === 'text' && o.caption).sort((a,b) => a.start - b.start);
  if(!caps.length) return '<div class="lnote">No captions yet. Use <b>Auto captions</b> or import an SRT.</div>';
  return `<div class="capfind"><input type="text" id="capFind" placeholder="Find" value="${esc(S.capFind||'')}"><input type="text" id="capRepl" placeholder="Replace" value="${esc(S.capRepl||'')}"><button data-caprepl="1">Replace all</button></div>
    <div class="caplist">${caps.map((o,i)=>`<div class="caprow ${S.sel===o.id?'on':''}" data-cid="${o.id}"><span class="ct" data-capgo="${o.id}">${fmtTC(o.start)}</span><textarea rows="1" data-capt="${o.id}" data-ci2="${i}">${esc(o.text)}</textarea><button class="ib sm" data-capmerge="${o.id}" title="Merge with next">⤓</button><button class="ib sm" data-capdel="${o.id}" title="Delete">✕</button></div>`).join('')}</div>
    <div class="lnote">✏️ Click a caption → the video jumps there. <b>Enter</b> = next caption, <b>Shift+Enter</b> = new line. ⤓ = merge with next caption.</div>`;
}
LC.addEventListener('focusin', e => { const ta = e.target.closest('[data-capt]'); if(!ta) return; const o = S.overlays.find(x => x.id === ta.dataset.capt); if(!o) return; pause(); S.sel = o.id; seek(o.start + .02); pushUndo(); LC.querySelectorAll('.caprow').forEach(r => r.classList.toggle('on', r.dataset.cid === o.id)); renderTimeline(); });
LC.addEventListener('keydown', e => {
  const ta = e.target.closest('[data-capt]'); if(!ta || e.key !== 'Enter' || e.shiftKey) return; e.preventDefault();
  const all = [...LC.querySelectorAll('[data-capt]')], i = all.indexOf(ta); if(all[i+1]){ all[i+1].focus(); all[i+1].select(); }
});
function doBeat(a, it){
  if(a === 'detect'){ const sec_ = IB.querySelector('[data-beat="detect"]'); if(sec_){ sec_.disabled = true; sec_.textContent = '⏳ Analyzing…'; }
    detectBeats(it).then(() => { renderTimeline(); renderInspector(); }).catch(err => { alert('Beat detection failed: ' + err.message); renderInspector(); }); return; }
  if(a === 'cut'){ const n = cutToBeats(it, S.beatEvery || 2); if(n) renderInspector(); }
}
async function doSilence(a, c){
  const st = $('#silStat'); if(st) st.textContent = '⏳ Reading audio…';
  try{
    const r = await analyzeSilence(c, {thr:S.silAuto === false ? (S.silThr ?? -40) : null, minSil:S.silMin ?? .6, pad:.12});
    if(S.silAuto !== false){ S.silThr = r.thr; const a1 = $('#silThr'), a2 = $('#silThrN'); if(a1){ a1.value = r.thr; setFill(a1); } if(a2) a2.value = r.thr; }
    if(a === 'analyze'){ const st2 = $('#silStat'); if(st2) st2.innerHTML = `${r.cuts} silent parts · <b>${r.removed.toFixed(1)} s</b> will be removed (threshold ${r.thr} dB)`; return; }
    if(!r.cuts && r.keep.length === 1 && Math.abs(r.keep[0][0]-c.in) < .05 && Math.abs(r.keep[0][1]-c.out) < .05){ const st2 = $('#silStat'); if(st2) st2.textContent = 'No silence found'; return; }
    applySilenceCut(c, r.keep);
  }catch(err){ const st2 = $('#silStat'); if(st2) st2.textContent = '❌ ' + err.message; }
}
function v9Input(e){
  const el = e.target, id = el.id;
  if(el.dataset.capt){ const o = S.overlays.find(x => x.id === el.dataset.capt); if(o){ o.text = el.value; renderTimeline(); } return true; }
  if(id === 'capFind' || id === 'capRepl'){ S[id === 'capFind' ? 'capFind' : 'capRepl'] = el.value; return true; }
  if(id === 'beatEvery'){ S.beatEvery = +el.value; return true; }
  if(id === 'silThr' || id === 'silThrN'){ S.silThr = +el.value; S.silAuto = false; const cb = $('#silAuto'); if(cb) cb.checked = false; const o = id === 'silThr' ? $('#silThrN') : $('#silThr'); if(o) o.value = el.value; if(el.type === 'range') setFill(el); return true; }
  if(id === 'silMin' || id === 'silMinN'){ S.silMin = +el.value; const o = id === 'silMin' ? $('#silMinN') : $('#silMin'); if(o) o.value = el.value; if(el.type === 'range') setFill(el); return true; }
  if(id === 'silAuto'){ S.silAuto = el.checked; return true; }
  return false;
}
function v9Click(t, it){
  const d = t.dataset;
  if(d.tpl){ openTemplateDialog(d.tpl); return true; }
  if(d.ttpl){ addTextTemplate(d.ttpl); return true; }
  if(d.bub){ const o = selOv(); if(o && o.type === 'text'){ pushUndo(); o.bubble = d.bub === 'none' ? '' : d.bub; if(o.bubble) o.bgOn = false; renderInspector(); } return true; }
  if(d.ease){ const x = selItem(), k = x && atKf(x); if(k){ pushUndo(); k.ease = d.ease; renderInspector(); seek(S.time); } return true; }
  if(d.addadj){ addOverlay(newOverlay('adjust', {start:S.time, dur:Math.max(3, Math.min(10, S.total - S.time || 5)), opacity:100}), 'adjust'); S.ltab = 'adjust'; S.lsub.adjust = 'adjust'; renderLeft(); return true; }
  if(d.addfl){ const o = newOverlay('adjust', {start:0, dur:Math.max(1, S.mainEnd || S.total || 5), filter:d.addfl, filterAmt:(visTarget()||{}).filterAmt || 80}); addOverlay(o, 'adjust'); const c = visTarget(); renderLeft(); return true; }
  if(d.beat){ const a = selAud(); if(a) doBeat(d.beat, a); return true; }
  if(d.sep){ runSep(d.sep); return true; }
  if(d.sil){ const c = selClip(); if(c) doSilence(d.sil, c); return true; }
  if(d.capgo){ const o = S.overlays.find(x => x.id === d.capgo); if(o){ S.sel = o.id; seek(o.start + .02); renderTimeline(); } return true; }
  if(d.capdel){ pushUndo(); S.overlays = S.overlays.filter(x => x.id !== d.capdel); afterEdit(); renderLeft(); return true; }
  if(d.capmerge){ const caps = S.overlays.filter(o => o.type === 'text' && o.caption).sort((a,b) => a.start - b.start), i = caps.findIndex(o => o.id === d.capmerge), a = caps[i], b = caps[i+1];
    if(a && b){ pushUndo(); a.text = (a.text + ' ' + b.text).trim(); a.dur = b.start + b.dur - a.start; S.overlays = S.overlays.filter(x => x !== b); afterEdit(); renderLeft(); } return true; }
  if(d.caprepl){ const f = S.capFind || ''; if(!f) return true; pushUndo(); let n = 0; for(const o of S.overlays) if(o.type === 'text' && o.caption && o.text.includes(f)){ o.text = o.text.split(f).join(S.capRepl || ''); n++; } afterEdit(); renderLeft(); alert(n + ' captions changed'); return true; }
  return false;
}
// ---- template dialog ----
let tplPick = [];
function openTemplateDialog(id){
  const t = TPL.find(z => z.id === id); if(!t) return;
  tplPick = S.media.filter(m => !m.missing && m.type !== 'audio').slice(0, t.n).map(m => m.id);
  const keys = t.texts.filter(z => z.key);
  showModal(`<h3 style="margin-top:0">✨ ${esc(t.name)} <small style="color:var(--mute);font-weight:400">${t.ratio}</small></h3>
    <div style="color:var(--mute);margin-bottom:6px">Pick the photos / videos to use (in order). ${t.n} recommended — fewer will be reused.</div>
    <div class="tplpick" id="tplPick"></div>
    <div class="btns"><button id="tplImp">${ic('import')} Import more</button></div>
    ${keys.map(z=>`<div class="xrow"><span>${z.key==='title'?'Title':'Subtitle'}</span><input type="text" data-tplk="${z.key}" value="${esc(z.text)}"></div>`).join('')}
    <div class="note">⚠ Current timeline clips / text will be replaced (audio stays). Undo with Ctrl+Z.</div>
    <div class="btns" style="justify-content:flex-end"><button id="tplCancel">Cancel</button><button class="primary" id="tplGo" data-id="${id}">✨ Use template</button></div>`);
  renderTplPick();
}
function renderTplPick(){
  const box = $('#tplPick'); if(!box) return;
  const list = S.media.filter(m => !m.missing && m.type !== 'audio');
  box.innerHTML = list.length ? list.map(m => { const i = tplPick.indexOf(m.id); return `<button class="tpm ${i>=0?'on':''}" data-tpm="${m.id}" style="background-image:url(${m.thumb||''})">${i>=0?`<b>${i+1}</b>`:''}<span>${m.type==='video'?fmtT(m.duration):'IMG'}</span></button>`; }).join('') : '<div class="lnote">No media yet — press "Import more".</div>';
}
const tplIn = document.createElement('input'); tplIn.type = 'file'; tplIn.accept = 'video/*,image/*'; tplIn.multiple = true; tplIn.hidden = true; document.body.appendChild(tplIn);
tplIn.onchange = async () => { for(const f of tplIn.files){ try{ const m = f.type.startsWith('video/') ? await addVideoMedia(f) : await addImageMedia(f); tplPick.push(m.id); }catch(err){ alert(f.name + ': ' + err.message); } } tplIn.value = ''; renderTplPick(); renderLeft(); };
$('#modal').addEventListener('click', e => {
  const pm = e.target.closest('[data-tpm]'); if(pm){ const id = pm.dataset.tpm, i = tplPick.indexOf(id); i >= 0 ? tplPick.splice(i,1) : tplPick.push(id); renderTplPick(); return; }
  if(e.target.closest('#tplImp')){ tplIn.click(); return; }
  if(e.target.closest('#tplCancel')){ hideModal(); return; }
  const go = e.target.closest('#tplGo'); if(!go) return;
  const t = TPL.find(z => z.id === go.dataset.id), medias = tplPick.map(media).filter(Boolean);
  if(!medias.length) return alert('Pick at least one photo / video');
  const texts = {}; $('#modalBox').querySelectorAll('[data-tplk]').forEach(x => texts[x.dataset.tplk] = x.value);
  hideModal(); buildTemplate(t, medias, texts); updatePInfo(); renderLeft();
});
// ---- v13: AI auto thumbnail ----
const TH = {size:'yt', title:'', sub:'', photos:[], frames:null, thumbs:[], sel:-1, busy:false, again:false, font:'', theme:'auto', scale:100, runs:0};
const TH_SUBS = ['','NEW','PART 1','MUST WATCH','VIRAL','EPISODE 1','TOP 5','LIVE','2026','FULL VLOG'];
const thIn = document.createElement('input'); thIn.type = 'file'; thIn.accept = 'image/*'; thIn.multiple = true; thIn.style.display = 'none'; document.body.appendChild(thIn);
thIn.onchange = async () => {
  for(const f of thIn.files){ try{ const b = await createImageBitmap(f), k = Math.min(1, 1280/Math.max(b.width, b.height)), c = document.createElement('canvas'); c.width = Math.round(b.width*k); c.height = Math.round(b.height*k); c.getContext('2d').drawImage(b, 0, 0, c.width, c.height); c._url = c.toDataURL('image/jpeg', .7); TH.photos.push(c); }catch(e){ alert(f.name + ': could not read image'); } }
  thIn.value = ''; renderThPhotos(); if(TH.frames) thGenerate(false);
};
function openThumb(){
  if(!S.total && !TH.photos.length) return alert('Add a video or photos first'); pause();
  TH.title = TH.title || autoTitle(); TH.frames = null; TH.thumbs = []; TH.sel = -1;
  showModal(`<div class="thwrap"><div class="thhead"><h3>✨ AI Auto Thumbnail</h3><span class="thsub">Built automatically from the best frames of your video + AI person cut-out</span><button class="thx" id="thClose">✕</button></div>
    <div class="thbody"><div class="thside">
      <label>Platform</label><div class="thsizes">${THUMB_SIZES.map(([k,n]) => `<button data-thsz="${k}" class="${TH.size===k?'on':''}">${n}</button>`).join('')}</div>
      <label>Title</label><textarea id="thTitle" rows="2" placeholder="Video title">${esc(TH.title)}</textarea>
      <label>Badge / Subtitle</label><input id="thSub" value="${esc(TH.sub)}" placeholder="e.g. NEW / PART 1"><div class="thchips">${TH_SUBS.filter(Boolean).map(t => `<button data-thsubq="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <label>Title font</label><select id="thFont">${fontOptions(TH.font, true)}</select>
      <label>Text style</label><div class="thchips thth">${Object.keys(THUMB_THEMES).map(k => `<button data-ththeme="${k}" class="${TH.theme===k?'on':''}">${k[0].toUpperCase()+k.slice(1)}</button>`).join('')}</div>
      <label>Text size <b id="thScaleV">${TH.scale}%</b></label><input type="range" id="thScale" min="60" max="140" value="${TH.scale}">
      <label>Your photos (optional)</label><div id="thPhotos" class="thphotos"></div>
      <button class="primary thgo" id="thGo">✨ Generate</button><button id="thMore">🔀 More designs</button>
      <div id="thProg" class="thprog"></div>
    </div><div class="thmain"><div id="thBig" class="thbig"><div class="themp"><div class="thhero">✨</div><b>Press Generate</b><br>Your video is analysed and 10 different thumbnail designs are created.<br><small>Pick a platform, title, font and style first — you can change them any time.</small></div></div>
      <div id="thGrid" class="thgrid"></div>
      <div class="btns thact"><button id="thManual">✏️ Manual editor</button><button id="thAdd" disabled>${ic('plus')} Add to video start</button><button class="primary" id="thDl" disabled>${ic('export')} Download PNG</button></div>
    </div></div></div>`);
  $('#modalBox').classList.add('wide','thm'); renderThPhotos();
}
function renderThPhotos(){ const b = $('#thPhotos'); if(!b) return; b.innerHTML = TH.photos.map((p,i) => `<div class="thph"><img src="${p._url}"><button data-thdel="${i}">✕</button></div>`).join('') + `<button class="thadd" id="thAddPh">${ic('plus')}<span>Photo</span></button>`; }
function thOpt(shuffle){ return {size:TH.size, title:(TH.title || autoTitle()).trim(), sub:TH.sub.trim(), shuffle, font:TH.font, theme:TH.theme, scale:TH.scale}; }
async function thGenerate(shuffle){
  if(TH.busy){ TH.again = shuffle; return; } TH.busy = true; const pg = $('#thProg'), go = $('#thGo'), more = $('#thMore');
  [go, more].forEach(b => b && (b.disabled = true, b.classList.add('busy')));
  if(go) go.innerHTML = '<span class="spin"></span> Generating…';
  const big = $('#thBig'); if(big && !TH.thumbs.length) big.innerHTML = '<div class="themp"><span class="spin lg"></span><br>Analysing your video…</div>';
  const prog = (m, p) => { if(pg) pg.innerHTML = `<div>${m}</div><i style="width:${Math.round((p||0)*100)}%"></i>`; };
  try{
    prog('🔤 Loading fonts…', .02); const o0 = thOpt(); await thFonts([TH.font, scriptFont(o0.title)], o0.title);
    if(!TH.frames && S.total) TH.frames = await collectThumbFrames(12, prog);
    const frames = [...(TH.frames || [])], o = thOpt(shuffle || TH.runs > 0); TH.runs++;
    const r = await makeThumbnails(Object.assign({}, o, {frames, photos:TH.photos}), prog);
    TH.thumbs = r.thumbs; TH.sel = 0; const gEl = $('#thGrid'); if(gEl) gEl.scrollLeft = 0;
    const segOk = r.frames.some(f => f.seg);
    prog(segOk ? '✅ Ready — AI person cut-out used' : '✅ Ready' + (navigator.onLine ? ' (no person found, using card designs)' : ' — offline: without AI cut-out'), 1);
    renderThGrid();
  }catch(e){ console.error(e); prog('⚠️ ' + (e.message || e), 0); }
  finally{ TH.busy = false; [go, more].forEach(b => b && (b.disabled = false, b.classList.remove('busy'))); if(go) go.innerHTML = '✨ Generate again'; if(TH.again !== false){ const a = TH.again; TH.again = false; thGenerate(a); } }
}
const thFonts = (a, b) => thumbFonts(a, b);
function renderThGrid(){
  const g = $('#thGrid'), big = $('#thBig'); if(!g) return;
  g.innerHTML = ''; TH.thumbs.forEach((t,i) => { const b = document.createElement('button'); b.className = 'thtile' + (i === TH.sel ? ' on' : ''); b.dataset.thi = i; const c = document.createElement('canvas'), k = 220/Math.max(t.c.width, t.c.height); c.width = Math.round(t.c.width*k); c.height = Math.round(t.c.height*k); c.getContext('2d').drawImage(t.c, 0, 0, c.width, c.height); b.appendChild(c); g.appendChild(b); });
  const t = TH.thumbs[TH.sel]; big.innerHTML = ''; if(t){ const c = document.createElement('canvas'); c.width = t.c.width; c.height = t.c.height; c.getContext('2d').drawImage(t.c, 0, 0); big.appendChild(c); }
  $('#thDl').disabled = $('#thAdd').disabled = !t;
}
$('#modal').addEventListener('change', async e => { if(e.target.id !== 'thFont') return; TH.font = e.target.value; await thFonts([TH.font], TH.title); thRedraw(); });
function thRedraw(){ if(!TH.thumbs.length) return; const o = thOpt(false), [W,H] = THUMB_SIZES.find(s => s[0] === TH.size).slice(2); TH.thumbs.forEach(t => t.c = renderThumb(t, W, H, o)); renderThGrid(); }
let thT = null;
$('#modal').addEventListener('input', e => {
  if(e.target.id === 'thTitle'){ TH.title = e.target.value; clearTimeout(thT); thT = setTimeout(thRedraw, 250); }
  if(e.target.id === 'thSub'){ TH.sub = e.target.value; clearTimeout(thT); thT = setTimeout(thRedraw, 250); }
  if(e.target.id === 'thScale'){ TH.scale = +e.target.value; $('#thScaleV').textContent = TH.scale + '%'; clearTimeout(thT); thT = setTimeout(thRedraw, 120); }
});
$('#modal').addEventListener('click', async e => {
  const q = s => e.target.closest(s);
  if(q('#thClose')){ hideModal(); $('#modalBox').classList.remove('wide','thm'); return; }
  const sz = q('[data-thsz]'); if(sz){ TH.size = sz.dataset.thsz; $('#modalBox').querySelectorAll('[data-thsz]').forEach(b => b.classList.toggle('on', b === sz)); if(TH.thumbs.length) thRedraw(); return; }
  const tt = q('[data-ththeme]'); if(tt){ TH.theme = tt.dataset.ththeme; $('#modalBox').querySelectorAll('[data-ththeme]').forEach(b => b.classList.toggle('on', b === tt)); thRedraw(); return; }
  const sq = q('[data-thsubq]'); if(sq){ TH.sub = sq.dataset.thsubq; $('#thSub').value = TH.sub; thRedraw(); return; }
  if(q('#thAddPh')){ thIn.click(); return; }
  const dp = q('[data-thdel]'); if(dp){ TH.photos.splice(+dp.dataset.thdel, 1); renderThPhotos(); return; }
  if(q('#thGo')){ thGenerate(false); return; } if(q('#thMore')){ thGenerate(true); return; }
  const tl = q('[data-thi]'); if(tl){ TH.sel = +tl.dataset.thi; renderThGrid(); return; }
  if(q('#thManual')){ $('#modalBox').classList.remove('thm'); openCover(); return; }
  const t = TH.thumbs[TH.sel]; if(!t) return;
  if(q('#thDl')){ const blob = await new Promise(r => t.c.toBlob(r, 'image/png')); saveBlob(blob, ((S.project && S.project.name) || 'thumbnail').replace(/[\\/:*?"<>|]/g,'_') + '_' + TH.size + '.png'); return; }
  if(q('#thAdd')){
    const W = out.width*2, H = out.height*2, c = renderThumb(t, W, H, thOpt(false)), blob = await new Promise(r => c.toBlob(r, 'image/png'));
    const m = await addImageMedia(new File([blob], 'Thumbnail.png', {type:'image/png'}));
    pushUndo(); const cl = newClip(m); cl.out = 1; S.clips.unshift(cl); if(S.clips[1]) S.clips[1].trans = {type:'fade', dur:.4};
    hideModal(); $('#modalBox').classList.remove('wide','thm'); afterEdit(); renderLeft(); seek(0);
  }
});
// ---- cover maker (manual) ----
const COV = {t:0, title:'', sub:'', style:'kannadaGold', font:'Baloo Tamma 2', size:60, pos:'bottom', shade:55, bright:5, sat:15, out:'yt'};
let covFrame = null, covTimer = null;
const COV_SIZES = [['yt','YouTube 1280×720',[1280,720]],['same','Video ratio',null],['sq','Square 1080',[1080,1080]],['vert','Reels 1080×1920',[1080,1920]]];
function covDims(){ const s = COV_SIZES.find(z => z[0] === COV.out); if(s && s[2]) return s[2]; const k = 1280/Math.max(out.width, out.height); return [Math.round(out.width*k), Math.round(out.height*k)]; }
async function openCover(){
  if(!S.total) return alert('Add media first'); pause();
  if(!COV.title) COV.title = S.project ? S.project.name : 'My Video';
  COV.t = clamp(COV.t || S.time, 0, S.total);
  const styles = ['kannadaGold','gold3d','fire','neonBlue','comic','popart','sticker','dblOutline','red3d','royal','silver','minimalShadow'];
  showModal(`<div class="xwrap"><div class="xprev cov"><canvas id="covCv"></canvas></div><div class="xform"><h3 style="margin:0 0 10px">🖼 Cover / Thumbnail</h3>
    <div class="xrow"><span>Frame</span><input type="range" id="covT" min="0" max="${S.total.toFixed(2)}" step="0.04" value="${COV.t}"></div>
    <div class="xrow"><span>Title</span><textarea id="covTitle" rows="2">${esc(COV.title)}</textarea></div>
    <div class="xrow"><span>Subtitle</span><input type="text" id="covSub" value="${esc(COV.sub)}" placeholder="e.g. Part 1 / NEW"></div>
    <div class="covst">${styles.map(k=>`<button data-covst="${k}" class="${COV.style===k?'on':''}"><canvas data-tfxc="${k}" width="96" height="44"></canvas></button>`).join('')}</div>
    <div class="xrow"><span>Font</span><select id="covFont">${fontOptions(COV.font)}</select></div>
    <div class="xrow"><span>Size</span><input type="range" id="covSize" min="20" max="120" value="${COV.size}"></div>
    <div class="xrow"><span>Position</span><select id="covPos">${[['top','Top'],['center','Center'],['bottom','Bottom']].map(([k,n])=>`<option value="${k}" ${COV.pos===k?'selected':''}>${n}</option>`).join('')}</select></div>
    <div class="xrow"><span>Shade</span><input type="range" id="covShade" min="0" max="90" value="${COV.shade}"></div>
    <div class="xrow"><span>Brightness</span><input type="range" id="covBright" min="-40" max="40" value="${COV.bright}"></div>
    <div class="xrow"><span>Saturation</span><input type="range" id="covSat" min="-50" max="60" value="${COV.sat}"></div>
    <div class="xrow"><span>Size</span><select id="covOut">${COV_SIZES.map(([k,n])=>`<option value="${k}" ${COV.out===k?'selected':''}>${n}</option>`).join('')}</select></div>
    <div class="btns" style="justify-content:flex-end"><button id="covClose">Close</button><button id="covAdd">${ic('plus')} Add to video start</button><button class="primary" id="covDl">${ic('export')} Download PNG</button></div>
    </div></div>`);
  $('#modalBox').classList.add('wide'); paintV8($('#modalBox'), null);
  covFrame = await grabFrame(COV.t); drawCovPreview();
}
function drawCovPreview(){ const c = $('#covCv'); if(!c) return; const [W,H] = covDims(), k = Math.min(300/W, 360/H); c.width = Math.round(W*k); c.height = Math.round(H*k); const big = document.createElement('canvas'); big.width = W; big.height = H; drawCover(big, covFrame, COV); c.getContext('2d').drawImage(big, 0, 0, c.width, c.height); }
$('#modal').addEventListener('input', e => {
  const id = e.target.id, v = e.target.value; if(!id || !id.startsWith('cov')) return;
  const map = {covTitle:'title', covSub:'sub', covFont:'font', covSize:'size', covPos:'pos', covShade:'shade', covBright:'bright', covSat:'sat', covOut:'out'};
  if(id === 'covT'){ COV.t = +v; clearTimeout(covTimer); covTimer = setTimeout(async () => { covFrame = await grabFrame(COV.t); drawCovPreview(); }, 120); return; }
  if(map[id]){ COV[map[id]] = ['size','shade','bright','sat'].includes(map[id]) ? +v : v; if(id === 'covFont') ensureFont(v); drawCovPreview(); }
});
$('#modal').addEventListener('change', e => { if(e.target.id === 'covFont'){ COV.font = e.target.value; ensureFont(COV.font); setTimeout(drawCovPreview, 300); } });
$('#modal').addEventListener('click', async e => {
  const st = e.target.closest('[data-covst]'); if(st){ COV.style = st.dataset.covst; $('#modalBox').querySelectorAll('[data-covst]').forEach(b => b.classList.toggle('on', b === st)); drawCovPreview(); return; }
  if(e.target.closest('#covClose')){ hideModal(); $('#modalBox').classList.remove('wide'); return; }
  const dl = e.target.closest('#covDl'), add = e.target.closest('#covAdd'); if(!dl && !add) return;
  const [W,H] = add ? [out.width*2, out.height*2] : covDims(), c = document.createElement('canvas'); c.width = W; c.height = H; drawCover(c, covFrame, COV);
  const blob = await new Promise(r => c.toBlob(r, 'image/png'));
  if(dl){ saveBlob(blob, (S.project ? S.project.name : 'cover') + '_cover.png'); return; }
  const m = await addImageMedia(new File([blob], 'Cover.png', {type:'image/png'}));
  pushUndo(); const cl = newClip(m); cl.out = 1; S.clips.unshift(cl); if(S.clips[1]) S.clips[1].trans = {type:'fade', dur:.4};
  hideModal(); $('#modalBox').classList.remove('wide'); afterEdit(); renderLeft(); seek(0);
});

/* =====================================================================
   MOBILE APP LAYOUT (mobile app style)
   player on top · timeline in the middle · tool bar at the bottom ·
   every panel opens as a sheet below the player, so the preview stays visible
   ===================================================================== */
Object.assign(IC, {
  speed:'<path d="M12 21a9 9 0 1 1 9-9"/><path d="M12 12l5-4"/><circle cx="12" cy="12" r="1.5"/>',
  anim:'<path d="M5 19c3-1 4-4 5-7s3-6 9-7"/><circle cx="5" cy="19" r="2"/><path d="M15 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>', back:'<path d="M15 5l-7 7 7 7"/>', install:'<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  wifi:'<path d="M2 9a15 15 0 0 1 20 0"/><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>'
});
var MQ = matchMedia('(max-width:900px)');
function isMob(){ return matchMedia('(max-width:900px)').matches; }
var MT = document.createElement('nav'); MT.id = 'mtools'; $('#app').appendChild(MT);
['left','right'].forEach(id => { const h = document.createElement('div'); h.className = 'shead'; h.innerHTML = `<span class="stitle"></span><button class="sdone" title="Done">${ic('check')}</button>`; $('#'+id).prepend(h); h.querySelector('.sdone').onclick = closeSheets; });
const RT_IC = {video:'film', audio:'music2', speed:'speed', anim:'anim', trans:'trans', adjust:'adjust', track:'target', tts:'mic', text:'text', sticker:'sticker', gfx:'library', layer:'layers'};
function sheetTop(){ const r = $('#player').getBoundingClientRect(); document.documentElement.style.setProperty('--sheetTop', Math.round(r.bottom + 4) + 'px'); }
addEventListener('resize', () => { if(isMob()){ sheetTop(); fitCanvas(); } });
function openSheet(side, title){
  sheetTop(); document.body.classList.remove('sheetL','sheetR'); document.body.classList.add(side === 'left' ? 'sheetL' : 'sheetR');
  $('#' + side + ' .stitle').textContent = title; $(side === 'left' ? '#lcontent' : '#inspBody').scrollTop = 0;
  requestAnimationFrame(fitCanvas);
}
function closeSheets(){ document.body.classList.remove('sheetL','sheetR'); renderMTools(); requestAnimationFrame(fitCanvas); }
function renderMTools(){
  if(!isMob() || !MT) return;
  const it = selItem(), B = (k, icon, label, cls='') => `<button data-mt="${k}" class="${cls}">${ic(icon)}<span>${label}</span></button>`;
  let h = '';
  if(!it){
    if(document.body.classList.contains('sheetR')) document.body.classList.remove('sheetR');
    h = B('import','import','Import','acc') + LTABS.map(([k,n,i]) => B('L:'+k, i, n)).join('');
  } else {
    const kind = kindOf(it); let tabs = RT[kind] || [];
    if((kind === 'clip' || kind === 'clipimg') && S.clips.indexOf(it) === 0) tabs = tabs.filter(t => t[0] !== 'trans');
    const vis = !it.type || isMediaOv(it) || it.type === 'adjust';
    h = B('back','back','Back','bk') + B('A:split','split','Split') + tabs.map(([k,n]) => B('R:'+k, RT_IC[k]||'edit', n)).join('') +
      (vis ? B('L:filters','filters','Filters') + B('L:effects','effects','Effects') : '') +
      B('A:dup','copy','Duplicate') + B('A:del','trash','Delete','del');
  }
  MT.innerHTML = h;
}
MT.addEventListener('click', e => {
  const b = e.target.closest('[data-mt]'); if(!b) return; const k = b.dataset.mt, label = b.textContent.trim();
  if(k === 'import'){ $('#fileIn').click(); return; }
  if(k === 'back'){ S.sel = null; selMulti.clear(); closeSheets(); renderTimeline(); renderInspector(); return; }
  if(k === 'A:split'){ split(); return; } if(k === 'A:dup'){ dup(); return; } if(k === 'A:del'){ del(); closeSheets(); return; }
  if(k.startsWith('L:')){ S.ltab = k.slice(2); renderLeft(); openSheet('left', label); return; }
  if(k.startsWith('R:')){ const it = selItem(); if(!it) return; S.rt[kindOf(it)] = k.slice(2); renderInspector(); openSheet('right', label); }
});
MQ.addEventListener('change', () => { closeSheets(); renderMTools(); setTimeout(() => { HEADW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--head')) || 150; fitCanvas(); renderTimeline(); }, 50); });
renderMTools();
// touch: one finger on empty timeline = scroll, tap = move playhead, two fingers = zoom
const tlTouch = new Map(); let pinch0 = null, pan = null;
TL.addEventListener('pointerdown', e => {
  if(e.pointerType !== 'touch' || onTLScrollbar(e)) return;
  tlTouch.set(e.pointerId, e.clientX);
  if(tlTouch.size === 2){ const [a,b] = [...tlTouch.values()]; pinch0 = {d:Math.max(20, Math.abs(a-b)), pps:S.pps}; drag = null; pan = null; e.stopImmediatePropagation(); return; }
  const empty = !e.target.closest('.it,.clip,.thead,.ruler,.tmark,[data-tk],[data-th]');
  if(empty){ pan = {x0:e.clientX, y0:e.clientY, sl:TL.scrollLeft, st:TL.scrollTop, moved:false}; e.stopImmediatePropagation(); }
}, true);
TL.addEventListener('pointermove', e => {
  if(e.pointerType !== 'touch') return;
  if(tlTouch.has(e.pointerId)) tlTouch.set(e.pointerId, e.clientX);
  if(pinch0 && tlTouch.size === 2){ const [a,b] = [...tlTouch.values()]; setZoom(pinch0.pps * Math.max(20, Math.abs(a-b)) / pinch0.d); e.stopImmediatePropagation(); return; }
  if(pan){ const dx = e.clientX - pan.x0, dy = e.clientY - pan.y0; if(Math.abs(dx) + Math.abs(dy) > 6) pan.moved = true; TL.scrollLeft = pan.sl - dx; TL.scrollTop = pan.st - dy; e.stopImmediatePropagation(); }
}, true);
const tlUp = e => {
  if(e.pointerType !== 'touch') return; tlTouch.delete(e.pointerId);
  if(tlTouch.size < 2) pinch0 = null;
  if(pan){ const p = pan; pan = null; if(!p.moved && e.type === 'pointerup'){ if(selMulti.size){ selMulti.clear(); renderTimeline(); } seek(tAt(e.clientX)); } e.stopImmediatePropagation(); }
};
TL.addEventListener('pointerup', tlUp, true); TL.addEventListener('pointercancel', tlUp, true);

/* =====================================================================
   INSTALL AS APP + OFFLINE
   ===================================================================== */
let installEvt = null;
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const IB_BTN = document.createElement('button'); IB_BTN.id = 'btnInstall'; IB_BTN.innerHTML = ic('install') + '<span>Install app</span>'; IB_BTN.onclick = () => doInstall();
$('#btnCover').before(IB_BTN);
const OFF = document.createElement('span'); OFF.id = 'offBadge'; OFF.innerHTML = ic('wifi') + ' Offline'; $('.ptitle').appendChild(OFF);
function updNet(){ OFF.style.display = navigator.onLine ? 'none' : ''; }
addEventListener('online', updNet); addEventListener('offline', updNet); updNet();
function updInstallBtn(){ IB_BTN.style.display = !standalone() && (installEvt || isIOS) ? '' : 'none'; }
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; updInstallBtn(); });
addEventListener('appinstalled', () => { installEvt = null; updInstallBtn(); });
updInstallBtn();
async function doInstall(){
  if(installEvt){ installEvt.prompt(); const r = await installEvt.userChoice; if(r.outcome === 'accepted'){ installEvt = null; updInstallBtn(); } return; }
  showModal(`<h3 style="margin-top:0">📲 Install ChitraCut as an app</h3>
    ${isIOS ? `<p><b>iPhone / iPad (Safari):</b></p><ol><li>Tap the <b>Share</b> button (⬆ square) at the bottom</li><li>Choose <b>Add to Home Screen</b></li><li>Tap <b>Add</b></li></ol>`
      : `<p><b>Android (Chrome):</b> top ⋮ menu › <b>Install app</b> / <b>Add to Home screen</b></p><p><b>PC (Chrome / Edge):</b> click the ⊕ install icon at the right of the address bar</p>`}
    <p style="color:var(--mute)">After installing, the ChitraCut icon appears on your home screen — it opens full screen like an app and works without internet.</p>
    <div class="btns" style="justify-content:flex-end"><button class="primary" id="xCancel">OK</button></div>`);
}
function offlineCard(){
  const inst = standalone() ? '✅ Installed as an app' : `<button id="hInstall">${ic('install')} Install as app</button>`;
  return `<div class="ocard"><div><b>${ic('wifi')} Use without internet</b><span>Editing, effects, filters and export all work offline. Press "Offline ready" once while online to also keep fonts, preview photos and the Remove BG AI.</span></div>
    <div class="obtn">${inst}<button id="hOffline">${ic('install')} Make offline ready</button></div></div>`;
}
async function prepareOffline(btn){
  if(!navigator.onLine) return alert('No internet now — press this when online');
  btn.disabled = true; const say = m => btn.innerHTML = m;
  try{
    if(navigator.storage && navigator.storage.persist) await navigator.storage.persist();
    say('⏳ Fonts…');
    const css = document.querySelector('link[href*="fonts.googleapis"]').href, txt = await (await fetch(css)).text();
    const urls = [...new Set([...txt.matchAll(/url\((https:[^)]+)\)/g)].map(m => m[1]))];
    // Kannada + Latin subsets are what we use; others (cyrillic, vietnamese…) are skipped
    const blocks = txt.split('@font-face').filter(b => /U\+0C80|U\+0000-00FF/.test(b)), need = new Set(blocks.map(b => (b.match(/url\((https:[^)]+)\)/)||[])[1]).filter(Boolean));
    let i = 0; const list = urls.filter(u => need.has(u));
    for(const u of list){ await fetch(u, {mode:'no-cors'}).catch(()=>{}); say(`⏳ Fonts ${++i}/${list.length}`); }
    say('⏳ Remove BG AI…'); await loadSeg().catch(()=>{});
    say('✅ Offline ready');
  }catch(err){ say('⚠ ' + err.message); btn.disabled = false; }
}
if(/[?&]new=1/.test(location.search)) setTimeout(() => { newProject(); }, 900);

/* ---- vocal / BGM remover UI ---- */
let sepBusy = false;
async function runSep(which){
  if(which === 'stop'){ stopStems(); sepBusy = false; const st = $('#sepStat'); if(st) st.textContent = 'Stopped'; ['#sepProg','#sepStopB'].forEach(q => { const e = $(q); if(e) e.style.display = 'none'; }); return; }
  if(sepBusy) return; const it = selItem(); if(!it || !(it.type === 'audio' || !it.type)) return;
  const m = media(it.mediaId); if(!m || m.type === 'image') return alert('Select a clip / music with audio');
  sepBusy = true; pause();
  const show = (msg, p) => { const st = $('#sepStat'), pr = $('#sepProg'), bar = $('#sepBar'), sb = $('#sepStopB'); if(st) st.textContent = msg; if(pr){ pr.style.display = ''; bar.style.width = (p*100) + '%'; } if(sb) sb.style.display = which === 'quick' ? 'none' : ''; };
  show(which === 'quick' ? '⚡ Processing…' : '⏳ Starting…', 0);
  try{
    const n = await separateStems(it, which, show);
    sepBusy = false; renderInspector(); renderLeft();
    const st = $('#sepStat'); if(st) st.textContent = `✅ ${n} new audio track(s) added — original audio muted`;
  }catch(err){ sepBusy = false; stopStems(); const st = $('#sepStat'); if(st) st.textContent = '❌ ' + err.message; else alert(err.message); const pr = $('#sepProg'); if(pr) pr.style.display = 'none'; const sb = $('#sepStopB'); if(sb) sb.style.display = 'none'; }
}
