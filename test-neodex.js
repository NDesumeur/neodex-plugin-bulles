// lancé par le test « local » de NeoDex : les règles (trois pareilles, chute, combo, arc-en-ciel, bombe, pierre), des tirs à la souris,
// la visée et le tir à la manette, l'éclatement en images, le plein écran et la place prise à la taille de la fenêtre (avec NEO_SHOTS : garde des images)
module.exports = async ({ pj, sleep }) => {
  const B = code => pj(`(() => { const T = document.getElementById('gc').__bu, bu = T.st(), BU = T.BU; ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'bulles-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const click = (x, y) => pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown', {bubbles: true, clientX: r.left + ${x} / 184 * r.width, clientY: r.top + ${y} / 256 * r.height})); return 0; })()`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await B('return T.check();'); if (chk !== 'ok') throw new Error('règles : ' + chk);
  await B('document.getElementById("gNew").click(); return 0;'); await sleep(300); await shot('0-depart');
  // trois tirs à la souris, vers la gauche, le milieu et la droite
  for (const x of [40, 92, 150]) { await click(x, 60); await sleep(900); }
  const n1 = await B('return bu.shots;'); if (n1 !== 3) throw new Error('3 tirs à la souris, compté ' + n1);
  // la manette : stick à droite un moment (la visée tourne), puis A (un tir)
  const a0 = await B('return bu.ang;');
  await pj(`(() => { const pad = {axes: [1, 0], buttons: Array.from({length: 17}, () => ({pressed: false}))}; window.__pad = pad; navigator.getGamepads = () => [pad]; return 0; })()`);
  await sleep(400); await pj(`(__pad.axes[0] = 0, 0)`); await sleep(50);
  const a1 = await B('return bu.ang;'); if (!(a1 > a0 + .1)) throw new Error('le stick ne fait pas tourner la visée : ' + a0 + ' → ' + a1);
  await pj(`(__pad.buttons[0].pressed = true, 0)`); await sleep(120); await pj(`(__pad.buttons[0].pressed = false, 0)`); await sleep(900);
  const n2 = await B('return bu.fired;'); if (n2 !== 4) throw new Error('le bouton A ne tire pas (' + n2 + ' tirs)'); await sleep(1200);
  // l'éclatement image par image : trois bleues, la troisième tirée tout droit
  await B(`bu.grid.forEach(r => r.fill(-1)); bu.grid[0][5] = 3; bu.grid[0][6] = 3; bu.grid[1][7] = 0; bu.grid[0][0] = 1; bu.grid[0][11] = 2; bu.top = 0; bu.cur = 3; bu.shot = null; bu.ang = Math.atan2(-(BU.DEAD + 16 - 25), 104 - 92); return 0;`);
  await B('bu.shot = {x: 99, y: 40, vx: 0, vy: -4.2, c: 3}; return 0;');
  for (const [i, ms] of [[1, 50], [2, 80], [3, 120]]) { await sleep(ms); await shot('1-eclat-' + i); }
  await sleep(1200);
  // la bombe et l'arc-en-ciel annoncés dans la bulle suivante, une pierre au tableau, un combo à l'écran
  await B(`bu.grid.forEach(r => r.fill(-1)); for (let c = 0; c < 12; c++) bu.grid[0][c] = c % 4; for (let c = 0; c < 11; c++) bu.grid[1][c] = (c + 2) % 5; bu.grid[2][4] = BU.STONE; bu.grid[2][7] = BU.STONE; bu.grid[2][1] = 5; bu.cur = BU.BOMB; bu.next = BU.RAIN; bu.texts.push({x: 92, y: 120, txt: 'COMBO ×2', col: '#ffd84a', big: true, t: 5}); return 0;`);
  await sleep(250); await shot('2-speciales');
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.getElementById('gFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && Math.abs(r.height - innerHeight) < 3; })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas la hauteur');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'règles ok · 3 tirs à la souris · visée et tir à la manette · plein écran · aquarium ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
