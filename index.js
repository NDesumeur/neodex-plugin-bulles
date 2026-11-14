// Bulles : Vise et tire des bulles : trois de la même couleur éclatent, et celles qui ne tiennent plus à rien tombent.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Bulles</span><span class="hint">Souris : viser · clic : tirer · X : échanger la bulle · manette : stick pour viser, A pour tirer, X pour échanger</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="184" height="256"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="gFs">PLEIN ÉCRAN</button></div>
      <div class="hint">Le pointillé montre la trajectoire, rebonds sur les bords compris.</div><div class="hint">Tous les 7 tirs, le plafond descend d'une rangée. Fais tomber plusieurs grappes d'un coup pour un combo.</div>
      <div class="hint">Bulles spéciales : la bombe fait sauter tout ce qui l'entoure, l'arc-en-ciel prend la couleur qui l'arrange, la pierre ne casse jamais (il faut la faire tomber).</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(240px,calc((100vh - 200px) * 184 / 256)));height:auto;aspect-ratio:184/256}
.gameBox:fullscreen{padding:0;display:grid;place-items:center}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 184 / 256))}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "BULLES", T: {"k": "#030a14", "k2": "#08162a", "fill": "#0e2240", "fillOn": "#143058", "hl": "#1c3a6a", "line": "#2e5a9a", "acc": "#ff4fa8", "accL": "#ffb0d8", "accS": "#c02a7a", "accD": "#4a0a2a", "rivet": "#ffb0d8", "btn": "#1c3a6a", "btnHi": "#4a7ac0", "btnLo": "#08162a", "btnHov": "#1c4478", "btnHovHi": "#6a9ae0", "text": "#eef6ff", "muted": "#a8c0e0", "acc2": "#ffd84a", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#040c1a", "bgDot": "#0e2240", "bgDot2": "#08162a", "spark": "#2e5a9a", "spark2": "#ffd84a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["....kkkk....", "..kkaaaakk..", ".kaawaaaaak.", ".kawaaaaaak.", "kaaaaaaaaaak", "kaaaaaaaaask", "kaaaaaaaaask", "kaaaaaaaassk", ".kaaaaaassk.", ".kaaaassssk.", "..kkssssk...", "....kkkk...."],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 184, H = 256, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
/* ---------- Bulles : viser et tirer des bulles ; trois de la même couleur éclatent, et celles qui ne tiennent plus à rien tombent ----------
   Valeurs d'une case : -1 vide, 0 à 5 les couleurs, 9 la pierre (ne casse jamais). Bulles à tirer en plus : 7 la bombe, 8 l'arc-en-ciel. */
const BU = {R: 7, D: 14, COLS: 12, X0: 8, Y0: 18, ROWH: 12, SPEED: 4.2, DEAD: 214, BOMB: 7, RAIN: 8, STONE: 9};
const BU_COL = [['#ff4a5a', '#ffb0b8', '#a02030'], ['#ffd84a', '#fff4b0', '#a07a10'], ['#5fdf6a', '#c8ffc8', '#2a8a3a'], ['#3f8aff', '#b0d0ff', '#1a4aa0'], ['#b07aff', '#e4d0ff', '#6a3ab0'], ['#ff9a3d', '#ffe0b0', '#a05a10']];
// une bulle de verre : reflet blanc en haut à gauche, croissant clair dedans, lumière renvoyée en bas à droite, bord sombre du côté de l'ombre
const BU_BALL = ['....kkkkkk....', '..kkmmmmmmkk..', '.kmmllllmmmmk.', '.kmlwwllmmmmk.', 'kmlwwlmmmmmmdk', 'kmllmmmmmmmmdk', 'kmlmmmmmmmmmdk', 'kmmmmmmmmmmmdk', 'kmmmmmmmmmmldk', 'kmmmmmmmmmlldk', '.kmmmmmmmlldk.', '.kdmmmmmmmddk.', '..kkddddddkk..', '....kkkkkk....'];
const BU_SPR = BU_COL.map(([m, l, d]) => spr(BU_BALL, {k: '#05010b', m, l, d, w: '#ffffff'}));
// l'arc-en-ciel : la même bulle en bandes de toutes les couleurs, qui défilent (6 images)
const BU_RAIN = BU_COL.map((_, f) => cnv(14, 14, b => BU_BALL.forEach((r, y) => { for (let x = 0; x < 14; x++) { const ch = r[x], i = ((x + y + f * 2) >> 1) % 6, col = {k: '#05010b', w: '#ffffff', m: BU_COL[i][0], l: BU_COL[i][1], d: BU_COL[i][2]}[ch]; if (col) px(b, col, x, y); } })));
// la bombe : boule noire à reflet, mèche et étincelle
const BU_BOMB = spr(['.........y.o..', '........o.y...', '........f.....', '....kkkkfk....', '..kkbbbbbbkk..', '.kbbggbbbbbbk.', '.kbgwgbbbbbbk.', 'kbbggbbbbbbbbk', 'kbbbbbbbbbbbbk', 'kbbbbbbbbbbbbk', '.kbbbbbbbbbbk.', '.kbbbbbbbbbbk.', '..kkbbbbbbkk..', '....kkkkkk....'],
  {k: '#05010b', b: '#2a2a3a', g: '#5a5a78', w: '#c8c8e0', f: '#8a6a3a', y: '#ffd84a', o: '#ff8a3a'});
// la pierre : un caillou à facettes, fendu
const BU_STONE = spr(['....kkkkk.....', '..kk44433kk...', '.k4433333322k.', 'k443333c33322k', 'k43333c333322k', 'k4333c3333222k', 'k33333c332222k', 'k3333333c2222k', 'k333333332221k', 'k23333332c221k', '.k2233322221k.', '.k1222222211k.', '..kk111111kk..', '....kkkkkk....'],
  {k: '#05010b', 1: '#4a4640', 2: '#6a645a', 3: '#8e877a', 4: '#b8b0a0', c: '#2a2622'});
const buImg = (v, t = 0) => v < 6 ? BU_SPR[v] : v === BU.BOMB ? BU_BOMB : v === BU.RAIN ? BU_RAIN[(t >> 3) % 6] : BU_STONE;
const buLight = v => v < 6 ? BU_COL[v][1] : v === BU.STONE ? '#b8b0a0' : '#ffd84a';  // la couleur des gouttes quand elle éclate
const bus = gstore('bulles', {games: 0, popped: 0});
const buXY = (r, c, top) => [BU.X0 + c * BU.D + (r % 2) * BU.R + BU.R, BU.Y0 + top + r * BU.ROWH + BU.R];
const buNb = (r, c) => { const o = r % 2; return [[r, c - 1], [r, c + 1], [r - 1, c - 1 + o], [r - 1, c + o], [r + 1, c - 1 + o], [r + 1, c + o]]; };
const buCols = r => BU.COLS - (r % 2);
let bu = null;
function buFill(colors, stones) {  // six rangées de bulles, et quelques pierres plus bas (jamais sur la première rangée : elles doivent pouvoir tomber)
  for (let r = 0; r < 6; r++) for (let c = 0; c < buCols(r); c++) bu.grid[r][c] = Math.floor(Math.random() * colors);
  for (let k = 0; k < stones; k++) { const r = 2 + Math.floor(Math.random() * 4); bu.grid[r][Math.floor(Math.random() * buCols(r))] = BU.STONE; }
}
function buNew() {
  const grid = []; for (let r = 0; r < 18; r++) grid.push(Array(BU.COLS).fill(-1));
  bu = Object.assign(bu || {tick: 0, raf: 0}, {mode: 'play', user: false, grid, top: 0, shots: 0, fired: 0, board: 1, ang: -Math.PI / 2, cur: Math.floor(Math.random() * 4), next: Math.floor(Math.random() * 4), shot: null, falling: [], pops: [], booms: [], texts: [], shake: 0, score: 0, overAt: 0, colors: 4});
  buFill(4, 2); buInfo();
}
function buPresent() { const s = new Set(); bu.grid.forEach(r => r.forEach(v => { if (v >= 0 && v < 6) s.add(v); })); return [...s]; }  // les couleurs encore là (pas les pierres)
function buPick() { const p = buPresent(); return p.length ? p[Math.floor(Math.random() * p.length)] : Math.floor(Math.random() * bu.colors); }
function buFire() {
  if (bu.mode !== 'play' || bu.shot) return; const [x, y] = [W / 2, BU.DEAD + 16];
  bu.shot = {x, y, vx: Math.cos(bu.ang) * BU.SPEED, vy: Math.sin(bu.ang) * BU.SPEED, c: bu.cur}; bu.cur = bu.next; bu.fired++;
  bu.next = bu.fired % 10 === 0 ? (bu.fired % 20 ? BU.BOMB : BU.RAIN) : buPick();  // tous les 10 tirs, une bulle spéciale : bombe, puis arc-en-ciel
  beep(520, .05, 'square', 780, .05);
}
function buPop(a, b) { const [x, y] = buXY(a, b, bu.top), v = bu.grid[a][b]; bu.pops.push({x, y, c: v, t: 0, drops: Array.from({length: 7}, (_, i) => { const an = i / 7 * Math.PI * 2 + Math.random() * .5, sp = 1 + Math.random(); return [Math.cos(an) * sp, Math.sin(an) * sp - .6]; })}); bu.grid[a][b] = -1; }
function buDrop() {  // ce qui ne tient plus au plafond tombe ; renvoie le nombre de bulles et de grappes séparées
  const held = new Set(), q = []; for (let b = 0; b < buCols(0); b++) if (bu.grid[0][b] >= 0) { held.add('0,' + b); q.push([0, b]); }
  while (q.length) { const [a, b] = q.pop(); for (const [x, y] of buNb(a, b)) if (bu.grid[x]?.[y] >= 0 && !held.has(x + ',' + y)) { held.add(x + ',' + y); q.push([x, y]); } }
  const loose = new Map(); bu.grid.forEach((row, a) => row.forEach((v, b) => { if (v >= 0 && !held.has(a + ',' + b)) loose.set(a + ',' + b, [a, b]); }));
  let comps = 0; const seen = new Set();
  for (const [k, cell] of loose) { if (seen.has(k)) continue; comps++; seen.add(k); const st = [cell]; while (st.length) for (const [x, y] of buNb(...st.pop())) { const kk = x + ',' + y; if (loose.has(kk) && !seen.has(kk)) { seen.add(kk); st.push([x, y]); } } }
  for (const [a, b] of loose.values()) { const [x, y] = buXY(a, b, bu.top); bu.falling.push({x, y, vy: -1 - Math.random(), vx: (Math.random() - .5) * .8, c: bu.grid[a][b]}); bu.grid[a][b] = -1; }
  return [loose.size, comps];
}
const buSay = (x, y, txt, col, big = false) => bu.texts.push({x, y, txt, col, big, t: 0});
function buSnap(s) {  // la bulle se range dans la case libre la plus proche, puis on cherche les groupes de trois
  let best = null, bd = 1e9;
  for (let r = 0; r < bu.grid.length; r++) for (let c = 0; c < buCols(r); c++) if (bu.grid[r][c] < 0) { const [x, y] = buXY(r, c, bu.top), d = Math.hypot(x - s.x, y - s.y); if (d < bd && (r === 0 || buNb(r, c).some(([a, b]) => bu.grid[a]?.[b] >= 0))) { bd = d; best = [r, c]; } }
  if (!best) return; const [r, c] = best, [hx, hy] = buXY(r, c, bu.top);
  const group = col => { bu.grid[r][c] = col; const same = [best], seen = new Set([r + ',' + c]); for (let i = 0; i < same.length; i++) for (const [a, b] of buNb(...same[i])) if (bu.grid[a]?.[b] === col && !seen.has(a + ',' + b)) { seen.add(a + ',' + b); same.push([a, b]); } return same; };
  let gone = [];
  if (s.c === BU.BOMB) {  // la bombe : tout ce qui est à deux bulles autour saute, pierres comprises
    bu.grid[r][c] = BU.BOMB; bu.grid.forEach((row, a) => row.forEach((v, b) => { if (v >= 0) { const [x, y] = buXY(a, b, bu.top); if (Math.hypot(x - hx, y - hy) < BU.D * 2.1) gone.push([a, b]); } }));
    bu.booms.push({x: hx, y: hy, t: 0}); bu.shake = 10; beep(90, .45, 'sawtooth', 40, .1); setTimeout(() => beep(60, .3, 'square', 30, .06), 60);
  } else {
    let col = s.c;
    if (col === BU.RAIN) {  // l'arc-en-ciel prend la couleur voisine qui fait le plus grand groupe
      const near = [...new Set(buNb(r, c).map(([a, b]) => bu.grid[a]?.[b]).filter(v => v >= 0 && v < 6))];
      col = near.length ? near.map(v => [group(v).length, v]).sort((x, y) => y[0] - x[0])[0][1] : buPick();
      bu.pops.push({x: hx, y: hy, c: col, t: 0, drops: []}); beep(1046, .12, 'triangle', 1568, .05);
    }
    const same = group(col); if (same.length >= 3) gone = same;
  }
  let fell = 0, comps = 0, pts = 0;
  if (gone.length) {
    gone.forEach(([a, b]) => buPop(a, b)); [fell, comps] = buDrop();
    pts = gone.length * (s.c === BU.BOMB ? 15 : 10) + Math.round(fell * 20 * (1 + fell / 4)) * Math.max(1, comps);  // deux grappes qui tombent d'un coup : chute ×2
    bu.score += pts; bus.popped += gone.length + fell;
    if (s.c !== BU.BOMB) beep(880, .08, 'triangle', 1320, .07); if (fell) setTimeout(() => beep(660, .15, 'triangle', 220, .06), 80);
    buSay(hx, hy - 6, '+' + pts, '#ffffff');
    if (comps >= 2) { buSay(W / 2, 120, 'COMBO ×' + comps, '#ffd84a', true); bu.shake = Math.max(bu.shake, 6); [0, 90, 180].forEach((d, i) => setTimeout(() => beep(784 * 1.26 ** i, .1, 'square', 0, .05), d)); }
    else if (fell >= 4) buSay(W / 2, 120, 'CHUTE ×' + fell, '#7ee07a', true);
  } else beep(260, .04, 'square', 0, .04);
  bu.shots++; if (bu.shots % 7 === 0) { bu.top += BU.ROWH; beep(160, .2, 'sawtooth', 100, .05); }  // le plafond descend
  if (!buPresent().length) {  // plus aucune couleur : les pierres tombent en bonus, et un nouveau tableau arrive, avec une couleur et une pierre de plus
    let st = 0; bu.grid.forEach((row, a) => row.forEach((v, b) => { if (v === BU.STONE) { const [x, y] = buXY(a, b, bu.top); bu.falling.push({x, y, vy: -1, vx: 0, c: v}); bu.grid[a][b] = -1; st++; } }));
    bu.score += 500 + st * 50; bu.colors = Math.min(6, bu.colors + 1); bu.board++; bu.top = 0; buFill(bu.colors, Math.min(6, bu.board + 1));
    buSay(W / 2, 100, 'TABLEAU ' + bu.board, '#ffd84a', true);
  }
  if (bu.grid.some((row, a) => row.some((v, b) => v >= 0 && buXY(a, b, bu.top)[1] + BU.R > BU.DEAD))) { bu.mode = 'over'; bu.overAt = bu.tick; bus.games++; best('bulles', Math.round(bu.score)); saveGames(); buInfo(); beep(140, .5, 'sawtooth', 60, .08); }
  if (bu.cur < 6 && !buPresent().includes(bu.cur)) bu.cur = buPick(); if (bu.next < 6 && !buPresent().includes(bu.next)) bu.next = buPick();
}
function buUpdate() {
  const s = bu.shot;
  if (s) for (let k = 0; k < 3; k++) {
    s.x += s.vx / 3 * 1.6; s.y += s.vy / 3 * 1.6;
    if (s.x < BU.X0 + BU.R) { s.x = BU.X0 + BU.R; s.vx = Math.abs(s.vx); beep(400, .02, 'square', 0, .03); } if (s.x > BU.X0 + BU.COLS * BU.D - BU.R) { s.x = BU.X0 + BU.COLS * BU.D - BU.R; s.vx = -Math.abs(s.vx); beep(400, .02, 'square', 0, .03); }
    const hit = s.y < BU.Y0 + bu.top + BU.R || bu.grid.some((row, a) => row.some((v, b) => { if (v < 0) return false; const [x, y] = buXY(a, b, bu.top); return Math.hypot(x - s.x, y - s.y) < BU.D - 2; }));
    if (hit) { bu.shot = null; buSnap(s); break; }
  }
  buAnim();
}
function buAnim() {  // ce qui bouge encore après la fin d'une partie : chutes, éclats, textes
  for (const f of bu.falling) { f.vy += .3; f.y += f.vy; f.x += f.vx; } bu.falling = bu.falling.filter(f => f.y < H + 10);
  for (const p of bu.pops) p.t++; bu.pops = bu.pops.filter(p => p.t < 20);
  for (const b of bu.booms) b.t++; bu.booms = bu.booms.filter(b => b.t < 16);
  for (const t of bu.texts) t.t++; bu.texts = bu.texts.filter(t => t.t < (t.big ? 70 : 40));
  if (bu.shake) bu.shake--;
}
const BU_BG = cnv(W, H, b => {  // un aquarium de nuit : fond tramé, algues sur les bords, sable
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) px(b, y < H * .5 ? ((x + y) % 2 && y % 16 < 3 ? '#0e1a3a' : '#0a1430') : '#0a1430', x, y);
  px(b, '#05010b', BU.X0 - 2, 0, 2, H); px(b, '#05010b', BU.X0 + BU.COLS * BU.D, 0, 2, H); px(b, '#2a3a6a', BU.X0 - 1, 0, 1, H); px(b, '#2a3a6a', BU.X0 + BU.COLS * BU.D, 0, 1, H);
  for (let x = BU.X0; x < BU.X0 + BU.COLS * BU.D; x += 4) px(b, '#3a2a5a', x, BU.DEAD, 2, 1);
  for (let y = H - 14; y < H; y++) for (let x = 0; x < W; x++) px(b, (x * 3 + y * 7) % 9 < 2 ? '#a08a5a' : '#c8a870', x, y);
  px(b, '#05010b', 0, 0, W, BU.Y0 - 2); px(b, '#2a1a4a', 0, BU.Y0 - 2, W, 2);
});
function buDraw() {
  if (bu.mode === 'over') buAnim();  // après la fin, les bulles finissent de tomber
  const sh = bu.shake ? Math.round((Math.random() - .5) * Math.min(4, bu.shake)) : 0;
  g.save(); g.translate(sh, sh ? Math.round((Math.random() - .5) * 3) : 0);
  g.drawImage(BU_BG, 0, 0);
  if (bu.top) { px(g, '#3a2a5a', BU.X0, BU.Y0, BU.COLS * BU.D, bu.top); for (let x = BU.X0; x < BU.X0 + BU.COLS * BU.D; x += 6) px(g, '#5a4a7a', x, BU.Y0 + bu.top - 2, 3, 2); }
  bu.grid.forEach((row, r) => row.forEach((v, c) => { if (v >= 0) { const [x, y] = buXY(r, c, bu.top); g.drawImage(buImg(v, bu.tick), x - BU.R, y - BU.R); } }));
  for (const f of bu.falling) g.drawImage(buImg(f.c, bu.tick), Math.round(f.x - BU.R), Math.round(f.y - BU.R));
  // l'éclatement : la bulle gonfle un instant, puis se brise en anneau et en gouttes qui retombent
  for (const p of bu.pops) {
    if (p.t < 3) { const z = 14 + p.t * 2; g.drawImage(buImg(p.c, bu.tick), Math.round(p.x - z / 2), Math.round(p.y - z / 2), z, z); continue; }
    const k = (p.t - 3) / 17, col = buLight(p.c);
    if (p.t < 8) { const rr = BU.R + (p.t - 3) * 2; for (let a = 0; a < 12; a++) if (a % 3) px(g, p.t < 6 ? '#ffffff' : col, p.x + Math.cos(a * .5236) * rr, p.y + Math.sin(a * .5236) * rr, 1, 1); }
    g.globalAlpha = 1 - k; const n = p.t - 3; for (const [vx, vy] of p.drops) { const s = n < 8 ? 2 : 1; px(g, col, p.x + vx * n * 1.4 - s / 2, p.y + vy * n * 1.4 + .09 * n * n - s / 2, s, s); } g.globalAlpha = 1;
  }
  // la bombe : un éclair rond qui grandit, jaune puis orange
  for (const b of bu.booms) { const rr = 6 + b.t * 2.2; g.globalAlpha = 1 - b.t / 16; for (let a = 0; a < 28; a++) { const an = a / 28 * Math.PI * 2, j = (a * 7 + b.t) % 3; px(g, b.t < 5 ? '#ffffff' : j ? '#ffa030' : '#ffd84a', b.x + Math.cos(an) * (rr - j), b.y + Math.sin(an) * (rr - j), 2, 2); } if (b.t < 4) { g.globalAlpha = .5 - b.t / 8; px(g, '#fff0c0', b.x - rr, b.y - rr, rr * 2, rr * 2); } g.globalAlpha = 1; }
  // le canon et la ligne de visée en pointillés (avec un rebond)
  const cx = W / 2, cy = BU.DEAD + 16;
  if (bu.mode === 'play') { let x = cx, y = cy, vx = Math.cos(bu.ang), vy = Math.sin(bu.ang); for (let i = 0; i < 70; i++) { x += vx * 3; y += vy * 3; if (x < BU.X0 + BU.R || x > BU.X0 + BU.COLS * BU.D - BU.R) vx = -vx; if (y < BU.Y0 + bu.top) break; if (i % 3 === 0) px(g, '#c8d8ff', x, y, 1, 1); } }
  for (let k = 0; k < 14; k++) px(g, k < 3 ? '#05010b' : '#8a8aa8', cx + Math.cos(bu.ang) * k - 1, cy + Math.sin(bu.ang) * k - 1, 3, 3);
  px(g, '#05010b', cx - 10, cy - 2, 20, 12); px(g, '#5a5a78', cx - 9, cy - 1, 18, 10); px(g, '#8a8aa8', cx - 9, cy - 1, 18, 2);
  if (bu.shot) g.drawImage(buImg(bu.shot.c, bu.tick), Math.round(bu.shot.x - BU.R), Math.round(bu.shot.y - BU.R)); else if (bu.mode === 'play') g.drawImage(buImg(bu.cur, bu.tick), cx - BU.R, cy - BU.R - 1);
  g.drawImage(buImg(bu.next, bu.tick), 10, H - 28); pxFont(g, bu.next === BU.BOMB ? 'bombe !' : bu.next === BU.RAIN ? 'arc-en-ciel !' : 'suivante', 8, H - 30, bu.next >= 6 ? '#ffd84a' : '#c8b8a0', 6);  // le nom au-dessus de la bulle : il ne passe jamais sous le canon
  // les points gagnés montent et s'effacent ; les combos s'affichent en grand au milieu
  for (const t of bu.texts) { const k = t.t / (t.big ? 70 : 40); g.globalAlpha = k > .7 ? (1 - k) / .3 : 1; pxFont(g, t.txt, t.x, Math.round(t.y - t.t * (t.big ? .25 : .5)), t.col, t.big ? 14 : 6, 'center'); g.globalAlpha = 1; }
  g.restore();
  pxFont(g, String(Math.round(bu.score)), 6, 12, '#ffffff', 8); pxFont(g, 'plafond dans ' + (7 - bu.shots % 7), W - 6, 12, '#a8b8e0', 6, 'right');
  if (bu.mode === 'pause' && bu.user) gameText(g, W, [['PAUSE', '#ffd84a', 12], ['P ou Start : reprendre', '#ffffff']], 118);
  if (bu.mode === 'over' && bu.tick - bu.overAt > 30) gameText(g, W, [['C\'EST PLEIN !', '#ff4a5a', 12], [Math.round(bu.score) + ' points', '#ffffff'], ['Clic pour rejouer', '#ffd84a']], 110);
}
const buAim = a => { bu.ang = Math.max(-Math.PI + .15, Math.min(-.15, a)); };
cv.onpointermove = e => { if (!bu) return; const [x, y] = cpos(e); buAim(Math.atan2(y - (BU.DEAD + 16), x - W / 2)); };
cv.onpointerdown = e => { e.preventDefault(); if (!bu) return; if (bu.mode === 'over') { if (bu.tick - bu.overAt > 30) buNew(); return; } cv.onpointermove(e); buFire(); };
document.addEventListener('keydown', e => {
  if (!keyOk(e) || !bu) return;
  if (e.key === 'ArrowLeft') { e.preventDefault(); buAim(bu.ang - .06); } if (e.key === 'ArrowRight') { e.preventDefault(); buAim(bu.ang + .06); }
  if (e.key === ' ' || e.key === 'ArrowUp') { e.preventDefault(); if (bu.mode === 'over') { if (bu.tick - bu.overAt > 30) buNew(); } else buFire(); }
  if (e.key.toLowerCase() === 'x' && bu.mode === 'play' && !bu.shot) { [bu.cur, bu.next] = [bu.next, bu.cur]; beep(700, .03); }
  if (e.key.toLowerCase() === 'p' && bu.mode === 'play') { bu.mode = 'pause'; bu.user = true; } else if (e.key.toLowerCase() === 'p' && bu.mode === 'pause') { bu.mode = 'play'; bu.user = false; }
});
{  // la manette : stick gauche ou croix pour viser (en continu), A pour tirer, X ou Y pour échanger, Start pour la pause ; les boutons envoient les touches du clavier
  const KEY = {0: ' ', 2: 'x', 3: 'x', 9: 'p'}, held = new Set();
  const loop = () => {
    requestAnimationFrame(loop); if (!bu || !view.classList.contains('on') || !navigator.getGamepads) return;
    const p = [...navigator.getGamepads()].find(Boolean); if (!p) return;
    const ax = p.axes[0] || 0, turn = Math.abs(ax) > .2 ? ax : p.buttons[14]?.pressed ? -1 : p.buttons[15]?.pressed ? 1 : 0;
    if (turn && bu.mode === 'play') buAim(bu.ang + turn * .035);
    for (const [i, k] of Object.entries(KEY)) { const on = !!p.buttons[i]?.pressed; if (on && !held.has(i)) { held.add(i); document.dispatchEvent(new KeyboardEvent('keydown', {key: k, bubbles: true})); } else if (!on) held.delete(i); }
  };
  requestAnimationFrame(loop);
}
function buInfo() { showStats([['Meilleur score', games.best.bulles || 0], ['Parties', bus.games], ['Bulles éclatées', bus.popped]]); }
$('gNew').onclick = () => { buNew(); $('gNew').blur(); };
$('gFs').onclick = () => { $('gFs').blur(); if (document.fullscreenElement) document.exitFullscreen(); else cv.parentElement.requestFullscreen?.().catch(() => {}); };
const buCheck = () => {  // vérification : trois bulles pareilles éclatent et ce qui ne tient plus tombe ; deux grappes d'un coup font un combo ; l'arc-en-ciel, la bombe et la pierre
  const keep = bu, kp = bus.popped, bad = [], empty = () => { bu = null; buNew(); bu.grid.forEach(r => r.fill(-1)); };
  empty(); bu.grid[0][0] = 1; bu.grid[0][1] = 1; bu.grid[1][1] = 2; bu.grid[2][1] = 3; bu.grid[0][5] = 0;
  let [x, y] = buXY(0, 2, 0); buSnap({x, y, c: 1}); if (!(bu.grid[0][0] < 0 && bu.grid[0][2] < 0 && bu.grid[1][1] < 0 && bu.falling.length === 2 && bu.grid[0][5] === 0)) bad.push('trois pareilles');
  empty(); bu.grid[0][0] = 1; bu.grid[0][2] = 1; bu.grid[1][0] = 2; bu.grid[1][2] = 3; bu.grid[0][9] = 0;  // deux grappes séparées, pendues sous les bulles jaunes
  [x, y] = buXY(0, 1, 0); buSnap({x, y, c: 1}); if (!bu.texts.some(t => t.txt === 'COMBO ×2')) bad.push('combo');
  empty(); bu.grid[0][0] = 2; bu.grid[0][1] = 2; bu.grid[0][3] = 4; bu.grid[0][9] = 0;
  [x, y] = buXY(0, 2, 0); buSnap({x, y, c: BU.RAIN}); if (bu.grid[0][0] >= 0 || bu.grid[0][3] !== 4) bad.push('arc-en-ciel');
  empty(); bu.grid[0][4] = BU.STONE; bu.grid[0][5] = 0; bu.grid[0][6] = 1; bu.grid[0][10] = 3;
  [x, y] = buXY(1, 5, 0); buSnap({x, y, c: BU.BOMB}); if (bu.grid[0][4] >= 0 || bu.grid[0][5] >= 0 || bu.grid[0][10] !== 3) bad.push('bombe');
  empty(); bu.grid[0][0] = 1; bu.grid[0][1] = 1; bu.grid[1][0] = BU.STONE; bu.grid[0][9] = 0;
  [x, y] = buXY(1, 1, 0); buSnap({x, y, c: 4}); if (bu.grid[1][0] !== BU.STONE) bad.push('la pierre ne casse pas');
  [x, y] = buXY(0, 2, 0); buSnap({x, y, c: 1}); if (bu.grid[1][0] >= 0 || !bu.falling.some(f => f.c === BU.STONE)) bad.push('la pierre tombe');
  bu = keep; bus.popped = kp; return bad.length ? bad.join(', ') : 'ok';
};
cv.__bu = {st: () => bu, check: buCheck, BU};  // pour l'auto-test
console.assert(buCheck() === 'ok', 'bulles', buCheck());
ctx.onOpen(() => { if (!bu) buNew(); if (bu.mode === 'pause' && !bu.user) bu.mode = 'play'; gameLoop(bu, 'bulles', buUpdate, buDraw); buInfo(); });

}
