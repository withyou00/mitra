# 🎬 ChitraCut – Free Video Editor (Browser + Phone App)

ಉಚಿತ professional video editor. ಯಾವುದೇ server ಬೇಕಿಲ್ಲ — ಎಲ್ಲಾ editing ನಿಮ್ಮ phone/PC ಯ browser ನಲ್ಲೇ ಆಗುತ್ತದೆ.
GitHub Pages ನಲ್ಲಿ **ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿ** host ಮಾಡಬಹುದು ಮತ್ತು phone ನಲ್ಲಿ app ಆಗಿ install ಮಾಡಬಹುದು (PWA).

## 🖥️ Layout 
- **Home:** Create project banner, quick tools (Auto captions, Remove BG, Voice-over, Sound effects), projects grid
- **ಎಡ:** Media · Audio · Text · Stickers · Effects · Transitions · Captions · Filters · Adjustment (sub-menu ಸಹಿತ)
- **ಮಧ್ಯ:** Player (timecode, play, background, ratio, full screen)
- **ಬಲ:** Video / Audio / Speed / Animation / Transition / Adjust tabs + Basic · Remove BG · Mask · Retouch (Effects ಈಗ ಎಡಗಡೆ ಮಾತ್ರ)
- **ಕೆಳಗೆ:** Timeline — overlay tracks ಮೇಲೆ, main track ಮಧ್ಯ, audio tracks ಕೆಳಗೆ. Main ಗೆ ಎಳೆದರೆ clip, ಮೇಲೆ ಎಳೆದರೆ overlay.

## ✅ Features (Phase 1 – 9)
| ವಿಭಾಗ | Features |
|---|---|
| Timeline | Multi-clip, trim (clip ಅಂಚು drag), split (S), delete, duplicate, move, undo/redo, zoom |
| Video | Scale, position, rotate, Fit/Fill, aspect ratio 9:16 / 16:9 / 1:1 / 4:5 …, blur background |
| Animation | In / Out (Fade, Zoom, Slide, Spin, Shake) + Combo (Ken Burns, Pulse, Sway) |
| Speed | 0.1x–10x + **Speed curves** (Montage, Hero, Bullet, Jump Cut, Flash In/Out, Custom) |
| Filters | 12 filters (Vivid, Warm, Cinematic, B&W, Vintage…) + strength |
| Adjust | Brightness, contrast, saturation, temperature, tint, fade, vignette, grain, sharpen |
| LUT | 7 built-in LUTs + ನಿಮ್ಮ **.cube LUT import** |
| Audio | Volume, fade in/out, **Bass boost, Treble**, **Mic Hog**, Megaphone, Telephone, Robot, Lo-Fi, Deep, Radio, **Echo, Reverb**, background music |
| Text (Phase 2) | ಕನ್ನಡ fonts (Noto Sans/Serif Kannada, Baloo Tamma 2, Anek, Tiro) + 9 English fonts, 8 style presets, color, outline, background box, shadow/glow, bold/italic, align |
| Text animation | In/Out: Fade, Pop, Zoom, Slide, **Typewriter** (ಕನ್ನಡ ಅಕ್ಷರ ಒಡೆಯದೆ), Bounce, Spin, Blur · Loop: Pulse, Shake, Float, Swing, Blink, Heartbeat |
| Stickers / Overlay | 48 emoji stickers, PNG logo/watermark overlay, layer order |
| Photos | Photo ಗಳನ್ನು timeline clip ಆಗಿ (3s default, trim ಮಾಡಬಹುದು) |
| Transitions | Dissolve, Fade Black, Flash White, Slide ×4, Wipe ×2, Zoom In/Out, Spin, Glitch (clip ಗಳ ನಡುವಿನ ⇄ ಒತ್ತಿ) — audio crossfade ಸಹಿತ |
| Preview editing | Preview ನಲ್ಲೇ text/sticker/video drag, mouse wheel ಅಥವಾ pinch ಮಾಡಿ size |
| PiP / Multi-layer (Phase 3) | Video ಮೇಲೆ video/photo (🎞 PiP), layer order, speed, volume, main track ಮುಗಿದ ನಂತರವೂ overlay play |
| Keyframes | Position, size, rotate, opacity — main clip, PiP, text, sticker ಎಲ್ಲಕ್ಕೂ (◆ / `K`) |
| Mask | Linear, Mirror, Circle, Rectangle (round corners), Heart, Star + feather, invert, rotate |
| Chroma key | Green/Blue screen ತೆಗೆಯುವುದು — auto detect, 🎯 preview ನಿಂದ ಬಣ್ಣ pick, intensity, edge smooth, spill remove |
| Blend modes | 16: Multiply, Screen, Overlay, Soft Light, Difference … |
| Mobile | ☰ Media drawer (phone ನಲ್ಲಿ music/PiP ಸೇರಿಸಲು) |
| Projects (Phase 4) | 🏠 My Projects — ಹಲವು projects, auto-save (IndexedDB, device ನಲ್ಲೇ), rename, delete, refresh ಮಾಡಿದರೂ ಕೆಲಸ ಉಳಿಯುತ್ತದೆ |
| Video effects | RGB Split, Glitch, VHS, Old Film, Shake, Zoom Pulse, Flash, Rainbow, Pixelate, Blur, Mirror, 4-Split, Invert (intensity + speed) |
| Audio tracks | ಹಲವು music / audio track ಗಳು, waveform, trim/split/move, fade, EQ, voice effects, 🎵 Extract audio from video |
| Voice-over | 🎙 Mic recording (video ಜೊತೆ play), + Live captions (Chrome speech recognition) |
| Auto captions | 💬 Whisper AI browser ನಲ್ಲೇ (ಕನ್ನಡ, English, ಹಿಂದಿ…), SRT import/export, ಎಲ್ಲಾ captions ಗೆ ಒಂದೇ style |
| Phase 5 (UI) | 🤖 Auto background removal (AI, browser ನಲ್ಲೇ), 💆 Retouch (smooth, whitening, clear), 🔔 27 free sound effects (copyright ಇಲ್ಲ), 🎧 Voice changer tiles + preview, ▶ Animation/transition/effect tiles preview, Mirror, Rotate 90°, Delete left/right (Q/W), main track mute/hide |
| Phase 6 | 📚 Library: 25 animated stock graphics (Subscribe + Bell, Like, Follow, Countdown, Lower third, Neon hearts, Fireworks, Snow, Confetti…) — copyright ಇಲ್ಲ · ⭐ 28 social/badge stickers · 🔔 62 sound effects · 🎚 Reduce noise, Enhance voice, Normalize loudness, Isolate voice · 🎯 Motion tracking · ◐ Mask ಅನ್ನು Player ನಲ್ಲಿ ನೇರವಾಗಿ ಎಳೆಯುವುದು · ⏱ Speed curve + Add point · 36 transitions · 30+ In/Out + 15 loop animations (ಅಕ್ಷರ-ಅಕ್ಷರ text animation ಸಹಿತ) · Timeline filmstrip |
| Phase 7 – Filters | 🎬 48 professional cinematic filters (Teal & Orange, Blockbuster, Golden Hour, Film 400, Bleach Bypass, Moody, Cyberpunk, B&W…) — 8 categories, ನಿಮ್ಮ clip ನ frame ಮೇಲೆ ನಿಜವಾದ preview, 3D LUT ಆಗಿ GPU ನಲ್ಲಿ |
| Phase 7 – Adjust | Exposure, Highlights, Shadows, Vibrance, Hue + ಹಳೆಯವು (Light / Color / Effects ವಿಭಾಗಗಳು) |
| Phase 7 – Effects | ಎಡಗಡೆ ಮಾತ್ರ: **Video effects** 28 (Fisheye, Wave, Swirl, Neon edges, Thermal, Night vision, CRT, Light leak, Cinema bars, Dreamy glow…) + **Body effects** 7 (Portrait blur, Color pop, Spotlight, Body glow, Neon outline, Color background, Ghost) |
| Phase 7 – Audio | Audacity ತರಹ: 10-band graphic EQ + presets, Compressor, Noise gate, Limiter, Amplify, Pitch shift, Echo (delay/feedback), Reverb (Room/Hall/Church/Plate/Stadium), Phaser, Wah, Tremolo, Distortion, High/Low-pass, Reverse · ಮೃದುವಾದ **Mic Hog** + Studio, Podcast, Chipmunk, Monster, Cave, Underwater |
| Phase 7 – Edit | Right-click menu (Extract / **Restore audio**, Mute, Freeze frame, **Compound clip** (Ctrl/Shift+click), Reverse audio, Copy/Paste attributes, Move to overlay/main…) · Media delete (✕ / right-click) · Speed curve ಗೆರೆ ಹಿಡಿದು ಎಳೆಯಬಹುದು · Scrub ಮಾಡುವಾಗ blink ಇಲ್ಲ · Overlay video filmstrip |
| Phase 8 – Timeline | **ಸ್ಥಿರ tracks** (ಎಳೆದಾಗ item ಬೇರೆ track ಗೆ ಹಾರುವುದಿಲ್ಲ; ಮೇಲೆ/ಕೆಳಗೆ ಎಳೆದು track ಬದಲಿಸಬಹುದು) · ಮೇಲಿನ track ಮೇಲೆ ಕಾಣುತ್ತದೆ (video → text → video + Remove BG ಸರಿಯಾಗಿ) · Mouse ಎಳೆದು **ಹಲವು items select** (rubber-band), Ctrl/Shift+click, Ctrl+A, ಒಟ್ಟಿಗೆ move/delete · Snapping (Alt = snap ಇಲ್ಲ) · Track ಗೆ 👁 hide / 🔇 mute / 🔒 lock · Ctrl+wheel zoom |
| Phase 8 – Layout | Left / Player / Right / Timeline ನಡುವಿನ ಅಂತರ ಎಳೆದು **ಗಾತ್ರ ಬದಲಿಸಿ** (double-click = reset) |
| Phase 8 – Animations | 100+ (Basic, Light, Glitch, Mask, 3D, Vibration, Zoom, Blur, Rotate, Distort + Text) · Search · Mouse ಇಟ್ಟರೆ ನಿಜವಾದ preview |
| Phase 8 – Voice | 48 voices: Voice filters (Crisp Mic, Live Stage, Divine Echo, 8D, Vinyl, Old Phone…) + Voice characters (Chipmunk, Giant, Alien, Ghost, Old Man, Villain, 8-bit…) · Search · Fine tune |
| Phase 8 – Text | 33 **Text effects** (Neon, Gold, Chrome, Fire, 3D, Comic, Retro 80s, Glitch, Sticker…) · 🗣 **Text to speech** (ಕನ್ನಡ / English / हिन्दी, 10 voice styles, speed) · ಕನ್ನಡ captions English ಅಕ್ಷರದಲ್ಲಿ ಬಂದರೆ ತಾನಾಗಿ ಕನ್ನಡ ಲಿಪಿಗೆ |
| Phase 9 | ✨ **Templates** (ಶಾಲಾ ಕಾರ್ಯಕ್ರಮ, Birthday, ಹಬ್ಬ, YouTube Intro/Outro, Reels, Memories, Travel, ಪಾಠದ ಪರಿಚಯ, Status) · 🥁 **Beat sync** (music beats ಗುರುತಿಸಿ clips cut) · ✂ **Auto silence cut** · ✏️ **Captions editor** (find/replace, merge) · 💬 Text **Bubble** (12) + **Curve text** + 12 **Text templates** · ◆ Keyframe **easing** (9) · 🎚 **Adjustment / Filter layer** · 🖼 **Cover / Thumbnail maker** (PNG, video ಆರಂಭಕ್ಕೆ ಸೇರಿಸಬಹುದು) |
| Export – Export to | ಒಂದೇ ಸಾಲು: 📁 ಒತ್ತಿ folder ಆರಿಸಿ (ನೆನಪಿನಲ್ಲಿರುತ್ತದೆ) · folder ಇಲ್ಲದಿದ್ದರೆ Export ಒತ್ತಿದಾಗ Save as ಕೇಳುತ್ತದೆ · Desktop/Documents ನೇರವಾಗಿ ಆರಿಸಲು browser ಬಿಡುವುದಿಲ್ಲ — ಅದರೊಳಗಿನ folder ಆರಿಸಿ |
| Export | Name, Resolution 480p–**2K–4K**, Bit rate (Lower/Recommended/Higher/Custom), Codec (H.264 / HEVC / VP9 / AV1 / VP8 — browser support ಆಧರಿಸಿ), Format MP4/WebM, Frame rate 24–60, Audio only, **GIF export** |

> Export real-time ನಲ್ಲಿ ಆಗುತ್ತದೆ — 1 ನಿಮಿಷದ video ಗೆ ಸುಮಾರು 1 ನಿಮಿಷ. ಆ ಸಮಯದಲ್ಲಿ tab ತೆರೆದಿಡಿ. 2K/4K export ಗೆ ಶಕ್ತಿಶಾಲಿ PC ಬೇಕು — ನಿಧಾನದ device ನಲ್ಲಿ frames ಕಡಿಮೆಯಾಗಬಹುದು.

## 🎤 Phase 12
- **Effects:** ಎಡ sidebar categories — Trending, Cinematic, Party, Light, Retro, Glitch, Lens, Motion, Split, Weather, Color · ಹೊಸ 23 (Black Flash, Light Sweep, Bokeh, Snow, Rain, Sparkle, Lens Flare, Film Frame, Prism, Vertigo, Tilt Shift, 3/9 Split, Heartbeat…) — ಒಟ್ಟು 50+ · **ಪ್ರತಿ tile ನಲ್ಲಿ ನಿಜವಾದ WebGL preview** (mouse ಇಟ್ಟರೆ ಚಲಿಸುತ್ತದೆ)
- **Transitions:** Trending, Basic, Camera, Light, Glitch, Slide, Shape, 3D, Distort · ಹೊಸ 22 (Pull In/Out, Spin Blur, Glare, Film Burn, Ink Spread, Whip Up/Down, Shake Zoom, Zoom Punch…) — ಒಟ್ಟು 58 · ನಿಜವಾದ preview
- **Vocal remover / BGM remover:** AI (UVR MDX-Net) browser ನಲ್ಲೇ — ಹಾಡಿನಿಂದ ಧ್ವನಿ ತೆಗೆಯಿರಿ, music ತೆಗೆಯಿರಿ, ಅಥವಾ ಎರಡು tracks ಆಗಿ ಬೇರ್ಪಡಿಸಿ · ⚡ Quick karaoke (AI ಇಲ್ಲದೆ). ಮೊದಲ ಬಾರಿ ~67 MB model; GPU ಇದ್ದರೆ ವೇಗ. *(Model ಅನ್ನು repo ನ `models/` folder ನಲ್ಲಿ ಇಟ್ಟರೆ ಅಲ್ಲಿಂದಲೇ load ಆಗುತ್ತದೆ.)*

## 📱 Phone app + Offline (v11)
- **Phone layout:** ಮೇಲೆ Player, ಮಧ್ಯ Timeline, ಕೆಳಗೆ tool bar. Tool ಒತ್ತಿದರೆ panel Player ಕೆಳಗೆ ತೆರೆಯುತ್ತದೆ — preview ನೋಡುತ್ತಲೇ apply ಮಾಡಿ, ✓ ಒತ್ತಿ ಮುಚ್ಚಿ. Clip select ಮಾಡಿದಾಗ tool bar ಅದರ tools (Split, Animation, Speed, Filters…) ತೋರಿಸುತ್ತದೆ. Timeline: ಒಂದು ಬೆರಳು = scroll, tap = playhead, ಎರಡು ಬೆರಳು = zoom.
- **Install:** ಮೇಲಿನ ⬇ **Install app** ಬಟನ್ (Android/PC Chrome, Edge). iPhone: Safari › Share › Add to Home Screen.
- **Offline:** ಒಮ್ಮೆ ತೆರೆದ ನಂತರ internet ಇಲ್ಲದೆಯೂ editing, effects, filters, export ಎಲ್ಲವೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ. Home ನಲ್ಲಿ **Offline ready** ಒತ್ತಿದರೆ ಕನ್ನಡ fonts ಮತ್ತು Remove BG AI ಕೂಡ ಉಳಿಯುತ್ತವೆ. Auto captions / Text-to-speech ಮೊದಲ ಬಾರಿ internet ನಲ್ಲಿ ಬಳಸಿದ ನಂತರ offline ನಲ್ಲೂ ಕೆಲಸ ಮಾಡುತ್ತವೆ.

## 🚀 GitHub ನಲ್ಲಿ ಉಚಿತವಾಗಿ ಹಾಕುವುದು (5 ನಿಮಿಷ)
1. github.com ನಲ್ಲಿ account ತೆರೆಯಿರಿ → **New repository** → ಹೆಸರು `chitracut` → **Public** → Create.
2. **Add file → Upload files** → ಈ folder ನ ಎಲ್ಲಾ files (`index.html, style.css, core.js, extras.js, ui.js, manifest.json, sw.js, icon-192.png, icon-512.png, README.md`) drag ಮಾಡಿ → **Commit**.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → **Save**.
4. 1–2 ನಿಮಿಷದಲ್ಲಿ link ಸಿಗುತ್ತದೆ: `https://<ನಿಮ್ಮ-username>.github.io/chitracut/`
5. **Phone app ಆಗಿ:** Chrome ನಲ್ಲಿ ಆ link ತೆರೆದು ⋮ → **Add to Home screen / Install app**.
6. **PC software ಆಗಿ:** Chrome/Edge ನಲ್ಲಿ address bar ನ install ⊕ icon ಒತ್ತಿ.

## ⌨️ Shortcuts
`Space` play/pause · Right-click = menu · `Ctrl/Shift+click` = ಹಲವು clips ಆರಿಸಿ · `T` text · `K` keyframe · `Esc` pick cancel · `Ctrl+S` save · `Q`/`W` delete left/right · `Ctrl+D` duplicate · `S` / `Ctrl+B` split · `Delete` · `Ctrl+Z` / `Ctrl+Y` · `←` `→` frame step

## 🗺️ Roadmap (ಮುಂದಿನ ಹಂತಗಳು)
- ~~Phase 2: Text, stickers, image clips, transitions~~ ✅
- ~~Phase 3: PiP, keyframes, masks, chroma key, blend modes~~ ✅
- ~~Phase 4: Projects/autosave, effects, audio tracks, voice-over, captions~~ ✅
- **Phase 5:** Fast export with FFmpeg.wasm, Android APK (Capacitor ಅಥವಾ TWA → Play Store), Windows .exe (Tauri/Electron)
- **Phase 6 – ಮಾರಾಟ (₹200/ವರ್ಷ):** Free version ನಲ್ಲಿ watermark + 720p; Pro ನಲ್ಲಿ 1080p/4K, no watermark, premium LUT/effects. Payment: Razorpay ಅಥವಾ Play Store billing; license check: Firebase/Supabase free tier.

## ⚠️ ಗಮನಿಸಿ
- **Text to speech** voices (Meta MMS) *non-commercial* license ನಲ್ಲಿವೆ — ₹200 ಮಾರಾಟದ version ನಲ್ಲಿ ಬಳಸುವ ಮೊದಲು ಬೇರೆ (commercial) TTS ಬೇಕು. ಮೊದಲ ಬಾರಿ ~38 MB download.
- Projects ಆ browser/device ನಲ್ಲಿ ಮಾತ್ರ ಇರುತ್ತವೆ. Browser data clear ಮಾಡಿದರೆ ಹೋಗುತ್ತವೆ.
- Auto background removal ಮೊದಲ ಬಾರಿ AI model (~5 MB) download ಮಾಡುತ್ತದೆ; internet ಬೇಕು.
- Auto captions ಮೊದಲ ಬಾರಿ AI model (40–250 MB) download ಮಾಡುತ್ತದೆ; internet ಬೇಕು.
- Live captions Chrome ನಲ್ಲಿ ಮಾತ್ರ (Google speech service ಬಳಸುತ್ತದೆ).

## 📄 License
ನಿಮ್ಮ ಆಯ್ಕೆ. ಮುಂದೆ ಮಾರಾಟ ಮಾಡುವುದಾದರೆ code ಅನ್ನು open-source license ಇಲ್ಲದೆ (All rights reserved) ಇಡಬಹುದು ಅಥವಾ repo ಅನ್ನು private ಮಾಡಿ ಕೇವಲ Pages ಮೂಲಕ app ಕೊಡಬಹುದು.

## Phase 13 — Preview images + AI Auto Thumbnail
- Effects, transitions, animations ಮತ್ತು filters tiles ಮೇಲೆ ಸುಂದರ illustrated preview images (sunset, city, beach, neon, portrait…) — ನಿಮ್ಮ clip ಬಳಸುವುದಿಲ್ಲ. Mouse ಇಟ್ಟರೆ live preview.
- **✨ Thumbnail** (ಮೇಲಿನ button): video ದ 12 frames ವಿಶ್ಲೇಷಿಸಿ (sharpness, ಬಣ್ಣ, ಬೆಳಕು), ಅತ್ಯುತ್ತಮ frames ಆರಿಸಿ, AI ಮೂಲಕ ವ್ಯಕ್ತಿಯನ್ನು cut-out ಮಾಡಿ 8 ವಿಭಿನ್ನ designs ತಯಾರಿಸುತ್ತದೆ: Pop-out, Banner, Zoom circle, Gradient, Neon, Cinematic, Collage, VS compare.
- YouTube / Shorts-Reels / Instagram (1:1, 4:5) / Facebook sizes · Title (auto) · Badge · ನಿಮ್ಮ photos upload · 🔀 ಇನ್ನಷ್ಟು designs · PNG download ಅಥವಾ video ಆರಂಭಕ್ಕೆ ಸೇರಿಸಿ · Manual editor.
- AI cut-out ಗೆ ಮೊದಲ ಬಾರಿ internet ಬೇಕು (MediaPipe model); offline ಇದ್ದರೆ card designs ಬಳಸುತ್ತದೆ.

## Phase 14 — English UI, real photo previews, 178 fonts, better thumbnails
- The whole interface is now in English, so people from any state can use it (Kannada, Hindi, Tamil and other languages are still fully supported for text, captions and voice).
- Effect / transition / animation / filter tiles use **real photographs** instead of drawings.
  - Bundled in `previews/` (always available offline):
    - coffee.jpg — CC0, photo by Rachel Michetti.
    - cat.jpg — CC0, photo by Stéfan van der Walt.
    - rocket.jpg — public domain, SpaceX.
    - space.jpg — public domain, NASA / Hubble.
    - temple.jpg — CC BY 2.0, photo by danielbuechele (Flickr).
    - flower.jpg — CC BY 2.0, photo by vultilion (Flickr).
  - When online, an extra pack of free Unsplash-licensed photos is loaded from picsum.photos and cached.
- **Fonts:** 178 fonts — English (Sans, Display, Serif, Script, Handwriting, Mono), Kannada, Hindi/Marathi, Tamil, Telugu, Malayalam, Bengali, Gujarati, Punjabi, Odia, Urdu/Arabic.
  - The font picker has search and categories; fonts load only when needed.
- **AI Thumbnail:**
  - Generation runs only when you click **Generate**, with a visible progress state.
  - 10 layouts (new: Split, Polaroid).
  - Title font choice, 9 text styles and a text-size slider.
  - Correct fonts for every Indian script.

## Phase 15 — Transform handles & keyframe fixes
- **Player handles:** select a video, photo, text or sticker to get a white box in the player.
  - Drag a **corner** to scale up or down.
  - Drag the **round handle** at the top to rotate; it snaps at 0° and 90°.
  - Drag inside the box to move it.
  - Mouse wheel and two-finger pinch still work.
- **Keyframes:**
  - Pressing ◆ shows a yellow ◆ badge on the player, a "Keyframe added" label, and a ◆ mark on the timeline clip.
  - After the first keyframe, moving, scaling or rotating at another time adds a keyframe automatically.
  - A filled ◆ means you are on a keyframe; an outline ◆ means the item has keyframes.
- **Fonts:** the player redraws as soon as a font finishes downloading, so a newly chosen font (e.g. Anek Kannada) shows immediately.

## Phase 16 — Project ends with the video
- Playback and export stop where the video (main track + overlays/text) ends.
- Music or audio longer than the video is cut at that point.
- The part of the timeline after the end is shown dimmed (striped, red line).
- An audio-only project still uses the audio length.

## Phase 18 — Import to library + premium filters
- **Import:** files now go only into the **Media** library, not straight onto the timeline.
  - Click **＋** on a file (or drag it) to put it on the timeline; **PiP** adds it as an overlay.
  - Clicking a tile only selects it.
- **Filters:** 85 colour grades in 12 categories — Trending, HD, Portrait, Landscape, Cinematic, Food, Night, Film, Retro, B&W, Mood and Basic.
  - New grades use selective colour (HSL): for example, greens shift to teal while skin stays natural.
  - **HD** looks also add GPU sharpening, shadow lift and a vignette.
  - Each filter is previewed on a photo that suits it.

## Phase 19 — Better chroma key
- **Neutral keys (white, black, grey backgrounds):** the key now matches brightness as well as colour. Removing a white background no longer eats grey/black parts of the image, and white text inside a green screen stays.
- **Clean edges:** the key colour is removed from semi-transparent edge pixels, so there is no white or green halo around letters and hair. The matte is softened over neighbouring pixels to remove jagged edges.
- **Spill remove:** only applies to coloured screens (green/blue), so it no longer greys out a logo when keying white.
- The ratio label in the player header now updates correctly when a project opens.

## Phase 20/21 — Stabilization + timeline fixes
- **🎥 Stabilization** is in Video › Basic, for video clips.
  - **Smooth** keeps intentional camera moves and has a Strength slider. **Tripod** locks the shot completely.
  - **Max crop** limits how far the auto zoom can go.
  - How it works:
    - It analyses every frame (at 320 px) with block matching and fits a robust move/rotate/zoom model to each frame.
    - It smooths the camera path, then auto-zooms just enough to hide the black edges.
  - Changing the strength re-smooths instantly, without analysing again.
  - Tested on a synthetic hand-shake clip: tracking error is under 1 px and frame-to-frame shake drops by about 80%.
- **Timeline:**
  - Clicking or dragging the timeline scrollbar no longer moves the playhead.
  - Dragging the playhead to the edge of the timeline scrolls it.
- **Scrubbing:** if the browser's video decoder stops answering a seek, ChitraCut restarts the seek after 0.45 s. The picture follows the playhead again (including when you drag it backwards) instead of freezing.

## Phase 22 — Playhead drag fix
- While you drag the playhead, the pointer is kept inside the track area. Holding it at the left or right edge, or past it over the track names, keeps scrolling the timeline. You can always drag back to 0:00, even when the timeline is scrolled far right.
- The playhead line is hidden when it is scrolled out of view, so it never sits over the track names.

## Phase 23 — ✨ Magic animate (photos)
- Where to find it: select a photo (main track or overlay) › **Animation › ✨ Magic**.
- **Finding the objects:**
  - **Auto-detect** finds people, animals, vehicles, furniture and other objects with DETR ResNet-50 (Apache-2.0, run with transformers.js).
  - Each object is then cut out with the MediaPipe "magic touch" interactive segmenter (Apache-2.0).
  - **Tap to add object** cuts out anything you tap in the player. Each found object can be removed with ✕.
- **Animation:**
  - The hole behind each object is filled automatically (push-pull inpainting).
  - Each object then animates on its own — **In:** Auto (nearest edge), Left, Right, Top, Bottom, Pop, Rise, Fade, Spin; **Out:** the same, or None.
  - You can set the in/out duration, the delay between objects, the order (left→right, biggest first, random) and the background (stays, fades in, zooms in).
- Everything runs in the browser; the picture is never uploaded. The models download once (≈45 MB + ≈6 MB) and are then cached.
- The objects and settings are saved inside the project and export like any other clip.

## Phase 24 — Magic animate is easier to find
- **✨ Magic** is now the first sub-tab under Animation for photos *and* videos. On a video it explains that Magic works on photos.
- On a photo, a purple **✨ Magic animate** banner sits above the In/Out animations.
- Searching "magic" in the animation search shows a Magic animate tile.
- A version tag (v24) next to the logo shows which version is loaded.

## Phase 25 — Magic animate, Canva-style
- **✨ Magic** is now the first tile in **Animation › In** (photos only). There is no separate tab.
  - Clicking the tile turns it on and runs auto-detect the first time.
  - Picking any other In animation turns Magic off.
- **Timing:**
  - Defaults: the picture comes into focus from a soft bright haze, objects rise in one by one (0.6 s each, 0.1 s apart), and there is no Out.
  - The photo is lengthened automatically so objects never overlap their in and out.
- **Content-aware fill:** the space behind each object is now filled with a multi-scale PatchMatch fill. It copies real texture (ground, walls) from nearby instead of blurring.

## Phase 26 — Text to speech fix
- **Cleaning the text:** before speaking, the text is reduced to what the chosen voice can pronounce.
  - Digits are turned into words (e.g. 2026 → ಎರಡು ಸೊನ್ನೆ ಎರಡು ಆರು).
  - Characters from other scripts and symbols are removed.
  - Characters the voice did not know were crashing it, which showed as a bare number error.
- **Smaller pieces:** text is spoken in pieces of at most about 140 characters. If a piece still fails, it is split in half and retried.
- **Fallback voice:** if the small 8-bit voice model cannot run in the browser, ChitraCut switches automatically to the full-precision voice (one-time larger download, ~114 MB for Kannada).

## Phase 27 — Search everywhere
- Every library panel has a search box at the top: Media & Library, Audio (sound effects + your music), Text, Stickers, Effects, Transitions, Templates, Filters and LUTs.
- **What it searches:**
  - All categories of the panel at once, by name and by category. For example, "glitch" finds every effect in the Glitch group, and "hd" finds all HD filters.
  - Emojis and stickers have names, so you can search "like", "birthday", "arrow" and so on.
- Results show in one grid with a count. ✕ or Esc clears the search, and picking a category on the left also leaves search.

## Phase 28 — Smoother playback, clean export start, crisper timeline
- **Many clips no longer lag:** only the current clip and its neighbours keep a live video decoder. Far-away clips and PiP videos release theirs, so browsers no longer choke when many videos are imported.
- **Stall guard:** when the playing video is still loading (start of play, clip change, big 4K files), the music and PiP videos wait for it, so they stay in sync.
- **Export:**
  - The export warms up the first clip before recording starts.
  - The recorder pauses while a clip is still loading, so the final file no longer begins with a frozen picture or has stutters at cuts.
- **Scrubbing:** a slow seek (large 4K files) is no longer restarted early. Before this fix, restarting it was what froze the picture, so the frame shown — and the split point — lagged behind the playhead.
- **Playhead drag:** the timeline only auto-scrolls when the pointer is pushed past the edge, so the playhead stays exactly under the mouse.
- **Timeline look:**
  - Taller tracks with tick-mark ruler.
  - Blue audio clips with light-blue waveforms.
  - Clearer labels and selection.

## Phase 29
- Fix: when the timeline is scrolled, clips no longer show through the track-name column on the left.

## Phase 30 — Lighter preview engine
- **Frame-aware upload:** a video frame is copied to the GPU only when the browser has decoded a new one. Before, the same frame was copied 60×/s while the video runs at 25–30 fps.
- **4K / high-resolution clips:** each frame is shrunk on the GPU to preview size before upload, so 4K is about 16× less data per frame. Export uses full quality.
- **Idle:** while paused, the preview redraws only when something changes (time, edit, selection, a new decoded frame) or while you are interacting. This keeps the editor responsive instead of redrawing 60×/s.

## Phase 31 — CapCut desktop look
- **Colours:** sampled from a CapCut desktop screenshot — page #141414, panels #262626, panel headers #303030, track lanes #292929, accent #5ec7cd.
- **Panel tops:** the left tabs, Player header and right tabs sit on a lighter header strip, like CapCut. All left tabs fit without a scrollbar.
- **Media:** large 2-column cards; Add/PiP buttons appear on hover (always shown on touch screens).
- **Right panel:** with nothing selected it shows **Details** — name, duration, clip counts, aspect ratio, resolution, preview quality, frame rate.

## Phase 32 — preview stability
- Fast scrubbing onto a clip that is still loading keeps the last good picture instead of flashing black (up to 3 s).
- A clip whose new frame is not decoded yet reuses its last uploaded frame instead of returning early.
- Video decoders are no longer thrown away while scrubbing (only while playing, or when more than 6 are open); keep-window widened to 2 clips back / 2 ahead.
- Frame-upload skip is limited to one video frame (40 ms) during playback, so a missed frame callback can never freeze the picture under a filter.
- Every main render resets the shared WebGL state (scissor, viewport, texture unit); the effect/transition preview tiles always restore it, even on errors.
- Moving the mouse over the side panels no longer forces the preview to keep re-rendering (less lag while browsing filters/effects).
- Bug fix: dragging a filter thumbnail onto the player/timeline used to import the thumbnail picture as a new "download.jpg" overlay. Panel pictures can no longer be dragged out as files; instead a filter tile can be dragged onto a clip (timeline) or onto the player to apply that filter.
