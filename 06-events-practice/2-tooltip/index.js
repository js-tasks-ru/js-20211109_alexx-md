class Tooltip {
  element = null;
  offset = 5;
  static instance;

  pointerOver = ({target, clientX, clientY}) => this.over(target, clientX, clientY);
  pointerOut = () => this.remove();
  pointerMove = ({clientX, clientY}) => this.move(clientX, clientY);

  constructor() {
    //singleton
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  over(target, x, y) {
    this.render(target.dataset.tooltip);
    this.move(x, y);
  }

  move(x, y) {
    this.element.style.left = `${x + this.offset}px`;
    this.element.style.top = `${y + this.offset}px`;
  }

  eventListeners(type) {
    const tooltipElement = document.body.querySelector('[data-tooltip]');

    if (type === 'add') {
      tooltipElement.addEventListener('pointerover', this.pointerOver);
      tooltipElement.addEventListener('pointerout', this.pointerOut);
      tooltipElement.addEventListener('pointermove', this.pointerMove);
    } else {
      tooltipElement.removeEventListener('pointerover', this.pointerOver);
      tooltipElement.removeEventListener('pointerout', this.pointerOut);
      tooltipElement.removeEventListener('pointermove', this.pointerMove);
    }
  }

  initialize() {
    this.eventListeners('add');
  }

  render(message = '') {
    const target = document.createElement('div');
    target.innerHTML = `<div class="tooltip">${message}</div>`;
    this.element = target.firstElementChild;
    document.body.append(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.eventListeners();
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
