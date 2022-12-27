import Filters from './filters/Filters';
import './catalogue.scss';
import initialProducts from '../../data/data.json';
import type ProductData from '../types/ProductData';
import ProductItem from './product-item/ProductItem';
import FilterGeneral from './filters/FilterGeneral';

class Catalogue {
  private readonly TAG_MAIN = 'main';
  private readonly CLASS_MAIN = 'main';
  private productsGridView: boolean;
  private _componentElement: HTMLElement;
  private productsContainer: HTMLElement;
  private initialProducts: ProductData[];
  private searchParams: URLSearchParams;
  private filterGeneral = new FilterGeneral();

  constructor() {
    this._componentElement = document.createElement(this.TAG_MAIN);
    this.productsContainer = document.createElement('div');
    this.initialProducts = initialProducts;
    this.productsGridView = true;
    this.searchParams = new URLSearchParams(window.location.hash.slice(2));
    window.addEventListener(
      'hashchange',
      () => {
        this.searchParams = new URLSearchParams(window.location.hash.slice(2))
      }
    );
  }

  createComponent(): HTMLElement {
    const productsWithTopBar = document.createElement('div');
    productsWithTopBar.className = 'products-with-topbar';
    this.createProducts(this.initialProducts);
    productsWithTopBar.append(this.createTopBar(), this.productsContainer);

    const productsWithFilters = document.createElement('div');
    productsWithFilters.className = 'products-with-filters';
    productsWithFilters.append(this.createFilters(), productsWithTopBar);

    const headingWithSearch = document.createElement('div');
    headingWithSearch.className = 'heading-search';
    headingWithSearch.append(this.createHeading('Навесное оборудование'), this.createSearch());

    this._componentElement.append(headingWithSearch, productsWithFilters);

    this._componentElement.className = this.CLASS_MAIN;

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

    searchForm.setAttribute('method', 'get');
    searchForm.setAttribute('action', '');
    searchForm.setAttribute('onsubmit', 'return false');
    searchForm.className = 'search';

    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('name', 'search-text');
    searchInput.setAttribute('placeholder', 'Поиск по каталогу');
    searchInput.className = 'search__input';

    searchBtn.className = 'search__btn';
    searchBtn.textContent = 'Найти';

    searchForm.append(searchInput, searchBtn);
    return searchForm;
  }

  private createTopBar(): HTMLElement {
    const topBar = document.createElement('section');
    topBar.className = 'topbar';

    const itemsOnPage = document.createElement('p');

    const sortSelect = this.createSelect(['Рекомендуем', 'Сначала дешевые', 'Сначала дорогие']);

    itemsOnPage.textContent = 'Товаров найдено: ' + this.initialProducts.length;
    itemsOnPage.className = 'topbar__items-on-page';

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

    viewWideRadio.addEventListener('change', () => {
      this.searchParams.set('viewGrid', 'false');
      this.productsGridView = false;
      window.location.hash = '?' + this.searchParams.toString();
      this.productsContainer.classList.remove('products_grid')
      this.productsContainer.classList.add('products_wide')
      for (const item of this.productsContainer.children) {
        // new ProductItem().makeWide(item)
      }

    });
    viewGridRadio.addEventListener('change', () => {
      this.searchParams.set('viewGrid', 'true');
      this.productsGridView = true;
      window.location.hash = '?' + this.searchParams.toString();
      this.productsContainer.classList.add('products_grid')
      this.productsContainer.classList.remove('products_wide')
      for (const item of this.productsContainer.children) {
        // new ProductItem().makeGrid(item)
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
    for (let opt of options) {
      const option = document.createElement('option');
      option.textContent = opt;
      option.setAttribute('value', opt);
      select.append(option);
    }
    return select;
  }

  private selectHandle(event: Event) {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      switch (target.value) {
        case 'Сначала дорогие':
          break;
        case 'Сначала дешевые':
          break;
        case 'Рекомендуем':
          break;
        default:
          return;
      }
    }
  }

  private createProducts(productsData: ProductData[]): void {
    this.productsContainer.className = 'products';

    if (this.productsGridView) {
      this.productsContainer.classList.add('products_grid');
      this.productsContainer.classList.remove('products_wide');
    } else {
      this.productsContainer.classList.remove('products_grid');
      this.productsContainer.classList.add('products_wide');
    }

    for (let i = 0; i < productsData.length; i++) {
      const item = new ProductItem(productsData[i]).getComponent();
      this.productsContainer.append(item);
    }
  }

  private createFilters() {
    const filters = new Filters(this.initialProducts).createComponent();
    return filters;
  }

  updateProductsData() {
    // console.log(this.searchParams.toString())
    // const searchParams = new URLSearchParams(document.location.hash.slice(2));
    // this.currentProducts = this.initialProducts.filter((e) => e.category === searchParams.get('category'));
    // // this.currentProducts = this.currentProducts.filter((e) => e.baseVehicle.some((e) => searchParams.getAll('baseVehicle')?.includes(e)))
    // // console.log(this.currentProducts)
    // this.createProducts(this.currentProducts);
  }
}

export default Catalogue;
