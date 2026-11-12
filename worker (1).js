/* ಈ ಫೈಲ್ ಅನ್ನು Cloudflare Worker ನ ಸಂಪಾದಕದಲ್ಲಿ ಪೂರ್ತಿ paste ಮಾಡಿ (Deploy). */
const esc = t => String(t ?? '');
/* RULES:START — ಈ ಭಾಗವನ್ನು worker.js ಕೂಡ ಬಳಸುತ್ತದೆ. ಇಲ್ಲಿ ಬದಲಿಸಿದರೆ worker.js ನಲ್ಲೂ ಬದಲಿಸಬೇಕು */
/* ---------- ವಿಷಯಗಳು ----------
   ಪ್ರತಿ ವಿಷಯ: [ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಕಾಣುವ ಹೆಸರು, ಫೈಲ್ ಹೆಸರಿನಲ್ಲಿ ಬರೆಯಬಹುದಾದ ರೂಪಗಳು…]
   ಕನ್ನಡ / ಇಂಗ್ಲಿಷ್, ದೊಡ್ಡ / ಸಣ್ಣ ಅಕ್ಷರ, ಸ್ಪೇಸ್, ಕಾಗುಣಿತದ ಸಣ್ಣ ವ್ಯತ್ಯಾಸ — ಎಲ್ಲವೂ ಒಂದೇ ವಿಷಯವಾಗಿ ಗುರುತಾಗುತ್ತದೆ.
   ಹೊಸ ವಿಷಯ ಬೇಕಿದ್ದರೆ ಇಲ್ಲಿ ಒಂದು ಸಾಲು ಸೇರಿಸಿ. */
const SUBJECT_LIST = {
  kannada:  ['ಕನ್ನಡ', 'kannada', 'kan', 'ಕನ್ನಡ'],
  english:  ['ಇಂಗ್ಲೀಷ್', 'english', 'eng', 'ಇಂಗ್ಲೀಷ್', 'ಇಂಗ್ಲಿಷ್', 'ಆಂಗ್ಲ', 'अंग्रेजी', 'इंग्रजी'],
  hindi:    ['ಹಿಂದಿ', 'hindi', 'hin', 'ಹಿಂದಿ', 'हिंदी', 'हिन्दी'],
  marathi:  ['ಮರಾಠಿ', 'marathi', 'mar', 'ಮರಾಠಿ', 'मराठी'],
  sanskrit: ['ಸಂಸ್ಕೃತ', 'sanskrit', 'samskrita', 'ಸಂಸ್ಕೃತ'],
  urdu:     ['ಉರ್ದು', 'urdu', 'ಉರ್ದು'],
  ganita:   ['ಗಣಿತ', 'ganita', 'ganitha', 'maths', 'math', 'mathematics', 'ಗಣಿತ'],
  vijnana:  ['ವಿಜ್ಞಾನ', 'vijnana', 'vignana', 'vijnan', 'vignan', 'vijana', 'science', 'sci', 'ವಿಜ್ಞಾನ'],
  samaja:   ['ಸಮಾಜ ವಿಜ್ಞಾನ', 'samaja', 'samaj', 'samajavijnana', 'social', 'social science', 'social studies', 'ss', 'sst', 'ಸಮಾಜ', 'ಸಮಾಜ ವಿಜ್ಞಾನ'],
  parisara: ['ಪರಿಸರ ಅಧ್ಯಯನ', 'parisara', 'parisara adhyayana', 'evs', 'environmental studies', 'ಪರಿಸರ', 'ಪರಿಸರ ಅಧ್ಯಯನ'],
  dehika:   ['ದೈಹಿಕ ಶಿಕ್ಷಣ', 'dehika', 'pe', 'physical education', 'ದೈಹಿಕ', 'ದೈಹಿಕ ಶಿಕ್ಷಣ'],
  kala:     ['ಕಲಾ ಶಿಕ್ಷಣ', 'kala', 'art', 'arts', 'ಕಲೆ', 'ಕಲಾ ಶಿಕ್ಷಣ'],
  computer: ['ಗಣಕಯಂತ್ರ', 'computer', 'ಕಂಪ್ಯೂಟರ್', 'ಗಣಕಯಂತ್ರ']
};
const SUBJECTS = Object.fromEntries(Object.entries(SUBJECT_LIST).map(([k, v]) => [k, v[0]]));
/* ಹೋಲಿಕೆಗಾಗಿ ಹೆಸರಿನ "ಅಸ್ಥಿಪಂಜರ": ಸ್ಪೇಸ್, ಚಿಹ್ನೆ, ಕನ್ನಡ ಸ್ವರಚಿಹ್ನೆ/ಹಲಂತ/ಅನುಸ್ವಾರ ತೆಗೆದು */
const skel = t => String(t).normalize('NFC').toLowerCase()
  .replace(/[\s_.,()&'"‌‍]+/g, '').replace(/[ಂಃ಼-್ೕೖೢೣ]/g, '');
const SUBJ_INDEX = {};
for (const [k, names] of Object.entries(SUBJECT_LIST)) for (const n of [k, ...names]) SUBJ_INDEX[skel(n)] ??= k;
const subjCode = raw => SUBJ_INDEX[skel(raw)] || String(raw).normalize('NFC').toLowerCase().replace(/\s+/g, '');
const MED_RE = /^(en|mr|ur|bi|kn)-(?=(?:lp|ppt|nt|aj|doc|sample)-)/i;
const medOf = name => ((MED_RE.exec(name.normalize('NFC').trim()) || [])[1] || 'kn').toLowerCase();
/* ---------- ಫೈಲ್ ಹೆಸರು → ಅರ್ಥ ----------
   ಹೆಸರನ್ನು "-" ಚಿಹ್ನೆಯಲ್ಲಿ ಭಾಗಿಸಲಾಗುತ್ತದೆ: ಪ್ರಕಾರ - ತರಗತಿ - ವಿಷಯ - ಭಾಗ - ಘಟಕ
   ವಿಷಯದಲ್ಲಿ ಸ್ಪೇಸ್ ಇದ್ದರೂ ಸರಿ (lp-6-social science-1.xlsx, lp-6-ಸಮಾಜ ವಿಜ್ಞಾನ-1.xlsx) */
function parseName(name) { const p = parseName0(name); if (p && p.type !== 'bad') p.med = medOf(name); return p; }
function parseName0(name) {
  const med = medOf(name);
  const clean = name.normalize('NFC').trim().replace(MED_RE, '').replace(/(?:\.(?:xlsx|pdf|pptx|json))+(\.(?:xlsx|pdf|pptx|json))$/i, '$1');  // .xlsx.xlsx → .xlsx
  const m = /^(.+)\.(xlsx|pdf|pptx|json)$/i.exec(clean);
  if (!m) {
    if (/^(lp|ppt|nt|aj|doc|sample)-/i.test(clean) && !/\.[a-z0-9]{2,5}$/i.test(clean))
      return { type: 'bad', reason: `ಹೆಸರಿನ ಕೊನೆಯಲ್ಲಿ <b>.pptx</b> / <b>.pdf</b> / <b>.xlsx</b> ಇಲ್ಲ. GitHub ನಲ್ಲಿ rename ಮಾಡಿ ಕೊನೆಗೆ ಸೇರಿಸಿ, ಉದಾ: <code>${esc(clean)}.pptx</code>` };
    return null;
  }
  const ext = m[2].toLowerCase(), parts = m[1].split('-').map(x => x.trim()).filter(Boolean);
  const type = (parts.shift() || '').toLowerCase();
  const isNum = x => /^\d{1,2}$/.test(x);
  /* ಮಾದರಿ (ಖರೀದಿಸುವ ಮೊದಲು ಎಲ್ಲರಿಗೂ ನೋಡಲು): sample-lp.pdf, sample-ppt-ಹೆಸರು.pdf, sample-nt.pdf, sample-aj.pdf, sample-doc.pdf */
  if (type === 'sample') {
    const kind = (parts.shift() || '').toLowerCase();
    if (ext !== 'pdf' || !['lp', 'ppt', 'nt', 'aj', 'doc'].includes(kind)) return null;
    return { type, kind, title: parts.join(' - '), ext };
  }
  if (type === 'doc') {
    if (ext === 'json') return null;
    const doc = (parts.shift() || '').toLowerCase();
    if (!/^[a-z]+$/.test(doc)) return null;
    const cls = parts.length && isNum(parts[0]) ? String(+parts.shift()) : '';
    const part = parts.length && isNum(parts[parts.length - 1]) ? +parts.pop() : '';
    const raw = parts.join(' ');
    if (!cls && (raw || part)) return null;
    return { type, doc, cls, subj: raw ? subjCode(raw) : '', part: raw ? part : '', ext };
  }
  if (!['lp', 'ppt', 'nt', 'aj'].includes(type) || !isNum(parts[0] || '')) return null;
  const cls = String(+parts.shift());
  if (type === 'aj') return (ext === 'xlsx' && !parts.length) ? { type, cls, ext } : null;
  /* ವಿಷಯ → ಸಂಖ್ಯೆಗಳು (ಭಾಗ, ಘಟಕ, ಉಪ-ಭಾಗ) → ಐಚ್ಛಿಕ ಹೆಸರು */
  let i = 0; const st = [];
  while (i < parts.length && !isNum(parts[i])) st.push(parts[i++]);
  const nums = [];
  while (i < parts.length && isNum(parts[i]) && nums.length < 3) nums.push(+parts[i++]);
  let title = parts.slice(i).join(' - ');
  if (!st.length) {
    const fix = `${type}-${cls}-samaja-${nums[0] || 1}${type !== 'lp' ? '-' + (nums[1] || 'ಘಟಕ') : ''}${title ? '-' + title : ''}.${ext}`;
    return { type: 'bad', reason: `ವಿಷಯದ ಹೆಸರು ಇಲ್ಲ. ತರಗತಿಯ ನಂತರ ವಿಷಯ ಬರಬೇಕು. ಉದಾ: <code>${esc(fix)}</code> (samaja ಬದಲು ನಿಜವಾದ ವಿಷಯ${type === 'ppt' ? ', "ಘಟಕ" ಬದಲು ಘಟಕ ಸಂಖ್ಯೆ' : ''})` };
  }
  let k = st.length;                                   // "samaja-ಗುಪ್ತರು" → ವಿಷಯ samaja, ಹೆಸರು ಗುಪ್ತರು
  while (k > 1 && !SUBJ_INDEX[skel(st.slice(0, k).join(' '))]) k--;
  if (!SUBJ_INDEX[skel(st.slice(0, k).join(' '))]) {
    const ex = SUBJECTS.samaja ? 'samaja' : Object.keys(SUBJECTS)[0];
    const looksTitle = st.join(' ').length > 12 || /\s/.test(st.join(' '));
    const fix = type !== 'lp'
      ? `${type}-${cls}-${ex}-${nums[0] || 1}-${nums[1] || 'ಘಟಕ'}-${[st.join(' '), title].filter(Boolean).join(' ')}.${ext}`
      : `${type}-${cls}-${ex}-${nums[0] || 1}.${ext}`;
    return { type: 'bad', reason: looksTitle
      ? `ವಿಷಯದ ಹೆಸರು ಇಲ್ಲ. ತರಗತಿಯ ನಂತರ ವಿಷಯ ಬರಬೇಕು. ಉದಾ: <code>${esc(fix)}</code> (samaja ಬದಲು ನಿಜವಾದ ವಿಷಯ, "ಘಟಕ" ಬದಲು ಘಟಕ ಸಂಖ್ಯೆ)`
      : `"${esc(st.join(' '))}" ಎಂಬ ವಿಷಯ ಗೊತ್ತಿಲ್ಲ. ${Object.keys(SUBJECTS).slice(0, 8).join(', ')}… ಅಥವಾ ಕನ್ನಡ ಹೆಸರು ಬಳಸಿ.` };
  }
  const subj = subjCode(st.slice(0, k).join(' '));
  if (k < st.length) title = [st.slice(k).join(' - '), title].filter(Boolean).join(' - ');
  if (type === 'lp') return (['xlsx', 'pdf', 'json'].includes(ext) && nums.length <= 1 && !title) ? { type, cls, subj, part: nums[0] || 1, ext } : null;
  if (!['pdf', 'pptx'].includes(ext) || (type === 'nt' && ext !== 'pdf') || (!nums.length && !title)) return null;
  const base = { type, cls, subj, ext, title, sub: null };
  if (nums.length === 3) return { ...base, part: nums[0], unit: nums[1], sub: nums[2] };
  if (nums.length === 2) return { ...base, part: nums[0], unit: nums[1] };
  if (nums.length === 1) return title ? { ...base, part: nums[0], unit: null } : { ...base, part: 1, unit: nums[0] };
  return { ...base, part: 1, unit: null };
}

/* ---------- ಯಾವ ಫೈಲ್‌ಗೆ ಯಾವ ಖರೀದಿ (ಪ್ಯಾಕ್) ----------
   ಪ್ಯಾಕ್ ಗುರುತು: ಪ್ರಕಾರ:ಮಾಧ್ಯಮ:ತರಗತಿ:ವಿಷಯ  ಉದಾ: lp:kn:5:ganita  sub:kn:5:ganita  aj:kn:5  doc:kn:5:kriya  cls:kn:5  sch:kn
   ಈ ಪಟ್ಟಿಯಲ್ಲಿ ಯಾವುದಾದರೂ ಒಂದು ಇದ್ದರೆ ಫೈಲ್ ತೆರೆಯುತ್ತದೆ. "ANY:kn" = ಆ ಮಾಧ್ಯಮದ ಯಾವುದೇ ಒಂದು ಖರೀದಿ */
function needKeys(p) {
  if (!p || p.type === 'bad') return [];
  const m = p.med || 'kn', c = p.cls, s = p.subj, k = ['sch:' + m];
  if (p.type === 'lp') k.push(`lp:${m}:${c}:${s}`, `sub:${m}:${c}:${s}`, `cls:${m}:${c}`);
  else if (p.type === 'ppt') k.push(`ppt:${m}:${c}:${s}`, `sub:${m}:${c}:${s}`, `cls:${m}:${c}`);
  else if (p.type === 'nt') k.push(`nt:${m}:${c}:${s}`, `cls:${m}:${c}`);
  else if (p.type === 'aj') k.push(`aj:${m}:${c}`, `cls:${m}:${c}`);
  else if (p.type === 'doc') { if (c) k.push(`doc:${m}:${c}:${p.doc}`, `cls:${m}:${c}`); else k.push(`doc:${m}:all:${p.doc}`, 'ANY:' + m); }
  return k;
}
/* packs = { "lp:kn:5:ganita": "2027-05-31", … } ; today = "2026-11-10" */
function allowedBy(packs, p, today) {
  const act = Object.keys(packs || {}).filter(k => String(packs[k]) >= today);
  return needKeys(p).some(k => k.startsWith('ANY:') ? act.some(a => a.split(':')[1] === k.slice(4)) : act.includes(k));
}
/* ಈಗಿರುವ ದಾಖಲೆಗಳಿಂದಲೇ ಉಚಿತ ಮಾದರಿ (ಖರೀದಿಸದವರಿಗೂ ಮುನ್ನೋಟ ಮಾತ್ರ):
   ಪಾಠಯೋಜನೆ = ಮೊದಲ ಭಾಗದ ಫೈಲ್ (ವೆಬ್‌ಸೈಟ್ ಮೊದಲ ಪಾಠ ಮಾತ್ರ ತೋರಿಸುತ್ತದೆ), PPT / ನೋಟ್ಸ್ = ಪ್ರತಿ ವಿಷಯದ ಮೊದಲನೆಯದು,
   ಅಂದಾಜು ಪತ್ರಿಕೆ / ಇತರೆ ದಾಖಲೆ = ಮೊದಲ ಪುಟಗಳು. ನೀವೇ sample- ಫೈಲ್ ಹಾಕಿದ್ದರೆ ಆ ವಿಧಕ್ಕೆ ಅದೇ ಮಾದರಿ. */
function isAutoSample(p, names) {
  if (!p || !['lp', 'ppt', 'nt', 'aj', 'doc'].includes(p.type)) return false;
  const m = p.med || 'kn', ps = names.map(parseName).filter(q => q && q.type !== 'bad');
  if (ps.some(q => q.type === 'sample' && q.kind === p.type && ['kn', m].includes(q.med || 'kn'))) return false;
  if (p.type === 'aj' || p.type === 'doc') return true;
  const same = ps.filter(q => q.type === p.type && (q.med || 'kn') === m && q.cls === p.cls && q.subj === p.subj);
  const minPart = Math.min(...same.map(q => +q.part || 1));
  if ((+p.part || 1) !== minPart) return false;
  if (p.type === 'lp') return true;
  const k = q => [q.unit ?? 999, q.sub ?? 0, q.title || ''];
  const first = same.filter(q => (+q.part || 1) === minPart).sort((a, b) => k(a)[0] - k(b)[0] || k(a)[1] - k(b)[1] || String(k(a)[2]).localeCompare(String(k(b)[2])))[0];
  return !!first && k(first).join('|') === k(p).join('|');
}
/* RULES:END */

/* ============================================================
   ಬೋಧನಾ ಮಿತ್ರ — ಫೈಲ್ ಕಾವಲುಗಾರ (Cloudflare Worker)
   ಖಾಸಗಿ GitHub repo ಯಿಂದ ಫೈಲ್ ತಂದು, ಖರೀದಿಸಿದವರಿಗೆ ಮಾತ್ರ ಕೊಡುತ್ತದೆ.
   Settings → Variables and Secrets:
     GH_REPO     (Text)   ಉದಾ: withyou00/mitra-files
     GH_TOKEN    (Secret) GitHub fine-grained token (Contents: Read-only)
     FB_PROJECT  (Text)   Firebase project ID
     ADMIN       (Text)   admin ಮೊಬೈಲ್ ಸಂಖ್ಯೆ
     SIGN_KEY    (Secret) ಯಾವುದಾದರೂ ಉದ್ದದ ರಹಸ್ಯ ಪದ (PowerPoint ಮುನ್ನೋಟದ ತಾತ್ಕಾಲಿಕ link ಗಾಗಿ)
   ============================================================ */
const LOGIN_DOMAIN = 'bodhana-mitra.in';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Expose-Headers': 'Content-Length' };
const json = (d, st = 200) => new Response(JSON.stringify(d), { status: st, headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const fail = (st, m) => json({ error: m }, st);
const today = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10);   // ಭಾರತದ ದಿನಾಂಕ

let LIST = null, LIST_T = 0, KEYS = null, KEYS_T = 0;
async function gh(env, path, accept) {
  return fetch(`https://api.github.com/repos/${env.GH_REPO}/contents/${path}`, {
    headers: { Authorization: `Bearer ${env.GH_TOKEN}`, 'User-Agent': 'bodhana-mitra', Accept: accept || 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  });
}
async function listFiles(env, fresh) {
  if (!fresh && LIST && Date.now() - LIST_T < 60e3) return LIST;
  const r = await gh(env, '');
  if (!r.ok) throw new Error('GitHub ' + r.status);
  LIST = (await r.json()).map(x => ({ name: x.name, type: x.type, size: x.size })); LIST_T = Date.now();
  return LIST;
}

/* ---- Firebase ID token ಪರಿಶೀಲನೆ (RS256) ---- */
const b64u = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), c => c.charCodeAt(0));
async function jwks() {
  if (KEYS && Date.now() - KEYS_T < 3600e3) return KEYS;
  const r = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
  KEYS = (await r.json()).keys; KEYS_T = Date.now();
  return KEYS;
}
async function verify(env, tok) {
  const [h, p, sg] = String(tok || '').split('.');
  if (!sg) return null;
  const head = JSON.parse(new TextDecoder().decode(b64u(h))), body = JSON.parse(new TextDecoder().decode(b64u(p)));
  const now = Date.now() / 1000;
  if (head.alg !== 'RS256' || body.aud !== env.FB_PROJECT || body.iss !== 'https://securetoken.google.com/' + env.FB_PROJECT || body.exp < now || body.iat > now + 300) return null;
  const jwk = (await jwks()).find(k => k.kid === head.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(sg), new TextEncoder().encode(h + '.' + p));
  if (!ok || !String(body.email || '').endsWith('@' + LOGIN_DOMAIN)) return null;
  return { mobile: body.email.split('@')[0], tok };
}
/* ಶಿಕ್ಷಕರ ಖರೀದಿ ಪಟ್ಟಿ — ಅವರದೇ token ನಿಂದ Firestore ಓದುವುದು (rules ಪ್ರಕಾರ ತಮ್ಮದನ್ನು ಮಾತ್ರ ಓದಬಹುದು) */
async function packsOf(env, u) {
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${env.FB_PROJECT}/databases/(default)/documents/users/${u.mobile}`, { headers: { Authorization: 'Bearer ' + u.tok } });
  if (!r.ok) return {};
  const f = (await r.json()).fields?.packs?.mapValue?.fields || {};
  return Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.stringValue || '']));
}

/* ---- PowerPoint ಮುನ್ನೋಟಕ್ಕೆ 15 ನಿಮಿಷದ link ---- */
async function hmac(env, s) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.SIGN_KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, '0')).join('');
}

const TYPES = { pdf: 'application/pdf', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', json: 'application/json' };
async function serve(env, name, inline) {
  const r = await gh(env, encodeURIComponent(name), 'application/vnd.github.raw');
  if (!r.ok) return fail(404, 'not found');
  const ext = (/\.([a-z]+)$/i.exec(name) || [])[1]?.toLowerCase();
  const h = { ...CORS, 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'private, no-store' };
  if (r.headers.get('Content-Length')) h['Content-Length'] = r.headers.get('Content-Length');
  if (inline) h['Content-Disposition'] = `inline; filename*=UTF-8''${encodeURIComponent(name)}`;
  return new Response(r.body, { headers: h });
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (req.method !== 'GET') return fail(405, 'method');
    const url = new URL(req.url), path = url.pathname;
    try {
      if (path === '/' || path === '/list') {
        if (path === '/') return json({ ok: true, service: 'bodhana-mitra files' });
        return json(await listFiles(env, url.searchParams.has('fresh')));
      }
      const m = /^\/(f|sign|s)\/(.+)$/.exec(path);
      if (!m) return fail(404, 'route');
      const name = decodeURIComponent(m[2]);
      if (name.includes('/') || name.startsWith('.')) return fail(400, 'name');
      if (m[1] === 's') {                                 // ತಾತ್ಕಾಲಿಕ link (Office ಮುನ್ನೋಟ)
        const e = +url.searchParams.get('e');
        if (!e || e < Date.now() / 1000 || url.searchParams.get('s') !== await hmac(env, name + '|' + e)) return fail(403, 'expired');
        return serve(env, name, true);
      }
      const u = await verify(env, (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, ''));
      if (!u) return fail(401, 'login');
      const p = parseName(name);
      if (!p || p.type === 'bad') return fail(404, 'name');
      if (p.type === 'sample') return m[1] === 'f' ? serve(env, name, false) : fail(403, 'sample');   // ಮಾದರಿ: login ಆದ ಎಲ್ಲರಿಗೂ
      const admin = env.ADMIN && u.mobile === String(env.ADMIN).trim();
      if (!admin && !allowedBy(await packsOf(env, u), p, today())
        && !isAutoSample(p, (await listFiles(env)).map(f => f.name))) return fail(403, 'not purchased');   // ಉಚಿತ ಮಾದರಿ ಅಲ್ಲದಿದ್ದರೆ
      if (m[1] === 'sign') {
        const e = Math.floor(Date.now() / 1000) + 900;
        return json({ url: `${url.origin}/s/${encodeURIComponent(name)}?e=${e}&s=${await hmac(env, name + '|' + e)}` });
      }
      return serve(env, name, false);
    } catch (x) { return fail(500, String(x.message || x)); }
  }
};
