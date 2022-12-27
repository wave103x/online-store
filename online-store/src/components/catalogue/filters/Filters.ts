import type ProductData from '../../types/ProductData';
import ParamsToFilter from '../../types/ParamsToFilter';
import baseVehicles from './bases.json';
import './filters.scss';

class Filters {
  private products: ProductData[];
  private _category: Array<string> = [];

  constructor(products: ProductData[]) {
    this.products = products;
  }

  createComponent(): HTMLElement {
    const filters = document.createElement('sidebar');
    filters.className = 'filters';

    const categoryFilter = this.createFilter('radio', ParamsToFilter.Category, this.products);
    const baseVehicleFilter = this.createFilter('checkbox', ParamsToFilter.BaseVehicle, this.products);
    const resetBtn = this.createButtons('reset');
    const copyBtn = this.createButtons('copy');

    filters.append(resetBtn, copyBtn, categoryFilter, baseVehicleFilter);
    return filters;
  }

  private createFilter(type: 'checkbox' | 'radio' | 'slide', key: keyof ProductData, data: ProductData[]) {
    const filter = document.createElement('div');
    filter.className = 'filter';

    const filterTitle = document.createElement('p');
    filterTitle.textContent = key;
    filterTitle.className = 'filter__title';

    let items = [...new Set(data.map((e) => e[key] as string))];

    for (let i = 0; i < items.length; i++) {
      const filterItemLabel = document.createElement('label');
      filterItemLabel.className = 'filter-item__label';
      if (typeof items[i] === 'string') filterItemLabel.textContent = items[i];
      const inputBox = document.createElement('input');
      inputBox.setAttribute('type', type);
      inputBox.setAttribute('name', key);
      inputBox.setAttribute('value', items[i]);
      filterItemLabel.prepend(inputBox);

      inputBox.addEventListener('change', (e) => this.filterHandler(e, key));
      document.addEventListener('eventGeneral', (e) => this.filterConnect(<CustomEvent>e, key, inputBox, filterItemLabel));

      filter.append(filterItemLabel);
    }

    filter.prepend(filterTitle);
    return filter;
  }

  private filterConnect(event: CustomEvent, key: keyof ProductData, input: HTMLElement, label: HTMLElement) {
    if (!(input instanceof HTMLInputElement)) return;
    const resultBase = this.products.filter((e) => event.detail.baseVehicle.includes(e.baseVehicle));
    const resultCategory = this.products.filter((e) => event.detail.category.includes(e.category));

    const visibleProducts = resultBase.filter(value => resultCategory.includes(value));

    // if (event.detail.baseVehicle.includes(visibleProducts.))
    // if (visibleProducts.includes((e) => event.detail(e.baseVehicle)))

    // if (event.detail.baseVehicle.includes(input.value)) label.hidden = false;
    // else label.hidden = true;
  }

  private filterHandler(event: Event, key: keyof ProductData) {
    const elem = event.target;
    if (!(elem instanceof HTMLInputElement)) return;
    const value = elem.value;

    const searchParams = new URLSearchParams(document.location.hash.slice(2));
    const current = searchParams.getAll(key) || [];

    switch (elem.type) {
      case 'radio':
        current.length = 0;
        current.push(value);
        searchParams.set(key, value);
        break;
      case 'checkbox':
        if (elem.checked) current.push(value);
        else current.splice(current.indexOf(value), 1);
        searchParams.delete(key);
        current.forEach((e) => searchParams.append(key, e));
        break;
      default:
        break;
    }

    window.location.hash = '?' + searchParams.toString();

    const newEvent = new CustomEvent(key, {
      bubbles: true,
      detail: {
        [key]: current,
      },
    });
    elem.dispatchEvent(newEvent);
  }

  private createButtons(type: 'reset' | 'copy'): HTMLElement {
    const button = document.createElement('button');
    switch (type) {
      case 'reset':
        button.textContent = 'Сбросить фильтры';
        button.className = 'filter_reset-btn';
        button.addEventListener('click', () => {
          window.location.hash = '?';
        });
        break;
      case 'copy':
        button.textContent = 'Копировать фильтрацию';
        button.className = 'filter_copy-btn';
        button.addEventListener('click', () => {
          navigator.clipboard.writeText(window.location.href);
        });
        break;
    }
    return button;
  }

  private inputBoxHandler(event: Event, key: keyof ProductData) {
    const elem = event.target;
    if (!(elem instanceof HTMLInputElement)) return;
    const value = elem.value;

    const searchParams = new URLSearchParams(window.location.hash.slice(2));

    if (elem.type === 'radio') searchParams.set(key, value);
    else {
      if (searchParams.has(key)) {
        let curValues = Array.from(searchParams.getAll(key));
        if (curValues.includes(value)) {
          curValues = curValues.filter((e) => e !== value);
        } else {
          curValues = curValues.concat(value);
        }
        if (!curValues.length) searchParams.delete(key);
        else {
          searchParams.delete(key);
          for (let value of curValues) {
            searchParams.append(key, value);
          }
        }
      } else searchParams.set(key, value);
    }
    window.location.hash = '#?' + searchParams.toString();
    // history.pushState(null, '', newPath);
    // window.location.assign(newPath)
  }
}

export default Filters;
