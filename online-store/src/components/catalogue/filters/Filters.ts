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
    const priceFIlter = this.createRange(ParamsToFilter.Price, this.products, searchParams);
    const priceStock = this.createRange(ParamsToFilter.Stock, this.products, searchParams);
    const resetBtn = this.createButtons('reset');
    const copyBtn = this.createButtons('copy');

    filters.append(copyBtn, resetBtn, categoryFilter, baseVehicleFilter, priceFIlter, priceStock);
    return filters;
  }

  private createRange(key: keyof ProductData, data: ProductData[], searchParams: URLSearchParams) {
    const filterName = key === 'price' ? 'Цена' : key === 'stock' ? 'На складе' : null;
    const filter = document.createElement('div');
    filter.className = 'filter filter_range';

    const filterTitle = document.createElement('p');
    filterTitle.textContent = filterName;
    filterTitle.className = 'filter__title';

    const values = data.map((e) => e[key]) as number[];
    values.sort((a, b) => a - b);
    const min = values[0];
    const max = values[values.length - 1];
    const step = Math.ceil((max - min) / 50);

    const inputL = document.createElement('input');
    inputL.className = 'filter__range';
    inputL.setAttribute('type', 'range');
    inputL.setAttribute('min', min.toString());
    inputL.setAttribute('max', max.toString());
    inputL.setAttribute('name', 'rangeL');
    // inputL.setAttribute('value', min.toString());
    inputL.setAttribute('value', inputL.dataset.value || min.toString());
    // inputL.setAttribute('step', step.toString());

    const inputR = document.createElement('input');
    inputR.className = 'filter__range';
    inputR.setAttribute('type', 'range');
    inputR.setAttribute('min', min.toString());
    inputR.setAttribute('max', max.toString());
    inputR.setAttribute('name', 'rangeR');
    // inputR.setAttribute('value', max.toString());
    inputR.setAttribute('value', inputR.dataset.value || max.toString());
    // inputR.setAttribute('step', step.toString());

    const labelL = document.createElement('label');
    labelL.textContent = inputL.getAttribute('min');
    inputL.addEventListener('input', (e) => this.rangeHandler(e, inputL, labelL, key, false, min, max));
    document.addEventListener('eventGeneral', (e) => this.filterConnect(<CustomEvent>e, key, inputL, labelL));

    const labelR = document.createElement('label');
    labelR.textContent = inputR.getAttribute('max');
    inputR.addEventListener('input', (e) => this.rangeHandler(e, inputR, labelR, key, true, min, max));
    document.addEventListener('eventGeneral', (e) => this.filterConnect(<CustomEvent>e, key, inputR, labelR));

    const labelsContainer = document.createElement('div');
    labelsContainer.className = 'filter__labels';
    labelsContainer.append(labelL, labelR);

    const rangeContainer = document.createElement('div');
    rangeContainer.className = 'filter_ranges';
    rangeContainer.append(inputL, inputR);

    filter.append(filterTitle, labelsContainer, rangeContainer);
    return filter;
  }

  private rangeHandler(
    event: Event,
    input: HTMLInputElement,
    label: HTMLLabelElement,
    key: keyof ProductData,
    right: boolean,
    min: number,
    max: number
  ) {
    label.textContent = input.value;

    const searchParams = new URLSearchParams(document.location.hash.slice(2));
    const currentPrice = searchParams.get(key);

    let currentLeft = currentPrice?.toString().slice(0, currentPrice?.toString().indexOf('-')) || min.toString();
    let currentRight = currentPrice?.toString().slice(currentPrice?.toString().indexOf('-') + 1) || max.toString();

    right ? (currentRight = input.value) : (currentLeft = input.value);

    const value = `${currentLeft}-${currentRight}`;
    searchParams.set(key, value);

    window.location.hash = '?' + searchParams.toString();

    const newEvent = new CustomEvent(key, {
      detail: {
        [key]: value,
      },
    });
    document.dispatchEvent(newEvent);
  }

  private createFilter(
    type: 'checkbox' | 'radio',
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

    const price = event.detail.price;
    let resultPrice = [...this.products];
    if (price) {
      const minPrice = price.slice(0, price.indexOf('-'));
      const maxPrice = price.slice(price.indexOf('-') + 1);
      resultPrice = this.products.filter((e) => e.price >= minPrice && e.price <= maxPrice);
    }

    const stock = event.detail.stock;
    let resultStock = [...this.products];
    if (stock) {
      const minStock = stock.slice(0, stock.indexOf('-'));
      const maxStock = stock.slice(stock.indexOf('-') + 1);
      resultStock = this.products.filter((e) => e.stock >= minStock && e.stock <= maxStock);
    }

    const search = event.detail?.search?.trim().toLowerCase();
    let resultSearch = [...this.products];
    if (search) {
      resultSearch = this.products.filter(
        (e) =>
          e.title.toLowerCase().includes(search) ||
          e.category.toLowerCase().includes(search) ||
          e.baseVehicle.toLowerCase().includes(search) ||
          e.price.toString().includes(search) ||
          e.stock.toString().includes(search)
      );
    }

    let productsOnPage = resultBase.filter((value) => resultCategory.includes(value));
    productsOnPage = productsOnPage.filter((value) => resultPrice.includes(value));
    productsOnPage = productsOnPage.filter((value) => resultStock.includes(value));
    productsOnPage = productsOnPage.filter((value) => resultSearch.includes(value));

    const allOfFilter = this.products.filter((e) => e[key] === label.textContent).length.toString();
    const currentOfFilter = productsOnPage.filter((e) => e[key] === label.textContent).length.toString();

    label.dataset.qty = `${currentOfFilter}/${allOfFilter}`;

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
      case 'rangeL':
        if (key === 'price') {
          if (!productsOnPage.length) break;
          const value = [...productsOnPage].sort((a, b) => a.price - b.price)[0].price.toString();
          input.value = value;
          label.textContent = value;
        }
        if (key === 'stock') {
          if (!productsOnPage.length) break;
          const value = [...productsOnPage].sort((a, b) => a.stock - b.stock)[0].stock.toString();
          input.value = value;
          label.textContent = value;
        }
        break;
      case 'rangeR':
        if (key === 'price') {
          if (!productsOnPage.length) break;
          const value = [...productsOnPage].sort((a, b) => b.price - a.price)[0].price.toString();
          input.value = value;
          label.textContent = value;
        }
        if (key === 'stock') {
          if (!productsOnPage.length) break;
          const value = [...productsOnPage].sort((a, b) => b.stock - a.stock)[0].stock.toString();
          input.value = value;
          label.textContent = value;
        }
        break;
    }

    if (event.detail?.reset) {
      input.checked = false;
      const newEvent = new CustomEvent(key, {
        detail: {
          category: [],
          baseVehicle: [],
          price: '',
          stock: '',
          search: '',
          reset: true,
        },
      });
      document.dispatchEvent(newEvent);
      const newEvent2 = new CustomEvent('search', {
        detail: {
          search: '',
          reset: true,
        },
      });
      document.dispatchEvent(newEvent2);
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
      detail: {
        [key]: currentParams,
      },
    });
    document.dispatchEvent(newEvent);
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
                price: '',
                stock: '',
                search: '',
                reset: true,
              },
            })
          );
        });
        break;
      case 'copy':
        const text = document.createElement('span');
        text.textContent = 'Копировать фильтрацию';
        button.className = 'filter__btn filter_copy-btn';
        icon.src = require('../../../assets/icons/icon-copy.svg') as string;
        button.prepend(icon, text);
        button.addEventListener('click', () => {
          navigator.clipboard.writeText(window.location.href);
          text.textContent = 'Успешно';
          setTimeout(() => {
            text.textContent = 'Копировать фильтрацию';
          }, 1000);
        });
        break;
    }
    return button;
  }
}

export default Filters;
