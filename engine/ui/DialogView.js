export class DialogView {
  constructor(root) {
    this.box = root.querySelector('#dialog-box');
    this.nameEl = root.querySelector('#dialog-name');
    this.textEl = root.querySelector('#dialog-text');
    this.contEl = root.querySelector('#dialog-continue');
    this._typing = false;
    this._skip = false;
    this._timers = [];
  }

  show() { this.box.classList.remove('hidden'); }
  hide() { this.box.classList.add('hidden'); }
  clear() {
    this._cancelTimers();
    this.nameEl.textContent = '';
    this.textEl.textContent = '';
    this.contEl.classList.remove('visible');
    this._typing = false;
  }
  isTyping() { return this._typing; }

  say(name, text, typingSpeed = 30) {
    this.show();
    this._cancelTimers();
    this.nameEl.textContent = name || '';
    this.textEl.textContent = '';
    this.contEl.classList.remove('visible');
    this._typing = true;
    this._skip = false;

    const chars = Array.from(text);
    let i = 0;

    const step = () => {
      if (this._skip || i >= chars.length) {
        this.textEl.textContent = text;
        this._finish();
        return;
      }
      this.textEl.textContent += chars[i++];
      this._timers.push(setTimeout(step, typingSpeed));
    };
    step();
  }

  skipTyping() {
    if (this._typing) { this._skip = true; return true; }
    return false;
  }

  _finish() {
    this._typing = false;
    this.contEl.classList.add('visible');
  }

  _cancelTimers() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
  }
}
