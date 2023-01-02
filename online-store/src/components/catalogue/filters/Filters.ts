import type ProductData from '../../types/ProductData';
import ParamsToFilter from '../../types/ParamsToFilter';
import baseVehicles from './bases.json';
import FilterNames from '../../types/FilterNames';
import './filters.scss';

class Filters {
  private products: ProductData[];

  constructor(products: ProductData[]) {
    this.products = products;
  }

  createComponent(searchParams: URLSearchParams): HTMLElement {
    const filters = document.createElement('sidebar');
    filters.className = 'filters';

    const categoryFilter = this.createFilter('checkbox', ParamsToFilter.Category, this.products, searchParams);
    const baseVehicleFilter = this.createFilter('checkbox', ParamsToFilter.BaseVehicle, this.products, searchParams);
    const resetBtn = this.createButtons('reset');
    const copyBtn = this.createButtons('copy');

    filters.append(copyBtn, resetBtn, categoryFilter, baseVehicleFilter);
    return filters;
  }

  private createFilter(
    type: 'checkbox' | 'radio' | 'slide',
    key: keyof ProductData,
    data: ProductData[],
    searchParams: URLSearchParams
  ) {
    const filterName = key === 'category' ? 'Категория' : key === 'baseVehicle' ? 'Базовая машина' : null;
    const filter = document.createElement('div');
    filter.className = 'filter';

    const filterTitle = document.createElement('p');
    filterTitle.textContent = filterName;
    filterTitle.className = 'filter__title';

    let items = [...new Set(data.map((e) => e[key] as string))];
    const queryUrlValues = searchParams.getAll(key);

    for (let i = 0; i < items.length; i++) {
      const filterItemLabel = document.createElement('label');
      filterItemLabel.className = 'filter-item__label';
      if (typeof items[i] === 'string') filterItemLabel.textContent = items[i];
      const inputBox = document.createElement('input');
      inputBox.setAttribute('type', type);
      inputBox.setAttribute('name', key);
      inputBox.setAttribute('value', items[i]);

      if (queryUrlValues.length) {
        queryUrlValues.includes(inputBox.value) ? (inputBox.checked = true) : (inputBox.checked = false);
      }

      filterItemLabel.prepend(inputBox);

      inputBox.addEventListener('change', (e) => this.filterHandler(e, key));

      document.addEventListener('eventGeneral', (e) =>
        this.filterConnect(<CustomEvent>e, key, inputBox, filterItemLabel)
      );

      filter.append(filterItemLabel);
    }

    filter.prepend(filterTitle);

    const newEvent = new CustomEvent(key, {
      detail: {
        [key]: queryUrlValues,
      },
    });
    document.dispatchEvent(newEvent);

    return filter;
  }

  private filterConnect(event: CustomEvent, key: keyof ProductData, input: HTMLElement, label: HTMLElement) {
    if (!(input instanceof HTMLInputElement)) return;
    let resultBase = this.products.filter((e) => event.detail.baseVehicle.includes(e.baseVehicle));
    let resultCategory = this.products.filter((e) => event.detail.category.includes(e.category));
    if (!resultBase.length) resultBase = [...this.products];
    if (!resultCategory.length) resultCategory = [...this.products];

    const productsOnPage = resultBase.filter((value) => resultCategory.includes(value));

    const categoriesOnPage = [...new Set(productsOnPage.map((e) => e.category))];
    const basesOnPage = [...new Set(productsOnPage.map((e) => e.baseVehicle))];

    switch (input.name) {
      case 'category':
        if (categoriesOnPage.includes(input.value)) {
          label.classList.remove('filter_stealth');
        } else {
          label.classList.add('filter_stealth');
        }
        break;
      case 'baseVehicle':
        if (basesOnPage.includes(input.value)) {
          label.classList.remove('filter_stealth');
        } else {
          label.classList.add('filter_stealth');
        }
        break;
    }

    if (event.detail?.reset) {
      input.checked = false;
      const newEvent = new CustomEvent(key, {
        detail: {
          [key]: [],
        },
      });
      document.dispatchEvent(newEvent);
    }

    const productsOnPageEvent = new CustomEvent('productsOnPage', { detail: productsOnPage.length });
    document.dispatchEvent(productsOnPageEvent);
  }

  private filterHandler(event: Event, key: keyof ProductData) {
    const elem = event.target;
    if (!(elem instanceof HTMLInputElement)) return;
    const value = elem.value;

    const searchParams = new URLSearchParams(document.location.hash.slice(2));
    const currentParams = searchParams.getAll(key) || [];
    switch (elem.type) {
      case 'radio':
        currentParams.length = 0;
        currentParams.push(value);
        searchParams.set(key, value);
        break;
      case 'checkbox':
        if (elem.checked) currentParams.push(value);
        else currentParams.splice(currentParams.indexOf(value), 1);
        searchParams.delete(key);
        [...new Set(currentParams)].forEach((e) => searchParams.append(key, e));
        break;
      default:
        break;
    }

    window.location.hash = '?' + searchParams.toString();
    const newEvent = new CustomEvent(key, {
      bubbles: true,
      detail: {
        [key]: currentParams,
      },
    });
    elem.dispatchEvent(newEvent);
  }

  private createButtons(type: 'reset' | 'copy'): HTMLElement {
    const button = document.createElement('button');
    const icon = new Image();
    switch (type) {
      case 'reset':
        button.textContent = 'Сбросить фильтры';
        button.className = 'filter__btn filter_reset-btn';
        icon.src = require('../../../assets/icons/icon-refresh.svg') as string;
        button.prepend(icon);
        button.addEventListener('click', () => {
          window.location.hash = '#?';
          document.dispatchEvent(
            new CustomEvent('eventGeneral', {
              detail: {
                category: [],
                baseVehicle: [],
                reset: true,
              },
            })
          );
        });
        break;
      case 'copy':
        button.textContent = 'Копировать фильтрацию';
        button.className = 'filter__btn filter_copy-btn';
        icon.src = require('../../../assets/icons/icon-copy.svg') as string;
        button.prepend(icon);
        button.addEventListener('click', () => {
          navigator.clipboard.writeText(window.location.href);
        });
        break;
    }
    return button;
  }
}

export default Filters;
