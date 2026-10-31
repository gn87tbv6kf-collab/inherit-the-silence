export class ChoiceView {
  constructor(root) {
    this.root = root.querySelector('#layer-choices');
  }

  show(options, onPick) {
    this.root.innerHTML = '';
    this.root.classList.add('active');
    options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = opt.text || '';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hide();
        onPick(i);
      });
      this.root.appendChild(btn);
    });
  }

  hide() {
    this.root.classList.remove('active');
    this.root.innerHTML = '';
  }
}
