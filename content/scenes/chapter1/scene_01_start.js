export default {
  id: 'scene_01_start',
  commands: [
    // техническая демо-сцена (без сюжета) — замени содержимое своим
    { narrate: 'Техническая демо-сцена. Проверка работы движка.' },
    { bg: 'assets/bg/placeholder.jpg' },
    { sprite: 'hero', img: 'assets/sprites/hero_normal.png', pos: 'center' },
    { say: 'hero', text: 'Привет. Это реплика персонажа.' },
    { think: 'hero', text: 'Это внутренняя мысль персонажа (пока отображается так же).' },
    { narrate: 'Сейчас появится выбор.' },
    { choice: [
      { text: 'Вариант A', set: { picked_a: true }, goto: 'scene_02_after_choice' },
      { text: 'Вариант B', set: { picked_b: true }, goto: 'scene_02_after_choice' },
    ]},
  ],
};
