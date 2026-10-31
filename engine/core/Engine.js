import { State } from './State.js';
import { SceneRunner } from './SceneRunner.js';
import { DialogView } from '../ui/DialogView.js';
import { ChoiceView } from '../ui/ChoiceView.js';
import { SceneRenderer } from '../media/SceneRenderer.js';

export class Engine {
  constructor({ root, config, scenes, characters }) {
    this.root = root;
    this.config = config || {};
    this.scenes = scenes || {};
    this.characters = characters || {};

    this.state = new State();
    this.renderer = new SceneRenderer(root);
    this.dialog = new DialogView(root);
    this.choiceView = new ChoiceView(root);
    this.runner = new SceneRunner(this);

    this.settings = {
      typingSpeed: this.config.typingSpeed ?? 30,
    };

    this.currentSceneId = null;
  }

  async start(sceneId) {
    const id = sceneId || this.config.startScene;
    if (!id || !this.scenes[id]) {
      console.error('[engine] no start scene:', id);
      return;
    }
    await this.goTo(id);
  }

  async goTo(sceneId) {
    const scene = this.scenes[sceneId];
    if (!scene) {
      console.error('[engine] scene not found:', sceneId);
      return;
    }
    this.currentSceneId = sceneId;
    this.state.currentScene = sceneId;
    this.dialog.hide();
    this.dialog.clear();
    await this.runner.load(scene);
  }

  advance() { return this.runner.advance(); }

  evalCondition(expr) {
    if (expr === undefined || expr === null || expr === '') return true;
    if (typeof expr === 'function') return !!expr(this.state.vars);
    try {
      // В условиях используй префикс v: например "v.trust >= 3 && v.flag_x === true"
      const fn = new Function('v', `return (${expr});`);
      return !!fn(this.state.vars);
    } catch (err) {
      console.error('[engine] condition error:', expr, err);
      return false;
    }
  }
}
