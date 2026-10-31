export class SceneRunner {
  constructor(engine) {
    this.engine = engine;
    this.scene = null;
    this.cursor = 0;
    this.mode = 'idle'; // idle | say | choice | ended
  }

  async load(scene) {
    this.scene = scene;
    this.cursor = 0;
    await this._run();
  }

  async advance() {
    if (this.mode !== 'say') return;
    const dlg = this.engine.dialog;
    if (dlg.isTyping()) { dlg.skipTyping(); return; }
    this.cursor++;
    await this._run();
  }

  async pickChoice(index) {
    const cmd = this.scene.commands[this.cursor];
    if (!cmd || !cmd.choice) return;
    const opt = cmd.choice[index];
    if (!opt) return;
    if (opt.set) this.engine.state.set(opt.set);
    if (opt.goto) {
      await this.engine.goTo(opt.goto);
    } else {
      this.cursor++;
      await this._run();
    }
  }

  async _run() {
    this.mode = 'idle';
    while (this.cursor < this.scene.commands.length) {
      const cmd = this.scene.commands[this.cursor];
      const r = await this._exec(cmd);
      if (r === 'wait_input')  { this.mode = 'say';    return; }
      if (r === 'wait_choice') { this.mode = 'choice'; return; }
      if (r === 'jump')        { return; }
      this.cursor++;
    }
    this.mode = 'ended';
    console.log('[runner] scene ended:', this.scene.id);
  }

  async _exec(cmd) {
    const e = this.engine;

    if (cmd.bg !== undefined) {
      e.renderer.setBackground(cmd.bg); return 'continue';
    }
    if (cmd.sprite !== undefined) {
      e.renderer.setSprite(cmd.sprite, cmd.img, cmd.pos || 'center'); return 'continue';
    }
    if (cmd.clearSprite !== undefined) {
      e.renderer.clearSprite(cmd.clearSprite); return 'continue';
    }
    if (cmd.set !== undefined) {
      e.state.set(cmd.set); return 'continue';
    }
    if (cmd.wait !== undefined) {
      await new Promise(r => setTimeout(r, cmd.wait)); return 'continue';
    }
    if (cmd.narrate !== undefined) {
      e.dialog.say('', cmd.narrate, e.settings.typingSpeed); return 'wait_input';
    }
    if (cmd.say !== undefined) {
      const ch = e.characters[cmd.say];
      e.dialog.say(ch ? ch.name : cmd.say, cmd.text || '', e.settings.typingSpeed);
      return 'wait_input';
    }
    if (cmd.think !== undefined) {
      const ch = e.characters[cmd.think];
      e.dialog.say(ch ? ch.name : cmd.think, cmd.text || '', e.settings.typingSpeed);
      return 'wait_input';
    }
    if (cmd.if !== undefined) {
      const branch = e.evalCondition(cmd.if) ? (cmd.then || []) : (cmd.else || []);
      for (const c of branch) {
        if (c.set)  e.state.set(c.set);
        if (c.goto) { await e.goTo(c.goto); return 'jump'; }
      }
      return 'continue';
    }
    if (cmd.goto !== undefined) {
      await e.goTo(cmd.goto); return 'jump';
    }
    if (cmd.choice !== undefined) {
      e.choiceView.show(cmd.choice, (i) => this.pickChoice(i));
      return 'wait_choice';
    }

    console.warn('[runner] unknown command:', cmd);
    return 'continue';
  }
}
