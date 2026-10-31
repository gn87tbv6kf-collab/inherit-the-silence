export class State {
  constructor() {
    this.vars = {};
    this.currentScene = null;
    this.history = [];  // история переходов (для будущих сохранений)
  }

  set(obj) {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string' && /^[+\-]\d+(\.\d+)?$/.test(v)) {
        const delta = parseFloat(v);
        this.vars[k] = (Number(this.vars[k]) || 0) + delta;
      } else {
        this.vars[k] = v;
      }
    }
  }

  get(k) { return this.vars[k]; }
}
