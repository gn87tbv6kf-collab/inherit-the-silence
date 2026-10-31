export default {
  id: 'scene_02_after_choice',
  commands: [
    { narrate: 'Переход выполнен. Проверяем ветвление.' },
    { if: 'v.picked_a === true', then: [ { goto: 'scene_a_end' } ], else: [ { goto: 'scene_b_end' } ] },
  ],
};
