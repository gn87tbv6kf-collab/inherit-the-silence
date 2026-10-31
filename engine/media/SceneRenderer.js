export class SceneRenderer {
  constructor(root) {
    this.bgEl = root.querySelector('#layer-bg');
    this.spriteSlots = {
      left: root.querySelector('.sprite-slot[data-pos="left"]'),
      center: root.querySelector('.sprite-slot[data-pos="center"]'),
      right: root.querySelector('.sprite-slot[data-pos="right"]'),
    };
    this.spriteMap = {}; // charId -> 'left' | 'center' | 'right'
  }

  setBackground(src) {
    if (!src) { this.bgEl.style.backgroundImage = ''; return; }
    this.bgEl.style.backgroundImage = `url("${src}")`;
  }

  setSprite(charId, src, pos = 'center') {
    const oldPos = this.spriteMap[charId];
    if (oldPos && oldPos !== pos) this.clearSprite(charId);
    const slot = this.spriteSlots[pos];
    if (!slot) { console.warn('[renderer] bad pos:', pos); return; }
    slot.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'sprite';
    img.alt = charId;
    img.onerror = () => img.classList.add('sprite-missing');
    img.src = src;
    slot.appendChild(img);
    this.spriteMap[charId] = pos;
  }

  clearSprite(charId) {
    const pos = this.spriteMap[charId];
    if (!pos) return;
    const slot = this.spriteSlots[pos];
    if (slot) slot.innerHTML = '';
    delete this.spriteMap[charId];
  }
}
