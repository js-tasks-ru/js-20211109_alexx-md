export default class SortableTable {
  field = '';
  order = '';
  element = null;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data;

    this.render();
  }

  sortData(field, order = 'asc') {
    const copy = [...this.data];
    const collator = new Intl.Collator(['ru', 'en'], { caseFirst: 'upper' });

    if (order === 'asc') {
      return copy.sort((a, b) => collator.compare(a[field], b[field]));
    }

    return copy.sort((a, b) => -collator.compare(a[field], b[field]));
  }

  sort(field = '', order = '') {
    if (field && order) {
      this.field = field;
      this.order = order;
      this.destroy();
      this.data = this.sortData(field, order);
      this.render();
    }
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  isFiltered() {
    return this.field && this.order;
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

  getTableHeaderCell(item) {
    const { id = '', title = '', sortable = false, sortType = '', template = null } = item;

    return `
      <div class="sortable-table__cell" ${this.isFiltered ? `data-id="${id}" data-sortable="${sortable}" data-order="${this.order}"` : ''}>
        <span>${title}</span>
        ${this.getTableHeaderCellArrow()}
      </div>`;
  }

  getTableHeader() {
    return this.headerConfig.map((item) => this.getTableHeaderCell(item)).join('');
  }

  getTableBodyRow(item, ids) {
    let newItem = {};
    ids.forEach((key) => {
      newItem[key] = item[key];
    })

    return `
      <a href="#" class="sortable-table__row">
        ${Object.keys(newItem).map((key) => `<div class="sortable-table__cell">${item[key]}</div>`).join('')}
      </a>`;
  }

  getTableBody() {
    const ids = this.headerConfig.map(({id}) => id);

    return this.data.map((item) => this.getTableBodyRow(item, ids)).join('');
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
            ${this.getTableBody()}
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

    document.body.append(this.element);
    /*
    const root = document.getElementById('root');
    if (root) {
      root.append(this.element);
    }
    */
  }
}

