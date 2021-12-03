export default class SortableTable {
  isSortLocally = true;
  element = null;
  subElements = {};
  sorted = null;
  sortableCells;

  clickHandler = (e) => {
    /*
    if (this.sorted.id !== e.currentTarget.dataset.id) {
      this.sorted.order = 'asc';
    } else {
      this.sorted.order = this.sorted.order === 'asc' ? 'desc' : 'asc';
    }
    */
    this.sorted.order = this.sorted.order === 'asc' ? 'desc' : 'asc';
    this.sorted.id = e.currentTarget.dataset.id;
    this.sort(this.sorted.id, this.sorted.order);
  }

  constructor(headerConfig = [], { data = [], sorted = {},  } = {}) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data;
    this.sorted = sorted;
    this.render();
  }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    this.sortableCells.forEach(({dataset}) => dataset.order = '');

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

      return direction * (Number(a[field]) - Number(b[field]));
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

  async destroy() {
    this.sortableCells.forEach((item) => {
      item.removeEventListener('pointerdown', this.clickHandler);
    });
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

  getTableHeaderCell({ id = '', title = '', sortable = false } = {}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}"}>
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

  async render() {
    const target = document.createElement('div');
    target.innerHTML = this.getTemplate();
    this.element = target.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.sortableCells = this.element.querySelectorAll('.sortable-table__cell[data-sortable="true"]');
    const defaultSortedColumn = this.element.querySelector(`.sortable-table__cell[data-id="${this.sorted.id}"]`);
    defaultSortedColumn.setAttribute('data-order', this.sorted.order);
    this.sort(this.sorted.id, this.sorted.order);

    this.sortableCells.forEach((item) => {
      item.addEventListener('pointerdown', this.clickHandler);
    });
  }
}
