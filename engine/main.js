import { Engine } from './core/Engine.js';
import { loadContent } from '../content/registry.js';

async function boot() {
  const root = document.getElementById('stage');
  const content = await loadContent();
  const engine = new Engine({ root, ...content });

  // клик / тап — продвинуть диалог
  document.addEventListener('click', (e) => {
    if (e.target.closest('.choice-btn')) return;
    if (e.target.closest('.layer-choices.active')) return;
    engine.advance();
  });

  // space / enter
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      engine.advance();
    }
  });

  window.__engine = engine; // для отладки из консоли
  await engine.start();
}

boot().catch(err => {
  console.error('[boot] fatal:', err);
  document.body.innerHTML = `<pre style="padding:2rem;color:#f66;font-family:monospace">Ошибка запуска. Открой консоль (F12).\n${err}</pre>`;
});
