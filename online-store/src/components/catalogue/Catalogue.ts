import Filters from './filters/Filters';
import initialProducts from '../../data/data.json';
import type ProductData from '../types/ProductData';
import ProductItem from './product-item/ProductItem';
import FilterGeneral from './filters/FilterGeneral';
import './catalogue.scss';

class Catalogue {
  private readonly TAG_MAIN = 'main';
  private readonly CLASS_MAIN = 'main-catalogue';
  private _componentElement: HTMLElement;
  private productsContainer: HTMLElement;
  private initialProducts: ProductData[];
  private searchParams: URLSearchParams;
  private filterGeneral = new FilterGeneral();

  constructor() {
    this._componentElement = document.createElement(this.TAG_MAIN);
    this.productsContainer = document.createElement('div');
    this.initialProducts = initialProducts;
    this.searchParams = new URLSearchParams(window.location.hash.slice(2));
    window.addEventListener('hashchange', () => {
      this.searchParams = new URLSearchParams(window.location.hash.slice(2));
    });
  }

  createComponent(): HTMLElement {
    const productsWithTopBar = document.createElement('div');
    productsWithTopBar.className = 'products-with-topbar';
    this.createProducts([...this.initialProducts]);
    const messageNoProducts = document.createElement('p');
    messageNoProducts.className = 'message-no-products';
    messageNoProducts.textContent = 'Здесь ничего нет';
    messageNoProducts.hidden = true;
    productsWithTopBar.append(this.createTopBar(messageNoProducts), this.productsContainer, messageNoProducts);

    const productsWithFilters = document.createElement('div');
    productsWithFilters.className = 'products-with-filters';
    productsWithFilters.append(this.createFilters(), productsWithTopBar);

    const headingWithSearch = document.createElement('div');
    headingWithSearch.className = 'heading-search';
    headingWithSearch.append(this.createHeading('Навесное оборудование для спецтехники'), this.createSearch());

    this._componentElement.append(headingWithSearch, productsWithFilters);

    this._componentElement.className = this.CLASS_MAIN;

    this.searchParams.toString();
    document.dispatchEvent(
      new CustomEvent('eventGeneral', {
        detail: {
          category: this.searchParams.getAll('category') || [],
          baseVehicle: this.searchParams.getAll('baseVehicle') || [],
          price: this.searchParams.get('price') || '',
          stock: this.searchParams.get('stock') || '',
          search: this.searchParams.get('search') || '',
        },
      })
    );

    return this._componentElement;
  }

  private createHeading(headingText: string): HTMLElement {
    const heading = document.createElement('h1');
    heading.className = 'catalogue__h1';
    heading.textContent = headingText;
    return heading;
  }

  private createSearch(): HTMLElement {
    const searchForm = document.createElement('form');
    const searchInput = document.createElement('input');
    const searchBtn = document.createElement('button');
    searchBtn.style.opacity = '0.5';

    searchForm.setAttribute('method', 'get');
    searchForm.setAttribute('action', '');
    searchForm.setAttribute('onsubmit', 'return false');
    searchForm.className = 'search';

    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('name', 'search-text');
    searchInput.setAttribute('placeholder', 'Поиск по каталогу');
    searchInput.className = 'search__input';
    const searchParams = new URLSearchParams(document.location.hash.slice(2));
    const currentParams = searchParams.get('search');
    if (currentParams) searchInput.value = currentParams.toString();

    searchInput.addEventListener('input', () => {
      if (searchInput.value) searchBtn.style.opacity = '1';
      else searchBtn.style.opacity = '0.5';

      const searchParams = new URLSearchParams(document.location.hash.slice(2));
      searchParams.set('search', searchInput.value);
      window.location.hash = '?' + searchParams.toString();

      const newEvent = new CustomEvent('search', {
        bubbles: true,
        detail: {
          search: searchInput.value,
        },
      });
      searchInput.dispatchEvent(newEvent);
    });

    document.addEventListener('eventGeneral', (e) => this.searchReset(<CustomEvent>e, searchInput));

    searchBtn.className = 'button search__btn';
    searchBtn.textContent = '✖';
    searchBtn.addEventListener('click', () => {
      searchBtn.style.opacity = '0.5';
      searchInput.value = '';
      const searchParams = new URLSearchParams(document.location.hash.slice(2));
      searchParams.delete('search');
      window.location.hash = '?' + searchParams.toString();

      const newEvent = new CustomEvent('search', {
        bubbles: true,
        detail: {
          search: searchInput.value,
        },
      });
      searchInput.dispatchEvent(newEvent);
    });

    searchForm.append(searchInput, searchBtn);
    return searchForm;
  }

  private searchReset(e: CustomEvent, searchInput: HTMLInputElement) {
    if (e.detail.reset) searchInput.value = '';
  }

  private createTopBar(messageNoProducts: HTMLElement): HTMLElement {
    const topBar = document.createElement('section');
    topBar.className = 'topbar';

    const itemsOnPage = document.createElement('div');

    const sortSelect = this.createSelect([
      'Сначала дешевые',
      'Сначала дорогие',
      'Больше на складе',
      'Меньше на складе',
    ]);

    itemsOnPage.className = 'topbar__items-on-page';
    document.addEventListener('productsOnPage', (e) => {
      if (e instanceof CustomEvent) {
        itemsOnPage.innerHTML = '<span class="topbar-itemsOnPage__span">Товаров найдено:</span> ' + e.detail;
        !e.detail ? (messageNoProducts.hidden = false) : (messageNoProducts.hidden = true);
      }
    });

    const productsViewSwitch = document.createElement('div');
    productsViewSwitch.className = 'topbar__switch';
    const viewWideLabel = document.createElement('label');
    const viewWideRadio = document.createElement('input');
    const viewGridLabel = document.createElement('label');
    const viewGridRadio = document.createElement('input');
    viewGridLabel.className = 'topbar-switch-label';
    viewWideLabel.className = 'topbar-switch-label';
    viewWideRadio.setAttribute('name', 'view-switch');
    viewWideRadio.setAttribute('type', 'radio');
    viewWideRadio.className = 'topbar-switch-input';
    if (this.searchParams.get('viewGrid') === 'false') {
      viewWideRadio.checked = true;
    } else viewGridRadio.checked = true;

    viewWideRadio.addEventListener('change', () => {
      this.searchParams.set('viewGrid', 'false');
      window.location.hash = '?' + this.searchParams.toString();
      this.productsContainer.classList.remove('products_grid');
      this.productsContainer.classList.add('products_wide');
      for (const item of this.productsContainer.children) {
        item.classList.add('product_wide');
        item.classList.remove('product_grid');
      }
    });
    viewGridRadio.addEventListener('change', () => {
      this.searchParams.set('viewGrid', 'true');
      window.location.hash = '?' + this.searchParams.toString();
      this.productsContainer.classList.add('products_grid');
      this.productsContainer.classList.remove('products_wide');
      for (const item of this.productsContainer.children) {
        item.classList.remove('product_wide');
        item.classList.add('product_grid');
      }
    });

    viewGridRadio.setAttribute('name', 'view-switch');
    viewGridRadio.setAttribute('type', 'radio');
    viewGridRadio.setAttribute('checked', 'true');
    viewGridRadio.className = 'topbar-switch-input';
    const svgWide = new Image();
    svgWide.className = 'topbar-switch-view__icon';
    svgWide.src = require('../../assets/icons/wide-icon.svg') as string;
    const svgGrid = new Image();
    svgGrid.className = 'topbar-switch-view__icon';
    svgGrid.src = require('../../assets/icons/grid-icon.svg') as string;
    viewWideLabel.append(viewWideRadio, svgWide);
    viewGridLabel.append(viewGridRadio, svgGrid);
    productsViewSwitch.append(viewGridLabel, viewWideLabel);

    topBar.append(sortSelect, itemsOnPage, productsViewSwitch);
    return topBar;
  }

  private createSelect(options: Array<string>) {
    const select = document.createElement('select');
    select.className = 'topbar__select';

    const firstOption = document.createElement('option');
    firstOption.textContent = 'Сортировать';
    firstOption.setAttribute('value', '');
    firstOption.setAttribute('disabled', 'true');
    firstOption.setAttribute('selected', 'true');
    select.append(firstOption);

    select.addEventListener('change', (event: Event) => this.selectHandle(event));

    const sortTypes = {
      priceDesc: 'Сначала дорогие',
      priceAsc: 'Сначала дешевые',
      stockDesc: 'Больше на складе',
      stockAsc: 'Меньше на складе',
    };

    for (let opt of options) {
      const option = document.createElement('option');
      option.textContent = opt;
      option.setAttribute('value', opt);
      select.append(option);
      const urlOpt = this.searchParams.get('sort');
      switch (urlOpt) {
        case 'priceDesc':
          if (option.textContent === 'Сначала дорогие') option.setAttribute('selected', 'true');
          break;
        case 'priceAsc':
          if (option.textContent === 'Сначала дешевые') option.setAttribute('selected', 'true');
          break;
        case 'stockDesc':
          if (option.textContent === 'Больше на складе') option.setAttribute('selected', 'true');
          break;
        case 'stockAsc':
          if (option.textContent === 'Меньше на складе') option.setAttribute('selected', 'true');
          break;
      }
    }
    return select;
  }

  private selectHandle(event: Event) {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      const products = Array.from(this.productsContainer.children) as HTMLElement[];
      switch (target.value) {
        case 'Сначала дорогие':
          products
            .sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price))
            .forEach((node) => this.productsContainer.append(node));
          this.searchParams.set('sort', 'priceDesc');
          window.location.hash = '?' + this.searchParams.toString();
          break;
        case 'Сначала дешевые':
          products
            .sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price))
            .forEach((node) => this.productsContainer.append(node));
          this.searchParams.set('sort', 'priceAsc');
          window.location.hash = '?' + this.searchParams.toString();
          break;
        case 'Больше на складе':
          products
            .sort((a, b) => Number(b.dataset.stock) - Number(a.dataset.stock))
            .forEach((node) => this.productsContainer.append(node));
          this.searchParams.set('sort', 'stockDesc');
          window.location.hash = '?' + this.searchParams.toString();
          break;
        case 'Меньше на складе':
          products
            .sort((a, b) => Number(a.dataset.stock) - Number(b.dataset.stock))
            .forEach((node) => this.productsContainer.append(node));
          this.searchParams.set('sort', 'stockAsc');
          window.location.hash = '?' + this.searchParams.toString();
          break;
        default:
          return;
      }
    }
  }

  private createProducts(productsData: ProductData[]): void {
    this.productsContainer.className = 'products';
    if (this.searchParams.get('viewGrid') === 'false') {
      this.productsContainer.classList.remove('products_grid');
      this.productsContainer.classList.add('products_wide');
    } else {
      this.productsContainer.classList.add('products_grid');
      this.productsContainer.classList.remove('products_wide');
    }

    switch (this.searchParams.get('sort')) {
      case 'priceDesc':
        productsData.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'priceAsc':
        productsData.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'stockDesc':
        productsData.sort((a, b) => Number(b.stock) - Number(a.stock));
        break;
      case 'stockAsc':
        productsData.sort((a, b) => Number(a.stock) - Number(b.stock));
        break;
      default:
        break;
    }

    for (let i = 0; i < productsData.length; i++) {
      const item = new ProductItem(productsData[i], this.searchParams).getComponent();
      this.productsContainer.append(item);
    }
  }

  private createFilters() {
    const filters = new Filters(this.initialProducts).createComponent(this.searchParams);
    return filters;
  }
}

export default Catalogue;
