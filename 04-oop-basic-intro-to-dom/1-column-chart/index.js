export default class ColumnChart {
  element = null;
  chartHeight = 50;

  constructor(obj) {
    const { data, label, link, value, formatHeading = (value) => value } = obj || {};

    this.data = data !== undefined ? data : [];
    this.label = label !== undefined ? label : '';
    this.link = link !== undefined ? link : '';
    this.value = value !== undefined ? value : '';
    this.formatHeading = formatHeading;

    this.render();
  }

  update(obj) {
    new this.constructor(obj);
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map((item) => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale)),
      };
    });
  }

  renderHeaderTemplate() {
    return `<div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>`;
  }

  renderBodyTemplate() {
    const template = [];

    this.getColumnProps(this.data).forEach(({value, percent}) => {
      template.push(`<div style="--value: ${value}" data-tooltip="${percent}"></div>}`);
    });

    return template.join('');
  }

  renderLinkTemplate() {
    if (this.link) {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }

    return '';
  }

  getClassList() {
    const classListObj = {
      'column-chart': true,
      'column-chart_loading': !this.data.length,
    };

    const classList = [];

    Object.entries(classListObj).forEach(([key, value]) => value ? classList.push(key) : null);

    return classList.join(' ');
  }

  getTemplate() {
    return `<div class="${this.getClassList()}" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.renderLinkTemplate()}
      </div>
      <div class="column-chart__container">
        ${this.renderHeaderTemplate()}
        <div data-element="body" class="column-chart__chart">
            ${this.renderBodyTemplate()}
        </div>
      </div>
    </div>`;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }
}
