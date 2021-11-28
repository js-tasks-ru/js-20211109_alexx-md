export default class NotificationMessage {
  static activeComponent;
  element = null;
  timeout = null;

  constructor(message = '', props = {}) {
    const { duration = 2000, type = 'success' } = props;
    this.message = message;
    this.duration = duration;
    this.durationinSeconds = `${this.duration / 1000}s`;
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

  getTemplate() {
    return `<div class="${this.getClassList()}" style="--value:${this.durationinSeconds}">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  remove () {
    clearTimeout(this.timeout);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    NotificationMessage.activeComponent = null;
  }

  show(target = document.body) {
    if (NotificationMessage.activeComponent) {
      NotificationMessage.activeComponent.remove();
    }

    target.append(this.element);

    this.timeout = setTimeout(() => {
      this.remove();
    }, this.duration);

    NotificationMessage.activeComponent = this;
  }
}
