export default class SortableTable {
  element = null;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data;

    this.render();
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach(({dataset}) => dataset.order = '');

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getTableBody(sortedData);
  }

  sortData(field, order = 'asc') {
    const copy = [...this.data];
    const collator = new Intl.Collator(['ru', 'en'], { caseFirst: 'upper' });
    const { sortType } = this.headerConfig.find(({id}) => id === field);
    const direction = order === 'asc' ? 1 : -1;

    return copy.sort((a, b) => {
      if (sortType === 'string') {
        return direction * collator.compare(a[field], b[field]);
      }

      return direction * (a[field] - b[field]);
    });
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

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  getTableHeaderCellArrow(sortable) {
    if (sortable) {
      return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`;
    }

    return '';
  }

  getTableHeaderCell({ id = '', title = '', sortable = false, sortType = '', template = null } = {}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        ${this.getTableHeaderCellArrow(sortable)}
      </div>`;
  }

  getTableHeader() {
    return this.headerConfig.map((item) => this.getTableHeaderCell(item)).join('');
  }

  getTableBodyRow(item, cells) {
    return `
      <a href="#" class="sortable-table__row">
        ${cells.map(({id, template}) => {
          return template ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}</div>`;
        }).join('')}
      </a>`;
  }

  getTableBody(data) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return data.map((item) => this.getTableBodyRow(item, cells)).join('');
  }

  getEmptyPlaceholder() {
    if (!this.data.length) {
      return '';
    }

    return `
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>`;
  }

  getTemplate() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getTableHeader()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.getTableBody(this.data)}
          </div>

          <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

          ${this.getEmptyPlaceholder()}
        </div>
      </div>
    `;
  }

  render() {
    const target = document.createElement('div');
    target.innerHTML = this.getTemplate();
    this.element = target.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }
}

