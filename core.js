'use strict';
/* ================= STATE ================= */
const $ = s => document.querySelector(s);
const S = {project:null,media:[],clips:[],overlays:[],audios:[],luts:[],sel:null,time:0,total:0,mainEnd:0,playing:false,pps:40,ratio:'9:16',quality:720,bg:'black',pick:false,mainMute:false,mainHide:false,rt:{},rs:{},closed:{},ltab:'media',lsub:{}};
const nid = () => 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const vids = {};          // clipId -> <video> (main track)
const ovVids = {};        // overlayId -> <video> (PiP)
const ovAud = {};         // overlayId -> GainNode
const audEls = {};        // audioItemId -> <audio>
const audChains = {};     // audioItemId -> effect chain
const images = {};        // mediaId -> <img>
const mediaBlobs = {};    // mediaId -> File/Blob
const derived = {};       // clipId -> {start,dur,cum,len,td}
const hits = new Map();
const geo = {};           // last drawn on-screen geometry per item (for mask / tracking gizmos)
const undoS = [], redoS = [];
let active = null, editing = false, exporting = false, rec = null, drag = null, cdrag = null, recState = null;

const pad = n => String(n).padStart(2,'0');
const fmtT = t => { t = Math.max(0,t||0); return pad(Math.floor(t/60)) + ':' + pad(Math.floor(t%60)); };
const fmtTC = t => { t = Math.max(0,t||0); return pad(Math.floor(t/60)) + ':' + pad(Math.floor(t%60)) + '.' + pad(Math.floor((t%1)*100)); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (v,a,b) => Math.min(b, Math.max(a, v));
const media = id => S.media.find(m => m.id === id);
const isImg = c => (media(c.mediaId)||{}).type === 'image';
const isMediaOv = o => o.type === 'image' || o.type === 'video';
const selClip = () => S.clips.find(c => c.id === S.sel);
const selOv = () => S.overlays.find(o => o.id === S.sel);
const selAud = () => S.audios.find(a => a.id === S.sel);
const selItem = () => selClip() || selOv() || selAud();
const findFree = id => S.overlays.find(o => o.id === id) || S.audios.find(a => a.id === id);
function selFree(){ const o=selOv(); if(o) return [o,S.overlays]; const a=selAud(); if(a) return [a,S.audios]; return null; }
const getP = (o,p) => p.split('.').reduce((x,k) => x == null ? x : x[k], o);
const setP = (o,p,v) => { const k = p.split('.'); const last = k.pop(); k.reduce((x,kk) => x[kk], o)[last] = v; };
const fmtV = v => (Math.round(v*10)/10).toString();
const hexA = (h,a) => { const n = parseInt((h||'#000000').slice(1),16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; };
const toHex = (r,g,b) => '#' + [r,g,b].map(x => Math.round(clamp(x,0,255)).toString(16).padStart(2,'0')).join('');
const seg = (window.Intl && Intl.Segmenter) ? new Intl.Segmenter('kn',{granularity:'grapheme'}) : null;
const graphemes = s => seg ? Array.from(seg.segment(s), x => x.segment) : Array.from(s);
const deep = o => JSON.parse(JSON.stringify(o));

/* ================= DEFAULTS ================= */
const defMask = () => ({type:'none',x:0,y:0,w:60,h:60,rot:0,feather:5,round:0,invert:false});
const defAdj = () => ({exposure:0,brightness:0,contrast:0,highlights:0,shadows:0,saturation:0,vibrance:0,hue:0,temp:0,tint:0,fade:0,vignette:0,grain:0,sharpen:0});
const defFx = () => ({type:'none',amount:60,speed:50});
const defAudio = () => ({voice:'none',bass:0,treble:0,echo:0,reverb:0,enhance:false,isolate:false,norm:false,
  eq:[0,0,0,0,0,0,0,0,0,0], comp:false, compThr:-24, compRatio:4, limiter:false, gate:false, gateThr:-45, pitch:0,
  echoTime:.3, echoFb:35, reverbSize:'hall', dist:0, phaser:0, wah:0, trem:0, hp:0, lp:0, amp:0,
  chorus:0, vibrato:0, ring:0, crush:0, pan8d:0, vinyl:0, vpreset:''});
const defBfx = () => ({type:'none',amount:70,color:'#20d5ec'});
const EQ_F = [31,62,125,250,500,1000,2000,4000,8000,16000];
// fill fields that older projects / older items don't have
function normItem(it){
  if(!it) return it;
  if(it.adj) it.adj = Object.assign(defAdj(), it.adj);
  if(it.audio){ it.audio = Object.assign(defAudio(), it.audio); if(!Array.isArray(it.audio.eq) || it.audio.eq.length !== 10) it.audio.eq = defAudio().eq; }
  if(it.adj && !it.bfx) it.bfx = defBfx();
  return it;
}
// canvas positions (tf.x / tf.y) are stored for a 720p canvas and scaled for other export sizes
const PK = () => Math.min(cv.width, cv.height)/720;
const clipDefaults = () => ({in:0, out:3, speed:1, curve:null, curveName:'none', volume:100, fadeIn:0, fadeOut:0, opacity:100,
  tf:{scale:100,x:0,y:0,rot:0,flip:false}, kf:[], rt:{smooth:0,bright:0,clear:0}, rmbg:false, rmbgInv:false, ck:{on:false,color:'#00ff00',sim:35,smooth:10,spill:30}, filter:'none', filterAmt:80, adj:defAdj(), lut:'', lutAmt:100, mask:defMask(), fx:defFx(), bfx:defBfx(),
  anim:{in:'none',out:'none',loop:'none',inDur:0.5,outDur:0.5}, trans:{type:'none',dur:0.6}, audio:defAudio()});
const ovDefaults = type => ({text:'', mediaId:null, start:0, dur:3, x:50, y:50,
  size: type==='image' ? 40 : type==='video' ? 50 : type==='sticker' ? 90 : 48, rot:0, opacity:100, kf:[], blend:'source-over', flip:false, rt:{smooth:0,bright:0,clear:0}, rmbg:false, rmbgInv:false,
  in:0, speed:1, volume:100, caption:false, curve:0, bubble:'', bubColor:'#ffffff', bubStroke:'#111111', tfx:'',
  font:'Noto Sans Kannada', bold:true, italic:false, align:'center',
  color:'#ffffff', stroke:'#000000', strokeW:0, bgOn:false, bgColor:'#000000', bgAlpha:70, shadow:30, shadowColor:'#000000',
  filter:'none', filterAmt:80, adj:defAdj(), lut:'', lutAmt:100, mask:defMask(), fx:defFx(), bfx:defBfx(),
  ck:{on:false,color:'#00ff00',sim:35,smooth:10,spill:30},
  anim: (type==='image'||type==='video') ? {in:'none',out:'none',loop:'none',inDur:0.5,outDur:0.5} : {in:'fade',out:'fade',loop:'none',inDur:0.5,outDur:0.5}});
const audDefaults = () => ({type:'audio', kind:'music', start:0, dur:1, in:0, speed:1, volume:100, fadeIn:0, fadeOut:0, audio:defAudio()});
function newClip(m){ return {...clipDefaults(), id:nid(), mediaId:m.id, out:m.type==='image' ? 3 : m.duration}; }
function newOverlay(type, extra){ return {...ovDefaults(type), id:nid(), type, start:S.time, ...extra}; }
function newAudioItem(m, extra){ return {...audDefaults(), id:nid(), mediaId:m.id, start:S.time, dur:m.duration, ...extra}; }
const CAPTION_STYLE = {caption:true,size:38,y:82,bgOn:true,bgColor:'#000000',bgAlpha:55,shadow:0,strokeW:0,color:'#ffffff',anim:{in:'fade',out:'fade',loop:'none',inDur:.15,outDur:.15}};

/* ================= PRESETS ================= */
const FILTERS = {
  none:{}, vivid:{saturation:35,contrast:15}, warm:{temp:45,saturation:10}, cool:{temp:-45,tint:-5},
  bw:{saturation:-100,contrast:20}, vintage:{temp:30,saturation:-30,fade:50,vignette:40,grain:25},
  cinema:{contrast:25,saturation:-15,temp:-15,vignette:35}, fade:{fade:70,contrast:-15},
  drama:{contrast:45,saturation:-25,vignette:50,brightness:-10}, moody:{temp:-20,saturation:-35,brightness:-12,fade:20},
  golden:{temp:60,brightness:8,saturation:20}, film:{grain:40,fade:30,contrast:10}
};
const FILTER_NAMES = {none:'None',vivid:'Vivid',warm:'Warm',cool:'Cool',bw:'B&W',vintage:'Vintage',cinema:'Cinematic',fade:'Faded',drama:'Drama',moody:'Moody',golden:'Golden',film:'Film'};
const CURVES = {montage:[2.5,.6,2.5,.6,2.5], hero:[2,2,.3,2,2], bullet:[3,.25,.25,.25,3], jumper:[.5,3,.5,3,.5], flashIn:[4,2,1,1,1], flashOut:[1,1,1,2,4]};
const CURVE_OPTS = [['none','None'],['montage','Montage'],['hero','Hero'],['bullet','Bullet'],['jumper','Jump Cut'],['flashIn','Flash In'],['flashOut','Flash Out'],['custom','Custom']];
const ANIM_IN = [['none','None'],['fade','Fade In'],['zoomIn','Zoom In'],['zoomOut','Zoom Out'],['slideL','Slide Left'],['slideR','Slide Right'],['slideU','Slide Up'],['slideD','Slide Down'],['spin','Spin'],['shake','Shake'],['rotateIn','Rotate In'],['flipX','Flip X'],['flipY','Flip Y'],['dropIn','Drop'],['riseUp','Rise Up'],['blurIn','Blur In'],['glitchIn','Glitch In'],['swingIn','Swing'],['shrinkIn','Shrink'],['growIn','Grow'],['wipeIn','Wipe'],['circleIn','Circle'],['flashIn','Flash'],['pixelIn','Pixelate'],['tiltIn','Tilt']];
const ANIM_OUT = ANIM_IN.map(([k,n]) => [k, n.replace(' In',' Out')]);
const ANIM_LOOP = [['none','None'],['kenburns','Ken Burns'],['zoomOutSlow','Slow Zoom Out'],['pulse','Pulse'],['sway','Sway'],['zoomInOut','Zoom In-Out'],['rock','Rock'],['wobble','Wobble'],['jelly','Jelly'],['glitchLoop','Glitch'],['flashLoop','Flash'],['rotateLoop','Rotate'],['shakeLoop','Shake'],['heartbeat','Heartbeat'],['bounceLoop','Bounce'],['blurPulse','Blur Pulse']];
const VOICES = [['none','None'],['michog','Mic Hog'],['megaphone','Megaphone'],['telephone','Telephone'],['robot','Robot'],['lofi','Lo-Fi'],['deep','Deep'],['radio','Radio'],['chipmunk','Chipmunk'],['monster','Monster'],['studio','Studio Voice'],['podcast','Podcast'],['cave','Cave'],['underwater','Underwater']];
const TRANS = [['none','None'],['pullIn','Pull In'],['pullOut','Pull Out'],['zoomRotate','Zoom Rotate'],['spinBlur','Spin Blur'],['whipU','Whip Up'],['whipD','Whip Down'],['glare','Glare'],['filmBurn','Film Burn'],['inkSpread','Ink Spread'],['swirlT','Swirl'],['waveT','Wave'],['fisheyeT','Fisheye'],['blackFlashT','Black Flash'],['shakeZoom','Shake Zoom'],['stretchT','Stretch'],['squeezeT','Squeeze'],['lightSweepT','Light Sweep'],['prismT','Prism'],['bounceUp','Bounce Up'],['zoomPunch','Zoom Punch'],['split3T','Split'],['vertigoT','Vertigo'],['fade','Dissolve'],['black','Fade Black'],['white','Flash White'],['slideL','Slide Left'],['slideR','Slide Right'],['slideU','Slide Up'],['slideD','Slide Down'],['wipeL','Wipe Left'],['wipeR','Wipe Right'],['zoomIn','Zoom In'],['zoomOut','Zoom Out'],['spin','Spin'],['glitch','Glitch'],['circleOpen','Circle Open'],['circleClose','Circle Close'],['diamond','Diamond'],['clock','Clock Wipe'],['blinds','Blinds'],['blindsV','Blinds V'],['dissolve','Pixel Dissolve'],['doors','Doors'],['barn','Barn Door'],['heart','Heart'],['star','Star'],['luma','Luma Fade'],['blurDissolve','Blur'],['pixelT','Pixelate'],['zoomBlur','Zoom Blur'],['whipL','Whip Left'],['whipR','Whip Right'],['flashShake','Shake & Flash'],['rgbGlitch','RGB Glitch'],['spinZoom','Spin Zoom'],['flip','Flip'],['cube','Cube'],['dropIn','Drop In']];
const TRANS_CATS = [['Trending',['pullIn','zoomBlur','whipL','glare','flashShake','rgbGlitch','spinBlur','filmBurn','shakeZoom','inkSpread','zoomPunch','fade']],
  ['Basic',['fade','black','white','luma','blurDissolve','dissolve','zoomIn','zoomOut']],
  ['Camera',['pullIn','pullOut','zoomRotate','spinBlur','whipL','whipR','whipU','whipD','zoomPunch','vertigoT','shakeZoom']],
  ['Light',['glare','filmBurn','lightSweepT','white','flashShake','prismT']],
  ['Glitch',['glitch','rgbGlitch','pixelT','blackFlashT','split3T']],
  ['Slide',['slideL','slideR','slideU','slideD','wipeL','wipeR','bounceUp','dropIn']],
  ['Shape',['circleOpen','circleClose','diamond','clock','blinds','blindsV','doors','barn','heart','star','inkSpread']],
  ['3D',['flip','cube','spin','spinZoom','stretchT','squeezeT']],
  ['Distort',['swirlT','waveT','fisheyeT','zoomBlur','prismT']]];
const FONT_LIB = [["Inter", "Sans", ""], ["Poppins", "Sans", ""], ["Montserrat", "Sans", ""], ["Roboto", "Sans", ""], ["Open Sans", "Sans", ""], ["Lato", "Sans", ""], ["Raleway", "Sans", ""], ["Nunito", "Sans", ""], ["Work Sans", "Sans", ""], ["Rubik", "Sans", ""], ["Outfit", "Sans", ""], ["Manrope", "Sans", ""], ["DM Sans", "Sans", ""], ["Kanit", "Sans", ""], ["Barlow", "Sans", ""], ["Josefin Sans", "Sans", ""], ["Quicksand", "Sans", ""], ["Exo 2", "Sans", ""], ["Titillium Web", "Sans", ""], ["Ubuntu", "Sans", ""], ["Bebas Neue", "Display", ""], ["Anton", "Display", ""], ["Oswald", "Display", ""], ["Archivo Black", "Display", ""], ["Bangers", "Display", ""], ["Bungee", "Display", ""], ["Righteous", "Display", ""], ["Russo One", "Display", ""], ["Staatliches", "Display", ""], ["Teko", "Display", ""], ["Alfa Slab One", "Display", ""], ["Luckiest Guy", "Display", ""], ["Fredoka", "Display", ""], ["Titan One", "Display", ""], ["Passion One", "Display", ""], ["Lilita One", "Display", ""], ["Black Ops One", "Display", ""], ["Monoton", "Display", ""], ["Audiowide", "Display", ""], ["Orbitron", "Display", ""], ["Chakra Petch", "Display", ""], ["Press Start 2P", "Display", ""], ["Creepster", "Display", ""], ["Bowlby One SC", "Display", ""], ["Rubik Mono One", "Display", ""], ["Bungee Shade", "Display", ""], ["Faster One", "Display", ""], ["Ultra", "Display", ""], ["Playfair Display", "Serif", ""], ["Merriweather", "Serif", ""], ["Lora", "Serif", ""], ["Cinzel", "Serif", ""], ["Abril Fatface", "Serif", ""], ["DM Serif Display", "Serif", ""], ["Cormorant Garamond", "Serif", ""], ["Libre Baskerville", "Serif", ""], ["Bodoni Moda", "Serif", ""], ["Prata", "Serif", ""], ["Yeseva One", "Serif", ""], ["Cinzel Decorative", "Serif", ""], ["Pacifico", "Script", ""], ["Lobster", "Script", ""], ["Dancing Script", "Script", ""], ["Great Vibes", "Script", ""], ["Satisfy", "Script", ""], ["Sacramento", "Script", ""], ["Allura", "Script", ""], ["Parisienne", "Script", ""], ["Kaushan Script", "Script", ""], ["Yellowtail", "Script", ""], ["Cookie", "Script", ""], ["Courgette", "Script", ""], ["Alex Brush", "Script", ""], ["Tangerine", "Script", ""], ["Pinyon Script", "Script", ""], ["Mr Dafoe", "Script", ""], ["Monsieur La Doulaise", "Script", ""], ["Permanent Marker", "Handwriting", ""], ["Caveat", "Handwriting", ""], ["Shadows Into Light", "Handwriting", ""], ["Indie Flower", "Handwriting", ""], ["Amatic SC", "Handwriting", ""], ["Patrick Hand", "Handwriting", ""], ["Gloria Hallelujah", "Handwriting", ""], ["Rock Salt", "Handwriting", ""], ["Architects Daughter", "Handwriting", ""], ["Covered By Your Grace", "Handwriting", ""], ["Reenie Beanie", "Handwriting", ""], ["Nothing You Could Do", "Handwriting", ""], ["Space Mono", "Mono", ""], ["Roboto Mono", "Mono", ""], ["VT323", "Mono", ""], ["Share Tech Mono", "Mono", ""], ["Noto Sans Kannada", "Kannada", "ಕನ್ನಡ"], ["Baloo Tamma 2", "Kannada", "ಕನ್ನಡ"], ["Anek Kannada", "Kannada", "ಕನ್ನಡ"], ["Hubballi", "Kannada", "ಕನ್ನಡ"], ["Akaya Kanadaka", "Kannada", "ಕನ್ನಡ"], ["Tiro Kannada", "Kannada", "ಕನ್ನಡ"], ["Noto Serif Kannada", "Kannada", "ಕನ್ನಡ"], ["Noto Sans Devanagari", "Hindi / Marathi", "हिन्दी"], ["Hind", "Hindi / Marathi", "हिन्दी"], ["Mukta", "Hindi / Marathi", "हिन्दी"], ["Baloo 2", "Hindi / Marathi", "हिन्दी"], ["Kalam", "Hindi / Marathi", "हिन्दी"], ["Yatra One", "Hindi / Marathi", "हिन्दी"], ["Rozha One", "Hindi / Marathi", "हिन्दी"], ["Martel", "Hindi / Marathi", "हिन्दी"], ["Khand", "Hindi / Marathi", "हिन्दी"], ["Rajdhani", "Hindi / Marathi", "हिन्दी"], ["Modak", "Hindi / Marathi", "हिन्दी"], ["Amita", "Hindi / Marathi", "हिन्दी"], ["Eczar", "Hindi / Marathi", "हिन्दी"], ["Tiro Devanagari Hindi", "Hindi / Marathi", "हिन्दी"], ["Sarpanch", "Hindi / Marathi", "हिन्दी"], ["Laila", "Hindi / Marathi", "हिन्दी"], ["Palanquin Dark", "Hindi / Marathi", "हिन्दी"], ["Gotu", "Hindi / Marathi", "हिन्दी"], ["Noto Sans Tamil", "Tamil", "தமிழ்"], ["Mukta Malar", "Tamil", "தமிழ்"], ["Baloo Thambi 2", "Tamil", "தமிழ்"], ["Catamaran", "Tamil", "தமிழ்"], ["Hind Madurai", "Tamil", "தமிழ்"], ["Pavanam", "Tamil", "தமிழ்"], ["Kavivanar", "Tamil", "தமிழ்"], ["Meera Inimai", "Tamil", "தமிழ்"], ["Anek Tamil", "Tamil", "தமிழ்"], ["Tiro Tamil", "Tamil", "தமிழ்"], ["Noto Serif Tamil", "Tamil", "தமிழ்"], ["Noto Sans Telugu", "Telugu", "తెలుగు"], ["Ramabhadra", "Telugu", "తెలుగు"], ["Mallanna", "Telugu", "తెలుగు"], ["Mandali", "Telugu", "తెలుగు"], ["Gurajada", "Telugu", "తెలుగు"], ["NTR", "Telugu", "తెలుగు"], ["Baloo Tammudu 2", "Telugu", "తెలుగు"], ["Hind Guntur", "Telugu", "తెలుగు"], ["Anek Telugu", "Telugu", "తెలుగు"], ["Suranna", "Telugu", "తెలుగు"], ["Dhurjati", "Telugu", "తెలుగు"], ["Tiro Telugu", "Telugu", "తెలుగు"], ["Noto Sans Malayalam", "Malayalam", "മലയാളം"], ["Baloo Chettan 2", "Malayalam", "മലയാളം"], ["Manjari", "Malayalam", "മലയാളം"], ["Gayathri", "Malayalam", "മലയാളം"], ["Chilanka", "Malayalam", "മലയാളം"], ["Anek Malayalam", "Malayalam", "മലയാളം"], ["Noto Serif Malayalam", "Malayalam", "മലയാളം"], ["Noto Sans Bengali", "Bengali", "বাংলা"], ["Hind Siliguri", "Bengali", "বাংলা"], ["Baloo Da 2", "Bengali", "বাংলা"], ["Galada", "Bengali", "বাংলা"], ["Atma", "Bengali", "বাংলা"], ["Mina", "Bengali", "বাংলা"], ["Anek Bangla", "Bengali", "বাংলা"], ["Tiro Bangla", "Bengali", "বাংলা"], ["Noto Sans Gujarati", "Gujarati", "ગુજરાતી"], ["Hind Vadodara", "Gujarati", "ગુજરાતી"], ["Baloo Bhai 2", "Gujarati", "ગુજરાતી"], ["Mukta Vaani", "Gujarati", "ગુજરાતી"], ["Shrikhand", "Gujarati", "ગુજરાતી"], ["Rasa", "Gujarati", "ગુજરાતી"], ["Anek Gujarati", "Gujarati", "ગુજરાતી"], ["Noto Sans Gurmukhi", "Punjabi", "ਪੰਜਾਬੀ"], ["Baloo Paaji 2", "Punjabi", "ਪੰਜਾਬੀ"], ["Mukta Mahee", "Punjabi", "ਪੰਜਾਬੀ"], ["Anek Gurmukhi", "Punjabi", "ਪੰਜਾਬੀ"], ["Tiro Gurmukhi", "Punjabi", "ਪੰਜਾਬੀ"], ["Noto Sans Oriya", "Odia", "ଓଡ଼ିଆ"], ["Baloo Bhaina 2", "Odia", "ଓଡ଼ିଆ"], ["Anek Odia", "Odia", "ଓଡ଼ିଆ"], ["Noto Nastaliq Urdu", "Urdu / Arabic", "اردو"], ["Cairo", "Urdu / Arabic", "اردو"], ["Tajawal", "Urdu / Arabic", "اردو"], ["Amiri", "Urdu / Arabic", "اردو"], ["Lalezar", "Urdu / Arabic", "اردو"], ["Reem Kufi", "Urdu / Arabic", "اردو"], ["Noto Naskh Arabic", "Urdu / Arabic", "اردو"]];
const FONT_GROUPS = ["Sans", "Display", "Serif", "Script", "Handwriting", "Mono", "Kannada", "Hindi / Marathi", "Tamil", "Telugu", "Malayalam", "Bengali", "Gujarati", "Punjabi", "Odia", "Urdu / Arabic"];
const FONTS = FONT_LIB.map(([f,g]) => [f, f]);
const TEXT_PRESETS = [
  {color:'#ffffff',strokeW:0,bgOn:false,shadow:30,shadowColor:'#000000'},
  {color:'#ffffff',stroke:'#000000',strokeW:6,bgOn:false,shadow:0},
  {color:'#ffe600',stroke:'#000000',strokeW:7,bgOn:false,shadow:0},
  {color:'#000000',strokeW:0,bgOn:true,bgColor:'#ffffff',bgAlpha:100,shadow:0},
  {color:'#ffffff',strokeW:0,bgOn:true,bgColor:'#e53935',bgAlpha:100,shadow:0},
  {color:'#ffffff',strokeW:0,bgOn:true,bgColor:'#000000',bgAlpha:60,shadow:0},
  {color:'#ffffff',strokeW:0,bgOn:false,shadow:80,shadowColor:'#1fd1d1'},
  {color:'#ff4fa3',stroke:'#ffffff',strokeW:6,bgOn:false,shadow:0}
];
const SWATCHES = ['#ffffff','#000000','#ffe600','#ff3b30','#ff9500','#34c759','#1fd1d1','#007aff','#af52de','#ff4fa3'];
const EMOJIS = '❤️ 😂 😍 🔥 👍 🎉 ✨ ⭐ 💯 😎 🥳 😢 😡 🤔 👏 🙏 💪 🎂 🎁 🌸 🌹 ☀️ 🌙 ⚡ 💥 💫 🎵 🎶 📍 ✅ ❌ ⚠️ 👉 👈 👆 👇 😮 🤩 😇 🥰 😜 🙌 💖 💔 🏆 🎓 📚 🪔'.split(' ');
const OV_IN = [['none','None'],['fade','Fade'],['pop','Pop'],['zoom','Zoom'],['slideUp','Slide Up'],['slideDown','Slide Down'],['slideL','Slide Left'],['slideR','Slide Right'],['typewriter','Typewriter'],['bounce','Bounce'],['spin','Spin'],['blur','Blur'],['letterPop','Letter Pop'],['letterFade','Letter Fade'],['letterBounce','Letter Bounce'],['wordPop','Word Pop'],['flipX','Flip X'],['flipY','Flip Y'],['dropIn','Drop'],['riseUp','Rise Up'],['rotateIn','Rotate In'],['growIn','Grow'],['shrinkIn','Shrink'],['glitchIn','Glitch'],['swingIn','Swing'],['tiltIn','Tilt'],['wipeIn','Wipe'],['flashIn','Flash']];
const OV_OUT = OV_IN.filter(x => x[0] !== 'bounce' && x[0] !== 'pop');
const OV_LOOP = [['none','None'],['pulse','Pulse'],['shake','Shake'],['float','Float'],['swing','Swing'],['blink','Blink'],['heartbeat','Heartbeat'],['rotate','Rotate'],['wave','Wave'],['jelly','Jelly'],['rock','Rock'],['bounceLoop','Bounce'],['zoomInOut','Zoom In-Out'],['glitchLoop','Glitch'],['rainbow','Rainbow']];
const MASKS = [['none','None'],['linear','Linear'],['mirror','Mirror'],['circle','Circle'],['rect','Rectangle'],['heart','❤ Heart'],['star','★ Star']];
const MASK_T = {none:0,linear:1,mirror:2,circle:3,rect:4,heart:5,star:6};
const BLENDS = [['source-over','Normal'],['multiply','Multiply'],['screen','Screen'],['overlay','Overlay'],['darken','Darken'],['lighten','Lighten'],['color-dodge','Color Dodge'],['color-burn','Color Burn'],['hard-light','Hard Light'],['soft-light','Soft Light'],['difference','Difference'],['exclusion','Exclusion'],['hue','Hue'],['saturation','Saturation'],['color','Color'],['luminosity','Luminosity']];
const FX = [['none','None'],['rgbsplit','RGB Split'],['glitch','Glitch'],['vhs','VHS'],['oldfilm','Old Film'],['shake','Shake'],['zoompulse','Zoom Pulse'],['flash','Flash'],['rainbow','Rainbow'],['pixelate','Pixelate'],['blur','Blur'],['mirror','Mirror'],['kaleido','4-Split'],['invert','Invert'],
  ['blackflash','Black Flash'],['vertigo','Vertigo'],['split3','3 Split'],['split9','9 Split'],['rollshutter','Rolling Shutter'],['zoomlens','Zoom Lens'],['tiltshift','Tilt Shift'],['lightsweep','Light Sweep'],['prism','Prism'],['bokeh','Bokeh'],['snow','Snow'],['rain','Rain'],['sparkle','Sparkle'],['filmframe','Film Frame'],['neonglow','Neon Glow'],['sepiaburn','Sepia Burn'],['strobecolor','Color Strobe'],['lensflare','Lens Flare'],['colorpop','Red Pop'],['infrared','Infrared'],['heartbeat','Heartbeat'],['cambounce','Camera Bounce'],['shake2','Hard Shake'],
  ['fisheye','Fisheye'],['wave','Wave'],['swirl','Swirl'],['edgeneon','Neon Edges'],['posterize','Posterize'],['duotone','Duotone'],['thermal','Thermal'],['nightvision','Night Vision'],['crt','CRT TV'],['mirrorv','Mirror V'],['letterbox','Cinema Bars'],['lightleak','Light Leak'],['chroma','Lens Aberration'],['glow','Dreamy Glow']];
const FX_CATS = [['Trending',['glitch','lightleak','blackflash','lightsweep','shake','zoompulse','bokeh','sparkle','prism','vertigo','rgbsplit','filmframe','heartbeat']],
  ['Cinematic',['letterbox','filmframe','lensflare','lightleak','tiltshift','sepiaburn','glow','oldfilm','lightsweep','blackflash']],
  ['Party',['strobecolor','rainbow','sparkle','bokeh','neonglow','edgeneon','flash','heartbeat','cambounce']],
  ['Light',['flash','lightsweep','lensflare','glow','bokeh','lightleak','blackflash','neonglow']],
  ['Retro',['vhs','oldfilm','crt','posterize','duotone','sepiaburn','filmframe']],
  ['Glitch',['glitch','rgbsplit','rollshutter','chroma','prism','pixelate','strobecolor']],
  ['Lens',['fisheye','zoomlens','tiltshift','blur','vertigo','wave','swirl']],
  ['Motion',['shake','shake2','zoompulse','heartbeat','cambounce','vertigo']],
  ['Split',['split3','split9','mirror','mirrorv','kaleido']],
  ['Weather',['snow','rain','sparkle','bokeh']],
  ['Color',['colorpop','infrared','thermal','nightvision','invert','duotone','posterize','rainbow']]];
const BFX = [['none','None'],['portraitBlur','Portrait Blur'],['colorPop','Color Pop'],['spotlight','Spotlight'],['bodyGlow','Body Glow'],['neonOutline','Neon Outline'],['bgTint','Color Background'],['ghost','Ghost Echo']];
const BFX_T = {none:0,portraitBlur:1,colorPop:2,spotlight:3,bodyGlow:4,neonOutline:5,bgTint:6,ghost:7};
const FX_T = {none:0,rgbsplit:1,glitch:2,vhs:3,pixelate:4,mirror:5,kaleido:6,invert:7,blur:8,oldfilm:9,shake:10,zoompulse:11,flash:12,bright:13,rainbow:14,
  fisheye:16,wave:17,swirl:18,edgeneon:19,posterize:20,duotone:21,thermal:22,nightvision:23,crt:24,mirrorv:25,letterbox:26,lightleak:27,chroma:28,glow:29,
  blackflash:30,vertigo:31,split3:32,split9:33,rollshutter:34,zoomlens:35,tiltshift:36,lightsweep:37,prism:38,bokeh:39,snow:40,rain:41,sparkle:42,filmframe:43,neonglow:44,sepiaburn:45,strobecolor:46,lensflare:47,colorpop:48,infrared:49,heartbeat:0,cambounce:0,shake2:0};
const CAP_LANGS = [['kannada','Kannada · ಕನ್ನಡ'],['english','English'],['hindi','हिन्दी'],['tamil','தமிழ்'],['telugu','తెలుగు'],['marathi','मराठी'],['malayalam','മലയാളം']];
const SR_LANGS = [['kn-IN','Kannada · ಕನ್ನಡ'],['en-IN','English (India)'],['hi-IN','हिन्दी'],['ta-IN','தமிழ்'],['te-IN','తెలుగు'],['mr-IN','मराठी'],['ml-IN','മലയാളം']];

/* ================= KEYFRAMES ================= */
const KF_CLIP = ['tf.scale','tf.x','tf.y','tf.rot','opacity'];
const KF_OV = ['x','y','size','rot','opacity'];
const KF_EPS = 1/30;
const EASE = {
  smooth: f => f<.5 ? 2*f*f : 1-Math.pow(-2*f+2,2)/2,
  linear: f => f,
  easeIn: f => f*f*f,
  easeOut: f => 1-Math.pow(1-f,3),
  strong: f => f<.5 ? 16*Math.pow(f,5) : 1-Math.pow(-2*f+2,5)/2,
  back: f => 1+2.70158*Math.pow(f-1,3)+1.70158*Math.pow(f-1,2),
  bounce: f => { const n=7.5625,d=2.75; if(f<1/d) return n*f*f; if(f<2/d) return n*(f-=1.5/d)*f+.75; if(f<2.5/d) return n*(f-=2.25/d)*f+.9375; return n*(f-=2.625/d)*f+.984375; },
  elastic: f => f<=0?0:f>=1?1:Math.pow(2,-10*f)*Math.sin((f*10-.75)*2.0944)+1,
  hold: f => f < 1 ? 0 : 1
};
const EASE_LIST = [['smooth','Smooth'],['linear','Linear'],['easeIn','Ease in'],['easeOut','Ease out'],['strong','Strong'],['back','Overshoot'],['bounce','Bounce'],['elastic','Elastic'],['hold','Hold']];
const kfList = it => it.type === 'audio' ? [] : it.type ? KF_OV : KF_CLIP;
function kfTime(it){ if(it.type) return S.time - it.start; const d = derived[it.id]; return d ? localToSrc(it, S.time - d.start) : 0; }
function ev(it,path,t){
  const kf = it.kf;
  if(!kf || !kf.length || !kfList(it).includes(path)) return getP(it,path);
  if(t === undefined) t = kfTime(it);
  if(t <= kf[0].t) return kf[0].v[path];
  const last = kf[kf.length-1]; if(t >= last.t) return last.v[path];
  for(let i=0;i<kf.length-1;i++) if(t < kf[i+1].t){
    const a=kf[i], b=kf[i+1], f=(t-a.t)/(b.t-a.t), e=(EASE[a.ease]||EASE.smooth)(f);
    return a.v[path] + (b.v[path]-a.v[path])*e;
  }
  return last.v[path];
}
function atKf(it){ if(!it || !it.kf || !it.kf.length) return null; const t = kfTime(it); return it.kf.find(k => Math.abs(k.t-t) < KF_EPS) || null; }
function setVal(it,path,v){
  if(it.kf && it.kf.length && kfList(it).includes(path)){
    let k = atKf(it);
    if(!k){ const t = kfTime(it); k = {t, v:{}}; for(const p of kfList(it)) k.v[p] = ev(it,p,t); it.kf.push(k); it.kf.sort((a,b)=>a.t-b.t); kfFlash = performance.now(); if(typeof renderTimeline === 'function') setTimeout(renderTimeline, 0); }
    k.v[path] = v;
  } else setP(it,path,v);
}
function inRange(it){ if(it.type) return S.time >= it.start && S.time <= it.start+it.dur; const d=derived[it.id]; return S.time >= d.start && S.time <= d.start+d.dur; }
function toggleKf(){
  const it = selItem(); if(!it) return alert('Select a clip, photo or text on the timeline first, then press ◆');
  if(!kfList(it).length) return alert('Keyframes work on video, photo, text and sticker items');
  if(!inRange(it)) return alert('Move the playhead inside this item, then press ◆');
  pushUndo(); it.kf = it.kf || [];
  const k = atKf(it);
  if(k){
    if(it.kf.length === 1) for(const p of kfList(it)) setP(it,p,k.v[p]);
    it.kf.splice(it.kf.indexOf(k),1);
  } else {
    const t = kfTime(it), v = {}; for(const p of kfList(it)) v[p] = ev(it,p,t);
    it.kf.push({t,v}); it.kf.sort((a,b)=>a.t-b.t); kfFlash = performance.now();
  }
  renderTimeline(); renderInspector(); render(performance.now());
}
function jumpKf(dir){
  const it = selItem(); if(!it || !it.kf || !it.kf.length) return; const t = kfTime(it);
  const k = dir > 0 ? it.kf.find(k => k.t > t+KF_EPS) : [...it.kf].reverse().find(k => k.t < t-KF_EPS);
  if(!k) return;
  seek(it.type ? it.start + k.t : derived[it.id].start + srcToLocal(it, k.t));
  renderInspector();
}

/* ================= TIMELINE MATH ================= */
const N = 100;
function curveAt(c,p){
  if(!c.curve || !c.curve.length) return 1; const a=c.curve; p=clamp(p,0,1);
  if(typeof a[0]==='number'){ const n=a.length-1, x=p*n, i=Math.min(Math.floor(x),n-1), f=x-i; return a[i]+(a[i+1]-a[i])*f; }
  if(p<=a[0][0]) return a[0][1];
  for(let i=0;i<a.length-1;i++) if(p<=a[i+1][0]){ const f=(p-a[i][0])/Math.max(1e-6,a[i+1][0]-a[i][0]), e=f*f*(3-2*f); return Math.pow(2, Math.log2(a[i][1])*(1-e)+Math.log2(a[i+1][1])*e); }
  return a[a.length-1][1];
}
const curvePairs = arr => arr.map((v,i)=>[i/(arr.length-1), v]);
function rateAt(c,p){ return clamp(c.speed*curveAt(c,p), 0.1, 10); }
/* ---- tracks: every overlay / audio item lives on a fixed track (like pro editors). Higher track = drawn on top ---- */
const EPS_T = .04;
const overlapT = (a,b) => a.start < b.start + b.dur - EPS_T && b.start < a.start + a.dur - EPS_T;
function normTracks(){
  for(const arr of [S.overlays, S.audios]){
    const placed = [];
    const fresh = arr.filter(x => x.track == null || x.track < 0);
    const order = arr.filter(x => !(x.track == null || x.track < 0)).sort((a,b) => (a.track - b.track) || ((a._pri?1:0) - (b._pri?1:0)) || (a.start - b.start));
    const put = it => { let t = Math.max(0, it.track|0); while(placed.some(p => p.track === t && overlapT(p,it))) t++; it.track = t; placed.push(it); };
    order.forEach(put);
    fresh.forEach(it => { it.track = 0; put(it); });
    const used = [...new Set(arr.map(x => x.track))].sort((a,b)=>a-b), map = {};   // remove empty tracks
    used.forEach((t,i) => map[t] = i); arr.forEach(x => { x.track = map[x.track]; delete x._pri; });
  }
}
const zOrder = () => S.overlays.map((o,i) => [o,i]).sort((a,b) => (a[0].track - b[0].track) || (a[1] - b[1])).map(x => x[0]);
const trkState = (kind, t) => ((S.trk = S.trk || {ov:{},au:{}})[kind][t] = S.trk[kind][t] || {});
function layout(){
  normTracks();
  let t = 0, prev = null;
  for(const c of S.clips){
    const len = Math.max(0.05, c.out - c.in), cum = new Float64Array(N+1);
    for(let i=0;i<N;i++) cum[i+1] = cum[i] + len/N/rateAt(c,(i+.5)/N);
    let td = 0;
    if(prev && c.trans && c.trans.type !== 'none') td = Math.min(c.trans.dur, derived[prev.id].dur*.45, cum[N]*.45);
    const start = t - td;
    derived[c.id] = {start, dur:cum[N], cum, len, td};
    t = start + cum[N]; prev = c;
  }
  S.mainEnd = t;
  // the project ends where the video ends (main track + overlays/text). Music longer than the video is cut there.
  // Only an audio-only project uses the audio length.
  const vEnd = Math.max(t, 0, ...S.overlays.map(o => o.start + o.dur));
  S.allEnd = Math.max(vEnd, ...S.audios.map(a => a.start + a.dur));
  S.total = vEnd > 0 ? vEnd : S.allEnd;
}
function srcToLocal(c,src){ const d=derived[c.id]; const p=clamp((src-c.in)/d.len,0,1)*N; const i=Math.min(Math.floor(p),N-1); return d.cum[i]+(d.cum[i+1]-d.cum[i])*(p-i); }
function localToSrc(c,lt){
  const d=derived[c.id], cum=d.cum; lt=clamp(lt,0,cum[N]);
  let lo=0, hi=N; while(hi-lo>1){ const m=(lo+hi)>>1; if(cum[m]<=lt) lo=m; else hi=m; }
  const sg=cum[lo+1]-cum[lo], f=sg>0?(lt-cum[lo])/sg:0;
  return c.in+(lo+f)/N*d.len;
}
function clipAt(t){
  for(const c of S.clips){ const d=derived[c.id]; if(t < d.start+d.dur) return c; }
  const last = S.clips[S.clips.length-1];
  return last && t <= S.mainEnd + 1e-6 ? last : null;
}
function currentPair(){
  const a = active; if(!a || !derived[a.id]) return null;
  const b = S.clips[S.clips.indexOf(a)+1];
  if(b && b.trans && b.trans.type !== 'none'){
    const db = derived[b.id];
    if(db && db.td > 0 && S.time >= db.start) return {a, b, p:clamp((S.time-db.start)/db.td,0,1)};
  }
  return {a};
}

/* ================= MEDIA ELEMENTS ================= */
const POOL = (() => { const d=document.createElement('div'); d.id='mediaPool'; d.style.cssText='position:fixed;left:0;top:0;width:4px;height:4px;overflow:hidden;opacity:.01;pointer-events:none;z-index:-1'; (document.body||document.documentElement).appendChild(d); return d; })();
function mkVideo(url){ const v=document.createElement('video'); v.preload='auto'; v.playsInline=true; v.setAttribute('playsinline',''); v.style.cssText='width:4px;height:4px'; POOL.appendChild(v); if(url) v.src=url;
  // count the frames the browser really presents → the GPU only re-uploads a picture when there is a new one
  v._fn = 0; if(v.requestVideoFrameCallback){ const f = () => { v._fn++; if(v.isConnected) v.requestVideoFrameCallback(f); }; v.requestVideoFrameCallback(f); }
  return v; }
function dropEl(v){ try{ v.pause(); v.removeAttribute('src'); v.load(); v.remove(); }catch(e){} }
function getVid(c){
  let v = vids[c.id];
  if(!v){ v = mkVideo(media(c.mediaId).url); v.currentTime = c.in; vids[c.id] = v; }
  return v;
}
function ovVid(o){
  let v = ovVids[o.id];
  if(!v){ v = mkVideo(media(o.mediaId).url); v.currentTime = o.in; ovVids[o.id] = v; }
  return v;
}
function audEl(a){
  let el = audEls[a.id];
  if(el && el.dataset.mid !== a.mediaId){ dropEl(el); delete audEls[a.id]; if(audChains[a.id]){ killChain(audChains[a.id]); delete audChains[a.id]; } el = null; }
  if(!el){ el = new Audio(); el.preload = 'auto'; el.dataset.mid = a.mediaId; const m = media(a.mediaId); if(m && m.url) el.src = m.url; audEls[a.id] = el; }
  return el;
}

/* ================= AUDIO ENGINE ================= */
let AC=null, master, spk, recDest, impulse=null;
const srcNodes = new WeakMap();
const chains = new Map();
function initAudio(){
  if(AC) return;
  AC = new (window.AudioContext||window.webkitAudioContext)();
  master = AC.createGain(); spk = AC.createGain();
  master.connect(spk); spk.connect(AC.destination);
  recDest = AC.createMediaStreamDestination(); master.connect(recDest);
  if(AC.audioWorklet){
    AC.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET_SRC],{type:'application/javascript'})))
      .then(() => { WK = true; rebuildAllAudio(); }).catch(e => console.warn('worklet', e));
  }
}
let WK = false;
const WORKLET_SRC = `
class Pitch extends AudioWorkletProcessor{
  static get parameterDescriptors(){ return [{name:'semi',defaultValue:0,minValue:-24,maxValue:24}]; }
  constructor(){ super(); this.N=8192; this.b=[new Float32Array(this.N),new Float32Array(this.N)]; this.w=0; this.d=0; }
  process(ins,outs,p){
    const i=ins[0], o=outs[0]; if(!i||!i.length) return true;
    const r=Math.pow(2,p.semi[0]/12), W=Math.round(sampleRate*.05), N=this.N, n=i[0].length;
    for(let k=0;k<n;k++){
      for(let c=0;c<2;c++) this.b[c][this.w]=(i[c]||i[0])[k];
      this.d-=(r-1); while(this.d<0) this.d+=W; while(this.d>=W) this.d-=W;
      const d1=this.d, d2=(this.d+W/2)%W, g1=Math.pow(Math.sin(Math.PI*d1/W),2), g2=1-g1;
      for(let c=0;c<o.length;c++){
        const B=this.b[c%2], rd=d=>{ const pos=this.w-d-1+N*2, a=Math.floor(pos), f=pos-a; return B[a%N]*(1-f)+B[(a+1)%N]*f; };
        o[c][k]=rd(d1)*g1+rd(d2)*g2;
      }
      this.w=(this.w+1)%N;
    }
    return true;
  }
}
class Gate extends AudioWorkletProcessor{
  static get parameterDescriptors(){ return [{name:'thr',defaultValue:-45}]; }
  constructor(){ super(); this.env=0; this.g=0; this.hold=0; }
  process(ins,outs,p){
    const i=ins[0], o=outs[0]; if(!i||!i.length) return true;
    const thr=Math.pow(10,p.thr[0]/20), n=i[0].length, sr=sampleRate;
    const aE=Math.exp(-1/(sr*.004)), rE=Math.exp(-1/(sr*.06)), aG=Math.exp(-1/(sr*.003)), rG=Math.exp(-1/(sr*.15));
    for(let k=0;k<n;k++){
      let m=0; for(let c=0;c<i.length;c++) m=Math.max(m,Math.abs(i[c][k]));
      this.env = m>this.env ? aE*this.env+(1-aE)*m : rE*this.env+(1-rE)*m;
      let t; if(this.env>thr){ t=1; this.hold=sr*.08; } else if(this.hold>0){ this.hold--; t=1; } else t=.02;
      this.g = t>this.g ? aG*this.g+(1-aG)*t : rG*this.g+(1-rG)*t;
      for(let c=0;c<o.length;c++) o[c][k]=(i[c]||i[0])[k]*this.g;
    }
    return true;
  }
}
registerProcessor('cc-pitch',Pitch); registerProcessor('cc-gate',Gate);`;
function rebuildAllAudio(){ if(!AC) return; dropAllChains(); dropAudChains(); pairKey=''; syncAudio(); S.audios.forEach(audChain); }
function nodeFor(el){ let n=srcNodes.get(el); if(!n){ n=AC.createMediaElementSource(el); srcNodes.set(el,n); } return n; }
function shaperCurve(k){ const n=1024, a=new Float32Array(n); for(let i=0;i<n;i++){ const x=i*2/n-1; a[i]=(1+k)*x/(1+k*Math.abs(x)); } return a; }
const IMPULSES = {};
const REVERBS = [['room','Room'],['hall','Hall'],['church','Church'],['plate','Plate'],['stadium','Stadium']];
function getImpulse(kind){
  kind = kind || 'hall'; if(IMPULSES[kind]) return IMPULSES[kind];
  const cfg = {room:[.7,4,.012,.55], hall:[2.2,3,.025,.4], church:[4.2,2.4,.04,.3], plate:[1.6,3.5,.002,.7], stadium:[3.2,2,.09,.25]}[kind] || [2.2,3,.025,.4];
  const [sec,decay,pre,bright] = cfg, sr = AC.sampleRate, len = Math.floor(sr*sec), b = AC.createBuffer(2,len,sr), p0 = Math.floor(pre*sr);
  for(let ch=0;ch<2;ch++){
    const d = b.getChannelData(ch); let lp = 0;
    for(let i=p0;i<len;i++){
      const t = (i-p0)/(len-p0), env = Math.pow(1-t, decay), k = bright*(1-t*.8);   // highs die faster (damping)
      lp += (Math.random()*2-1 - lp)*k; d[i] = lp*env;
    }
    for(let e=0;e<6;e++){ const at = p0 + Math.floor(sr*(.008+Math.random()*.05)); if(at<len) d[at] += (Math.random()<.5?-1:1)*(.5-e*.06); }   // early reflections
  }
  let mx = 0; for(let ch=0;ch<2;ch++){ const d=b.getChannelData(ch); for(let i=0;i<len;i++) mx=Math.max(mx,Math.abs(d[i])); }
  for(let ch=0;ch<2;ch++){ const d=b.getChannelData(ch); for(let i=0;i<len;i++) d[i]/=mx*2.2; }
  return IMPULSES[kind] = b;
}
function buildChain(c){
  const a = normItem(c).audio, nodes=[], input=AC.createGain(); let cur=input;
  const link = n => { cur.connect(n); cur=n; nodes.push(n); return n; };
  const filt = (type,f,q,g) => { const n=AC.createBiquadFilter(); n.type=type; n.frequency.value=f; if(q!=null) n.Q.value=q; if(g!=null) n.gain.value=g; return n; };
  const shaper = k => { const s=AC.createWaveShaper(); s.curve=shaperCurve(k); s.oversample='4x'; return s; };
  const gain = v => { const g=AC.createGain(); g.gain.value=v; return g; };
  const comp = (thr,ratio,att,rel,knee) => { const cp=AC.createDynamicsCompressor(); cp.threshold.value=thr; cp.ratio.value=ratio; cp.attack.value=att; cp.release.value=rel; cp.knee.value=knee; return cp; };
  const lfo = (freq,depth,target) => { const o=AC.createOscillator(), g=gain(depth); o.frequency.value=freq; o.connect(g); g.connect(target); o.start(); nodes.push(o,g); };
  const wk = (name,params) => { if(!WK) return null; try{ return new AudioWorkletNode(AC,name,{numberOfInputs:1,numberOfOutputs:1,outputChannelCount:[2],parameterData:params}); }catch(e){ return null; } };
  // 1. clean-up
  if(a.hp > 0) link(filt('highpass',a.hp,.707));
  if(a.lp > 0) link(filt('lowpass',a.lp,.707));
  if(a.gate){ const g=wk('cc-gate',{thr:a.gateThr}); if(g) link(g); }
  if(a.isolate){ link(filt('highpass',120,.7)); link(filt('lowpass',7500,.7)); link(filt('peaking',250,1,-3)); link(filt('peaking',2800,.9,2.5)); }
  if(a.enhance){ link(filt('highpass',80,.7)); link(filt('peaking',250,1,-2.5)); link(filt('peaking',3000,1,3)); link(filt('highshelf',10000,null,2));
    link(comp(-24,3,.006,.18,10)); link(gain(1.35)); }
  // 2. tone: bass / treble + 10-band graphic EQ
  if(a.bass) link(filt('lowshelf',180,null,a.bass));
  if(a.treble) link(filt('highshelf',4000,null,a.treble));
  a.eq.forEach((g,i) => { if(g) link(filt(i===0?'lowshelf':i===9?'highshelf':'peaking',EQ_F[i],1.1,g)); });
  // 3. voice presets (smooth — no harsh distortion)
  switch(a.voice){
    case 'michog':   // close-mic broadcast sound: warm low end, clear presence, glued by compression
      link(filt('highpass',90,.7)); link(filt('lowshelf',160,null,4)); link(filt('peaking',350,1,-2.5)); link(filt('peaking',3200,.8,3.5)); link(filt('highshelf',9000,null,1.5));
      link(comp(-26,4,.004,.2,12)); link(gain(1.5)); break;
    case 'megaphone':link(filt('highpass',500,.9)); link(filt('lowpass',3500,.9)); link(filt('peaking',1800,1.2,5)); link(shaper(6)); link(gain(.75)); break;
    case 'telephone':link(filt('highpass',350,.9)); link(filt('lowpass',3400,.9)); link(filt('peaking',1500,1,4)); break;
    case 'robot':   { const g=gain(0); lfo(55,1,g.gain); link(g); link(gain(1.6)); break; }
    case 'lofi':     link(filt('lowpass',3200,.6)); link(filt('highpass',120,.7)); link(shaper(2.5)); break;
    case 'deep':     { const p=wk('cc-pitch',{semi:-4}); if(p) link(p); link(filt('lowshelf',150,null,4)); break; }
    case 'chipmunk': { const p=wk('cc-pitch',{semi:7}); if(p) link(p); break; }
    case 'monster':  { const p=wk('cc-pitch',{semi:-9}); if(p) link(p); link(filt('lowshelf',120,null,5)); link(shaper(3)); break; }
    case 'radio':    link(filt('highpass',450,.9)); link(filt('lowpass',5000,.9)); link(filt('peaking',1500,1,4)); link(comp(-20,6,.003,.1,6)); link(gain(1.3)); break;
    case 'studio':   link(filt('highpass',75,.7)); link(filt('peaking',200,1,1.5)); link(filt('peaking',450,1.2,-3)); link(filt('peaking',5000,.8,2.5)); link(filt('highshelf',12000,null,2.5)); link(comp(-22,3,.005,.2,10)); link(gain(1.3)); break;
    case 'podcast':  link(filt('highpass',100,.7)); link(filt('lowshelf',140,null,3)); link(filt('peaking',300,1,-3)); link(filt('peaking',2500,1,2)); link(comp(-28,5,.003,.25,8)); link(gain(1.7)); break;
    case 'cave': case 'underwater': if(a.voice==='underwater'){ link(filt('lowpass',600,1.5)); { const g=gain(1); lfo(.7,.25,g.gain); link(g); } } break;
  }
  if(a.pitch){ const p=wk('cc-pitch',{semi:a.pitch}); if(p) link(p); }
  // 4. distortion
  if(a.dist > 0){ link(shaper(a.dist/100*30+1)); link(filt('lowpass',7000 - a.dist*40,.7)); link(gain(1/(1+a.dist/100*1.2))); }
  // 5. modulation
  if(a.phaser > 0){
    const sum = gain(1), dry = gain(1 - a.phaser/250); cur.connect(dry); dry.connect(sum);
    let p = cur; for(let k=0;k<4;k++){ const ap=filt('allpass',800+k*400,.6); p.connect(ap); p=ap; nodes.push(ap); lfo(.4,500+k*150,ap.frequency); }
    const wet = gain(a.phaser/150); p.connect(wet); wet.connect(sum); nodes.push(sum,dry,wet); cur = sum;
  }
  if(a.wah > 0){
    const sum = gain(1), dry = gain(1 - a.wah/160), bp = filt('bandpass',1000,3.5), wet = gain(a.wah/45);
    cur.connect(dry); dry.connect(sum); cur.connect(bp); bp.connect(wet); wet.connect(sum); lfo(1.8,700,bp.frequency); nodes.push(sum,dry,bp,wet); cur = sum;
  }
  if(a.trem > 0){ const g = gain(1 - a.trem/200); lfo(5.5, a.trem/200, g.gain); link(g); }
  if(a.vibrato > 0){ const d = AC.createDelay(.05); d.delayTime.value = .006; lfo(5.5, .0035*a.vibrato/100, d.delayTime); link(d); }
  if(a.chorus > 0){
    const sum = gain(1), dry = gain(1 - a.chorus/300); cur.connect(dry); dry.connect(sum); nodes.push(sum,dry);
    [[.017,.7],[.025,1.1],[.031,.45]].forEach(([dt,f]) => { const d = AC.createDelay(.1), w = gain(a.chorus/100*.45); d.delayTime.value = dt; lfo(f, .004, d.delayTime); cur.connect(d); d.connect(w); w.connect(sum); nodes.push(d,w); });
    cur = sum;
  }
  if(a.ring > 0){ const sum = gain(1), dry = gain(.35), rg = gain(0); lfo(a.ring, 1, rg.gain); cur.connect(dry); cur.connect(rg); dry.connect(sum); rg.connect(sum); nodes.push(sum,dry,rg); cur = sum; }
  if(a.crush > 0){ const sh = AC.createWaveShaper(), n = 2048, c2 = new Float32Array(n), steps = Math.pow(2, 12 - a.crush/100*9); for(let i=0;i<n;i++){ const x = i*2/n - 1; c2[i] = Math.round(x*steps)/steps; } sh.curve = c2; link(sh); link(filt('lowpass', 9000 - a.crush*55, .7)); }
  // 6. dynamics
  if(a.comp){ link(comp(a.compThr, a.compRatio, .005, .2, 6)); link(gain(Math.pow(10, Math.min(12, -a.compThr*(1-1/a.compRatio)*.5)/20))); }
  if(a.amp) link(gain(Math.pow(10, a.amp/20)));
  // 7. time effects (parallel wet paths)
  const vol=gain(1); nodes.push(vol);
  const dry=gain(1); cur.connect(dry); dry.connect(vol); nodes.push(dry);
  if(a.voice === 'cave' || a.voice === 'underwater'){ const cv=AC.createConvolver(); cv.buffer=getImpulse(a.voice==='cave'?'church':'room'); const w=gain(a.voice==='cave'?.9:.5); cur.connect(cv); cv.connect(w); w.connect(vol); nodes.push(cv,w); }
  if(a.echo>0){
    const d=AC.createDelay(3); d.delayTime.value=clamp(a.echoTime,.05,2.5);
    const fb=gain(Math.min(.85,a.echoFb/100)), damp=filt('lowpass',4500,.7), wet=gain(a.echo/100*.7);
    cur.connect(d); d.connect(damp); damp.connect(fb); fb.connect(d); damp.connect(wet); wet.connect(vol); nodes.push(d,fb,damp,wet);
  }
  if(a.reverb>0){
    const cv=AC.createConvolver(); cv.buffer=getImpulse(a.reverbSize); const wet=gain(a.reverb/100*1.1);
    dry.gain.value = 1 - a.reverb/100*.35;
    cur.connect(cv); cv.connect(wet); wet.connect(vol); nodes.push(cv,wet);
  }
  if(a.vinyl > 0){   // record crackle + hiss
    const len = AC.sampleRate*2, b = AC.createBuffer(1, len, AC.sampleRate), d = b.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = (Math.random()*2-1)*.015 + (Math.random() < .0007 ? (Math.random()*2-1)*.6 : 0);
    const src = AC.createBufferSource(); src.buffer = b; src.loop = true; const g = gain(a.vinyl/100*.5), lp = filt('lowpass', 6000, .7);
    src.connect(lp); lp.connect(g); g.connect(vol); src.start(); nodes.push(src, g, lp);
    const tone = filt('bandpass', 1800, .6); cur.connect(tone); const tw = gain(a.vinyl/100*.6); tone.connect(tw); tw.connect(vol); dry.gain.value *= 1 - a.vinyl/250; nodes.push(tone, tw);
  }
  let last = vol;
  if(a.pan8d > 0){ const pn = AC.createStereoPanner(); lfo(.12, a.pan8d/100, pn.pan); vol.connect(pn); last = pn; nodes.push(pn); }
  if(a.limiter){ const lm = comp(-1.5, 20, .001, .08, 0); last.connect(lm); lm.connect(master); nodes.push(lm); }
  else last.connect(master);
  return {input, vol, nodes};
}
function killChain(ch){
  try{ ch.src.disconnect(); }catch(e){}
  try{ ch.input.disconnect(); }catch(e){}
  ch.nodes.forEach(n => { try{ n.disconnect(); if(n.stop) n.stop(); }catch(e){} });
}
function dropChainFor(id){ const ch = chains.get(id); if(!ch) return; killChain(ch); chains.delete(id); }
function dropAllChains(){ [...chains.keys()].forEach(dropChainFor); }
function ensureChain(c){
  if(!AC || isImg(c)) return null;
  let ch = chains.get(c.id); if(ch) return ch;
  const sn = nodeFor(getVid(c)); try{ sn.disconnect(); }catch(e){}
  ch = buildChain(c); sn.connect(ch.input); ch.src = sn; chains.set(c.id, ch);
  return ch;
}
function rebuildChain(c){ if(chains.has(c.id)){ dropChainFor(c.id); ensureChain(c); } }
function syncAudio(){
  if(!AC) return;
  const pr = currentPair(), want = pr ? [pr.a, pr.b].filter(Boolean) : [];
  for(const id of [...chains.keys()]) if(!want.some(c => c.id === id)) dropChainFor(id);
  want.forEach(ensureChain);
}
function ensureOvAudio(o,v){
  if(!AC || ovAud[o.id]) return;
  const g = AC.createGain(); nodeFor(v).connect(g); g.connect(master); ovAud[o.id] = g;
}
function audChain(a){
  if(!AC) return null;
  let ch = audChains[a.id]; if(ch) return ch;
  const sn = nodeFor(audEl(a)); try{ sn.disconnect(); }catch(e){}
  ch = buildChain(a); sn.connect(ch.input); ch.src = sn; audChains[a.id] = ch;
  return ch;
}
function rebuildAudChain(a){ const ch = audChains[a.id]; if(!ch) return; killChain(ch); delete audChains[a.id]; audChain(a); }
function dropAudChains(){ for(const id in audChains){ killChain(audChains[id]); delete audChains[id]; } }

/* ================= PLAYBACK ================= */
// Browsers can only run a few video decoders smoothly. Many imported clips used to keep one decoder each,
// which made playback stutter. Now only the current clip and its neighbours keep a live video element.
function trimDecoders(c){
  if(!S.playing && !exporting && Object.keys(vids).length <= 6) return;   // scrubbing: keep decoders alive (re-creating one = black/stuck frame)
  const i = S.clips.indexOf(c), keep = new Set(S.clips.slice(Math.max(0, i-2), i+3).map(x => x.id));
  for(const k in vids) if(!keep.has(k)){ if(chains.has(k)) dropChainFor(k); dropEl(vids[k]); delete vids[k]; }
}
function activate(c,src){
  if(active !== c){
    for(const k in vids) if(k !== c.id) vids[k].pause();
    active = c; trimDecoders(c);
  }
  if(!isImg(c)){
    const v = getVid(c);
    if(Math.abs((v._pend ?? v.currentTime) - src) > (S.playing ? .2 : .04)){ if(S.playing) v.currentTime = src; else scrubTo(v, src); }
  }
  const nx = S.clips[S.clips.indexOf(c)+1];
  if(nx && !isImg(nx) && S.time < derived[nx.id].start){
    const nv = getVid(nx); if(nv.paused && Math.abs(nv.currentTime-nx.in) > .03) nv.currentTime = nx.in;
  }
}
// while scrubbing, never interrupt a running seek: remember the newest target and jump there when the
// current seek finishes — the picture keeps updating instead of blinking black
function scrubTo(v, t){
  const now = performance.now();
  // a seek normally finishes in a few ms; if the browser never reports it (stuck decoder), restart it so
  // the picture follows the playhead again instead of freezing
  if(!v.seeking || now - (v._seekT || 0) > 2500){ v._pend = null; v._seekT = now; v.currentTime = t; return; }
  v._pend = t;
  if(!v._hook){ v._hook = true; v.addEventListener('seeked', () => { const p = v._pend; if(p != null){ v._pend = null; if(Math.abs(v.currentTime - p) > .02){ v._seekT = performance.now(); v.currentTime = p; } } }); }
}
function deactivate(){ if(active && !isImg(active) && vids[active.id]) vids[active.id].pause(); active = null; }
function syncSecondary(){
  const pr = currentPair(); if(!pr || !pr.b || isImg(pr.b)) return;
  const b = pr.b, v = getVid(b), want = localToSrc(b, S.time - derived[b.id].start);
  if(S.playing){
    if(v.paused){ v.currentTime = want; v.play().catch(()=>{}); }
    else if(Math.abs(v.currentTime - want) > .3) v.currentTime = want;
    const r = Math.round(rateAt(b,(v.currentTime-b.in)/derived[b.id].len)*20)/20;
    if(v.playbackRate !== r) v.playbackRate = r;
  } else if(Math.abs(v.currentTime - want) > .04) scrubTo(v, want);
}
// keep a free-running media element (PiP video / audio item) in sync with the timeline
function syncEl(el,it,on){
  if(!on){ if(!el.paused) el.pause(); return; }
  const want = it.in + (S.time - it.start)*it.speed;
  if(S.playing && stalled){ if(!el.paused) el.pause(); if(Math.abs(el.currentTime - want) > .05) el.currentTime = want; return; }
  if(S.playing){
    if(el.playbackRate !== it.speed) el.playbackRate = it.speed;
    if(el.paused){ el.currentTime = want; el.play().catch(()=>{}); }
    else if(Math.abs(el.currentTime - want) > .3) el.currentTime = want;
  } else {
    if(!el.paused) el.pause();
    if(Math.abs((el._pend ?? el.currentTime) - want) > .04) scrubTo(el, want);
  }
}
function syncOvVideos(){
  for(const o of S.overlays){
    if(o.type !== 'video') continue;
    if((S.time < o.start - 4 || S.time > o.start + o.dur + 2) && !ovVids[o.id]) continue;
    const v = ovVid(o), on = S.time >= o.start && S.time < o.start + o.dur;
    if(AC) ensureOvAudio(o,v);
    const th = S.trk && S.trk.ov[o.track] && (S.trk.ov[o.track].hide || S.trk.ov[o.track].mute);
    if(ovAud[o.id]) ovAud[o.id].gain.value = on && !soloMain && !th ? o.volume/100 : 0;
    syncEl(v,o,on);
  }
  for(const id in ovVids) if(!S.overlays.some(o => o.id === id)){ ovVids[id].pause(); if(ovAud[id]) ovAud[id].gain.value = 0; }
  // free decoders of PiP videos that are far from the playhead
  for(const o of S.overlays){ if(o.type !== 'video' || !ovVids[o.id]) continue; if(S.time < o.start - 4 || S.time > o.start + o.dur + 2){ if(ovAud[o.id]){ try{ ovAud[o.id].disconnect(); }catch(e){} delete ovAud[o.id]; } dropEl(ovVids[o.id]); delete ovVids[o.id]; } }
}
function syncAudItems(){
  for(const a of S.audios){
    const el = audEl(a), on = S.time >= a.start && S.time < a.start + a.dur, ch = audChain(a);
    if(ch){
      const lt = S.time - a.start; let g = on && !soloMain ? a.volume/100*(a.audio.norm && a.normGain ? a.normGain : 1) : 0;
      if(a.fadeIn > 0) g *= clamp(lt/a.fadeIn, 0, 1);
      if(a.fadeOut > 0) g *= clamp((a.dur-lt)/a.fadeOut, 0, 1);
      if(S.trk && S.trk.au[a.track] && S.trk.au[a.track].mute) g = 0;
      ch.vol.gain.value = g;
    }
    syncEl(el,a,on);
  }
  for(const id in audEls) if(!S.audios.some(a => a.id === id)){ audEls[id].pause(); if(audChains[id]) audChains[id].vol.gain.value = 0; }
}
function seek(t){
  S.time = clamp(t, 0, S.total||0);
  const c = clipAt(S.time);
  if(c){
    activate(c, localToSrc(c, S.time - derived[c.id].start));
    syncSecondary();
    if(S.playing && !isImg(c)) getVid(c).play().catch(()=>{});
  } else deactivate();
  syncOvVideos(); syncAudItems(); syncAudio(); updatePH();
}
async function play(){
  if(!S.total) return;
  initAudio(); if(AC.state === 'suspended') await AC.resume();
  if(S.time >= S.total - .05) S.time = 0;
  S.playing = true; seek(S.time); updatePlayBtn();
}
function pause(){
  S.playing = false;
  for(const k in vids) vids[k].pause();
  for(const k in ovVids) ovVids[k].pause();
  for(const k in audEls) audEls[k].pause();
  updatePlayBtn();
}
function updatePlayBtn(){ const b=$('#btnPlay'); if(b) b.innerHTML = ic(S.playing ? 'pause' : 'play'); }

let lastNow = 0, pairKey = '', lastSyncT = -1, lastIdleKey = '', lastIdleDraw = 0, lastInteract = 0;
// plain mouse movement over the side panels must not keep the preview redrawing (that was a big source of lag)
['pointerdown','pointermove','keydown','input','wheel','change'].forEach(t => addEventListener(t, e => {
  if(t === 'pointermove' && !e.buttons && !(e.target && e.target.closest && e.target.closest('#stage'))) return;
  lastInteract = performance.now(); }, {capture:true, passive:true}));
// stall guard — when the playing video is still loading/decoding (start of play, clip change, big 4K files)
// the music and PiP videos wait for it, and an export pauses its recorder, so nothing freezes in the final file
let stalled = false, stallVT = -1, stallAdvT = 0, stallClip = null;
function checkStall(now){
  const c = active; let st = false;
  if(c && !isImg(c) && S.time < S.mainEnd - 1e-3){
    const v = vids[c.id];
    if(stallClip !== c){ stallClip = c; stallVT = -1; stallAdvT = now; }
    if(v){ if(v.currentTime !== stallVT){ stallVT = v.currentTime; stallAdvT = now; }
      st = v.seeking || v.readyState < 3 || (now - stallAdvT > 160); }
  }
  if(st !== stalled){ stalled = st;
    if(st){ for(const k in ovVids) ovVids[k].pause(); for(const k in audEls) audEls[k].pause(); }
    if(rec && exporting){ try{ if(st && rec.state === 'recording') rec.pause(); else if(!st && rec.state === 'paused') rec.resume(); }catch(e){} }
  }
  if(exporting && rec && rec.state === 'inactive' && !st && recArmed){ recArmed = false; rec.start(250); }
}
var recArmed = false;
var HEAVY = 0;
function tick(now){
  requestAnimationFrame(tick);
  const dt = Math.min(.1, (now - lastNow)/1000 || 0); lastNow = now;
  if(S.playing){
    if(!active && S.time < S.mainEnd - 1e-4){
      const c = clipAt(S.time);
      if(c){ activate(c, localToSrc(c, S.time - derived[c.id].start)); if(!isImg(c)) getVid(c).play().catch(()=>{}); }
    }
    const c = active;
    if(c && S.time < S.mainEnd - 1e-4){
      const d = derived[c.id], end = d.start + d.dur; let done = false;
      if(isImg(c)){ S.time += dt; done = S.time >= end; }
      else {
        const v = vids[c.id];
        if(v.currentTime >= c.out - .02 || v.ended) done = true;
        else {
          const r = Math.round(rateAt(c,(v.currentTime-c.in)/d.len)*20)/20;
          if(v.playbackRate !== r) v.playbackRate = r;
          S.time = d.start + srcToLocal(c, v.currentTime);
        }
      }
      if(done){
        const nx = S.clips[S.clips.indexOf(c)+1];
        if(nx){
          if(!isImg(c)) vids[c.id].pause();
          S.time = end; activate(nx, localToSrc(nx, S.time - derived[nx.id].start));
          if(!isImg(nx)) getVid(nx).play().catch(()=>{});
        } else S.time = end;
      }
    } else {
      S.time += dt;
      if(active && S.time > S.mainEnd + 1e-4) deactivate();
    }
    checkStall(now);
    if(exporting && expEnd != null && S.time >= expEnd - 1e-3 && expEnd < S.total - 1e-4){ S.time = expEnd; pause(); onPlaybackEnd(); }
    else if(S.time >= S.total - 1e-4){ S.time = S.total; pause(); onPlaybackEnd(); }
    else { syncSecondary(); syncOvVideos(); syncAudItems(); }
  }
  const pr = currentPair();
  const key = pr ? pr.a.id + '|' + (pr.b ? pr.b.id : '') : '';
  if(key !== pairKey){ pairKey = key; syncAudio(); }
  if(pr){
    for(const [c,role] of [[pr.a,'a'],[pr.b,'b']]){
      if(!c) continue; const ch = chains.get(c.id); if(!ch) continue;
      const d = derived[c.id], lt = S.time - d.start; let g = S.mainMute ? 0 : c.volume/100*(c.audio.norm && c.normGain ? c.normGain : 1);
      if(c.fadeIn > 0)  g *= clamp(lt/c.fadeIn, 0, 1);
      if(c.fadeOut > 0) g *= clamp((d.dur-lt)/c.fadeOut, 0, 1);
      if(pr.b) g *= role === 'a' ? 1 - pr.p : pr.p;
      ch.vol.gain.value = g;
    }
  }
  // when paused, only redraw the preview if something could have changed (time, an edit, or the user is interacting) —
  // the editor stays responsive instead of re-drawing the same picture 60 times a second
  const idleKey = S.time + '|' + S.sel + '|' + editVer + '|' + undoS.length + '|' + (active && vids[active.id] ? vids[active.id]._fn + ':' + vids[active.id].readyState : '') + '|' + out.width + 'x' + out.height;
  const busy = S.playing || exporting || idleKey !== lastIdleKey || now - lastInteract < 1500 || now - lastIdleDraw > 500;
  if(busy && !(HEAVY && !S.playing && !exporting)){ render(now); lastIdleKey = idleKey; if(!S.playing) lastIdleDraw = now; }
  updatePH();
  syncInsp();
  if(exporting && rec && rec.state === 'recording') $('#ovBar').style.width = (S.total ? S.time/(expEnd || S.total)*100 : 0) + '%';
  if(recState) $('#recTime') && ($('#recTime').textContent = fmtTC((performance.now()-recState.w0)/1000));
}

/* ================= WEBGL RENDERER ================= */
const out = $('#out'), octx = out.getContext('2d');
const cv = document.createElement('canvas'); cv.width = 720; cv.height = 1280;
const gl = cv.getContext('webgl', {alpha:true, premultipliedAlpha:true, preserveDrawingBuffer:true});
const VS = `attribute vec2 a;varying vec2 uv;uniform vec2 u_half,u_off,u_canvas;uniform float u_rot;
void main(){uv=vec2(a.x*.5+.5,.5-a.y*.5);vec2 p=a*u_half;float cs=cos(u_rot),sn=sin(u_rot);
p=vec2(p.x*cs-p.y*sn,p.x*sn+p.y*cs)+u_off;gl_Position=vec4(p/(u_canvas*.5),0.,1.);}`;
const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec2 uv;uniform sampler2D u_tex,u_lut,u_lut2;uniform vec2 u_px;uniform float u_lut2N,u_lut2Amt,u_ex,u_hl,u_shd,u_vib,u_hue,u_segAv,u_bfx,u_bfxA;uniform vec3 u_bcol;
uniform float u_lutN,u_lutAmt,u_alpha,u_time,u_b,u_c,u_s,u_t,u_ti,u_f,u_v,u_g,u_sh,u_blur;
uniform float u_mT,u_mRot,u_mF,u_mR,u_mInv,u_asp;uniform vec2 u_mC,u_mS;
uniform float u_ck,u_ckSim,u_ckSm,u_ckSp,u_ckY,u_ckSat;uniform vec3 u_ckC;
uniform float u_fx,u_fxA,u_sec;
uniform sampler2D u_seg;uniform float u_segOn,u_segInv,u_rtS,u_rtB,u_trT,u_trP;uniform vec2 u_res;
const vec3 LW=vec3(.299,.587,.114);
vec3 lutS(sampler2D L,float n,vec3 c){float b=c.b*(n-1.);float b0=floor(b);float b1=min(b0+1.,n-1.);float f=b-b0;
 float x=c.r*(n-1.)+.5;float y=(c.g*(n-1.)+.5)/n;
 return mix(texture2D(L,vec2((b0*n+x)/(n*n),y)).rgb,texture2D(L,vec2((b1*n+x)/(n*n),y)).rgb,f);}
float rnd(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float dot2(vec2 v){return dot(v,v);}
float sdHeart(vec2 p){p.x=abs(p.x);
 if(p.y+p.x>1.)return sqrt(dot2(p-vec2(.25,.75)))-sqrt(2.)/4.;
 return sqrt(min(dot2(p-vec2(0.,1.)),dot2(p-.5*max(p.x+p.y,0.))))*sign(p.x-p.y);}
float sdStar(vec2 p,float r,float rf){
 const vec2 k1=vec2(.809016994375,-.587785252292);const vec2 k2=vec2(-.809016994375,-.587785252292);
 p.x=abs(p.x);p-=2.*max(dot(k1,p),0.)*k1;p-=2.*max(dot(k2,p),0.)*k2;p.x=abs(p.x);p.y-=r;
 vec2 ba=rf*vec2(-k1.y,k1.x)-vec2(0.,1.);float h=clamp(dot(p,ba)/dot(ba,ba),0.,r);
 return length(p-ba*h)*sign(p.y*ba.x-p.x*ba.y);}
float maskA(){
 if(u_mT<.5)return 1.;
 vec2 p=uv-u_mC;p.x*=u_asp;
 float cs=cos(u_mRot),sn=sin(u_mRot);p=vec2(p.x*cs+p.y*sn,-p.x*sn+p.y*cs);
 float d;
 if(u_mT<1.5)d=p.y;
 else if(u_mT<2.5)d=abs(p.y)-u_mS.y;
 else if(u_mT<3.5){vec2 r=max(u_mS,vec2(.001));d=(length(p/r)-1.)*min(r.x,r.y);}
 else if(u_mT<4.5){vec2 q=abs(p)-u_mS+u_mR;d=length(max(q,0.))+min(max(q.x,q.y),0.)-u_mR;}
 else if(u_mT<5.5){float s=max(u_mS.y*1.8,.001);d=sdHeart(vec2(p.x,-p.y)/s+vec2(0.,.55))*s;}
 else d=sdStar(vec2(p.x,-p.y),u_mS.y,.45);
 float f=u_mF+.0015;float a=1.-smoothstep(-f,f,d);
 return u_mInv>.5?1.-a:a;}
vec2 cuv(vec3 c){float y=dot(c,LW);return vec2(c.b-y,c.r-y);}
float sedge(float v,float e){return smoothstep(e+.006,e-.006,v);}
float trMask(){
 if(u_trT<.5)return 1.;
 vec2 q=gl_FragCoord.xy/u_res;q.y=1.-q.y;float p=u_trP;vec2 d=q-.5;d.x*=u_res.x/u_res.y;
 if(u_trT<1.5)return sedge(length(d),p*1.25);
 if(u_trT<2.5)return 1.-sedge(length(d),(1.-p)*1.25);
 if(u_trT<3.5)return sedge(abs(d.x)+abs(d.y),p*1.6);
 if(u_trT<4.5){float a=atan(d.x,-d.y)/6.28318+.5;return sedge(a,p);}
 if(u_trT<5.5)return sedge(fract(q.y*10.),p);
 if(u_trT<6.5)return sedge(fract(q.x*10.),p);
 if(u_trT<7.5)return step(rnd(floor(q*vec2(60.,60.*u_res.y/u_res.x))),p);
 if(u_trT<8.5)return sedge(abs(q.x-.5)*2.,p);
 if(u_trT<9.5)return sedge(abs(q.y-.5)*2.,p);
 if(u_trT<10.5){float s=max(p*2.4,.001);return sedge(sdHeart(vec2(d.x,-d.y)/s+vec2(0.,.55))*s,0.);}
 if(u_trT<11.5)return sedge(sdStar(vec2(d.x,-d.y),p*1.3,.45),0.);
 if(u_trT>12.5&&u_trT<13.5)return sedge(q.x,p);
 return 1.;}
vec3 hueRot(vec3 c,float a){vec3 k=vec3(.57735);float cs=cos(a);return c*cs+cross(k,c)*sin(a)+k*dot(k,c)*(1.-cs);}
float ckD(vec3 c){vec2 a=cuv(c)-cuv(u_ckC);return length(vec3(a,dot(c-u_ckC,LW)*u_ckY));}
float ckA(vec3 c){return pow(clamp((ckD(c)-u_ckSim)/u_ckSm,0.,1.),1.5);}
vec4 tx(vec2 u){vec4 t=texture2D(u_tex,u);
 if(u_ck>.5){float a=ckA(t.rgb);
  if(u_ckSm>.03){vec2 o=u_px*(1.+u_ckSm*6.);a=a*.4+.15*(ckA(texture2D(u_tex,u+vec2(o.x,0.)).rgb)+ckA(texture2D(u_tex,u-vec2(o.x,0.)).rgb)+ckA(texture2D(u_tex,u+vec2(0.,o.y)).rgb)+ckA(texture2D(u_tex,u-vec2(0.,o.y)).rgb));}
  if(a<.999)t.rgb=clamp((t.rgb-(1.-a)*u_ckC)/max(a,.08),0.,1.);
  float sp=pow(clamp((ckD(t.rgb)-u_ckSim)/u_ckSp,0.,1.),1.5);t.rgb=mix(vec3(dot(t.rgb,LW)),t.rgb,mix(1.,sp,u_ckSat));
  t.a*=a;}
 return t;}
float skin(vec3 c){float y=dot(c,LW);float cb=(c.b-y)*.564+.5;float cr=(c.r-y)*.713+.5;
 return (1.-smoothstep(.08,.14,abs(cb-.40)))*(1.-smoothstep(.06,.12,abs(cr-.60)))*smoothstep(.12,.25,y);}
vec3 surf(vec2 u,vec3 c0){vec3 acc=c0;float ws=1.;
 for(int i=0;i<8;i++){float a=float(i)*.785398;vec2 d=vec2(cos(a)*u_px.x/u_px.y,sin(a))*.0045;
  for(int r=1;r<=2;r++){vec3 s=tx(u+d*float(r)).rgb;float w=exp(-dot(s-c0,s-c0)*35.);acc+=s*w;ws+=w;}}
 return acc/ws;}
vec4 split3(vec2 u,vec2 o){vec4 a=tx(u+o),b=tx(u),c=tx(u-o);return vec4(a.r,b.g,c.b,max(b.a,max(a.a,c.a)));}
vec4 fetch(vec2 u){float I=u_fxA;
 if(u_fx<.5)return tx(u);
 if(u_fx<1.5)return split3(u,vec2(.015*I,.004*I));
 if(u_fx<2.5){float tt=floor(u_sec*12.);float ln=floor(u.y*24.);
  if(rnd(vec2(ln,tt))<.35*I)u.x+=(rnd(vec2(tt,ln+7.))-.5)*.25*I;
  return split3(u,vec2(.012*I*step(.5,rnd(vec2(tt,1.))),0.));}
 if(u_fx<3.5){u.x+=sin(u.y*40.+u_sec*8.)*.003*I+(rnd(vec2(floor(u.y*240.),floor(u_sec*30.)))-.5)*.006*I;
  return split3(u,vec2(.006*I,0.));}
 if(u_fx<4.5){vec2 b=u_px*mix(2.,48.,I);return tx((floor(u/b)+.5)*b);}
 if(u_fx<5.5){u.x=u.x<.5?u.x:1.-u.x;return tx(u);}
 if(u_fx<6.5){vec2 f=floor(u*2.);vec2 v=fract(u*2.);v=mix(v,1.-v,f);return tx(v);}
 if(u_fx>15.5&&u_fx<16.5){vec2 d=u-.5;u=.5+d*(1.+I*1.4*(dot(d,d)-.3));return tx(u);}
 if(u_fx>16.5&&u_fx<17.5){u.x+=sin(u.y*18.+u_sec*4.)*.02*I;u.y+=cos(u.x*14.+u_sec*3.)*.012*I;return tx(u);}
 if(u_fx>17.5&&u_fx<18.5){vec2 d=u-.5;float r=length(d);float a=I*6.*pow(max(0.,.5-r)*2.,2.)*sin(u_sec*.9+1.2);float cs=cos(a),sn=sin(a);d=vec2(d.x*cs-d.y*sn,d.x*sn+d.y*cs);return tx(.5+d);}
 if(u_fx>24.5&&u_fx<25.5){u.y=u.y<.5?u.y:1.-u.y;return tx(u);}
 if(u_fx>27.5&&u_fx<28.5){return split3(u,(u-.5)*.035*I);}
 if(u_fx>30.5&&u_fx<31.5){vec2 d=u-.5;float z=1.-.14*I*(.5+.5*sin(u_sec*3.));float a=.07*I*sin(u_sec*1.7);d=vec2(d.x*cos(a)-d.y*sin(a),d.x*sin(a)+d.y*cos(a))*z;return tx(.5+d);}
 if(u_fx>31.5&&u_fx<32.5){u.y=.3333+fract(u.y*3.)/3.;return tx(u);}
 if(u_fx>32.5&&u_fx<33.5){return tx(fract(u*3.));}
 if(u_fx>33.5&&u_fx<34.5){u.x+=sin(u.y*12.+u_sec*8.)*.015*I+(rnd(vec2(floor(u.y*40.),floor(u_sec*10.)))-.5)*.012*I;return tx(u);}
 if(u_fx>34.5&&u_fx<35.5){vec4 s=vec4(0.);for(int i=0;i<12;i++)s+=tx(.5+(u-.5)*(1.-float(i)*.012*I));return s/12.;}
 if(u_fx>7.5&&u_fx<8.5){vec4 s=vec4(0.);vec2 r=u_px*(1.+I*14.);
  for(int i=-2;i<=2;i++)for(int j=-2;j<=2;j++)s+=tx(u+vec2(float(i),float(j))*r);return s/25.;}
 return tx(u);}
void main(){vec3 c;float ta=1.;float I=u_fxA;
 if(u_blur>0.){c=vec3(0.);for(int i=-3;i<=3;i++)for(int j=-3;j<=3;j++)c+=texture2D(u_tex,uv+vec2(float(i),float(j))*.012).rgb;c/=49.;}
 else{vec4 t=fetch(uv);c=t.rgb;ta=t.a;
  if(u_rtS>0.||u_rtB>0.){float sk=skin(c);if(u_rtS>0.)c=mix(c,surf(uv,c),clamp(sk*u_rtS*1.2,0.,1.));
   if(u_rtB>0.)c=mix(c,c+(1.-c)*.35,sk*u_rtB);}
  if(u_sh>0.){vec3 n=texture2D(u_tex,uv+vec2(u_px.x,0.)).rgb+texture2D(u_tex,uv-vec2(u_px.x,0.)).rgb+texture2D(u_tex,uv+vec2(0.,u_px.y)).rgb+texture2D(u_tex,uv-vec2(0.,u_px.y)).rgb;c+=(c*4.-n)*u_sh;}}
 c*=exp2(u_ex*1.5);
 c+=u_b*.25;
 {float l0=dot(clamp(c,0.,1.),LW);float ws=1.-smoothstep(0.,.6,l0);float wh=smoothstep(.4,1.,l0);c+=(c+.04)*u_shd*.9*ws;c+=(c+.04)*u_hl*.55*wh;}
 c=(c-.5)*(1.+u_c)+.5;
 float l=dot(c,LW);c=mix(vec3(l),c,1.+u_s);
 if(u_vib!=0.){float mx=max(c.r,max(c.g,c.b)),mn=min(c.r,min(c.g,c.b));l=dot(c,LW);c=mix(vec3(l),c,1.+u_vib*(1.-clamp((mx-mn)*1.6,0.,1.))*1.3);}
 if(u_hue!=0.)c=hueRot(c,u_hue*1.5708);
 c.r+=u_t*.08;c.b-=u_t*.08;c.g+=u_ti*.06;
 c=c*(1.-u_f*.3)+u_f*.15;
 c=clamp(c,0.,1.);
 if(u_lut2N>0.)c=mix(c,lutS(u_lut2,u_lut2N,c),u_lut2Amt);
 if(u_lutN>0.)c=mix(c,lutS(u_lut,u_lutN,c),u_lutAmt);
 if(u_fx>2.5&&u_fx<3.5){c*=.88+.12*sin(uv.y/u_px.y*1.7);c+=(rnd(uv*500.+u_sec)-.5)*.12*I;c=mix(c,vec3(dot(c,LW)),.2*I);}
 else if(u_fx>6.5&&u_fx<7.5)c=mix(c,1.-c,I);
 else if(u_fx>8.5&&u_fx<9.5){float lm=dot(c,LW);c=mix(c,vec3(lm*1.07+.05,lm*.95+.02,lm*.75),I);
  c*=1.-.18*I*rnd(vec2(floor(u_sec*18.),3.));
  float sx=rnd(vec2(floor(u_sec*6.),7.));c-=.4*I*(1.-smoothstep(0.,.0025,abs(uv.x-sx)))*step(.4,rnd(vec2(floor(u_sec*6.),9.)));
  c+=(rnd(uv*800.+u_sec)-.5)*.18*I;}
 else if(u_fx>11.5&&u_fx<12.5){c+=(1.-smoothstep(0.,.3,fract(u_sec)))*.7*I;}
 else if(u_fx>12.5&&u_fx<13.5)c=c+I*.85*(1.-c*.3);
 else if(u_fx>13.5&&u_fx<14.5)c=mix(c,hueRot(c,u_sec*2.),I);
 else if(u_fx>18.5&&u_fx<19.5){float e=0.;vec2 o=u_px*1.5;
  e+=abs(dot(tx(uv+vec2(o.x,0.)).rgb-tx(uv-vec2(o.x,0.)).rgb,LW))+abs(dot(tx(uv+vec2(0.,o.y)).rgb-tx(uv-vec2(0.,o.y)).rgb,LW));
  vec3 nc=hueRot(vec3(1.,.15,.75),u_sec*1.5+uv.y*3.)*clamp(e*5.,0.,1.)*1.6;c=mix(c,nc+c*.12,I);}
 else if(u_fx>19.5&&u_fx<20.5){float lv=mix(14.,3.,I);c=floor(c*lv+.5)/lv;}
 else if(u_fx>20.5&&u_fx<21.5){float lm=smoothstep(.05,.95,dot(c,LW));c=mix(c,mix(vec3(.12,.05,.38),vec3(1.,.62,.25),lm),I);}
 else if(u_fx>21.5&&u_fx<22.5){float lm=dot(c,LW);vec3 th=lm<.33?mix(vec3(0.,0.,.35),vec3(.6,0.,.8),lm*3.):lm<.66?mix(vec3(.6,0.,.8),vec3(1.,.35,0.),lm*3.-1.):mix(vec3(1.,.35,0.),vec3(1.,1.,.6),lm*3.-2.);c=mix(c,th,I);}
 else if(u_fx>22.5&&u_fx<23.5){float lm=dot(c,LW)*1.7;vec3 nv=vec3(.12,1.,.25)*lm+(rnd(uv*700.+u_sec)-.5)*.2;nv*=1.-smoothstep(.35,.75,distance(uv,vec2(.5)));nv*=.9+.1*sin(uv.y/u_px.y*1.5);c=mix(c,nv,I);}
 else if(u_fx>23.5&&u_fx<24.5){vec3 cr=c*(.72+.28*sin(uv.y/u_px.y*3.14159));float m3=mod(gl_FragCoord.x,3.);cr*=vec3(m3<1.?1.25:.85,(m3>=1.&&m3<2.)?1.25:.85,m3>=2.?1.25:.85);cr*=1.-smoothstep(.4,.75,distance(uv,vec2(.5)))*.6;c=mix(c,cr*1.1,I);}
 else if(u_fx>25.5&&u_fx<26.5){if(abs(uv.y-.5)>.5-.13*I)c=vec3(0.);}
 else if(u_fx>26.5&&u_fx<27.5){vec2 p1=vec2(.15+.25*sin(u_sec*.6),.2+.2*cos(u_sec*.45)),p2=vec2(.92,.85+.12*sin(u_sec*.8));
  vec3 lk=vec3(1.,.45,.12)*smoothstep(.65,0.,distance(uv,p1))*.9+vec3(1.,.2,.55)*smoothstep(.55,0.,distance(uv,p2))*.6;c=c+lk*I*(1.-c*.5);}
 else if(u_fx>28.5&&u_fx<29.5){vec3 bl=vec3(0.);for(int i=-2;i<=2;i++)for(int j=-2;j<=2;j++)bl+=tx(uv+vec2(float(i),float(j))*u_px*6.).rgb;bl/=25.;
  c=c+max(bl-.55,0.)*1.2*I;c=mix(c,c*vec3(1.03,1.,1.06)+.03,I*.5);}
 else if(u_fx>29.5&&u_fx<30.5){c=mix(c,vec3(0.),step(.8,fract(u_sec*1.6))*I);}
 else if(u_fx>35.5&&u_fx<36.5){float b=smoothstep(.12,.42,abs(uv.y-.5))*I;vec3 bl=vec3(0.);for(int i=-2;i<=2;i++)for(int j=-2;j<=2;j++)bl+=tx(uv+vec2(float(i),float(j))*u_px*(1.+7.*b)).rgb;c=mix(c,bl/25.,b);float l=dot(c,LW);c=mix(vec3(l),c,1.+.35*I);}
 else if(u_fx>36.5&&u_fx<37.5){float x=fract(u_sec*.35)*2.6-.8;float band=exp(-pow((uv.x+uv.y*.55-x)*7.,2.));c+=vec3(1.,.95,.85)*band*.75*I;}
 else if(u_fx>37.5&&u_fx<38.5){vec3 a=tx(uv+vec2(.014,.004)*I).rgb,b=tx(uv-vec2(.014,.004)*I).rgb;c=mix(c,vec3(a.r,c.g,b.b),I);c+=hueRot(vec3(.5,.15,.15),uv.x*6.+u_sec)*.18*I*smoothstep(.25,.75,distance(uv,vec2(.5)));}
 else if(u_fx>38.5&&u_fx<39.5){float asp=u_px.y/u_px.x;for(int i=0;i<16;i++){float fi=float(i);vec2 p=vec2(rnd(vec2(fi,1.)),fract(rnd(vec2(fi,2.))-u_sec*.03*(.5+rnd(vec2(fi,3.)))));float r=.035+.06*rnd(vec2(fi,4.));float d=length((uv-p)*vec2(asp,1.));c+=hueRot(vec3(1.,.72,.35),fi*.7)*smoothstep(r,r*.65,d)*.28*I;}}
 else if(u_fx>39.5&&u_fx<40.5){float asp=u_px.y/u_px.x;for(int l=0;l<3;l++){float fl=float(l);float sc=14.+fl*12.;vec2 q=uv*vec2(sc*asp,sc)+vec2(sin(u_sec*.6+fl)*1.5,-u_sec*(1.5+fl*.8));vec2 id=floor(q);vec2 f=fract(q)-.5;float h=rnd(id+fl*7.);if(h>.72){vec2 o=vec2(rnd(id+3.)-.5,rnd(id+5.)-.5)*.5;c+=vec3(smoothstep(.13-fl*.03,.0,length(f-o)))*.95*I;}}}
 else if(u_fx>40.5&&u_fx<41.5){vec2 q=vec2(uv.x*90.+uv.y*5.,uv.y*5.-u_sec*8.);vec2 id=floor(q);float h=rnd(id);float f=fract(q.y);float s2=step(.9,h)*smoothstep(0.,.25,f)*smoothstep(1.,.45,f)*smoothstep(.45,0.,abs(fract(q.x)-.5));c=c*(1.-.2*I)*vec3(.92,.96,1.05)+vec3(.75,.85,.95)*s2*.55*I;}
 else if(u_fx>41.5&&u_fx<42.5){float asp=u_px.y/u_px.x;vec2 q=uv*vec2(26.*asp,26.);vec2 id=floor(q);float h=rnd(id);if(h>.92){vec2 f=fract(q)-.5;float tw=pow(.5+.5*sin(u_sec*5.+h*60.),3.);float st=max(0.,1.-abs(f.x)*10.)*max(0.,1.-abs(f.y)*2.5)+max(0.,1.-abs(f.y)*10.)*max(0.,1.-abs(f.x)*2.5);c+=vec3(1.,.95,.8)*st*tw*1.4*I;}}
 else if(u_fx>42.5&&u_fx<43.5){vec2 b=abs(uv-.5)*2.;float fr=smoothstep(.92,.94,max(b.x,b.y));c=mix(c,c*vec3(1.06,.97,.85),I);float dust=step(.9982,rnd(floor(uv*350.)+floor(u_sec*12.)));float ln=step(.996,rnd(vec2(floor(uv.x*260.),floor(u_sec*9.))));c=mix(c,vec3(.95),dust*I);c=mix(c,c*.55,ln*I);c*=1.+(rnd(vec2(floor(u_sec*14.),3.))-.5)*.12*I;c=mix(c,vec3(.02),fr*I);}
 else if(u_fx>43.5&&u_fx<44.5){vec2 o=u_px*1.5;float e=abs(dot(tx(uv+vec2(o.x,0.)).rgb-tx(uv-vec2(o.x,0.)).rgb,LW))+abs(dot(tx(uv+vec2(0.,o.y)).rgb-tx(uv-vec2(0.,o.y)).rgb,LW));c+=hueRot(vec3(0.,1.,.9),u_sec*1.2+uv.y*2.)*clamp(e*4.,0.,1.)*1.6*I;}
 else if(u_fx>44.5&&u_fx<45.5){float l=dot(c,LW);vec3 sp=vec3(l*1.12,l*.9,l*.62);float v=smoothstep(.3,.85,distance(uv,vec2(.5)));sp=mix(sp,vec3(.28,.08,0.),v*.85);c=mix(c,sp,I);}
 else if(u_fx>45.5&&u_fx<46.5){float k=floor(u_sec*6.);c=mix(c,c*hueRot(vec3(1.,.35,.35),k*1.3)*1.7,I*.65*step(.5,fract(u_sec*3.)));}
 else if(u_fx>46.5&&u_fx<47.5){float asp=u_px.y/u_px.x;vec2 fp=vec2(.2+.6*fract(u_sec*.06),.22);vec2 a2=vec2(asp,1.);float d=length((uv-fp)*a2);c+=vec3(1.,.9,.72)*(.025/(d+.025))*.45*I;for(int k=1;k<4;k++){vec2 g=.5+(.5-fp)*float(k)*.45;c+=hueRot(vec3(.25,.5,1.),float(k))*smoothstep(.05+.02*float(k),0.,length((uv-g)*a2))*.3*I;}}
 else if(u_fx>47.5&&u_fx<48.5){float l=dot(c,LW);float red=smoothstep(.12,.32,c.r-max(c.g,c.b));c=mix(c,mix(vec3(l),c,red),I);}
 else if(u_fx>48.5&&u_fx<49.5){float l=dot(c,LW);vec3 ir=mix(vec3(1.,.45,.75)*l*1.4,vec3(c.g*1.3+.08,c.r*.75,c.b*.9+.12),.35);c=mix(c,ir,I);}
 if(u_bfx>.5&&u_segAv>.5){float m=smoothstep(.3,.7,texture2D(u_seg,uv).r);float J=u_bfxA;
  if(u_bfx<1.5){vec3 bl=vec3(0.);for(int i=-3;i<=3;i++)for(int j=-3;j<=3;j++)bl+=texture2D(u_tex,uv+vec2(float(i),float(j))*u_px*(2.+12.*J)).rgb;bl/=49.;c=mix(bl,c,m);}
  else if(u_bfx<2.5)c=mix(mix(c,vec3(dot(c,LW)),J),c,m);
  else if(u_bfx<3.5)c=mix(c*(1.-.8*J),c*(1.+.12*J),m);
  else{float mb=0.;for(int i=0;i<12;i++){float a=float(i)*.5236;mb+=texture2D(u_seg,uv+vec2(cos(a)*u_px.x/u_px.y,sin(a))*.025*(.4+J)).r;}mb=smoothstep(.2,.8,mb/12.);
   if(u_bfx<4.5)c+=u_bcol*max(mb-m,0.)*2.2*J;
   else if(u_bfx<5.5){vec3 nc=hueRot(u_bcol,u_sec*2.);c=mix(c,nc*1.3,clamp(abs(mb-m)*5.*J,0.,1.));}
   else if(u_bfx<6.5)c=mix(mix(c,u_bcol*(.35+.75*dot(c,LW)),J),c,m);
   else{vec2 o=vec2(sin(u_sec*2.3),cos(u_sec*1.7))*.035*J;float m2=smoothstep(.3,.7,texture2D(u_seg,uv-o).r);vec3 g=texture2D(u_tex,uv-o).rgb;c=mix(c,mix(g,u_bcol,.4)*1.2,m2*(1.-m)*.65*J);}}}
 c*=1.-u_v*smoothstep(.25,.85,distance(uv,vec2(.5)));
 c+=(rnd(uv*1000.+u_time)-.5)*u_g*.2;
 float A=u_alpha*ta*maskA()*trMask();
 if(u_trT>11.5&&u_trT<12.5){float lm=dot(clamp(c,0.,1.),LW);A*=smoothstep(lm-.08,lm+.08,u_trP*1.16-.08);}
 if(u_segOn>.5){float m=texture2D(u_seg,uv).r;if(u_segInv>.5)m=1.-m;A*=smoothstep(.3,.7,m);}
 gl_FragColor=vec4(clamp(c,0.,1.)*A,A);}`;
function mkShader(type,src){ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
const prog = gl.createProgram();
gl.attachShader(prog, mkShader(gl.VERTEX_SHADER,VS)); gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER,FS));
gl.linkProgram(prog); gl.useProgram(prog);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
const aLoc = gl.getAttribLocation(prog,'a'); gl.enableVertexAttribArray(aLoc); gl.vertexAttribPointer(aLoc,2,gl.FLOAT,false,0,0);
const U = {};
['u_half','u_off','u_rot','u_canvas','u_tex','u_lut','u_lutN','u_lutAmt','u_alpha','u_time','u_b','u_c','u_s','u_t','u_ti','u_f','u_v','u_g','u_sh','u_px','u_blur',
 'u_mT','u_mC','u_mS','u_mRot','u_mF','u_mR','u_mInv','u_asp','u_ck','u_ckC','u_ckSim','u_ckSm','u_ckSp','u_ckY','u_ckSat','u_fx','u_fxA','u_sec','u_seg','u_segOn','u_segInv','u_rtS','u_rtB','u_trT','u_trP','u_res','u_lut2','u_lut2N','u_lut2Amt','u_ex','u_hl','u_shd','u_vib','u_hue','u_segAv','u_bfx','u_bfxA','u_bcol'].forEach(n => U[n]=gl.getUniformLocation(prog,n));
gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
function mkTex(){
  const t=gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  return t;
}
const texA = mkTex(), texB = mkTex(), texO = mkTex(), texSeg = mkTex();
const dummy = mkTex(); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255]));
gl.uniform1i(U.u_tex,0); gl.uniform1i(U.u_lut,1); gl.uniform1i(U.u_seg,2); gl.uniform1i(U.u_lut2,3);
const EX0 = {s:1,sx:1,dx:0,dy:0,a:1,r:0};
const texOwn = new Map(), ovTex = {}, clipTex = new Map();
const texK = new WeakMap(), dsCanv = new WeakMap();
function texFor(id){
  let t = clipTex.get(id);
  if(t){ clipTex.delete(id); clipTex.set(id, t); return t; }
  if(clipTex.size >= 4){ const [k, old] = clipTex.entries().next().value; clipTex.delete(k); texOwn.delete(old.tex); gl.deleteTexture(old.tex); }
  t = {tex:mkTex()}; clipTex.set(id, t); return t;
}
let holdT = 0;

function fxParams(c){ const p={...c.adj}, k=c.filterAmt/100; let f=FILTERS[c.filter]||{}; if(c.filter && c.filter.startsWith('pf:') && typeof PF_MAP !== 'undefined') f = (PF_MAP[c.filter.slice(3)]||{}).adj || {}; for(const key in f) p[key]=(p[key]||0)+f[key]*k; return p; }
function setFx(c){
  const p = fxParams(c);
  gl.uniform1f(U.u_b,p.brightness/100); gl.uniform1f(U.u_c,p.contrast/100); gl.uniform1f(U.u_s,p.saturation/100);
  gl.uniform1f(U.u_t,p.temp/100); gl.uniform1f(U.u_ti,p.tint/100); gl.uniform1f(U.u_f,p.fade/100);
  const rt=c.rt||{};
  gl.uniform1f(U.u_v,p.vignette/100); gl.uniform1f(U.u_g,p.grain/100); gl.uniform1f(U.u_sh,(p.sharpen+(rt.clear||0)*.6)/100*1.5);
  gl.uniform1f(U.u_rtS,(rt.smooth||0)/100); gl.uniform1f(U.u_rtB,(rt.bright||0)/100);
  const l = c.lut && S.luts.find(x => x.id === c.lut);
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, l ? l.tex : dummy); gl.activeTexture(gl.TEXTURE0);
  gl.uniform1f(U.u_lutN, l ? l.n : 0); gl.uniform1f(U.u_lutAmt, c.lutAmt/100);
  gl.uniform1f(U.u_ex,(p.exposure||0)/100); gl.uniform1f(U.u_hl,(p.highlights||0)/100); gl.uniform1f(U.u_shd,(p.shadows||0)/100);
  gl.uniform1f(U.u_vib,(p.vibrance||0)/100); gl.uniform1f(U.u_hue,(p.hue||0)/100);
  const pf = c.filter && c.filter.startsWith('pf:') && typeof proLut === 'function' ? proLut(c.filter.slice(3)) : null;
  gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, pf ? pf.tex : dummy); gl.activeTexture(gl.TEXTURE0);
  gl.uniform1f(U.u_lut2N, pf ? pf.n : 0); gl.uniform1f(U.u_lut2Amt, c.filterAmt/100);
}
const fxRate = f => f ? .3 + 2.7*f.speed/100 : 1;
function setEffect(it){
  const f = it.fx, T = f ? FX_T[f.type] || 0 : 0;
  gl.uniform1f(U.u_fx, T); gl.uniform1f(U.u_fxA, f ? f.amount/100 : 0); gl.uniform1f(U.u_sec, S.time*fxRate(f));
}
function fxMotion(it,W,H){
  const f = it.fx, r = {dx:0,dy:0,s:1}; if(!f || f.type==='none') return r;
  const I = f.amount/100, t = S.time*fxRate(f), u = Math.min(W,H);
  if(f.type==='shake'){ r.dx=(Math.sin(t*31)+Math.sin(t*17.3))*.5*u*.03*I; r.dy=(Math.cos(t*27)+Math.sin(t*13.1))*.5*u*.03*I; }
  if(f.type==='zoompulse') r.s = 1 + .18*I*Math.pow(Math.max(0,Math.sin(t*Math.PI*2)),6);
  if(f.type==='shake2'){ r.dx=(Math.sin(t*41)+Math.sin(t*23.3))*.5*u*.07*I; r.dy=(Math.cos(t*37)+Math.sin(t*19.1))*.5*u*.07*I; r.s=1+.08*I; }
  if(f.type==='heartbeat'){ const ph=(t*1.2)%1; r.s = 1 + .12*I*(Math.exp(-Math.pow((ph-.1)*18,2)) + .7*Math.exp(-Math.pow((ph-.3)*18,2))); }
  if(f.type==='cambounce'){ r.dy = -Math.abs(Math.sin(t*Math.PI*1.6))*u*.05*I; r.s = 1+.05*I; }
  if(f.type==='vertigo') r.s = 1;
  return r;
}
function setMask(it,vw,vh){
  const m = it.mask, T = m ? MASK_T[m.type] || 0 : 0;
  gl.uniform1f(U.u_mT, T); if(!T) return;
  const sx = m.w/200, sy = m.h/200;
  gl.uniform1f(U.u_asp, vw/vh);
  gl.uniform2f(U.u_mC, .5 + m.x/100, .5 + m.y/100);
  gl.uniform2f(U.u_mS, sx, sy);
  gl.uniform1f(U.u_mRot, m.rot*Math.PI/180);
  gl.uniform1f(U.u_mF, m.feather/100*.25);
  gl.uniform1f(U.u_mR, m.round/100*Math.min(sx,sy));
  gl.uniform1f(U.u_mInv, m.invert ? 1 : 0);
}
function setChroma(it){
  const k = it.ck, on = !!(k && k.on && !(S.pick && S.sel === it.id));
  gl.uniform1f(U.u_ck, on ? 1 : 0); if(!on) return;
  const n = parseInt(k.color.slice(1),16);
  const r = (n>>16&255)/255, g = (n>>8&255)/255, b = (n&255)/255, y = .299*r + .587*g + .114*b;
  // saturated key (green/blue screen): match on colour, ignore shadows. Neutral key (white/black/grey): brightness matters too
  const ks = Math.hypot(b - y, r - y), sat = clamp((ks - .05)/.25, 0, 1);
  gl.uniform3f(U.u_ckC, r, g, b);
  gl.uniform1f(U.u_ckY, 2.2 - 1.9*sat); gl.uniform1f(U.u_ckSat, sat);
  gl.uniform1f(U.u_ckSim, k.sim/100*.6);
  gl.uniform1f(U.u_ckSm, Math.max(.025, k.smooth/100*.3));
  gl.uniform1f(U.u_ckSp, Math.max(.002, k.spill/100*.5));
}
const bounceOut = k => { const n=7.5625,d=2.75; if(k<1/d) return n*k*k; if(k<2/d) return n*(k-=1.5/d)*k+.75; if(k<2.5/d) return n*(k-=2.25/d)*k+.9375; return n*(k-=2.625/d)*k+.984375; };
const backOut = k => { const q=k-1; return 1+2.70158*q*q*q+1.70158*q*q; };
function animState(c,lt,dur){
  const R={s:1,sx:1,sy:1,dx:0,dy:0,r:0,a:1,fx:null,mT:0,mP:0}; const W=cv.width, H=cv.height;
  const ap = (name,k) => { k=clamp(k,0,1); const e=1-Math.pow(1-k,3);
    switch(name){
      case 'fade': R.a*=e; break;
      case 'zoomIn': R.s*=.5+.5*e; R.a*=e; break;
      case 'zoomOut': R.s*=1.6-.6*e; R.a*=e; break;
      case 'slideL': R.dx+=(1-e)*W; break;
      case 'slideR': R.dx-=(1-e)*W; break;
      case 'slideU': R.dy+=(1-e)*H; break;
      case 'slideD': R.dy-=(1-e)*H; break;
      case 'spin': R.r+=(1-e)*Math.PI*2; R.s*=.3+.7*e; R.a*=e; break;
      case 'shake': R.dx+=Math.sin(k*40)*(1-k)*W*.04; break;
      case 'rotateIn': R.r-=(1-e)*Math.PI/2; R.s*=.7+.3*e; R.a*=e; break;
      case 'flipX': R.sx*=Math.max(.001,e); break;
      case 'flipY': R.sy*=Math.max(.001,e); break;
      case 'dropIn': R.dy-=(1-bounceOut(k))*H; break;
      case 'riseUp': R.dy+=(1-e)*H*.12; R.a*=e; break;
      case 'blurIn': R.fx=['blur',1-e]; R.a*=Math.min(1,k*2); break;
      case 'glitchIn': R.fx=['rgbsplit',1-k]; R.dx+=Math.sin(k*97)*W*.03*(1-k); break;
      case 'swingIn': R.r+=Math.sin(k*Math.PI*3)*(1-k)*.35; R.a*=Math.min(1,k*3); break;
      case 'shrinkIn': R.s*=1.5-.5*e; break;
      case 'growIn': R.s*=Math.max(.001,backOut(k)); break;
      case 'wipeIn': R.mT=13; R.mP=e; break;
      case 'circleIn': R.mT=1; R.mP=e; break;
      case 'flashIn': R.fx=['bright',1-e]; break;
      case 'pixelIn': R.fx=['pixelate',1-e]; break;
      case 'tiltIn': R.r+=(1-e)*.25; R.dx+=(1-e)*W*.25; R.a*=e; break;
      default: if(typeof animLibApply === 'function') animLibApply(name,k,R,W,H);
    }};
  if(c.anim.in!=='none' && lt < c.anim.inDur) ap(c.anim.in, lt/c.anim.inDur);
  if(c.anim.out!=='none' && lt > dur-c.anim.outDur) ap(c.anim.out, (dur-lt)/c.anim.outDur);
  const q = dur>0 ? lt/dur : 0;
  switch(c.anim.loop){
    case 'kenburns': R.s*=1+.15*q; break;
    case 'zoomOutSlow': R.s*=1.15-.15*q; break;
    case 'pulse': R.s*=1+.04*Math.sin(lt*6); break;
    case 'sway': R.r+=.04*Math.sin(lt*2.5); break;
    case 'zoomInOut': R.s*=1+.12*Math.sin(q*Math.PI); break;
    case 'rock': R.r+=.06*Math.sin(lt*4); break;
    case 'wobble': R.dx+=Math.sin(lt*7)*W*.015; R.r+=.03*Math.sin(lt*5); break;
    case 'jelly': R.sx*=1+.05*Math.sin(lt*9); R.sy*=1-.05*Math.sin(lt*9); break;
    case 'glitchLoop': if(Math.sin(lt*13)>.7){ R.fx=['rgbsplit',.8]; R.dx+=Math.sin(lt*91)*W*.01; } break;
    case 'flashLoop': R.fx=['bright',Math.max(0,1-(lt*1.5%1)*4)*.6]; break;
    case 'rotateLoop': R.r+=lt*1.2; break;
    case 'shakeLoop': R.dx+=Math.sin(lt*41)*W*.012; R.dy+=Math.cos(lt*37)*H*.008; break;
    case 'heartbeat': { const p=lt%1; if(p<.5) R.s*=1+.08*Math.max(0,Math.sin(p*Math.PI*4)); break; }
    case 'bounceLoop': R.dy-=Math.abs(Math.sin(lt*4))*H*.03; break;
    case 'blurPulse': R.fx=['blur',(.5+.5*Math.sin(lt*3))*.6]; break;
    default: if(c.anim.loop !== 'none' && typeof loopLibApply === 'function') loopLibApply(c.anim.loop,lt,dur,R,W,H);
  }
  return R;
}
function transState(type,p,W,H){
  const A={...EX0}, B={...EX0}; let sc=null, clear=null;
  const e = p<.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2, bell = Math.sin(p*Math.PI);
  const mask = t => { B.mT=t; B.mP=e; };
  switch(type){
    case 'fade': B.a=e; break;
    case 'black': case 'white':
      clear = type==='black' ? 0 : 1;
      if(p<.5){ A.a=1-2*p; B.a=0; } else { A.a=0; B.a=2*p-1; } break;
    case 'slideL': A.dx=-e*W; B.dx=(1-e)*W; break;
    case 'slideR': A.dx=e*W; B.dx=-(1-e)*W; break;
    case 'slideU': A.dy=-e*H; B.dy=(1-e)*H; break;
    case 'slideD': A.dy=e*H; B.dy=-(1-e)*H; break;
    case 'wipeL': sc=[Math.round(W*(1-e)),0,Math.ceil(W*e),H]; break;
    case 'wipeR': sc=[0,0,Math.ceil(W*e),H]; break;
    case 'zoomIn': A.s=1+e*.8; A.a=1-e; B.a=e; break;
    case 'zoomOut': A.s=1-.3*e; B.s=1.8-.8*e; B.a=e; break;
    case 'spin': B.r=(1-e)*Math.PI; B.s=Math.max(.01,e); B.a=e; break;
    case 'glitch': { const j=Math.sin(p*90)*W*.05*(1-Math.abs(2*p-1)); A.dx=j; B.dx=-j; B.a = p>.5 ? 1 : (Math.random()<p*2 ? 1 : 0); break; }
    case 'circleOpen': mask(1); break;
    case 'circleClose': mask(2); break;
    case 'diamond': mask(3); break;
    case 'clock': mask(4); break;
    case 'blinds': mask(5); break;
    case 'blindsV': mask(6); break;
    case 'dissolve': mask(7); break;
    case 'doors': mask(8); break;
    case 'barn': mask(9); break;
    case 'heart': mask(10); break;
    case 'star': mask(11); break;
    case 'luma': B.mT=12; B.mP=p; break;
    case 'blurDissolve': B.a=e; A.fx=['blur',bell]; B.fx=['blur',bell]; break;
    case 'pixelT': A.fx=['pixelate',bell]; B.fx=['pixelate',bell]; B.a=clamp((p-.45)/.1,0,1); break;
    case 'zoomBlur': A.s=1+e*.6; B.s=1.6-.6*e; B.a=e; A.fx=['blur',bell*.8]; B.fx=['blur',bell*.8]; break;
    case 'whipL': A.dx=-e*W; B.dx=(1-e)*W; A.fx=['blur',bell]; B.fx=['blur',bell]; break;
    case 'whipR': A.dx=e*W; B.dx=-(1-e)*W; A.fx=['blur',bell]; B.fx=['blur',bell]; break;
    case 'flashShake': { const j=Math.sin(p*70)*W*.03*bell; A.dx=j; B.dx=-j; A.fx=['bright',bell]; B.fx=['bright',bell]; B.a=p>.5?1:0; break; }
    case 'rgbGlitch': { const j=Math.sin(p*90)*W*.04*bell; A.dx=j; B.dx=-j; A.fx=['rgbsplit',bell]; B.fx=['rgbsplit',bell]; B.a=p>.5?1:0; break; }
    case 'spinZoom': A.r=e*Math.PI; A.s=1+e; A.a=1-e; B.a=e; B.s=.5+.5*e; break;
    case 'flip': if(p<.5){ A.sx=Math.max(.001,1-2*p); B.a=0; } else { A.a=0; B.sx=Math.max(.001,2*p-1); } break;
    case 'cube': A.dx=-e*W*.5; A.sx=Math.max(.001,1-e); B.dx=(1-e)*W*.5; B.sx=Math.max(.001,e); break;
    case 'dropIn': B.dy=-(1-bounceOut(p))*H; break;
    case 'pullIn': A.s=1+e*1.2; A.a=1-e; A.fx=['zoomlens',bell]; B.s=.7+.3*e; B.a=e; B.fx=['zoomlens',bell]; break;
    case 'pullOut': A.s=1-.4*e; A.a=1-e; A.fx=['zoomlens',bell]; B.s=1.6-.6*e; B.a=e; B.fx=['zoomlens',bell]; break;
    case 'zoomRotate': A.s=1+e*.8; A.r=e*.6; A.a=1-e; B.s=1.5-.5*e; B.r=-(1-e)*.6; B.a=e; A.fx=['blur',bell*.6]; B.fx=['blur',bell*.6]; break;
    case 'spinBlur': A.r=e*Math.PI; B.r=-(1-e)*Math.PI; B.a=p>.5?1:0; A.fx=['zoomlens',bell]; B.fx=['zoomlens',bell]; A.s=1+bell*.3; B.s=1+bell*.3; break;
    case 'whipU': A.dy=-e*H; B.dy=(1-e)*H; A.fx=['blur',bell]; B.fx=['blur',bell]; break;
    case 'whipD': A.dy=e*H; B.dy=-(1-e)*H; A.fx=['blur',bell]; B.fx=['blur',bell]; break;
    case 'glare': A.fx=['lightsweep',bell]; B.fx=['bright',bell*.9]; B.a=e; A.dx=-e*W*.15; B.dx=(1-e)*W*.15; break;
    case 'filmBurn': A.fx=['lightleak',bell]; B.fx=['lightleak',bell]; B.a=e; break;
    case 'inkSpread': B.mT=12; B.mP=p; A.fx=['blur',bell*.4]; break;
    case 'swirlT': A.fx=['swirl',bell]; B.fx=['swirl',bell]; B.a=e; break;
    case 'waveT': A.fx=['wave',bell]; B.fx=['wave',bell]; B.a=e; break;
    case 'fisheyeT': A.fx=['fisheye',bell]; B.fx=['fisheye',bell]; B.a=clamp((p-.4)/.2,0,1); break;
    case 'blackFlashT': clear=0; A.a=p<.35?1:0; B.a=p>.65?1:(p>.5?.5:0); break;
    case 'shakeZoom': { const j=Math.sin(p*80)*W*.04*bell; A.dx=j; B.dx=-j; A.s=1+bell*.4; B.s=1+bell*.4; B.a=p>.5?1:0; break; }
    case 'stretchT': if(p<.5){ A.sx=1+p*4; A.a=1-p*2; B.a=0; } else { B.sx=1+(1-p)*4; B.a=(p-.5)*2; A.a=0; } break;
    case 'squeezeT': if(p<.5){ A.sy=Math.max(.001,1-p*2); B.a=0; } else { A.a=0; B.sy=Math.max(.001,(p-.5)*2); } break;
    case 'lightSweepT': A.fx=['lightsweep',1]; B.fx=['lightsweep',1]; B.a=e; break;
    case 'prismT': A.fx=['prism',bell]; B.fx=['prism',bell]; B.a=e; A.s=1+bell*.15; B.s=1+bell*.15; break;
    case 'bounceUp': B.dy=(1-bounceOut(p))*H; break;
    case 'zoomPunch': B.s=1+.5*Math.pow(1-p,3); A.a=1-clamp(p*3,0,1); B.a=clamp(p*3,0,1); break;
    case 'split3T': A.fx=['split3',bell]; B.fx=['split3',bell]; B.a=p>.5?1:0; break;
    case 'vertigoT': A.fx=['vertigo',bell]; B.fx=['vertigo',bell]; A.s=1+bell*.3; B.s=1+bell*.3; B.a=e; break;
  }
  return {A,B,sc,clear};
}
const texT = new WeakMap();
function drawClip(c,tex,ex){
  if(ex.a <= 0.001) return true;
  let el = isImg(c) ? images[c.mediaId] : vids[c.id]; if(!el) return false;
  const isI = el.tagName === 'IMG';
  if(isI && c.magic && c.magic.on && typeof magicFrame === 'function'){ const dd = derived[c.id], mf = dd && magicFrame(c, S.time - dd.start, dd.dur); if(mf) el = mf; }   // v23 magic animate
  const vw = isI ? (el.naturalWidth || el.width) : el.videoWidth, vh = isI ? (el.naturalHeight || el.height) : el.videoHeight;
  if(!vw) return false;
  tex = texFor(c.id).tex;
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
  const fresh = isI || (el.readyState >= 2 && !el.seeking);
  const tk = texK.get(tex) || {}, nowT = performance.now();
  // skip the upload when the same video frame is already on the GPU (big saving: video 30 fps vs screen 60 fps)
  // (while playing the window is one video frame, so a missed frame-callback can never freeze the picture)
  const same = !isI && texOwn.get(tex) === c.id && tk.el === el && el._fn > 0 && tk.fn === el._fn && Math.abs((tk.t ?? -1) - el.currentTime) < (S.playing ? .05 : .5) && nowT - (tk.at||0) < (S.playing ? 40 : 250) && !exporting;
  const sameImg = isI && texOwn.get(tex) === c.id && tk.el === el && !(c.magic && c.magic.on);
  if(!same && !sameImg && (fresh || exporting || texOwn.get(tex) !== c.id)){
    if(!isI && el.readyState < 2){ if(texOwn.get(tex) !== c.id) return false; }   // not decoded yet → keep showing the last picture of this clip
    else {
    let src = el;
    // 4K / high-res video: shrink on the GPU first, then upload a small picture (much faster on most PCs and phones)
    if(!isI && vw*vh > 2400000){ const lim = Math.max(cv.width, cv.height) * (exporting ? 1 : .75), k = Math.min(1, lim/Math.max(vw, vh));
      if(k < .9){ let ds = dsCanv.get(tex); if(!ds){ ds = document.createElement('canvas'); dsCanv.set(tex, ds); } const w = Math.round(vw*k), h = Math.round(vh*k);
        if(ds.width !== w || ds.height !== h){ ds.width = w; ds.height = h; } ds.getContext('2d').drawImage(el, 0, 0, w, h); src = ds; } }
    try{ gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src); texOwn.set(tex, c.id); texK.set(tex, {el, fn:el._fn, t:isI ? 0 : el.currentTime, at:nowT}); if(!isI) texT.set(tex, el.currentTime); }catch(e){ if(texOwn.get(tex) !== c.id) return false; }
    }
  }
  const W=cv.width, H=cv.height, d=derived[c.id], lt=S.time-d.start, st=localToSrc(c,lt);
  gl.uniform2f(U.u_px,1/vw,1/vh);
  gl.uniform1f(U.u_trT, ex.mT||0); gl.uniform1f(U.u_trP, ex.mP||0);
  setFx(c); gl.uniform1f(U.u_ck,0); gl.uniform1f(U.u_segOn,0);
  if(S.bg==='blur'){
    const k=Math.max(W/vw,H/vh);
    gl.uniform1f(U.u_rtS,0); gl.uniform1f(U.u_rtB,0); gl.uniform1f(U.u_mT,0); gl.uniform1f(U.u_fx,0);
    gl.uniform2f(U.u_half,vw*k/2,vh*k/2); gl.uniform2f(U.u_off,ex.dx,-ex.dy); gl.uniform1f(U.u_rot,0);
    gl.uniform1f(U.u_alpha,ex.a); gl.uniform1f(U.u_blur,1);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
  setFx(c); setMask(c,vw,vh); setEffect(c); setChroma(c); setSeg(c,el);
  const an = animState(c,lt,d.dur), fm = fxMotion(c,W,H);
  const fo = ex.fx || an.fx; if(fo){ gl.uniform1f(U.u_fx, FX_T[fo[0]]||0); gl.uniform1f(U.u_fxA, fo[1]); gl.uniform1f(U.u_sec, S.time); }
  if(!ex.mT && an.mT){ gl.uniform1f(U.u_trT, an.mT); gl.uniform1f(U.u_trP, an.mP); }
  const sb = c.stab && c.stab.mode !== 'off' && typeof stabAt === 'function' ? stabAt(c, (!isI && texT.has(tex)) ? texT.get(tex) : st) : null;   // use the time of the frame actually shown   // v20 stabilization
  const k = Math.min(W/vw,H/vh)*ev(c,'tf.scale',st)/100*an.s*ex.s*fm.s*(sb ? sb.z*Math.exp(sb.s) : 1);
  const hw = vw*k/2*an.sx*(ex.sx||1), hh = vh*k/2*an.sy;
  let ox = ev(c,'tf.x',st)*PK()+an.dx+ex.dx+fm.dx, oy = ev(c,'tf.y',st)*PK()-an.dy-ex.dy-fm.dy, rot = ev(c,'tf.rot',st)*Math.PI/180+an.r+ex.r;
  if(sb){ const fl = c.tf.flip ? -1 : 1, sx = sb.dx*2*hw*fl, sy = sb.dy*2*hh, cs = Math.cos(rot), sn = Math.sin(rot);
    ox += sx*cs - sy*sn; oy -= sx*sn + sy*cs; rot += sb.r*fl; }
  gl.uniform2f(U.u_half, hw*(c.tf.flip?-1:1), hh);
  gl.uniform2f(U.u_off, ox, oy);
  gl.uniform1f(U.u_rot, -rot);
  gl.uniform1f(U.u_alpha,an.a*ex.a*ev(c,'opacity',st)/100); gl.uniform1f(U.u_blur,0);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  geo[c.id] = {cx:W/2+ox, cy:H/2-oy, rot, hw, hh, flip:!!c.tf.flip};
  gl.uniform1f(U.u_trT, 0);
  return true;
}
let missT = 0;
function render(now){
  const W=cv.width, H=cv.height;
  gl.viewport(0,0,W,H); gl.disable(gl.SCISSOR_TEST); gl.activeTexture(gl.TEXTURE0);   // clean GL state (preview tiles share this context)
  const pr = currentPair(), tr = pr && pr.b ? transState(pr.b.trans.type, pr.p, W, H) : null;
  if(!exporting && pr && !S.mainHide){   // a clip has no picture yet (first seek) → keep showing the previous frame briefly
    const notReady = [pr.a, pr.b].some(c => c && !isImg(c) && vids[c.id] && vids[c.id].readyState < 2 && !(clipTex.get(c.id) && texOwn.get(clipTex.get(c.id).tex) === c.id));
    const t = performance.now();
    if(notReady){ if(!holdT) holdT = t; if(t - holdT < 800) return; } else holdT = 0;
  }
  const bgc = tr && tr.clear != null ? tr.clear : (S.bg==='white' ? 1 : 0);
  gl.clearColor(bgc,bgc,bgc,1); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(U.u_canvas,W,H); gl.uniform2f(U.u_res,W,H); gl.uniform1f(U.u_trT,0); gl.uniform1f(U.u_time,((now||0)%1000)/1000);
  if(pr && !S.mainHide){
    let ok = drawClip(pr.a, texA, tr ? tr.A : EX0);
    if(pr.b){
      if(tr.sc){ gl.enable(gl.SCISSOR_TEST); gl.scissor(...tr.sc); }
      ok = drawClip(pr.b, texB, tr.B) && ok;
      gl.disable(gl.SCISSOR_TEST);
    }
    // fast scrubbing onto a clip that is still loading: keep the last good picture on screen instead of flashing black
    if(!ok && !exporting){ const t = performance.now(); if(!missT) missT = t; if(t - missT < 3000){ lastIdleKey = ''; return; } } else missT = 0;
  }
  octx.globalAlpha = 1; octx.filter = 'none'; octx.globalCompositeOperation = 'source-over';
  octx.drawImage(cv,0,0);
  if(!soloMain) drawOverlays(octx);
  if(!exporting && typeof drawGizmos === 'function') drawGizmos(octx);
}

/* ================= OVERLAYS ================= */
const loadedFonts = new Set();
if(document.fonts) document.fonts.addEventListener('loadingdone', () => { try{ if(!exporting) render(performance.now()); }catch(e){} });
const BASE_FONTS = new Set(['Inter','Noto Sans Kannada','Baloo Tamma 2','Anek Kannada','Tiro Kannada','Noto Serif Kannada','Poppins','Montserrat','Bebas Neue','Anton','Pacifico','Lobster','Dancing Script','Permanent Marker','Oswald']);
const fontCss = new Set();
function fontLink(f){
  if(!f || BASE_FONTS.has(f) || fontCss.has(f)) return; fontCss.add(f);
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.dataset.font = f; l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g,'+') + '&display=swap'; document.head.appendChild(l);
  return new Promise(r => { l.onload = l.onerror = r; setTimeout(r, 4000); });
}
function ensureFont(f){
  if(loadedFonts.has(f) || !document.fonts) return; loadedFonts.add(f);
  const css = fontLink(f);
  if(css){ const smp = (FONT_LIB.find(x => x[0] === f) || [])[2] || ''; css.then(() => Promise.all([document.fonts.load(`700 40px "${f}"`, smp + ' Aa'), document.fonts.load(`400 40px "${f}"`, smp + ' Aa')])).then(() => { try{ if(typeof render === 'function') render(performance.now()); }catch(e){} }).catch(()=>{}); return; }
  Promise.all([document.fonts.load(`700 40px "${f}"`, 'ಕನ್ನಡ Aa'), document.fonts.load(`400 40px "${f}"`, 'ಕನ್ನಡ Aa')]).then(() => { try{ if(!exporting) render(performance.now()); }catch(e){} }).catch(()=>{});
}
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); if(ctx.roundRect) ctx.roundRect(x,y,w,h,r); else ctx.rect(x,y,w,h); }
const LETTER_ANIMS = ['letterPop','letterFade','letterBounce','wordPop'];
function ovAnim(o,lt,u){
  const R={s:1,sx:1,sy:1,dx:0,dy:0,r:0,a:1,ch:1,blur:0,fx:null,mT:0,mP:0,wipe:1,hue:0,inK:1,outK:1};
  const ap = (n,k) => { k=clamp(k,0,1); const e=1-Math.pow(1-k,3);
    switch(n){
      case 'fade': R.a*=e; break;
      case 'pop': R.s*=Math.max(0,backOut(k)); R.a*=Math.min(1,k*3); break;
      case 'zoom': R.s*=1.8-.8*e; R.a*=e; break;
      case 'slideUp': R.dy+=(1-e)*u*.25; R.a*=e; break;
      case 'slideDown': R.dy-=(1-e)*u*.25; R.a*=e; break;
      case 'slideL': R.dx+=(1-e)*u*.35; R.a*=e; break;
      case 'slideR': R.dx-=(1-e)*u*.35; R.a*=e; break;
      case 'typewriter': R.ch=Math.min(R.ch,k); break;
      case 'bounce': R.dy-=Math.abs(Math.cos(k*Math.PI*2.5))*(1-k)*u*.15; R.a*=Math.min(1,k*4); break;
      case 'spin': R.r+=(1-e)*Math.PI*2; R.s*=e; break;
      case 'blur': R.blur+=(1-e)*20; R.a*=e; break;
      case 'flipX': R.sx*=Math.max(.001,e); break;
      case 'flipY': R.sy*=Math.max(.001,e); break;
      case 'dropIn': R.dy-=(1-bounceOut(k))*u*.6; R.a*=Math.min(1,k*5); break;
      case 'riseUp': R.dy+=(1-e)*u*.08; R.a*=e; break;
      case 'rotateIn': R.r-=(1-e)*Math.PI/2; R.a*=e; R.s*=.7+.3*e; break;
      case 'growIn': R.s*=Math.max(0,backOut(k)); break;
      case 'shrinkIn': R.s*=1.6-.6*e; R.a*=e; break;
      case 'glitchIn': R.fx=['rgbsplit',1-k]; R.dx+=Math.sin(k*97)*u*.025*(1-k); R.a*=k>.15?1:k/.15; break;
      case 'swingIn': R.r+=Math.sin(k*Math.PI*3)*(1-k)*.5; R.a*=Math.min(1,k*3); break;
      case 'tiltIn': R.r+=(1-e)*.3; R.dx+=(1-e)*u*.2; R.a*=e; break;
      case 'wipeIn': R.wipe=Math.min(R.wipe,e); R.mT=13; R.mP=e; break;
      case 'flashIn': R.fx=['bright',1-e]; R.a*=Math.min(1,k*4); break;
      default: if(typeof animLibApply === 'function') animLibApply(n,k,R,u,u);
    }};
  const A=o.anim, D=o.dur;
  if(A.in!=='none' && lt < A.inDur){ R.inK=clamp(lt/A.inDur,0,1); ap(A.in, R.inK); }
  if(A.out!=='none' && lt > D-A.outDur){ R.outK=clamp((D-lt)/A.outDur,0,1); ap(A.out, R.outK); }
  switch(A.loop){
    case 'pulse': R.s*=1+.06*Math.sin(lt*6); break;
    case 'shake': R.dx+=Math.sin(lt*50)*u*.006; R.dy+=Math.cos(lt*43)*u*.004; break;
    case 'float': R.dy+=Math.sin(lt*2.5)*u*.02; break;
    case 'swing': R.r+=.12*Math.sin(lt*3); break;
    case 'blink': if(Math.sin(lt*8) < -.3) R.a*=.15; break;
    case 'heartbeat': { const p=lt%1; if(p<.5) R.s*=1+.12*Math.max(0,Math.sin(p*Math.PI*4)); break; }
    case 'rotate': R.r+=lt*2; break;
    case 'jelly': R.sx*=1+.08*Math.sin(lt*9); R.sy*=1-.08*Math.sin(lt*9); break;
    case 'rock': R.r+=.1*Math.sin(lt*4); break;
    case 'bounceLoop': R.dy-=Math.abs(Math.sin(lt*4))*u*.04; break;
    case 'zoomInOut': R.s*=1+.12*Math.sin(lt*2); break;
    case 'glitchLoop': if(Math.sin(lt*13)>.75){ R.fx=['rgbsplit',.8]; R.dx+=Math.sin(lt*91)*u*.01; } break;
    case 'rainbow': R.hue=(lt*120)%360+1; break;
    default: if(A.loop !== 'none' && typeof loopLibApply === 'function') loopLibApply(A.loop,lt,D,R,u,u);
  }
  return R;
}
function wrapLine(ctx,line,maxW){
  const words=line.split(' '), out=[]; let cur='';
  for(const w of words){ const t=cur?cur+' '+w:w; if(cur && ctx.measureText(t).width>maxW){ out.push(cur); cur=w; } else cur=t; }
  out.push(cur); return out;
}
function drawText(ctx,o,an,u,size,maxW,lt){
  ensureFont(o.font);
  const px = size*u/720, lh = px*1.3;
  ctx.font = `${o.italic?'italic ':''}${o.bold?700:400} ${px}px "${o.font}","Noto Sans Kannada",sans-serif`;
  let lines = (o.text || '').split('\n');
  if(maxW) lines = lines.flatMap(l => wrapLine(ctx,l,maxW));
  if(!lines.length) lines=[' '];
  const w = Math.max(px*.5, ...lines.map(l => ctx.measureText(l).width)), h = lh*lines.length;
  const padX = px*.35, padY = px*.18, color = an.hue ? `hsl(${an.hue},95%,62%)` : o.color;
  if(an.wipe < 1){ ctx.save(); ctx.beginPath(); ctx.rect(-w/2-padX,-h/2-padY,(w+padX*2)*an.wipe,h+padY*2); ctx.clip(); }
  if(o.bubble && typeof drawBubble === 'function') drawBubble(ctx, o.bubble, w+padX*2, h+padY*2, px, o.bubColor||'#ffffff', o.bubStroke||'#111111');
  else if(o.bgOn){ ctx.fillStyle = hexA(o.bgColor, o.bgAlpha/100); rr(ctx,-w/2-padX,-h/2-padY,w+padX*2,h+padY*2,px*.22); ctx.fill(); }
  ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const TS = o.tfx && typeof TFX_MAP !== 'undefined' ? TFX_MAP[o.tfx] : null;
  const glyph = (s,x,y) => {
    if(TS){ drawStyledText(ctx, s, x, y, px, TS.st); return; }
    if(o.shadow > 0){ ctx.shadowColor = o.shadowColor; ctx.shadowBlur = o.shadow*px/50; }
    if(o.strokeW > 0){ ctx.strokeStyle = o.stroke; ctx.lineWidth = o.strokeW*px/40; ctx.strokeText(s,x,y); ctx.shadowColor = 'transparent'; }
    ctx.fillStyle = color; ctx.fillText(s,x,y); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
  };
  const A = o.anim, inL = an.inK < 1 && LETTER_ANIMS.includes(A.in), outL = an.outK < 1 && LETTER_ANIMS.includes(A.out);
  if(o.curve && Math.abs(o.curve) > 1 && lines.length === 1 && !inL && !outL){   // text on an arc
    let g = graphemes(lines[0]); if(an.ch < 1) g = g.slice(0, Math.ceil(g.length*an.ch));
    const ang = o.curve/100*Math.PI*1.6, R = w/Math.max(.05, Math.abs(ang)), dir = Math.sign(ang);
    ctx.textAlign = 'center'; let pos = -w/2;
    for(const ch of g){
      const cw = ctx.measureText(ch).width, th = (pos + cw/2)/R;
      ctx.save(); ctx.translate(Math.sin(th)*R, dir*(R - Math.cos(th)*R) - dir*R*(1-Math.cos(ang/2))/2); ctx.rotate(th*dir); glyph(ch, 0, 0); ctx.restore();
      pos += cw;
    }
  } else if(!inL && !outL && A.loop !== 'wave'){
    let show = lines;
    if(an.ch < 1){
      let n = Math.ceil(graphemes(lines.join('\n')).length*an.ch); show = [];
      for(const l of lines){ const g = graphemes(l); if(n <= 0) break; show.push(g.slice(0,n).join('')); n -= g.length + 1; }
    }
    ctx.textAlign = o.align;
    const x = o.align==='left' ? -w/2 : o.align==='right' ? w/2 : 0;
    show.forEach((l,i) => glyph(l, x, -h/2 + lh*(i+.5)));
  } else {
    ctx.textAlign = 'left';
    const words = (inL && A.in==='wordPop') || (outL && A.out==='wordPop');
    const all = lines.map(l => graphemes(l)), total = all.reduce((a,g)=>a+g.length,0) || 1;
    const wordsTotal = (lines.join(' ').match(/\S+/g) || ['']).length;
    let idx = 0, widx = 0;
    const kOf = (k,unit,units) => clamp((k - unit/Math.max(1,units)*.7)/.3, 0, 1);
    all.forEach((g,li) => {
      const lw = ctx.measureText(lines[li]).width; let x = o.align==='left' ? -w/2 : o.align==='right' ? w/2-lw : -lw/2;
      const y = -h/2 + lh*(li+.5);
      for(const ch of g){
        const cw = ctx.measureText(ch).width, unit = words ? widx : idx, units = words ? wordsTotal : total;
        let a = 1, sc = 1, dy = 0;
        const fx = (type,k) => {
          if(type==='letterPop' || type==='wordPop'){ sc*=Math.max(0,backOut(k)); a*=Math.min(1,k*3); }
          else if(type==='letterFade'){ a*=k; dy+=(1-k)*px*.5; }
          else if(type==='letterBounce'){ dy-=(1-bounceOut(k))*px*1.4; a*=Math.min(1,k*4); }
        };
        if(inL) fx(A.in, kOf(an.inK,unit,units));
        if(outL) fx(A.out, kOf(an.outK,unit,units));
        if(A.loop==='wave') dy += Math.sin(lt*5 - idx*.55)*px*.18;
        if(a > .003 && sc > .003){ ctx.save(); ctx.globalAlpha *= a; ctx.translate(x+cw/2, y+dy); ctx.scale(sc,sc); glyph(ch,-cw/2,0); ctx.restore(); }
        x += cw; idx++; if(ch === ' ') widx++;
      }
      widx++;
    });
  }
  if(an.wipe < 1) ctx.restore();
  return {hw:w/2+padX, hh:h/2+padY};
}
function drawSticker(ctx,o,u,size){
  const px = size*u/720;
  if(o.text && o.text.startsWith('svg:')){
    const img = typeof SVGIMG !== 'undefined' ? SVGIMG[o.text.slice(4)] : null;
    if(img && img.complete && img.naturalWidth) ctx.drawImage(img,-px*.6,-px*.6,px*1.2,px*1.2);
    return {hw:px*.6, hh:px*.6};
  }
  ctx.font = `${px}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(o.text, 0, px*.05);
  return {hw:px*.6, hh:px*.6};
}
function mediaEl(o){
  if(o.type === 'image'){ const im = images[o.mediaId]; if(im && o.magic && o.magic.on && typeof magicFrame === 'function'){ const mf = magicFrame(o, S.time - o.start, o.dur); if(mf) return mf; } return im; }
  return ovVids[o.id]; }
function elSize(el){ return el.tagName === 'IMG' ? [el.naturalWidth, el.naturalHeight] : el.tagName === 'CANVAS' ? [el.width, el.height] : [el.videoWidth, el.videoHeight]; }
function drawMediaLayer(ctx,o,an,cx,cy,rot,size,opacity,u){
  const el = mediaEl(o); if(!el) return null;
  const [vw,vh] = elSize(el), isV = el.tagName === 'VIDEO';
  if(!vw) return null;
  if(!ovTex[o.id]) ovTex[o.id] = {tex:mkTex(), ok:false};
  const OT = ovTex[o.id], fresh = !isV || (el.readyState >= 2 && !el.seeking);
  if(!fresh && !OT.ok && !exporting) return null;
  if(isV && el.readyState < 2 && (exporting || !OT.ok)) return null;
  const W=cv.width, H=cv.height, w=u*size/100, h=w*vh/vw, a=clamp(opacity/100*an.a,0,1), fm=fxMotion(o,W,H);
  const hw = w*an.s*fm.s*an.sx/2, hh = h*an.s*fm.s*an.sy/2;
  if(a > .001){
    gl.viewport(0,0,W,H); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, OT.tex);
    if(fresh || exporting){ try{ gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,el); OT.ok = true; }catch(e){ return null; } }
    gl.uniform2f(U.u_px,1/vw,1/vh); setFx(o); setMask(o,vw,vh); setChroma(o); setEffect(o); setSeg(o,el);
    if(an.fx){ gl.uniform1f(U.u_fx, FX_T[an.fx[0]]||0); gl.uniform1f(U.u_fxA, an.fx[1]); gl.uniform1f(U.u_sec, S.time); }
    gl.uniform1f(U.u_trT, an.mT||0); gl.uniform1f(U.u_trP, an.mP||0);
    gl.uniform2f(U.u_half,(o.flip?-1:1)*hw, hh); gl.uniform2f(U.u_off,cx+fm.dx-W/2,H/2-cy-fm.dy);
    gl.uniform1f(U.u_rot,-rot); gl.uniform1f(U.u_alpha,1); gl.uniform1f(U.u_blur,0);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    gl.uniform1f(U.u_trT, 0);
    ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = o.blend || 'source-over';
    if(an.blur > .5) ctx.filter = `blur(${an.blur*u/720}px)`;
    ctx.drawImage(cv,0,0); ctx.restore();
  }
  geo[o.id] = {cx:cx+fm.dx, cy:cy+fm.dy, rot, hw, hh, flip:!!o.flip};
  return {hw:w/2, hh:h/2};
}
// adjustment / filter layer: re-grades everything below it on the timeline
let adjTex = null;
function drawAdjustLayer(ctx,o,an,OP){
  const W = cv.width, H = cv.height, a = clamp(OP/100*an.a, 0, 1); if(a <= .001) return;
  gl.viewport(0,0,W,H); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
  if(!adjTex) adjTex = mkTex();
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, adjTex);
  try{ gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,out); }catch(e){ return; }
  gl.uniform2f(U.u_px,1/W,1/H); setFx(o); gl.uniform1f(U.u_mT,0); gl.uniform1f(U.u_ck,0); setEffect(o); setSeg({},null);
  gl.uniform1f(U.u_trT,0); gl.uniform2f(U.u_half,W/2,H/2); gl.uniform2f(U.u_off,0,0); gl.uniform1f(U.u_rot,0); gl.uniform1f(U.u_alpha,1); gl.uniform1f(U.u_blur,0);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(cv,0,0); ctx.restore();
}
function drawSel(ctx,h,u){
  ctx.save(); ctx.translate(h.cx,h.cy); ctx.rotate(h.rot); ctx.scale(h.s||.001,h.s||.001);
  ctx.strokeStyle = '#1fd1d1'; ctx.lineWidth = Math.max(2,u/360)/Math.max(.2,h.s); ctx.setLineDash([8,6]);
  ctx.strokeRect(-h.hw,-h.hh,h.hw*2,h.hh*2); ctx.restore();
}
function drawOverlays(ctx){
  const W=out.width, H=out.height, u=Math.min(W,H), t=S.time;
  hits.clear();
  for(const o of zOrder()){
    if(t < o.start || t >= o.start+o.dur) continue;
    if(S.trk && S.trk.ov[o.track] && S.trk.ov[o.track].hide) continue;
    const lt = t - o.start, an = ovAnim(o, lt, u);
    const X=ev(o,'x',lt), Y=ev(o,'y',lt), SZ=ev(o,'size',lt), R=ev(o,'rot',lt), OP=ev(o,'opacity',lt);
    const cx = X/100*W + an.dx, cy = Y/100*H + an.dy, rot = R*Math.PI/180 + an.r;
    let box = null;
    if(o.type === 'adjust'){ drawAdjustLayer(ctx,o,an,OP); continue; }
    if(isMediaOv(o)) box = drawMediaLayer(ctx,o,an,cx,cy,rot,SZ,OP,u);
    else if(o.type==='gfx'){ box = typeof drawGfxItem === 'function' ? drawGfxItem(ctx,o,an,cx,cy,rot,SZ,OP,u,lt) : null; }
    else {
      ctx.save(); ctx.globalCompositeOperation = o.blend || 'source-over';
      ctx.translate(cx,cy); ctx.rotate(rot); ctx.scale(an.s*an.sx, an.s*an.sy);
      ctx.globalAlpha = clamp(OP/100*an.a, 0, 1);
      if(an.mT && an.mT !== 13){ if([1,3,10,11].includes(an.mT)){ ctx.beginPath(); ctx.arc(0,0,Math.max(.1,an.mP)*u*.75/Math.max(.05,an.s),0,7); ctx.clip(); } else ctx.globalAlpha *= clamp(an.mP,0,1); }
      if(an.blur > .5) ctx.filter = `blur(${an.blur*u/720}px)`;
      box = o.type==='text' ? drawText(ctx,o,an,u,SZ,o.caption ? W*.86/Math.max(.2,an.s) : 0,lt) : drawSticker(ctx,o,u,SZ);
      ctx.restore();
      if(box) geo[o.id] = {cx, cy, rot, hw:box.hw*an.s, hh:box.hh*an.s, flip:false};
    }
    if(box){
      const h = {cx, cy, rot, s:an.s, hw:box.hw, hh:box.hh};
      hits.set(o.id, h);
      
    }
  }
}

/* ================= LUTs ================= */
function addLut(name,n,data,id,custom){
  const max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if(n*n > max) throw new Error(`LUT size ${n} is too large (device max ${Math.floor(Math.sqrt(max))})`);
  const t = mkTex(); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,n*n,n,0,gl.RGBA,gl.UNSIGNED_BYTE,data);
  const l = {id:id||nid(), name, n, tex:t, custom:!!custom, data:custom?data:null}; S.luts.push(l); return l;
}
function parseCube(txt){
  let n=0; const vals=[];
  for(const line of txt.split(/\r?\n/)){
    const t=line.trim(); if(!t || t[0]==='#') continue;
    if(/^LUT_3D_SIZE/i.test(t)){ n=parseInt(t.split(/\s+/)[1]); continue; }
    if(/^[A-Za-z_]/.test(t)) continue;
    const p=t.split(/\s+/).map(Number); if(p.length>=3 && !isNaN(p[0])) vals.push(p[0],p[1],p[2]);
  }
  if(!n || vals.length < n*n*n*3) throw new Error('Not a valid 3D .cube LUT');
  const data = new Uint8Array(n*n*n*4);
  for(let b=0;b<n;b++) for(let g=0;g<n;g++) for(let r=0;r<n;r++){
    const i=(r+g*n+b*n*n)*3, o=(g*n*n+b*n+r)*4;
    data[o]=clamp(vals[i]*255,0,255); data[o+1]=clamp(vals[i+1]*255,0,255); data[o+2]=clamp(vals[i+2]*255,0,255); data[o+3]=255;
  }
  return {n, data};
}
function makeLut(id,name,fn,n=17){
  const data=new Uint8Array(n*n*n*4);
  for(let b=0;b<n;b++) for(let g=0;g<n;g++) for(let r=0;r<n;r++){
    const o=fn(r/(n-1),g/(n-1),b/(n-1)), idx=(g*n*n+b*n+r)*4;
    data[idx]=clamp(o[0]*255,0,255); data[idx+1]=clamp(o[1]*255,0,255); data[idx+2]=clamp(o[2]*255,0,255); data[idx+3]=255;
  }
  addLut(name,n,data,id,false);
}
function makeBuiltinLuts(){
  const lum=(r,g,b)=>.299*r+.587*g+.114*b, sc=x=>x*x*(3-2*x);
  makeLut('lut_teal','Teal & Orange',(r,g,b)=>{const l=lum(r,g,b)-.5;return [sc(r)+l*.25,g+l*.05,sc(b)-l*.25];});
  makeLut('lut_warm','Warm Film',(r,g,b)=>[Math.pow(r,.88)*1.02,Math.pow(g,.95),Math.pow(b,1.12)*.92+.03]);
  makeLut('lut_cyber','Cyberpunk',(r,g,b)=>[r*.9+b*.25,g*.8,b*1.1+.08]);
  makeLut('lut_bleach','Bleach',(r,g,b)=>{const l=lum(r,g,b);return [sc(r*.5+l*.5),sc(g*.5+l*.5),sc(b*.5+l*.5)];});
  makeLut('lut_sepia','Sepia',(r,g,b)=>[r*.393+g*.769+b*.189,r*.349+g*.686+b*.168,r*.272+g*.534+b*.131]);
  makeLut('lut_matrix','Matrix',(r,g,b)=>[r*.7,g*1.15+.03,b*.7]);
  makeLut('lut_noir','Noir',(r,g,b)=>{const l=sc(sc(lum(r,g,b)));return [l,l,l];});
}

/* ================= CHROMA KEY HELPERS ================= */
function autoKey(o){
  const el = mediaEl(o); if(!el) return;
  const [vw] = elSize(el); if(!vw) return;
  const c = document.createElement('canvas'); c.width = 32; c.height = 32;
  const x = c.getContext('2d', {willReadFrequently:true}); x.drawImage(el,0,0,32,32);
  const d = x.getImageData(0,0,32,32).data; let r=0,g=0,b=0,n=0;
  for(const [sx,sy] of [[0,0],[28,0],[0,28],[28,28]]) for(let yy=sy;yy<sy+4;yy++) for(let xx=sx;xx<sx+4;xx++){
    const i=(yy*32+xx)*4; r+=d[i]; g+=d[i+1]; b+=d[i+2]; n++;
  }
  o.ck.color = toHex(r/n,g/n,b/n);
}
function setPick(on){ S.pick = on; out.classList.toggle('pick', on); $('#pickTip').style.display = on ? 'block' : 'none'; }

/* ================= IMPORT ================= */
function waitFrame(v){ return new Promise(r=>{ let done=false; const fin=()=>{ if(!done){ done=true; r(); } }; if(v.requestVideoFrameCallback) v.requestVideoFrameCallback(fin); setTimeout(fin,300); }); }
function seekTo(v,t){ return new Promise(res=>{ let done=false; const fin=()=>{ if(done) return; done=true; v.removeEventListener('seeked',fin); res(); }; v.addEventListener('seeked',fin); v.currentTime=t; setTimeout(fin,4000); }); }
function frameLuma(c){ const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data; let s=0,n=0; for(let i=0;i<d.length;i+=32){ s+=d[i]+d[i+1]+d[i+2]; n++; } return s/n/3; }
async function probe(url){
  const v=mkVideo(null); v.muted=true;
  try{
    await new Promise((res,rej)=>{ v.onloadedmetadata=res; v.onerror=()=>rej(new Error('Cannot read this video — convert it to MP4 (H.264) and try again')); v.src=url; });
    if(!isFinite(v.duration)) await seekTo(v,1e7);
    const dur=v.duration||1;
    if(!v.videoWidth) throw new Error('Cannot decode the video picture (it may be HEVC/H.265). In phone camera settings choose "Most compatible / H.264" or convert to MP4 H.264.');
    const c=document.createElement('canvas'); c.width=160; c.height=Math.round(160*v.videoHeight/v.videoWidth)||90;
    let best=null, bestL=-1;
    for(const t of [Math.min(1,dur/2), dur*.35, dur*.65, .05]){
      await seekTo(v, clamp(t,0,Math.max(0,dur-.05))); await waitFrame(v);
      c.getContext('2d').drawImage(v,0,0,c.width,c.height); const L=frameLuma(c);
      if(L>bestL){ bestL=L; best=c.toDataURL('image/jpeg',.75); }
      if(L>14) break;
    }
    return {duration:dur,w:v.videoWidth,h:v.videoHeight,thumb:best};
  } finally { dropEl(v); }
}
async function genStrip(m){
  if(!m || m.type!=='video' || !m.url || m.strip || m._stripping) return;
  m._stripping=true;
  const v=mkVideo(null); v.muted=true;
  try{
    await new Promise((res,rej)=>{ v.onloadedmetadata=res; v.onerror=rej; v.src=m.url; });
    const n=clamp(Math.ceil(m.duration/1.5),4,30), fh=48, fw=Math.max(16,Math.round(fh*m.w/m.h));
    const c=document.createElement('canvas'); c.width=fw*n; c.height=fh; const x=c.getContext('2d');
    for(let i=0;i<n;i++){ await seekTo(v,Math.min(m.duration-.05,(i+.5)*m.duration/n)); await waitFrame(v); x.drawImage(v,i*fw,0,fw,fh); }
    m.strip=c.toDataURL('image/jpeg',.6); m.stripN=n;
    if(typeof renderTimeline==='function'){ layout(); renderTimeline(); }
  }catch(e){} finally{ m._stripping=false; dropEl(v); }
}
function loadImg(url){ return new Promise((res,rej)=>{ const img=new Image(); img.onload=()=>res(img); img.onerror=()=>rej(new Error('Cannot read this photo')); img.src=url; }); }
async function probeImage(url){
  const img=await loadImg(url);
  const c=document.createElement('canvas'); c.width=160; c.height=Math.round(160*img.naturalHeight/img.naturalWidth)||90;
  c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  return {img,w:img.naturalWidth,h:img.naturalHeight,thumb:c.toDataURL('image/png')};
}
function probeAudio(url){
  return new Promise((res,rej)=>{
    const a=new Audio(); a.preload='auto';
    a.onloadedmetadata=()=>{
      if(isFinite(a.duration)) return res(a.duration);
      a.ontimeupdate=()=>{ if(isFinite(a.duration)){ a.ontimeupdate=null; res(a.duration); } };
      a.currentTime=1e7;
    };
    a.onerror=()=>rej(new Error('Cannot read this audio'));
    a.src=url;
  });
}
function registerMedia(m,f){
  mediaBlobs[m.id]=f; S.media.push(m);
  if(DB && S.project) idbPut('blobs',{id:m.id,project:S.project.id,blob:f}).catch(()=>{});
  computeWave(m);
  return m;
}
async function addVideoMedia(f){
  const url=URL.createObjectURL(f), info=await probe(url);
  const m=registerMedia({id:nid(),name:f.name,url,type:'video',duration:info.duration,thumb:info.thumb,w:info.w,h:info.h},f);
  genStrip(m); return m;
}
async function addImageMedia(f){
  const url=URL.createObjectURL(f), info=await probeImage(url);
  const m={id:nid(),name:f.name,url,type:'image',duration:3600,thumb:info.thumb,w:info.w,h:info.h};
  images[m.id]=info.img; return registerMedia(m,f);
}
async function addAudioMedia(f,knownDur){
  const url=URL.createObjectURL(f);
  let dur=knownDur; try{ dur=await probeAudio(url); }catch(e){ if(!knownDur) throw e; }
  if(!isFinite(dur)||!dur) dur=knownDur||1;
  return registerMedia({id:nid(),name:f.name,url,type:'audio',duration:dur,thumb:'',w:0,h:0},f);
}
async function importFiles(files){
  // v18: import only adds files to the Media library — the user chooses what goes on the timeline (＋ button or drag)
  let n = 0;
  for(const f of files){
    try{
      if(f.type.startsWith('video/')){ await addVideoMedia(f); n++; }
      else if(f.type.startsWith('image/')){ await addImageMedia(f); n++; }
      else if(f.type.startsWith('audio/')){ await addAudioMedia(f); n++; }
    }catch(e){ alert(f.name+': '+e.message); }
  }
  if(n && S.ltab !== 'media'){ S.ltab = 'media'; if(typeof renderLeft === 'function') renderLeft(); }
  renderMediaPanel(); updateHint();
  if(n && typeof toast === 'function') toast(`${n} file${n>1?'s':''} imported — click ＋ or drag to the timeline`);
}
function addPip(m){
  const o = m.type === 'video'
    ? newOverlay('video',{mediaId:m.id, dur:m.duration, size:50})
    : newOverlay('image',{mediaId:m.id});
  addOverlay(o,'ovbasic');
}
function addAudioAt(m,extra){ pushUndo(); const a=newAudioItem(m,extra); S.audios.push(a); S.sel=a.id; afterEdit(); }

/* ---- waveform (decoded at 8 kHz to save memory) ---- */
async function computeWave(m){
  try{
    const blob=mediaBlobs[m.id]; if(!blob || m.type==='image' || blob.size>300e6) return;
    const ab=await new OfflineAudioContext(1,1,8000).decodeAudioData(await blob.arrayBuffer());
    const ch=ab.getChannelData(0), perSec=40, n=Math.max(1,Math.ceil(ab.duration*perSec)), step=ab.sampleRate/perSec;
    const peaks=new Float32Array(n); let mx=1e-4;
    for(let i=0;i<n;i++){ let p=0; const s=Math.floor(i*step), e=Math.min(ch.length,Math.floor((i+1)*step)); for(let j=s;j<e;j+=2){ const v=Math.abs(ch[j]); if(v>p) p=v; } peaks[i]=p; if(p>mx) mx=p; }
    if(mx<.002) return;   // silent / no audio track
    const draw=(W,H,col)=>{ const c=document.createElement('canvas'); c.width=W; c.height=H; const x=c.getContext('2d'); x.fillStyle=col;
      for(let i=0;i<W;i++){ const p=peaks[Math.floor(i*n/W)]/mx, h=Math.max(1,p*(H-2)); x.fillRect(i,(H-h)/2,1,h); } return c; };
    draw(Math.min(n,16000),48,'rgba(150,200,255,.95)').toBlob(b=>{ if(m.wave) URL.revokeObjectURL(m.wave); m.wave=URL.createObjectURL(b); layout(); renderTimeline(); });
    if(m.type==='audio'){ m.thumb=draw(160,70,'#b9a6ff').toDataURL('image/png'); renderMediaPanel(); }
  }catch(e){}
}

/* ================= EDIT OPERATIONS ================= */
function snap(){ return JSON.stringify({c:S.clips, o:S.overlays, a:S.audios}); }
function pushUndo(){ undoS.push(snap()); if(undoS.length>80) undoS.shift(); redoS.length=0; }
function restore(s){
  pause(); const d=JSON.parse(s); S.clips=d.c; S.overlays=d.o||[]; S.audios=d.a||[]; [...S.clips,...S.overlays,...S.audios].forEach(normItem);
  active=null; dropAllChains(); dropAudChains(); pairKey='';
  if(!selItem()) S.sel = S.clips[0] ? S.clips[0].id : null;
  afterEdit();
}
function undo(){ if(!undoS.length) return; redoS.push(snap()); restore(undoS.pop()); }
function redo(){ if(!redoS.length) return; undoS.push(snap()); restore(redoS.pop()); }
var editVer = 0;
function afterEdit(){ editVer++; layout(); renderTimeline(); renderInspector(); seek(Math.min(S.time,S.total)); $('#hint').style.display=(S.clips.length||S.overlays.length||S.audios.length)?'none':''; updateHint(); }
function updateHint(){ const h = $('#hint'); if(h) h.innerHTML = S.media.length ? '<b>Add to timeline</b><br>Click <b>＋</b> on a file in Media, or drag it onto the timeline' : '<b>Add media</b><br>Press <b>Import</b> on the left or drag video / photo / music here'; }
function split(){
  const fr=selFree();
  if(fr){
    const [o,arr]=fr;
    if(S.time-o.start<.1 || o.start+o.dur-S.time<.1) return;
    pushUndo(); const b=deep(o); b.id=nid();
    const cut=S.time-o.start;
    b.start=S.time; b.dur=o.dur-cut; o.dur=cut;
    if(o.anim){ o.anim.out='none'; b.anim.in='none'; }
    if(o.type==='audio'){ o.fadeOut=0; b.fadeIn=0; }
    b.in=o.in+cut*o.speed; if(b.kf) b.kf=b.kf.map(k=>({...k,t:k.t-cut}));
    arr.splice(arr.indexOf(o)+1,0,b); S.sel=b.id; afterEdit(); return;
  }
  const c=clipAt(S.time); if(!c) return;
  const d=derived[c.id], lt=S.time-d.start; if(lt<.1 || d.dur-lt<.1) return;
  pushUndo();
  const src=localToSrc(c,lt), b=deep(c); b.id=nid();
  c.out=src; b.in=src; c.anim.out='none'; b.anim.in='none'; b.trans={type:'none',dur:.6};
  S.clips.splice(S.clips.indexOf(c)+1,0,b); S.sel=b.id; afterEdit();
}
function del(){
  const fr=selFree();
  if(fr){ const [o,arr]=fr; pushUndo(); arr.splice(arr.indexOf(o),1); S.sel=null; afterEdit(); return; }
  const c=selClip(); if(!c) return;
  pushUndo(); const i=S.clips.indexOf(c); S.clips.splice(i,1);
  if(vids[c.id]) vids[c.id].pause();
  if(active===c){ active=null; dropChainFor(c.id); }
  S.sel=(S.clips[i]||S.clips[i-1]||{}).id||null; afterEdit();
}
function dup(){
  const fr=selFree();
  if(fr){ const [o,arr]=fr; pushUndo(); const b=deep(o); b.id=nid(); b.start=o.start+o.dur; arr.push(b); S.sel=b.id; afterEdit(); return; }
  const c=selClip(); if(!c) return;
  pushUndo(); const b=deep(c); b.id=nid();
  S.clips.splice(S.clips.indexOf(c)+1,0,b); S.sel=b.id; afterEdit();
}
function move(dir){
  const fr=selFree();
  if(fr){ pushUndo(); fr[0].start=Math.max(0,fr[0].start+dir*.1); layout(); renderTimeline(); return; }
  const c=selClip(); if(!c) return; const i=S.clips.indexOf(c), j=i+dir;
  if(j<0 || j>=S.clips.length) return;
  pushUndo(); [S.clips[i],S.clips[j]]=[S.clips[j],S.clips[i]]; afterEdit();
}
function select(id){
  S.sel=id; setPick(false);
  const o=selOv()||selAud(), c=selClip();
  if(o){ if(S.time<o.start || S.time>=o.start+o.dur) seek(o.start+.01); }
  else if(c){ const d=derived[c.id]; if(S.time<d.start || S.time>=d.start+d.dur) seek(d.start+.01); }
  renderTimeline(); renderInspector();
}
function addOverlay(o, tab){ pushUndo(); S.overlays.push(o); S.sel=o.id; S.tabOv=tab; afterEdit(); }
function ovAction(a){
  const o=selOv(); if(!o) return;
  if(a==='del') return del();
  if(a==='dup') return dup();
  pushUndo();
  if(a==='center'){ setVal(o,'x',50); setVal(o,'y',50); }
  if(a==='fillv' && isMediaOv(o)){ const el=mediaEl(o); if(el){ const [vw,vh]=elSize(el); const W=out.width,H=out.height,u=Math.min(W,H); setVal(o,'size',Math.round(Math.max(W/u,H/u*vw/vh)*100)); setVal(o,'x',50); setVal(o,'y',50); } }
  if(a==='capall'){ const keys=['font','bold','italic','align','color','stroke','strokeW','bgOn','bgColor','bgAlpha','shadow','shadowColor','size','y','anim']; for(const x of S.overlays) if(x!==o && x.caption) for(const k of keys) x[k]=deep(o[k]); }
  if(a==='up' || a==='down'){   // move one layer up / down: swap with whatever overlaps on the neighbour track
    const t0=o.track|0, t1=a==='up'?t0+1:t0-1;
    if(t1>=0){ for(const x of S.overlays) if(x!==o && x.track===t1 && overlapT(x,o)) x.track=t0; o.track=t1; layout(); }
  }
  renderInspector(); renderTimeline();
}
function extractAudio(c){
  const m=media(c.mediaId); if(!m || m.type!=='video') return;
  pushUndo();
  const d=derived[c.id];
  const a=newAudioItem(m,{kind:'extract',start:d.start,in:c.in,dur:(c.out-c.in)/c.speed,speed:c.speed,audio:deep(c.audio),volume:c.volume,linkClip:c.id});
  c.prevVolume=c.volume||100; c.extracted=a.id; c.volume=0; S.audios.push(a); S.sel=a.id; afterEdit();
}
// undo a wrong "extract audio": remove the extracted track and give the sound back to the clip
function restoreAudio(c){
  if(!c) return; pushUndo();
  S.audios = S.audios.filter(a => !(a.linkClip === c.id || a.id === c.extracted));
  c.volume = c.prevVolume || 100; delete c.extracted; delete c.prevVolume; S.sel = c.id; afterEdit();
}
function toggleMuteItem(it){ if(!it) return; pushUndo(); if(it.volume > 0){ it.prevVolume = it.volume; it.volume = 0; } else it.volume = it.prevVolume || 100; afterEdit(); }
let attrClip = null;
const ATTR_KEYS = ['filter','filterAmt','adj','lut','lutAmt','fx','bfx','mask','rt','ck','anim','audio','opacity'];
function copyAttrs(it){ if(!it) return; attrClip = {}; for(const k of ATTR_KEYS) if(it[k] !== undefined) attrClip[k] = deep(it[k]); }
function pasteAttrs(it){ if(!it || !attrClip) return; pushUndo(); for(const k in attrClip) if(it[k] !== undefined) it[k] = deep(attrClip[k]); if(it.audio) (chains.has(it.id) ? rebuildChain(it) : rebuildAudChain(it)); afterEdit(); }
// remove a media file from the project (and everything on the timeline that uses it)
async function deleteMedia(id){
  const m = media(id); if(!m) return;
  const used = S.clips.filter(c=>c.mediaId===id).length + S.overlays.filter(o=>o.mediaId===id).length + S.audios.filter(a=>a.mediaId===id).length;
  if(!confirm(`"${m.name}" — delete from project?` + (used ? `\n(Used ${used} time(s) on the timeline — those will be removed too)` : ''))) return false;
  pause();
  for(const c of S.clips.filter(c=>c.mediaId===id)){ if(vids[c.id]){ dropEl(vids[c.id]); delete vids[c.id]; } dropChainFor(c.id); if(active===c) active=null; }
  for(const o of S.overlays.filter(o=>o.mediaId===id)){ if(ovVids[o.id]){ dropEl(ovVids[o.id]); delete ovVids[o.id]; } }
  for(const a of S.audios.filter(a=>a.mediaId===id)){ if(audEls[a.id]){ dropEl(audEls[a.id]); delete audEls[a.id]; } if(audChains[a.id]){ killChain(audChains[a.id]); delete audChains[a.id]; } }
  S.clips = S.clips.filter(c=>c.mediaId!==id); S.overlays = S.overlays.filter(o=>o.mediaId!==id); S.audios = S.audios.filter(a=>a.mediaId!==id);
  S.media = S.media.filter(x=>x!==m); delete mediaBlobs[id]; delete images[id];
  if(m.url) URL.revokeObjectURL(m.url); if(m.wave) URL.revokeObjectURL(m.wave);
  if(DB){ try{ await idbDel('blobs', id); }catch(e){} }
  undoS.length = 0; redoS.length = 0; pairKey = '';
  if(!selItem()) S.sel = S.clips[0] ? S.clips[0].id : null;
  afterEdit(); renderMediaPanel(); saveProject(true); return true;
}
// freeze frame: split the clip at the playhead and insert a 3 s still image of that frame
async function freezeFrame(){
  const c = clipAt(S.time); if(!c || isImg(c)) return alert('Place the playhead over a main-track video');
  const v = getVid(c), src = localToSrc(c, S.time - derived[c.id].start);
  await seekTo(v, src); await waitFrame(v);
  const k = document.createElement('canvas'); k.width = v.videoWidth; k.height = v.videoHeight; k.getContext('2d').drawImage(v,0,0);
  const blob = await new Promise(r => k.toBlob(r, 'image/jpeg', .95));
  const m = await addImageMedia(new File([blob], `Freeze ${fmtT(S.time)}.jpg`, {type:'image/jpeg'}));
  pushUndo();
  const fr = newClip(m); fr.out = 3; for(const key of ['tf','adj','filter','filterAmt','lut','lutAmt','mask','rt']) fr[key] = deep(c[key]);
  const lt = S.time - derived[c.id].start, i = S.clips.indexOf(c);
  if(lt > .05 && derived[c.id].dur - lt > .05){
    const b = deep(c); b.id = nid(); c.out = src; b.in = src; c.anim.out = 'none'; b.anim.in = 'none'; b.trans = {type:'none',dur:.6};
    S.clips.splice(i+1, 0, fr, b);
  } else S.clips.splice(lt <= .05 ? i : i+1, 0, fr);
  S.sel = fr.id; afterEdit(); renderMediaPanel();
}

/* ================= UI: CANVAS ================= */
function setCanvas(){
  const q=S.quality; let a,b;
  if(S.ratio==='orig'){ const m=S.media.find(x=>x.w); a=m?m.w:9; b=m?m.h:16; } else [a,b]=S.ratio.split(':').map(Number);
  let W,H; if(a>=b){ H=q; W=Math.round(q*a/b); } else { W=q; H=Math.round(q*b/a); }
  cv.width=out.width=W-W%2; cv.height=out.height=H-H%2; fitCanvas();
  if(typeof updatePInfo === 'function') updatePInfo();
}
function fitCanvas(){
  const r=$('#stage').getBoundingClientRect(), k=Math.min((r.width-20)/out.width,(r.height-20)/out.height);
  out.style.width=Math.max(10,out.width*k)+'px'; out.style.height=Math.max(10,out.height*k)+'px';
}

/* ---- preview drag / pinch / wheel / color pick ---- */
const pts = new Map(); let wheelT = 0, wheelTimer = 0;
// player point → normalised position inside an item's picture (0..1), or null when outside it
function itemUV(it, p){
  let g;
  if(it.type){ const h = hits.get(it.id); if(!h) return null; const sc = h.s||1; g = {cx:h.cx, cy:h.cy, rot:h.rot, hw:h.hw*sc, hh:h.hh*sc}; }
  else { g = geo[it.id]; if(!g) return null; }
  const dx = p.x - g.cx, dy = p.y - g.cy, c = Math.cos(-g.rot), s = Math.sin(-g.rot), lx = dx*c - dy*s, ly = dx*s + dy*c;
  const u = (lx/g.hw + 1)/2, v = (ly/g.hh + 1)/2; return u < 0 || u > 1 || v < 0 || v > 1 ? null : [u, v];
}
function toCv(e){ const r=out.getBoundingClientRect(); return {x:(e.clientX-r.left)/r.width*out.width, y:(e.clientY-r.top)/r.height*out.height}; }
function hitAt(p){
  const zo=zOrder();
  for(let i=zo.length-1;i>=0;i--){
    const o=zo[i], h=hits.get(o.id); if(!h) continue; if(S.trk && S.trk.ov[o.track] && S.trk.ov[o.track].lock) continue;
    const dx=p.x-h.cx, dy=p.y-h.cy, cs=Math.cos(-h.rot), sn=Math.sin(-h.rot), s=Math.max(.05,h.s);
    const x=(dx*cs-dy*sn)/s, y=(dx*sn+dy*cs)/s;
    if(Math.abs(x)<=h.hw+8 && Math.abs(y)<=h.hh+8) return o;
  }
  return null;
}
const sizePath = it => it.type ? 'size' : 'tf.scale';
const rotPath = it => it.type ? 'rot' : 'tf.rot';
let kfFlash = 0;
// on-screen box of the selected item (canvas px, full scale) → for the transform handles
function gizmoOf(it){
  if(!it || it.type === 'audio' || it.type === 'adjust' || exporting) return null;
  if(it.type){ const h = hits.get(it.id); if(!h) return null; const s = Math.max(.05, h.s||1); return {cx:h.cx, cy:h.cy, rot:h.rot, hw:h.hw*s, hh:h.hh*s}; }
  if(!inRange(it) || S.mainHide) return null; const g = geo[it.id]; return g ? {cx:g.cx, cy:g.cy, rot:g.rot, hw:g.hw, hh:g.hh} : null;
}
const pxK = () => { const r = out.getBoundingClientRect(); return out.width / Math.max(1, r.width); };   // canvas px per screen px
function gizmoPts(g){
  const c = Math.cos(g.rot), s = Math.sin(g.rot), k = pxK(), m = 11*k;
  const P = (x, y) => ({x:clamp(g.cx + x*c - y*s, m, out.width - m), y:clamp(g.cy + x*s + y*c, m, out.height - m)});   // keep handles reachable inside the player
  const R = (x, y) => ({x:g.cx + x*c - y*s, y:g.cy + x*s + y*c});
  return {raw:[R(-g.hw,-g.hh), R(g.hw,-g.hh), R(g.hw,g.hh), R(-g.hw,g.hh)], corners:[P(-g.hw,-g.hh), P(g.hw,-g.hh), P(g.hw,g.hh), P(-g.hw,g.hh)], rot:(() => { const r = P(0, -g.hh - 34*k), t = P(0, -g.hh); return Math.hypot(r.x-t.x, r.y-t.y) < 20*k ? P(0, -g.hh + 34*k) : r; })(), top:P(0,-g.hh)};
}
function gizmoHit(g, p){
  const q = gizmoPts(g), tol = 16*pxK(), d = a => Math.hypot(a.x-p.x, a.y-p.y);
  if(d(q.rot) < tol) return 'rot';
  if(q.corners.some(c => d(c) < tol)) return 'scale';
  return null;
}
function drawTfGizmo(ctx){
  const it = selItem(); if(!it || S.pick || trackEditTarget() || maskEditTarget()) return;
  const g = gizmoOf(it); if(!g) return;
  const k = pxK(), lw = 1.6*k, q = gizmoPts(g), on = atKf(it), has = it.kf && it.kf.length;
  ctx.save(); ctx.lineWidth = lw; ctx.strokeStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 3*k;
  ctx.beginPath(); q.raw.forEach((c,i) => i ? ctx.lineTo(c.x,c.y) : ctx.moveTo(c.x,c.y)); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(q.top.x, q.top.y); ctx.lineTo(q.rot.x, q.rot.y); ctx.stroke();
  ctx.fillStyle = '#fff'; q.corners.forEach(c => { ctx.beginPath(); ctx.arc(c.x, c.y, 6*k, 0, 7); ctx.fill(); });
  ctx.beginPath(); ctx.arc(q.rot.x, q.rot.y, 9*k, 0, 7); ctx.fill();
  ctx.shadowBlur = 0; ctx.strokeStyle = '#111'; ctx.lineWidth = 1.6*k; ctx.beginPath(); ctx.arc(q.rot.x, q.rot.y, 4.5*k, -2.4, 1.6); ctx.stroke();
  // keyframe badge: filled ◆ = on a keyframe, outline ◆ = item has keyframes (moving now will add one)
  if(has){ const b = q.corners[0], sz = 7*k; ctx.save(); ctx.translate(b.x + 16*k, b.y - 16*k); ctx.rotate(Math.PI/4);
    ctx.fillStyle = on ? '#ffcf3d' : 'rgba(0,0,0,.55)'; ctx.strokeStyle = '#ffcf3d'; ctx.lineWidth = 2*k; ctx.fillRect(-sz,-sz,sz*2,sz*2); ctx.strokeRect(-sz,-sz,sz*2,sz*2); ctx.restore(); }
  if(performance.now() - kfFlash < 1400){ const b = q.corners[0]; ctx.font = `700 ${13*k}px Inter,sans-serif`; const t = '◆ Keyframe added', w = ctx.measureText(t).width;
    ctx.fillStyle = 'rgba(0,0,0,.75)'; rr(ctx, b.x + 30*k, b.y - 27*k, w + 14*k, 22*k, 6*k); ctx.fill(); ctx.fillStyle = '#ffcf3d'; ctx.fillText(t, b.x + 37*k, b.y - 11*k); }
  ctx.restore();
}
const sizeOf = it => ev(it, sizePath(it));
function setSize(it,v){ setVal(it, sizePath(it), Math.round(clamp(v,5,it.type ? (isMediaOv(it)?300:400) : 400))); }
function startCDrag(it,p,undone){ cdrag={it,p0:p,x0:ev(it,it.type?'x':'tf.x'),y0:ev(it,it.type?'y':'tf.y'),undo:!!undone}; }
out.addEventListener('pointerdown',e=>{
  if(exporting) return;
  const p=toCv(e);
  if(S.magicPick){ const it = selItem(); if(it && typeof magicTap === 'function'){ const uv = itemUV(it, p); if(uv) magicTap(it, uv[0], uv[1]); } return; }
  if(S.pick){
    const it=selItem(); if(it && it.ck){
      const d=octx.getImageData(clamp(p.x|0,0,out.width-1),clamp(p.y|0,0,out.height-1),1,1).data;
      pushUndo(); it.ck.color=toHex(d[0],d[1],d[2]); it.ck.on=true;
    }
    setPick(false); renderInspector(); return;
  }
  pts.set(e.pointerId,p); out.setPointerCapture(e.pointerId);
  if(pts.size===2 && cdrag){ const [a,b]=[...pts.values()]; cdrag.pinch={d0:Math.hypot(a.x-b.x,a.y-b.y),s0:sizeOf(cdrag.it)}; return; }
  const si = selItem(), gz = pts.size === 1 && si && gizmoOf(si), hd = gz && gizmoHit(gz, p);
  if(hd){ cdrag = {it:si, p0:p, mode:hd, cx:gz.cx, cy:gz.cy, d0:Math.max(4, Math.hypot(p.x-gz.cx, p.y-gz.cy)), s0:sizeOf(si), a0:Math.atan2(p.y-gz.cy, p.x-gz.cx), r0:ev(si, rotPath(si)), undo:false}; return; }
  const it = hitAt(p) || active; if(!it) return;
  if(S.sel!==it.id){ S.sel=it.id; renderTimeline(); renderInspector(); }
  cdrag=null; startCDrag(it,p);
});
out.addEventListener('pointermove',e=>{
  if(!cdrag && e.pointerType === 'mouse'){ const si = selItem(), g = si && gizmoOf(si), h = g && gizmoHit(g, toCv(e)); out.style.cursor = h === 'rot' ? 'grab' : h === 'scale' ? 'nwse-resize' : ''; }
  if(!cdrag || !pts.has(e.pointerId)) return;
  const p=toCv(e); pts.set(e.pointerId,p); const it=cdrag.it;
  if(cdrag.pinch && pts.size>=2){
    if(!cdrag.undo){ pushUndo(); cdrag.undo=true; }
    const [a,b]=[...pts.values()]; setSize(it,cdrag.pinch.s0*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,cdrag.pinch.d0)); return;
  }
  const dx=p.x-cdrag.p0.x, dy=p.y-cdrag.p0.y;
  if(!cdrag.undo){ if(Math.hypot(dx,dy)<3) return; pushUndo(); cdrag.undo=true; }
  if(cdrag.mode === 'scale'){ setSize(it, cdrag.s0 * Math.hypot(p.x-cdrag.cx, p.y-cdrag.cy) / cdrag.d0); return; }
  if(cdrag.mode === 'rot'){ let r = cdrag.r0 + (Math.atan2(p.y-cdrag.cy, p.x-cdrag.cx) - cdrag.a0)*180/Math.PI; r = ((r + 540) % 360) - 180; for(const sn of [-180,-90,0,90,180]) if(Math.abs(r-sn) < 4) r = sn; setVal(it, rotPath(it), Math.round(r)); return; }
  if(it.type){ setVal(it,'x',clamp(cdrag.x0+dx/out.width*100,-20,120)); setVal(it,'y',clamp(cdrag.y0+dy/out.height*100,-20,120)); }
  else { setVal(it,'tf.x',Math.round(cdrag.x0+dx/PK())); setVal(it,'tf.y',Math.round(cdrag.y0-dy/PK())); }
});
const endCDrag=e=>{
  pts.delete(e.pointerId);
  if(!cdrag) return;
  if(pts.size===0){ if(cdrag.undo){ renderInspector(); renderTimeline(); } cdrag=null; }
  else { cdrag.pinch=null; startCDrag(cdrag.it,[...pts.values()][0],cdrag.undo); }
};
out.addEventListener('pointerup',endCDrag); out.addEventListener('pointercancel',endCDrag);
out.addEventListener('wheel',e=>{
  const it=selItem(); if(!it || exporting || it.type==='audio') return; e.preventDefault();
  const now=performance.now(); if(now-wheelT>600) pushUndo(); wheelT=now;
  setSize(it,sizeOf(it)*(e.deltaY<0?1.06:1/1.06));
  clearTimeout(wheelTimer); wheelTimer=setTimeout(()=>{ renderInspector(); renderTimeline(); },300);
},{passive:false});

/* ================= MODAL ================= */
function showModal(html){ $('#modalBox').innerHTML=html; $('#modal').style.display='flex'; }
function hideModal(){ $('#modal').style.display='none'; }
$('#modal').addEventListener('click',e=>{ if(e.target.id==='modal' && !recState && !capBusy) hideModal(); });

/* ================= VOICE-OVER RECORDING (+ live captions) ================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function openRecord(){
  if(!navigator.mediaDevices || !window.MediaRecorder) return alert('This browser does not support recording. Use Chrome.');
  pause();
  showModal(`<h3 style="margin-top:0">🎙 Voice-over</h3>
    <div class="note">Recording starts at the playhead (${fmtTC(S.time)}). The video plays along — speak now. Headphones recommended.</div>
    <div class="row crow"><span>Mute video sound while recording</span><input type="checkbox" id="rMute" checked></div>
    <div class="row crow"><span>Live captions (speech → text)</span><input type="checkbox" id="rCap" ${SR?'checked':'disabled'}></div>
    <div class="row crow"><span>Language</span><select id="rLang">${SR_LANGS.map(([k,n])=>`<option value="${k}">${n}</option>`).join('')}</select></div>
    ${SR?'':'<div class="note">Live captions need Chrome.</div>'}
    <div id="recTime">00:00.00</div>
    <div class="btns" style="justify-content:center"><button id="rStart" class="danger">● Start</button><button id="rStop" disabled>■ Stop</button><button id="rClose">Close</button></div>`);
}
async function startRec(){
  let stream;
  try{ stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}}); }
  catch(e){ return alert('Microphone permission denied: '+e.message); }
  initAudio(); await AC.resume();
  const mt=['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg'].find(t=>MediaRecorder.isTypeSupported(t));
  const mr=new MediaRecorder(stream, mt?{mimeType:mt}:{}), chunks=[];
  mr.ondataavailable=e=>{ if(e.data.size) chunks.push(e.data); };
  recState={stream,mr,chunks,t0:S.time,w0:performance.now(),caps:[]};
  if($('#rMute').checked) spk.gain.value=0;
  if($('#rCap').checked && SR) startSR(recState,$('#rLang').value);
  mr.start(250);
  $('#rStart').disabled=true; $('#rStop').disabled=false; $('#rClose').disabled=true; $('#recTip').style.display='block';
  if(S.time < S.total) play();
}
function startSR(r,lang){
  const sr=new SR(); sr.lang=lang; sr.continuous=true; sr.interimResults=true; let starts={};
  const now=()=>r.t0+(performance.now()-r.w0)/1000;
  sr.onstart=()=>{ starts={}; };
  sr.onresult=e=>{
    for(let i=e.resultIndex;i<e.results.length;i++){
      if(starts[i]==null) starts[i]=Math.max(r.t0, now()-1);
      if(e.results[i].isFinal){ const txt=e.results[i][0].transcript.trim(); if(txt) r.caps.push({start:starts[i],end:now(),text:txt}); starts[i]=Infinity; }
    }
  };
  sr.onerror=()=>{};
  sr.onend=()=>{ if(recState===r){ try{ sr.start(); }catch(e){} } };   // Chrome stops after silence → restart
  try{ sr.start(); r.sr=sr; }catch(e){}
}
function stopRec(){
  const r=recState; if(!r) return; recState=null;
  $('#recTip').style.display='none';
  if(r.sr){ try{ r.sr.stop(); }catch(e){} }
  r.mr.onstop=async()=>{
    r.stream.getTracks().forEach(t=>t.stop());
    const dur=(performance.now()-r.w0)/1000;
    const blob=new Blob(r.chunks,{type:r.mr.mimeType||'audio/webm'});
    const ext=(r.mr.mimeType||'').includes('mp4')?'m4a':(r.mr.mimeType||'').includes('ogg')?'ogg':'webm';
    const n=S.audios.filter(a=>a.kind==='voice').length+1;
    try{
      const m=await addAudioMedia(new File([blob],`Voice ${n}.${ext}`,{type:blob.type}),dur);
      pushUndo();
      const a=newAudioItem(m,{kind:'voice',start:r.t0,dur:Math.min(m.duration,dur)}); S.audios.push(a); S.sel=a.id;
      for(const s of r.caps.flatMap(splitSeg)) S.overlays.push(newOverlay('text',{...deep(CAPTION_STYLE),text:s.text,start:s.start,dur:Math.max(.5,s.end-s.start)}));
      afterEdit(); renderMediaPanel();
    }catch(e){ alert('Recording could not be saved: '+e.message); }
    hideModal();
  };
  r.mr.stop(); pause(); spk.gain.value=1;
}
$('#modal').addEventListener('click',e=>{
  const id=e.target.id;
  if(id==='rStart') startRec();
  if(id==='rStop') stopRec();
  if(id==='rClose'||id==='cClose') hideModal();
});

/* ================= CAPTIONS (Whisper in browser + SRT) ================= */
let capBusy=false, capWorker=null;
function splitSeg(s){
  const w=s.text.trim().split(/\s+/); if(w.length<=8) return [s];
  const n=Math.ceil(w.length/7), per=Math.ceil(w.length/n), out=[], d=(s.end-s.start)/w.length;
  for(let i=0;i<w.length;i+=per) out.push({start:s.start+i*d, end:s.start+Math.min(w.length,i+per)*d, text:w.slice(i,i+per).join(' ')});
  return out;
}
function capSource(){
  const it=selItem();
  const ok = x => x && x.mediaId && media(x.mediaId) && media(x.mediaId).type!=='image' && mediaBlobs[x.mediaId];
  if(ok(it) && (!it.type || it.type==='video' || it.type==='audio')) return it;
  return S.clips.find(ok) || S.audios.find(ok) || null;
}
function srcRange(it){
  if(!it.type){ const d=derived[it.id]; return {from:it.in, to:it.out, map:t=>d.start+srcToLocal(it,clamp(t,it.in,it.out))}; }
  return {from:it.in, to:it.in+it.dur*it.speed, map:t=>it.start+(t-it.in)/it.speed};
}
const WORKER_SRC = `
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2';
env.allowLocalModels = false;
let asr = null, cur = '';
self.onmessage = async e => {
  const { audio, model, language } = e.data;
  try {
    if (!asr || cur !== model) {
      asr = await pipeline('automatic-speech-recognition', model, { progress_callback: p => self.postMessage({ type: 'progress', p }) });
      cur = model;
    }
    self.postMessage({ type: 'status', msg: 'transcribe' });
    const r = await asr(audio, { language, task: 'transcribe', return_timestamps: true, chunk_length_s: 30, stride_length_s: 5 });
    self.postMessage({ type: 'done', chunks: r.chunks && r.chunks.length ? r.chunks : [{ timestamp: [0, audio.length / 16000], text: r.text }] });
  } catch (err) { self.postMessage({ type: 'error', msg: String(err && err.message || err) }); }
};`;
let capLangNow='';
async function runCaptions(){
  const src=capSource(); if(!src || capBusy) return;
  const st=$('#cStatus'), bar=$('#cBar'), btn=$('#cRun');
  capBusy=true; btn.disabled=true; st.textContent='🎧 Reading audio…';
  try{
    const {from,to,map}=srcRange(src);
    const ab=await new OfflineAudioContext(1,1,16000).decodeAudioData(await mediaBlobs[src.mediaId].arrayBuffer());
    const s0=Math.floor(from*16000), s1=Math.min(ab.length,Math.ceil(to*16000)), len=Math.max(1,s1-s0);
    const audio=new Float32Array(len);
    for(let c=0;c<ab.numberOfChannels;c++){ const d=ab.getChannelData(c); for(let i=0;i<len;i++) audio[i]+=d[s0+i]/ab.numberOfChannels; }
    if(!capWorker) capWorker=new Worker(URL.createObjectURL(new Blob([WORKER_SRC],{type:'text/javascript'})),{type:'module'});
    const files={};
    const res=await new Promise((resolve,reject)=>{
      capWorker.onmessage=e=>{
        const d=e.data;
        if(d.type==='progress' && d.p && d.p.status==='progress' && d.p.total){
          files[d.p.file]=[d.p.loaded,d.p.total];
          const L=Object.values(files).reduce((a,b)=>a+b[0],0), T=Object.values(files).reduce((a,b)=>a+b[1],0);
          st.textContent=`⬇ Model download: ${(L/1048576).toFixed(0)} / ${(T/1048576).toFixed(0)} MB`; bar.style.width=(L/T*100)+'%';
        } else if(d.type==='status'){ st.textContent='✍ Converting speech to text… (this takes a moment)'; bar.style.width='100%'; }
        else if(d.type==='done') resolve(d.chunks);
        else if(d.type==='error') reject(new Error(d.msg));
      };
      capWorker.onerror=e=>reject(new Error(e.message||'Worker error (internet needed)'));
      capLangNow=$('#cLang').value;
      capWorker.postMessage({audio,model:'Xenova/whisper-'+$('#cModel').value,language:capLangNow},[audio.buffer]);
    });
    const segs=res.map(ch=>{ const a=ch.timestamp[0]||0, b=ch.timestamp[1]!=null?ch.timestamp[1]:a+2; return {start:map(from+a), end:map(from+b), text:(ch.text||'').trim()}; })
      .filter(s=>s.text && s.end>s.start).flatMap(splitSeg);
    if(!segs.length) throw new Error('No speech detected');
    let tr=false;   // small Whisper models often write Kannada in English letters → convert to ಕನ್ನಡ script
    if(capLangNow==='kannada' && latinRatio(segs.map(x=>x.text).join(' '))>.4){ segs.forEach(x=>x.text=translitKn(x.text)); tr=true; }
    addCaptions(segs);
    st.textContent=`✅ ${segs.length} captions added`+(tr?' (Romanised Kannada was converted to Kannada script — edit any mistakes. Use the Small model for better Kannada)':'');
  }catch(e){ st.textContent='❌ '+e.message; capWorker&&capWorker.terminate(); capWorker=null; }
  capBusy=false; if($('#cRun')) $('#cRun').disabled=false;
}
function addCaptions(segs){
  pushUndo();
  segs = [...segs].sort((a,b)=>a.start-b.start);
  const tr = S.overlays.length ? Math.max(...S.overlays.map(o=>o.track|0))+1 : 0;   // all captions on one new track
  segs.forEach((s,i) => { const nx = segs[i+1], end = nx ? Math.min(s.end, nx.start) : s.end;
    S.overlays.push(newOverlay('text',{...deep(CAPTION_STYLE),text:s.text,start:s.start,dur:Math.max(.3,end-s.start),track:tr})); });
  afterEdit();
}
const srtT = t => { const ms=Math.round(Math.max(0,t)*1000); return `${pad(Math.floor(ms/3600000))}:${pad(Math.floor(ms/60000)%60)}:${pad(Math.floor(ms/1000)%60)},${String(ms%1000).padStart(3,'0')}`; };
const srtP = s => { const m=s.match(/(\d+):(\d+):(\d+)[,.](\d+)/); return m ? +m[1]*3600 + +m[2]*60 + +m[3] + +m[4]/1000 : 0; };
function exportSRT(){
  let caps=S.overlays.filter(o=>o.type==='text'&&o.caption); if(!caps.length) caps=S.overlays.filter(o=>o.type==='text');
  if(!caps.length) return alert('No captions');
  caps=[...caps].sort((a,b)=>a.start-b.start);
  const txt=caps.map((o,i)=>`${i+1}\n${srtT(o.start)} --> ${srtT(o.start+o.dur)}\n${o.text}\n`).join('\n');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'})); a.download=(S.project?S.project.name:'captions')+'.srt'; a.click();
}
function importSRT(txt){
  const segs=[];
  for(const blk of txt.replace(/\r/g,'').split(/\n\s*\n/)){
    const L=blk.trim().split('\n'), i=L.findIndex(l=>l.includes('-->')); if(i<0) continue;
    const [a,b]=L[i].split('-->').map(x=>srtP(x.trim())); const text=L.slice(i+1).join('\n').trim();
    if(text && b>a) segs.push({start:a,end:b,text});
  }
  if(!segs.length) return alert('No captions found in the SRT');
  addCaptions(segs);
}
$('#modal').addEventListener('click',e=>{
  const id=e.target.id;
  if(id==='cRun') runCaptions();
  if(id==='cSrtOut') exportSRT();
  if(id==='cSrtIn') $('#srtIn').click();
  if(id==='cDelAll'){ const n=S.overlays.filter(o=>o.caption).length; if(n && confirm(n+' captions — delete?')){ pushUndo(); S.overlays=S.overlays.filter(o=>!o.caption); afterEdit(); } }
});
$('#srtIn').onchange=async e=>{ const f=e.target.files[0]; e.target.value=''; if(f){ importSRT(await f.text()); hideModal(); } };

/* ================= PROJECTS (IndexedDB, autosave) ================= */
let DB=null, lastSaved='', saving=false;
function idbOpen(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open('chitracut',1);
    r.onupgradeneeded=()=>{ const d=r.result; d.createObjectStore('projects',{keyPath:'id'}); d.createObjectStore('blobs',{keyPath:'id'}).createIndex('project','project'); };
    r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);
  });
}
function idbReq(store,mode,fn){
  return new Promise((res,rej)=>{ const tx=DB.transaction(store,mode); const r=fn(tx.objectStore(store)); tx.oncomplete=()=>res(r&&r.result); tx.onerror=()=>rej(tx.error); tx.onabort=()=>rej(tx.error); });
}
const idbPut=(s,v)=>idbReq(s,'readwrite',st=>st.put(v));
const idbGet=(s,k)=>idbReq(s,'readonly',st=>st.get(k));
const idbAll=s=>idbReq(s,'readonly',st=>st.getAll());
const idbDel=(s,k)=>idbReq(s,'readwrite',st=>st.delete(k));
function idbDelBlobs(pid){
  return idbReq('blobs','readwrite',st=>{ const r=st.index('project').openCursor(IDBKeyRange.only(pid)); r.onsuccess=()=>{ const c=r.result; if(c){ c.delete(); c.continue(); } }; return null; });
}
function projectData(){
  return {clips:deep(S.clips), overlays:deep(S.overlays), audios:deep(S.audios),
    media:S.media.map(({id,name,type,duration,thumb,w,h,strip,stripN})=>({id,name,type,duration,thumb,w,h,strip,stripN})),
    ratio:S.ratio, quality:S.quality, pk720:true, trk:S.trk||{ov:{},au:{}}, bg:S.bg, time:S.time, mainMute:S.mainMute, mainHide:S.mainHide,
    luts:S.luts.filter(l=>l.custom).map(l=>({id:l.id,name:l.name,n:l.n,data:l.data}))};
}
function makeThumb(){
  if(!S.clips.length && !S.overlays.length) return '';
  const c=document.createElement('canvas'), k=160/Math.max(out.width,out.height); c.width=Math.round(out.width*k); c.height=Math.round(out.height*k);
  c.getContext('2d').drawImage(out,0,0,c.width,c.height); return c.toDataURL('image/jpeg',.6);
}
const sig = () => snap()+'|'+S.ratio+S.quality+S.bg+S.mainMute+S.mainHide+'|'+S.media.length+'|'+S.luts.length+'|'+(S.project&&S.project.name);
async function saveProject(force){
  if(!DB || !S.project || saving) return;
  const s=sig(); if(!force && s===lastSaved) return;
  saving=true;
  try{ await idbPut('projects',{id:S.project.id,name:S.project.name,updated:Date.now(),thumb:makeThumb(),data:projectData()}); lastSaved=s; setSaved('✓ Saved'); }
  catch(e){ setSaved('⚠ Save failed'); }
  saving=false;
}
function setSaved(t){ $('#saveState').textContent=t; }
setInterval(()=>{ if(!exporting && !recState && !document.hidden) saveProject(); },2500);
document.addEventListener('visibilitychange',()=>{ if(document.hidden) saveProject(); });
function updateProjName(){ $('#projName').textContent=S.project?S.project.name:'Project'; document.title=(S.project?S.project.name+' · ':'')+'ChitraCut'; }
function resetState(){
  pause(); setPick(false);
  for(const map of [vids,ovVids,audEls]) for(const k in map){ dropEl(map[k]); delete map[k]; }
  dropAllChains(); dropAudChains();
  for(const k in ovAud){ try{ ovAud[k].disconnect(); }catch(e){} delete ovAud[k]; }
  for(const m of S.media){ if(m.url) URL.revokeObjectURL(m.url); if(m.wave) URL.revokeObjectURL(m.wave); }
  for(const k in images) delete images[k];
  for(const k in mediaBlobs) delete mediaBlobs[k];
  S.media=[]; S.clips=[]; S.overlays=[]; S.audios=[]; S.sel=null; S.time=0; active=null; pairKey='';
  undoS.length=0; redoS.length=0; S.mainMute=false; S.mainHide=false; S.trk={ov:{},au:{}};
  for(const k in segCache) delete segCache[k];
  S.luts=S.luts.filter(l=>!l.custom);
}
async function newProject(){
  resetState();
  let n=1; if(DB){ try{ n=(await idbAll('projects')).length+1; }catch(e){} }
  S.project={id:nid(),name:'Project '+n};
  syncSelects(); setCanvas(); hideHome(); layout(); afterEdit(); renderMediaPanel(); updateProjName();
  await saveProject(true);
}
async function openProject(id){
  const rec=await idbGet('projects',id); if(!rec) return;
  resetState();
  S.project={id:rec.id,name:rec.name}; const d=rec.data||{};
  S.ratio=d.ratio||'9:16'; S.quality=d.quality||720; S.bg=d.bg||'black'; S.mainMute=!!d.mainMute; S.mainHide=!!d.mainHide; syncSelects();
  for(const l of d.luts||[]){ try{ addLut(l.name,l.n,l.data,l.id,true); }catch(e){} }
  for(const mm of d.media||[]){
    const m={...mm}; const b=await idbGet('blobs',m.id).catch(()=>null);
    if(b && b.blob){
      mediaBlobs[m.id]=b.blob; m.url=URL.createObjectURL(b.blob);
      if(m.type==='image'){ try{ images[m.id]=await loadImg(m.url); }catch(e){ m.missing=true; } }
    } else m.missing=true;
    S.media.push(m);
  }
  const okM = x => { const m=media(x.mediaId); return m && !m.missing; };
  S.clips=(d.clips||[]).map(c=>({...clipDefaults(),...c})).filter(okM);
  S.overlays=(d.overlays||[]).map(o=>({...ovDefaults(o.type),...o})).filter(o=>!isMediaOv(o)||okM(o));
  S.audios=(d.audios||[]).map(a=>({...audDefaults(),...a})).filter(okM);
  [...S.clips,...S.overlays,...S.audios].forEach(normItem);
  const q0 = d.quality || 720;   // older projects stored canvas offsets in export-resolution pixels
  if(q0 !== 720 && !d.pk720){ const f = 720/q0; for(const c of S.clips){ c.tf.x = Math.round(c.tf.x*f); c.tf.y = Math.round(c.tf.y*f); (c.kf||[]).forEach(k => { if(k.v['tf.x']!=null) k.v['tf.x']*=f; if(k.v['tf.y']!=null) k.v['tf.y']*=f; }); } }
  S.quality = 720; S.trk = d.trk || {ov:{},au:{}};
  S.time=0; setCanvas(); hideHome(); layout();
  S.sel=S.clips[0]?S.clips[0].id:null;
  afterEdit(); seek(clamp(d.time||0,0,S.total)); renderMediaPanel(); updateProjName();
  lastSaved=sig(); setSaved('✓ Opened');
  S.media.filter(m=>!m.missing).forEach(m=>{ computeWave(m); genStrip(m); });
}
/* ================= EXPORT ================= */
function showOverlay(title,msg,btns){
  $('#overlay').style.display='flex'; $('#ovT').textContent=title; $('#ovMsg').textContent=msg; $('#ovBtns').innerHTML=btns;
}
// all recording goes through recordTimeline() — plays the timeline in real time into a MediaRecorder
let expEnd = null, soloMain = false, recDone = null, recCancel = null;
const VCODECS = [
  ['h264','H.264', q => q>1080 ? ['avc1.640033','avc1.640028','avc1.4d0033','avc1.42E01E','avc1'] : ['avc1.640028','avc1.4d0028','avc1.42E01E','avc1']],
  ['hevc','HEVC (H.265)', () => ['hvc1.1.6.L153.B0','hvc1','hev1.1.6.L153.B0']],
  ['vp9','VP9', () => ['vp09.00.51.08','vp9']],
  ['av1','AV1', () => ['av01.0.12M.08','av01','av1']],
  ['vp8','VP8', () => ['vp8']]];
function pickMime(fmt, codec, q){
  const vc = VCODECS.find(c => c[0] === codec) || VCODECS[0], ac = fmt === 'mp4' ? ['mp4a.40.2','opus'] : ['opus'];
  if(!window.MediaRecorder) return '';
  for(const v of vc[2](q)) for(const a of ac){ const t = `video/${fmt};codecs=${v},${a}`; if(MediaRecorder.isTypeSupported(t)) return t; }
  return '';
}
function exportSupport(q){
  const r = {};
  for(const f of ['mp4','webm']) for(const [c] of VCODECS){ const m = pickMime(f,c,q); if(m) (r[f] = r[f] || []).push(c); }
  return r;
}
function recordTimeline(o){
  return new Promise(async (resolve, reject) => {
    pause(); setPick(false); initAudio(); await AC.resume();
    const prevQ = S.quality;
    if(o.q && o.q !== S.quality){ S.quality = o.q; setCanvas(); }
    const tracks = [...recDest.stream.getAudioTracks()];
    if(!o.audioOnly) tracks.unshift(...out.captureStream(o.fps || 30).getVideoTracks());
    const chunks = [], opts = {mimeType:o.mime};
    if(!o.audioOnly) opts.videoBitsPerSecond = o.bitrate; opts.audioBitsPerSecond = o.abr || 192000;
    try{ rec = new MediaRecorder(new MediaStream(tracks), opts); }catch(e){ S.quality = prevQ; setCanvas(); return reject(e); }
    rec.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
    const finish = () => { exporting = false; expEnd = null; soloMain = false; spk.gain.value = 1; if(S.quality !== prevQ){ S.quality = prevQ; setCanvas(); seek(S.time); } };
    rec.onstop = () => { finish(); resolve(new Blob(chunks, {type:o.mime.split(';')[0]})); };
    rec.onerror = e => { finish(); reject(e.error || new Error('recorder error')); };
    recCancel = () => { finish(); reject(new Error('cancel')); };
    recDone = () => { if(rec && (rec.state === 'recording' || rec.state === 'paused')){ try{ if(rec.state === 'paused') rec.resume(); }catch(e){} setTimeout(() => rec.stop(), 150); } };
    exporting = true; soloMain = !!o.mainOnly; expEnd = o.t1; spk.gain.value = o.monitor ? 1 : 0;
    seek(o.t0);
    // warm-up: wait until the first clip (and the next one) have decoded their first frames
    const c0 = clipAt(o.t0), v0 = c0 && !isImg(c0) ? getVid(c0) : null;
    const ready = v => !v || (v.readyState >= 3 && !v.seeking);
    const t0w = performance.now();
    await new Promise(res => { const chk = () => (ready(v0) || performance.now() - t0w > 8000) ? res() : setTimeout(chk, 50); chk(); });
    await new Promise(r => setTimeout(r, 250));
    if(!exporting) return;
    recArmed = true; stalled = true; stallClip = null;   // the recorder starts on the first tick where the video is really moving
    play();
    if(!v0 || isImg(c0)){ setTimeout(() => { if(exporting && rec && rec.state === 'inactive'){ recArmed = false; rec.start(250); } }, 30); }
  });
}
const expName = ext => (S.project ? S.project.name.replace(/[^\wಀ-೿ -]/g,'') : 'ChitraCut') + '_' + Date.now() + ext;
/* ---- where exported files go: chosen folder / "Save as" dialog / browser Downloads ---- */
const FS_SAVE = typeof window.showSaveFilePicker === 'function', FS_DIR = typeof window.showDirectoryPicker === 'function';
function setDB(){ return new Promise((res, rej) => { const r = indexedDB.open('cc_settings', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
async function setSetting(k, v){ try{ const db = await setDB(); await new Promise((res, rej) => { const t = db.transaction('kv','readwrite'); v == null ? t.objectStore('kv').delete(k) : t.objectStore('kv').put(v, k); t.oncomplete = res; t.onerror = () => rej(t.error); }); }catch(e){} }
async function getSetting(k){ try{ const db = await setDB(); return await new Promise(res => { const r = db.transaction('kv').objectStore('kv').get(k); r.onsuccess = () => res(r.result); r.onerror = () => res(null); }); }catch(e){ return null; } }
let saveDir = null; getSetting('saveDir').then(h => { if(h) saveDir = h; });
function chooseMime(opt){
  if(opt.gif) return {mime:'image/gif', ext:'.gif'};
  if(opt.audioOnly){ const mime = ['audio/webm;codecs=opus','audio/mp4;codecs=mp4a.40.2','audio/webm'].find(t => MediaRecorder.isTypeSupported(t)); return {mime, ext:mime.includes('mp4') ? '.m4a' : '.webm'}; }
  const mime = pickMime(opt.fmt, opt.codec, opt.q) || pickMime('mp4','h264',opt.q) || pickMime('webm','vp9',opt.q) || pickMime('webm','vp8',opt.q) || 'video/webm';
  return {mime, ext:mime.startsWith('video/mp4') ? '.mp4' : '.webm'};
}
const cleanName = n => (n || 'ChitraCut').replace(/[\\/:*?"<>|]/g,'').trim() || 'ChitraCut';
async function writeOut(blob, name, opt){
  const url = URL.createObjectURL(blob);
  try{
    if(opt && opt.fileHandle){ const w = await opt.fileHandle.createWritable(); await w.write(blob); await w.close(); return {url, where:'📁 ' + opt.fileHandle.name}; }
    if(opt && opt.dirHandle){
      let nm = name, i = 1; const dot = name.lastIndexOf('.'), base = name.slice(0, dot), ext = name.slice(dot);
      while(true){ try{ await opt.dirHandle.getFileHandle(nm); nm = `${base} (${i++})${ext}`; }catch(e){ break; } }
      const fh = await opt.dirHandle.getFileHandle(nm, {create:true}), w = await fh.createWritable(); await w.write(blob); await w.close();
      return {url, where:'📁 ' + opt.dirHandle.name + ' / ' + nm};
    }
  }catch(e){ console.warn('save failed, falling back to download', e); }
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  return {url, where:'⬇ Downloads / ' + name};
}
function saveBlob(blob, name){ const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; a.click(); return url; }
async function exportVideo(opt){
  if(!S.total) return alert('Import a video / photo first');
  if(!window.MediaRecorder) return alert('This browser does not support export. Use Chrome.');
  opt = Object.assign({q:1080, fps:30, bitrate:0, fmt:'mp4', codec:'h264', audioOnly:false, gif:false, name:''}, opt||{});
  if(opt.gif) return exportGif(opt);
  const {mime, ext} = chooseMime(opt);
  const px = opt.q*opt.q*16/9, br = opt.bitrate || Math.round(px*opt.fps*.1);   // "recommended" ≈ 0.1 bit / pixel / frame
  showOverlay('Exporting…', `${opt.audioOnly ? 'Audio' : opt.q+'p · '+opt.fps+'fps · '+(br/1e6).toFixed(1)+' Mbps'} — keep this tab open, it renders in real time`, '<button id="ovCancel">Cancel</button>');
  try{
    const blob = await recordTimeline({t0:0, t1:S.total, q:opt.q, fps:opt.fps, bitrate:br, mime, audioOnly:opt.audioOnly});
    const name = opt.name ? cleanName(opt.name) + ext : expName(ext), r = await writeOut(blob, name, opt);
    showOverlay('✅ Export finished', r.where + '  ('+(blob.size/1048576).toFixed(1)+' MB · '+mime.split(';')[0]+')', `<a href="${r.url}" download="${name}"><button>⬇ Download copy</button></a><button class="primary" id="ovClose">Close</button>`);
    return true;
  }catch(e){ if(e && e.message === 'cancel') return false; showOverlay('⚠ Export failed', (e && e.message) || String(e), '<button id="ovClose">Close</button>'); }
}
// wait until every visible video has the frame for S.time, then render it
async function renderAt(t){
  seek(t);
  for(let i=0;i<60;i++){
    const busy = [...Object.values(vids), ...Object.values(ovVids)].some(v => v.seeking);
    if(!busy) break; await new Promise(r => setTimeout(r, 16));
  }
  render(performance.now());
}
async function exportGif(opt){
  const fps = Math.min(opt.fps, 15), maxW = opt.q >= 720 ? 480 : 320, k = Math.min(1, maxW/Math.max(out.width, out.height));
  const w = Math.round(out.width*k), h = Math.round(out.height*k), n = Math.max(1, Math.ceil(S.total*fps));
  if(n > 600 && !confirm(`Large GIF (${n} frames). Continue?`)) return;
  pause(); exporting = true;
  showOverlay('Creating GIF…', `${w}×${h} · ${fps} fps`, '<button id="ovCancel">Cancel</button>');
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d', {willReadFrequently:true});
  const g = new GifWriter(w, h, Math.round(100/fps));
  try{
    for(let i=0;i<n && exporting;i++){
      await renderAt(i/fps); x.drawImage(out, 0, 0, w, h); g.frame(x.getImageData(0,0,w,h).data);
      $('#ovBar').style.width = (i/n*100) + '%';
      if(i % 4 === 0) await new Promise(r => setTimeout(r));
    }
    if(!exporting) return;
    exporting = false; const blob = g.end(), name = cleanName(opt.name) + '.gif', r = await writeOut(blob, name, opt);
    showOverlay('✅ GIF finished', r.where + '  ('+(blob.size/1048576).toFixed(1)+' MB)', `<a href="${r.url}" download="${name}"><button>⬇ Download copy</button></a><button class="primary" id="ovClose">Close</button>`);
  }catch(e){ exporting = false; showOverlay('⚠ GIF failed', e.message, '<button id="ovClose">Close</button>'); }
}
// tiny GIF89a encoder (fixed 6×7×6 colour cube + ordered dithering, LZW)
function GifWriter(w, h, delay){
  const bytes = []; const B = b => bytes.push(b & 255), W16 = v => { B(v); B(v>>8); };
  const pal = []; for(let r=0;r<6;r++) for(let g=0;g<7;g++) for(let b=0;b<6;b++) pal.push([r*51, Math.round(g*42.5), b*51]);
  while(pal.length < 256) pal.push([0,0,0]);
  'GIF89a'.split('').forEach(ch => B(ch.charCodeAt(0))); W16(w); W16(h); B(0xF7); B(0); B(0);
  pal.forEach(p => { B(p[0]); B(p[1]); B(p[2]); });
  [0x21,0xFF,11,...'NETSCAPE2.0'.split('').map(c=>c.charCodeAt(0)),3,1,0,0,0].forEach(B);
  const BAY = [0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  this.frame = d => {
    const idx = new Uint8Array(w*h);
    for(let y=0,i=0;y<h;y++) for(let xx=0;xx<w;xx++,i++){
      const t = (BAY[(y&3)*4+(xx&3)]/16 - .5), p = i*4;
      const r = clamp(Math.round(d[p]/51 + t), 0, 5), g = clamp(Math.round(d[p+1]/42.5 + t), 0, 6), b = clamp(Math.round(d[p+2]/51 + t), 0, 5);
      idx[i] = r*42 + g*6 + b;
    }
    [0x21,0xF9,4,0].forEach(B); W16(delay); B(0); B(0);
    B(0x2C); W16(0); W16(0); W16(w); W16(h); B(0);
    B(8); lzw(idx);
  };
  const lzw = idx => {
    const MIN = 8, CLR = 256, EOI = 257; let size = MIN+1, next = 258, dict = new Map(), buf = 0, nb = 0; const outB = [];
    const emit = code => { buf |= code << nb; nb += size; while(nb >= 8){ outB.push(buf & 255); buf >>>= 8; nb -= 8; } };
    emit(CLR); let cur = idx[0];
    for(let i=1;i<idx.length;i++){
      const k = idx[i], key = cur*256 + k, f = dict.get(key);
      if(f !== undefined){ cur = f; continue; }
      emit(cur);
      if(next < 4096){ dict.set(key, next++); if(next > (1<<size) && size < 12) size++; }
      else { emit(CLR); dict = new Map(); size = MIN+1; next = 258; }
      cur = k;
    }
    emit(cur); emit(EOI); if(nb > 0) outB.push(buf & 255);
    for(let i=0;i<outB.length;i+=255){ const ch = outB.slice(i,i+255); B(ch.length); ch.forEach(B); }
    B(0);
  };
  this.end = () => { B(0x3B); return new Blob([new Uint8Array(bytes)], {type:'image/gif'}); };
}
// compound clip: render a run of main-track clips (with their effects) into one new clip
async function compoundClips(ids){
  const list = S.clips.filter(c => ids.includes(c.id)); if(list.length < 2) return alert('Select 2 or more clips to compound (Ctrl / Shift + click)');
  const i0 = S.clips.indexOf(list[0]), i1 = S.clips.indexOf(list[list.length-1]);
  if(i1 - i0 + 1 !== list.length) return alert('Only adjacent clips can be compounded');
  const t0 = derived[list[0].id].start, t1 = derived[list[list.length-1].id].start + derived[list[list.length-1].id].dur;
  const mime = pickMime('webm','vp9',1080) || pickMime('webm','vp8',1080) || pickMime('mp4','h264',1080);
  if(!mime) return alert('Not supported in this browser');
  showOverlay('Creating compound clip…', `${list.length} clips · ${fmtT(t1-t0)} (real-time)`, '<button id="ovCancel">Cancel</button>');
  try{
    const blob = await recordTimeline({t0, t1, q:S.quality, fps:30, bitrate:12e6, mime, mainOnly:true});
    const m = await addVideoMedia(new File([blob], `Compound ${S.media.filter(x=>/^Compound/.test(x.name)).length+1}.${mime.includes('mp4')?'mp4':'webm'}`, {type:mime.split(';')[0]}));
    pushUndo();
    const c = newClip(m); c.out = Math.min(m.duration, t1 - t0); c.trans = deep(list[0].trans); c.compoundOf = list.map(x => x.id);
    S.clips.splice(i0, list.length, c); S.sel = c.id; selMulti.clear(); afterEdit(); renderMediaPanel();
    $('#overlay').style.display = 'none';
  }catch(e){ if(e && e.message === 'cancel') return; showOverlay('⚠ Failed', e.message || String(e), '<button id="ovClose">Close</button>'); }
}
const selMulti = new Set();
function onPlaybackEnd(){ if(exporting && recDone) recDone(); }
$('#overlay').addEventListener('click',e=>{
  if(e.target.id==='ovCancel'){ const r=rec, rc=recCancel; recCancel=null; exporting=false; expEnd=null; soloMain=false; spk.gain.value=1;
    if(r && r.state!=='inactive'){ r.ondataavailable=null; r.onstop=null; r.stop(); } if(rc) rc(); pause(); $('#overlay').style.display='none'; }
  if(e.target.id==='ovClose') $('#overlay').style.display='none';
});


/* ================= AUTO BACKGROUND REMOVAL (MediaPipe selfie segmentation, runs in browser) ================= */
const MP_VER = '0.10.14';
let SEG = null, segLoading = null, segErr = '', segTs = 0;
const segCache = {};
function loadSeg(){
  if(SEG) return Promise.resolve(SEG);
  if(!segLoading) segLoading = (async () => {
    const v = await import(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}/vision_bundle.mjs`);
    const fs = await v.FilesetResolver.forVisionTasks(`https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}/wasm`);
    const opts = d => ({baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite', delegate:d},
      runningMode:'VIDEO', outputCategoryMask:false, outputConfidenceMasks:true});
    try{ SEG = await v.ImageSegmenter.createFromOptions(fs, opts('GPU')); }
    catch(e){ SEG = await v.ImageSegmenter.createFromOptions(fs, opts('CPU')); }
    segErr = ''; if(typeof onSegReady === 'function') onSegReady();
    return SEG;
  })().catch(e => { segErr = e.message || String(e); segLoading = null; if(typeof onSegReady === 'function') onSegReady(); throw e; });
  return segLoading;
}
function setSeg(it, el){
  gl.uniform1f(U.u_segOn, 0); gl.uniform1f(U.u_segAv, 0);
  const bf = it.bfx && it.bfx.type !== 'none' ? it.bfx : null;
  gl.uniform1f(U.u_bfx, bf ? BFX_T[bf.type]||0 : 0);
  if(bf){ const n = parseInt((bf.color||'#20d5ec').slice(1),16); gl.uniform1f(U.u_bfxA, bf.amount/100); gl.uniform3f(U.u_bcol,(n>>16&255)/255,(n>>8&255)/255,(n&255)/255); }
  if((!it.rmbg && !bf) || !el) return;
  if(!SEG){ if(!segErr) loadSeg().catch(()=>{}); return; }
  const key = el.tagName === 'IMG' ? 'img' : el.currentTime.toFixed(3);
  let c = segCache[it.id];
  if(!c || c.key !== key || c.src !== el){
    try{
      segTs = Math.max(segTs + 1, performance.now());
      SEG.segmentForVideo(el, segTs, r => {
        const m = r.confidenceMasks && r.confidenceMasks[0]; if(!m) return;
        const f = m.getAsFloat32Array(), u8 = (c && c.u8 && c.u8.length === f.length) ? c.u8 : new Uint8Array(f.length);
        for(let i = 0; i < f.length; i++) u8[i] = f[i]*255;
        c = segCache[it.id] = {key, src:el, u8, w:m.width, h:m.height};
      });
    }catch(e){ segErr = e.message || String(e); }
  }
  if(!c) return;
  gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, texSeg);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, c.w, c.h, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, c.u8);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
  gl.activeTexture(gl.TEXTURE0);
  gl.uniform1f(U.u_segAv, 1);
  if(it.rmbg){ gl.uniform1f(U.u_segOn, 1); gl.uniform1f(U.u_segInv, it.rmbgInv ? 1 : 0); }
}

/* ================= FREE SOUND EFFECTS (synthesised – no copyright, no download) ================= */
const SFX = [
  {id:'click',   name:'Mouse Click',     cat:'UI',      dur:.12},
  {id:'pop',     name:'Pop',             cat:'UI',      dur:.15},
  {id:'bubble',  name:'Bubbles',         cat:'UI',      dur:.6},
  {id:'ding',    name:'Ding',            cat:'UI',      dur:1.5},
  {id:'coin',    name:'Coin',            cat:'UI',      dur:.5},
  {id:'error',   name:'Error Buzz',      cat:'UI',      dur:.45},
  {id:'whoosh',  name:'Whoosh',          cat:'Swooshes',dur:.8},
  {id:'swoosh',  name:'Fast Swoosh',     cat:'Swooshes',dur:.35},
  {id:'riser',   name:'Riser',           cat:'Swooshes',dur:2},
  {id:'drop',    name:'Drop Down',       cat:'Swooshes',dur:1.1},
  {id:'boing',   name:'Boing',           cat:'Funny',   dur:.8},
  {id:'slideup', name:'Slide Whistle Up',cat:'Funny',   dur:.75},
  {id:'slidedn', name:'Slide Whistle Down',cat:'Funny', dur:.75},
  {id:'rimshot', name:'Ba Dum Tss',      cat:'Funny',   dur:1.4},
  {id:'fail',    name:'Sad Trombone',    cat:'Funny',   dur:2.2},
  {id:'boom',    name:'Boom',            cat:'Impact',  dur:1.6},
  {id:'punch',   name:'Punch',           cat:'Impact',  dur:.3},
  {id:'thud',    name:'Thud',            cat:'Impact',  dur:.35},
  {id:'shutter', name:'Camera Shutter',  cat:'Everyday',dur:.3},
  {id:'typing',  name:'Keyboard Typing', cat:'Everyday',dur:1.7},
  {id:'tick',    name:'Clock Tick',      cat:'Everyday',dur:2},
  {id:'bell',    name:'Door Bell',       cat:'Everyday',dur:1.6},
  {id:'heart',   name:'Heartbeat',       cat:'Everyday',dur:1.9},
  {id:'success', name:'Success Chime',   cat:'Musical', dur:1.1},
  {id:'magic',   name:'Magic Sparkle',   cat:'Musical', dur:1.5},
  {id:'drumroll',name:'Drum Roll',       cat:'Musical', dur:2.2},
  {id:'applause',name:'Applause',        cat:'Musical', dur:3}
];
const SFX_CATS = ['All','UI','Swooshes','Funny','Impact','Everyday','Musical'];
const sfxCache = {};
async function synthSFX(id){
  if(sfxCache[id]) return sfxCache[id];
  const def = SFX.find(x => x.id === id), SR_ = 44100;
  const ctx = new OfflineAudioContext(1, Math.ceil(def.dur*SR_), SR_), out_ = ctx.createGain(); out_.connect(ctx.destination);
  const nb = ctx.createBuffer(1, SR_*3, SR_), nd = nb.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i] = Math.random()*2-1;
  const env = (t0, a, d, peak=1, node) => { const g = ctx.createGain(); g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(peak,t0+a); g.gain.exponentialRampToValueAtTime(.0005,t0+a+d); if(node) node.connect(g); g.connect(out_); return g; };
  const osc = (type, f0, f1, t0, len, a, d, peak, curve) => { const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0,t0); if(f1!=null) (curve==='lin'?o.frequency.linearRampToValueAtTime(f1,t0+len):o.frequency.exponentialRampToValueAtTime(Math.max(1,f1),t0+len)); env(t0,a,d,peak,o); o.start(t0); o.stop(t0+a+d+.05); return o; };
  const noise = (t0, a, d, peak, ftype, f0, f1, q=1, len) => { const n = ctx.createBufferSource(); n.buffer = nb; const f = ctx.createBiquadFilter(); f.type = ftype; f.Q.value = q; f.frequency.setValueAtTime(f0,t0); if(f1!=null) f.frequency.exponentialRampToValueAtTime(f1,t0+(len||a+d)); n.connect(f); env(t0,a,d,peak,f); n.start(t0, Math.random()*1.5); n.stop(t0+a+d+.05); return f; };
  switch(id){
    case 'click': noise(0,.001,.02,.8,'highpass',2500); osc('sine',2200,null,0,0,.001,.015,.3); break;
    case 'pop': osc('sine',350,1300,0,.035,.002,.08,.9); break;
    case 'bubble': [0,.15,.32].forEach((t,i)=>osc('sine',280+i*60,900+i*150,t,.07,.003,.09,.6)); break;
    case 'ding': osc('sine',1320,null,0,0,.003,1.3,.6); osc('sine',2640,null,0,0,.003,.8,.2); break;
    case 'coin': osc('square',988,null,0,0,.002,.07,.25); osc('square',1319,null,.08,0,.002,.35,.25); break;
    case 'error': osc('square',150,null,0,0,.005,.12,.3); osc('square',140,null,.2,0,.005,.15,.3); break;
    case 'whoosh': noise(0,.35,.4,.9,'bandpass',300,3200,1.2,.45); break;
    case 'swoosh': noise(0,.08,.2,.9,'bandpass',1500,6000,1.5,.25); break;
    case 'riser': noise(0,1.85,.1,.6,'bandpass',200,4000,2,1.9); osc('sawtooth',120,1200,0,1.9,1.85,.1,.15); break;
    case 'drop': osc('sine',1200,60,0,1,.01,1,.8); break;
    case 'boing': { const o=ctx.createOscillator(), l=ctx.createOscillator(), lg=ctx.createGain(); o.frequency.value=180; l.frequency.value=14; lg.gain.setValueAtTime(90,0); lg.gain.exponentialRampToValueAtTime(1,.7); l.connect(lg); lg.connect(o.frequency); o.frequency.linearRampToValueAtTime(320,.7); env(0,.005,.7,.7,o); o.start(0); l.start(0); o.stop(.8); l.stop(.8); break; }
    case 'slideup': case 'slidedn': { const up=id==='slideup', o=ctx.createOscillator(), l=ctx.createOscillator(), lg=ctx.createGain(); o.frequency.setValueAtTime(up?400:1600,0); o.frequency.exponentialRampToValueAtTime(up?1600:350,.65); l.frequency.value=7; lg.gain.value=18; l.connect(lg); lg.connect(o.frequency); env(0,.03,.65,.5,o); o.start(0); l.start(0); o.stop(.75); l.stop(.75); break; }
    case 'rimshot': osc('sine',190,110,0,.15,.002,.2,.9); osc('sine',150,90,.18,.15,.002,.25,.9); noise(.45,.002,.9,.5,'highpass',6000); break;
    case 'fail': [[392,0,.4],[370,.45,.4],[349,.9,.4],[330,1.35,.8]].forEach(([f,t,l])=>{ const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.value=f; const lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1200; o.connect(lp); env(t,.03,l,.35,lp); if(l>.5){ const v=ctx.createOscillator(), vg=ctx.createGain(); v.frequency.value=6; vg.gain.value=8; v.connect(vg); vg.connect(o.frequency); v.start(t); v.stop(t+l+.1); } o.start(t); o.stop(t+l+.1); }); break;
    case 'boom': osc('sine',90,28,0,1.2,.005,1.4,1); noise(0,.005,1,.7,'lowpass',400,60); break;
    case 'punch': noise(0,.002,.08,1,'lowpass',1400); osc('sine',160,55,0,.12,.002,.15,.9); break;
    case 'thud': osc('sine',95,45,0,.2,.003,.25,1); noise(0,.002,.05,.4,'lowpass',500); break;
    case 'shutter': noise(0,.001,.03,.9,'bandpass',3000,null,2); noise(.09,.001,.05,.7,'bandpass',2200,null,2); break;
    case 'typing': { let t=0; while(t<1.55){ noise(t,.001,.025,.5+Math.random()*.4,'bandpass',2000+Math.random()*1500,null,3); t+=.06+Math.random()*.09; } break; }
    case 'tick': [0,.5,1,1.5].forEach(t=>osc('sine',3000,null,t,0,.001,.02,.5)); break;
    case 'bell': osc('sine',659,null,0,0,.005,.9,.6); osc('sine',523,null,.55,0,.005,1,.6); break;
    case 'heart': [0,.24,.95,1.19].forEach((t,i)=>osc('sine',i%2?50:62,40,t,.12,.01,.18,1)); break;
    case 'success': [523,659,784,1047].forEach((f,i)=>osc('triangle',f,null,i*.09,0,.005,i===3?.9:.2,.4)); break;
    case 'magic': for(let i=0;i<16;i++){ const t=i*.07+Math.random()*.03; osc('sine',1500+Math.random()*2800,null,t,0,.002,.25,.18); } break;
    case 'drumroll': { let t=0; while(t<1.6){ noise(t,.002,.04,.25+t*.35,'bandpass',900,null,1.2); t+=.03; } osc('sine',120,60,1.65,.2,.002,.4,.9); noise(1.65,.002,.5,.5,'highpass',5000); break; }
    case 'applause': for(let i=0;i<260;i++){ const t=Math.random()*2.6, k=Math.min(1,t/.4)*Math.min(1,(2.9-t)/.6); noise(t,.001,.02+Math.random()*.03,.15*k+.02,'bandpass',1500+Math.random()*2500,null,1.5); } break;
    default: if(typeof synthExtra==='function') synthExtra(id,{ctx,out_,env,osc,noise,nb});
  }
  const buf = await ctx.startRendering();
  sfxCache[id] = buf; return buf;
}
function wavBlob(buf){
  const d = buf.getChannelData(0), n = d.length, ab = new ArrayBuffer(44 + n*2), v = new DataView(ab);
  const w = (o,s) => { for(let i=0;i<s.length;i++) v.setUint8(o+i, s.charCodeAt(i)); };
  w(0,'RIFF'); v.setUint32(4,36+n*2,true); w(8,'WAVE'); w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
  v.setUint32(24,buf.sampleRate,true); v.setUint32(28,buf.sampleRate*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++) v.setInt16(44+i*2, clamp(d[i],-1,1)*32767, true);
  return new Blob([ab], {type:'audio/wav'});
}
let sfxPlaying = null;
async function previewSFX(id){
  initAudio(); await AC.resume();
  if(sfxPlaying){ try{ sfxPlaying.stop(); }catch(e){} }
  const b = AC.createBufferSource(); b.buffer = await synthSFX(id); b.connect(AC.destination); b.start(); sfxPlaying = b;
}
async function addSFX(id){
  const def = SFX.find(x => x.id === id), buf = await synthSFX(id);
  const m = await addAudioMedia(new File([wavBlob(buf)], `SFX - ${def.name}.wav`, {type:'audio/wav'}), buf.duration);
  addAudioAt(m, {kind:'sfx', start:S.time});
  return m;
}

/* ================= EXTRA EDIT OPERATIONS ================= */
// "delete left / right of playhead"
function trimSide(side){
  const fr = selFree();
  if(fr){
    const o = fr[0]; if(S.time <= o.start + .05 || S.time >= o.start + o.dur - .05) return;
    pushUndo(); const cut = S.time - o.start;
    if(side === 'left'){ o.start = S.time; o.dur -= cut; o.in += cut*o.speed; if(o.kf) o.kf.forEach(k => k.t -= cut); }
    else o.dur = cut;
    afterEdit(); return;
  }
  const c = selClip() || clipAt(S.time); if(!c) return;
  const d = derived[c.id], lt = S.time - d.start; if(lt < .05 || d.dur - lt < .05) return;
  pushUndo(); const src = localToSrc(c, lt);
  if(side === 'left'){ c.in = src; } else c.out = src;
  S.sel = c.id; afterEdit();
  if(side === 'left') seek(derived[c.id].start);
}
function flipSel(){ const it = selItem(); if(!it || it.type === 'audio' || it.type === 'text' || it.type === 'sticker') return; pushUndo(); if(it.type) it.flip = !it.flip; else it.tf.flip = !it.tf.flip; renderInspector(); }
function rotateSel(){ const it = selItem(); if(!it || it.type === 'audio') return; pushUndo(); const p = it.type ? 'rot' : 'tf.rot'; let r = ev(it,p) + 90; if(r > 180) r -= 360; setVal(it, p, r); renderInspector(); }
const OV_COPY = ['filter','filterAmt','adj','lut','lutAmt','mask','fx','rt','rmbg','rmbgInv','ck','volume'];
function clipToOverlay(c, start){
  const m = media(c.mediaId); if(!m) return;
  pushUndo();
  const o = newOverlay(m.type === 'video' ? 'video' : 'image', {mediaId:m.id, start:Math.max(0,start), in:c.in, speed:c.speed, dur:(c.out-c.in)/c.speed, size:Math.round(100*Math.min(out.width,out.height)/Math.min(out.width,out.height)), flip:c.tf.flip});
  const W = out.width, H = out.height, u = Math.min(W,H); o.size = Math.round(Math.min(W/m.w, H/m.h)*m.w/u*100);
  for(const k of OV_COPY) if(c[k] !== undefined) o[k] = deep(c[k]);
  S.clips.splice(S.clips.indexOf(c), 1); if(active === c){ deactivate(); dropChainFor(c.id); }
  S.overlays.push(o); S.sel = o.id; S.rt = S.rt || {}; afterEdit();
}
function insertIndexAt(t, exclude){
  const others = S.clips.filter(c => c !== exclude); let i = 0;
  for(const c of others){ const d = derived[c.id]; if(d && d.start + d.dur/2 < t) i++; }
  return i;
}
function overlayToClip(o, t){
  const m = media(o.mediaId); if(!m || !isMediaOv(o)) return;
  pushUndo();
  const c = newClip(m);
  if(o.type === 'video'){ c.in = o.in; c.out = Math.min(m.duration, o.in + o.dur*o.speed); c.speed = o.speed; }
  else { c.in = 0; c.out = o.dur; }
  c.tf.flip = !!o.flip;
  for(const k of OV_COPY) if(o[k] !== undefined) c[k] = deep(o[k]);
  S.overlays.splice(S.overlays.indexOf(o), 1);
  S.clips.splice(insertIndexAt(t), 0, c); S.sel = c.id; afterEdit();
}
function insertMediaClip(m, t){
  pushUndo(); const c = newClip(m); S.clips.splice(insertIndexAt(t), 0, c); S.sel = c.id;
  if(S.ratio === 'orig' && S.clips.length === 1) setCanvas();
  afterEdit();
}
function moveClipTo(c, t){
  const i = S.clips.indexOf(c), j = insertIndexAt(t, c); if(i === j) return;
  pushUndo(); S.clips.splice(i,1); S.clips.splice(j,0,c); afterEdit();
}
let previewTimer = 0;
function previewPlay(from, sec){
  clearTimeout(previewTimer);
  if(S.playing) pause();
  seek(clamp(from, 0, S.total)); play();
  previewTimer = setTimeout(() => { if(!exporting && !recState){ pause(); seek(clamp(from,0,S.total)); } }, sec*1000);
}
const fmtF = t => { t = Math.max(0, t||0); const f = Math.floor((t%1)*30); return `${pad(Math.floor(t/3600))}:${pad(Math.floor(t/60)%60)}:${pad(Math.floor(t%60))}:${pad(f)}`; };

/* ---- real previews: draw a sample picture through the actual WebGL effect / transition into a small tile ---- */
const PV_PLAIN = {filter:'none', filterAmt:0, adj:defAdj(), lut:'', lutAmt:0, mask:defMask(), ck:{on:false}, rt:{smooth:0,bright:0}, fx:defFx(), bfx:defBfx()};
const pvTex = {};
function pvTexture(img){
  const key = img.src; if(pvTex[key]) return pvTex[key];
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, t);
  for(const [k,v] of [[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE],[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR]]) gl.texParameteri(gl.TEXTURE_2D,k,v);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
  return pvTex[key] = {tex:t, w:img.naturalWidth, h:img.naturalHeight};
}
// layers: [{img, ex:{s,sx,sy,dx,dy,r,a,fx,mT,mP}, fx:[type,amount], sec}] — dx/dy are in tile pixels
function glTile(canvas, layers, opt){
  const w = canvas.width, h = canvas.height; if(w > cv.width || h > cv.height) return;
  try{ glTile0(canvas, layers, opt, w, h); }
  finally{ gl.disable(gl.SCISSOR_TEST); gl.uniform1f(U.u_trT,0); gl.activeTexture(gl.TEXTURE0); gl.viewport(0,0,cv.width,cv.height); }
}
function glTile0(canvas, layers, opt, w, h){
  gl.viewport(0,0,w,h); gl.enable(gl.SCISSOR_TEST); gl.scissor(0,0,w,h);
  const cl = opt && opt.clear != null ? opt.clear : 0; gl.clearColor(cl,cl,cl,1); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform2f(U.u_canvas,w,h); gl.uniform2f(U.u_res,w,h);
  for(const L of layers){
    const ex = Object.assign({s:1,sx:1,sy:1,dx:0,dy:0,r:0,a:1}, L.ex||{}); if(ex.a <= .001 || !L.img || !L.img.naturalWidth) continue;
    const T = pvTexture(L.img); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, T.tex);
    gl.uniform2f(U.u_px, 1/T.w, 1/T.h);
    setFx(PV_PLAIN); gl.uniform1f(U.u_mT,0); gl.uniform1f(U.u_ck,0); gl.uniform1f(U.u_rtS,0); gl.uniform1f(U.u_rtB,0); setSeg({},null);
    const fo = ex.fx || L.fx; gl.uniform1f(U.u_fx, fo ? FX_T[fo[0]]||0 : 0); gl.uniform1f(U.u_fxA, fo ? fo[1] : 0); gl.uniform1f(U.u_sec, L.sec||0);
    gl.uniform1f(U.u_trT, ex.mT||0); gl.uniform1f(U.u_trP, ex.mP||0);
    if(L.sc){ gl.scissor(...L.sc); }
    const k = Math.max(w/T.w, h/T.h)*ex.s;
    gl.uniform2f(U.u_half, T.w*k/2*ex.sx, T.h*k/2*ex.sy); gl.uniform2f(U.u_off, ex.dx, -ex.dy); gl.uniform1f(U.u_rot, -ex.r);
    gl.uniform1f(U.u_alpha, ex.a); gl.uniform1f(U.u_blur, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    if(L.sc) gl.scissor(0,0,w,h);
  }
  gl.disable(gl.SCISSOR_TEST); gl.uniform1f(U.u_trT,0);
  const x = canvas.getContext('2d'); x.clearRect(0,0,w,h); x.drawImage(cv, 0, cv.height - h, w, h, 0, 0, w, h);
}
function fxPreview(canvas, img, type, t){
  const f = {type, amount:75, speed:50}, m = fxMotion({fx:f}, canvas.width, canvas.height), sec = t*fxRate(f);
  const ex = {s:m.s, dx:0, dy:0};
  if(['shake','shake2','heartbeat','cambounce','zoompulse'].includes(type)){ const S0 = S.time; S.time = t; const mm = fxMotion({fx:f}, canvas.width, canvas.height); S.time = S0; ex.s = mm.s; ex.dx = mm.dx; ex.dy = mm.dy; }
  glTile(canvas, [{img, fx:[type,.75], sec, ex}]);
}
function transPreview(canvas, imgA, imgB, type, p){
  const w = canvas.width, h = canvas.height, tr = transState(type, p, w, h);
  const sc = tr.sc ? [tr.sc[0], 0, tr.sc[2], h] : null;
  glTile(canvas, [{img:imgA, ex:tr.A, sec:p*2}, {img:imgB, ex:tr.B, sec:p*2, sc}], {clear:tr.clear});
}
