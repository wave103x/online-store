import type ProductData from '../../types/ProductData';
import ParamsToFilter from '../../types/ParamsToFilter';
import initProducts from '../../../data/products.json';
import './filters.scss';

class Filters {
  private products: ProductData[];

  constructor(products: ProductData[]) {
    this.products = products;
  }

  createComponent(): HTMLElement {
    const filters = document.createElement('sidebar');
    filters.className = 'filters';

    const categoryFilter = this.createFilter('radio', ParamsToFilter.Category, this.products);

    filters.append(categoryFilter);
    return filters;
  }

  private createFilter(type: 'checkbox' | 'radio' | 'slide', key: keyof ProductData, data: ProductData[]) {
    const filter = document.createElement('div');
    filter.className = 'filter';

    const filterTitle = document.createElement('p');
    filterTitle.textContent = key;
    filterTitle.className = 'filter__title'

    let items = [...new Set(data.map((e) => e[key] as string))];
    //TO SOLVE, IMPORTANT

    for (let i = 0; i < items.length; i++) {
      const filterItemLabel = document.createElement('label');
      filterItemLabel.className = 'filter-item__label'
      if (typeof items[i] === 'string') filterItemLabel.textContent = items[i];
      const inputBox = document.createElement('input');
      inputBox.setAttribute('type', type);
      inputBox.setAttribute('name', key);
      inputBox.setAttribute('value', items[i]);
      filterItemLabel.prepend(inputBox);
      inputBox.addEventListener('change', (e) => this.inputBoxHandler(e, key))

      filter.append(filterItemLabel);
    }

    filter.prepend(filterTitle);
    return filter;
  }

  private inputBoxHandler(event: Event, key: keyof ProductData) {
    const elem = event.target;
    if (!(elem instanceof HTMLInputElement)) return;
    const value = elem.value;
    this.products = this.products.filter(e => e[key] === value)
    console.log(this.products)
  }
}

export default Filters;
