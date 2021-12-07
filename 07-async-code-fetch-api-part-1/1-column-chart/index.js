import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element = null;
  chartHeight = 50;
  subElements = {};
  range = {
    from: '',
    to: '',
  };

  constructor({
    data = [],
    label = '',
    link = '',
    value = '',
    formatHeading = (value) => value,
    url = '',
    range = {
      from: '',
      to: '',
    },
  } = {}) {
    this.label = label;
    this.link = link;
    this.value = formatHeading(value);
    this.url = new URL(`${BACKEND_URL}/${url}`);
    this.url.search = new URLSearchParams(this.range);

    if (range.from && range.to) {
      this.range = {
        from: range.from.toISOString(),
        to: range.to.toISOString(),
      };

      this.getData()
        .then((response) => {
          this.data = response;
          this.render();
        });
    } else {
      this.data = data;
      this.render();
    }
  }

  getData() {
    return fetchJson(this.url.href, this.range);
  }

  async update(from = '', to = '') {
    try {
      if (from && to) {
        this.range = {
          from: from.toISOString(),
          to: to.toISOString(),
        };
      }
      this.url.search = new URLSearchParams(this.range);

      this.data = await fetchJson(this.url.href, this.range);
      this.subElements.body.innerHTML = this.renderBodyTemplate(this.data);

      return this.data;
    } catch(e) {
      console.log('update/error', e.message);
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
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
    return `<div data-element="header" class="column-chart__header">${this.value}</div>`;
  }

  renderBodyTemplate() {
    const data = (typeof this.data === 'object') ? Object.values(this.data) : this.data;

    return this.getColumnProps(data).map(({value, percent}) => {
      return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
    }).join('');
  }

  renderLinkTemplate() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
  }

  getClassList() {
    const classListObj = {
      'column-chart': true,
      'column-chart_loading': !this.data.length,
    };

    return Object.entries(classListObj)
      .reduce((accum, [key, value]) => (value) ? [...accum, key] : accum, [])
      .join(' ');
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

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }
}
