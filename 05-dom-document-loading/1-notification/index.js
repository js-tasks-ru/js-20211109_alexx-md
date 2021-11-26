export default class NotificationMessage {
  element = null;
  timeout = null;

  constructor(message = '', props = {}) {
    const { duration = 2000, type = 'success' } = props;
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  getClassList() {
    const classListObj = {
      'notification': true,
      'success': this.type === 'success',
      'error': this.type === 'error',
    };

    return Object.entries(classListObj)
      .reduce((accum, [key, value]) => (value) ? [...accum, key] : accum, [])
      .join(' ');
  }

  getDuration() {
    return `${this.duration / 1000}s`;
  }

  getTemplate() {
    return `<div class="${this.getClassList()}" style="--value:${this.getDuration()}">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>`;
  }

  render(target = null) {
    if (target) {
      target.innerHTML = this.getTemplate();
      this.element = target;
    } else {
      target = document.createElement('div');
      target.innerHTML = this.getTemplate();
      this.element = target.firstElementChild;
    }
  }

  remove () {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    this.remove();
  }

  show(target) {
    let bodyElement = document.body;

    if (this.timeout) {
      this.remove();
    }
    this.render(target);

    bodyElement.appendChild(this.element);
    this.timeout = setTimeout(() => {
      clearTimeout(this.timeout);
      this.remove();
    }, this.duration);
  }
}
