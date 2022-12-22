import Filters from './filters/Filters';
import './catalogue.scss';
import initialProducts from '../../data/products.json';
import type ProductData from '../types/ProductData';
import ProductItem from './product-item/ProductItem';

class Catalogue {
  private readonly TAG_MAIN = 'main';
  private readonly CLASS_MAIN = 'main';
  private _componentElement: HTMLElement;
  private initialProducts: ProductData[];
  private currentProducts!: ProductData[];

  constructor() {
    this._componentElement = document.createElement(this.TAG_MAIN);
    this.initialProducts = initialProducts;
    this.currentProducts = [...this.initialProducts];
  }

  createComponent(): HTMLElement {
    const productsWithTopBar = document.createElement('div');
    productsWithTopBar.className = 'products-with-topbar';
    productsWithTopBar.append(this.createTopBar(), this.createProducts(this.initialProducts));
    
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
    topBar.className = 'top-bar';

    const sortBtn = document.createElement('button');
    const itemsOnPage = document.createElement('p');
    const productsViewSwitch = document.createElement('div');

    sortBtn.textContent = 'Сортировать';
    sortBtn.className = 'topbar__sort-btn';

    itemsOnPage.textContent = 'Товаров найдено:';
    itemsOnPage.className = 'topbar__items-on-page';

    const viewWideLabel = document.createElement('label');
    const viewWideRadio = document.createElement('input');
    const viewGridLabel = document.createElement('label');
    const viewGridRadio = document.createElement('input');
    viewWideRadio.setAttribute('name', 'view-switch');
    viewWideRadio.setAttribute('type', 'radio');
    viewWideRadio.className = 'topbar-switch-input';
    viewGridRadio.setAttribute('name', 'view-switch');
    viewGridRadio.setAttribute('type', 'radio');
    viewGridRadio.setAttribute('checked', 'true');
    viewGridRadio.className = 'topbar-switch-input';
    const svgWide = new Image();
    svgWide.className = 'topbar-switch-view__icon';
    svgWide.src = require('../../assets/icons/view_wide.svg') as string;
    const svgGrid = new Image();
    svgGrid.className = 'topbar-switch-view__icon';
    svgGrid.src = require('../../assets/icons/view_grid.svg') as string;
    viewWideLabel.append(viewWideRadio, svgWide);
    viewGridLabel.append(viewGridRadio, svgGrid);
    productsViewSwitch.append(viewGridLabel, viewWideLabel);

    topBar.append(sortBtn, itemsOnPage, productsViewSwitch);
    return topBar;
  }

  private createProducts(productsData: ProductData[]): HTMLElement {
    const products = document.createElement('div');
    products.className = 'products';
    for (let i = 0; i < productsData.length; i++) {
      const item = new ProductItem().createElement(productsData[i]);
      if (item) products.append(item);
    }
    return products;
  }

  private createFilters() {
    const filters = new Filters(this.currentProducts).createComponent();
    return filters;
  }
}

export default Catalogue;
