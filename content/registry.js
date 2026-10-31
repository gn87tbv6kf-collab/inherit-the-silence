import config from './config.js';
import chapter1 from './scenes/chapter1/_index.js';
import hero from './characters/hero.js';

export async function loadContent() {
  const allScenes = [...chapter1]; // сюда потом будешь добавлять новые главы
  const scenes = Object.fromEntries(allScenes.map(s => [s.id, s]));
  const characters = { hero };
  return { config, scenes, characters };
}
