import products from '../../data/data.json';
import type ProductData from '../types/ProductData';
import './product-page.scss';

class ProductPage {
  private readonly TAG_MAIN = 'main';
  private _componentElement: HTMLElement;
  private _id: number;
  private _product: ProductData;

  constructor() {
    this._componentElement = document.createElement(this.TAG_MAIN);
    const url = window.location.hash;
    this._id = Number(url.substring(url.indexOf('/') + 1));
    const product = products.find((e) => e.id === this._id) as ProductData;
    this._product = product;
    console.log(this._product);
    this.createComponent();
  }

  getComponent() {
    return this._componentElement;
  }

  private createComponent(): void {
    this._componentElement.className = 'main';

    const breadcrumbs = this.createBreadcrumbs();

    const photoWithDescription = document.createElement('div');
    photoWithDescription.className = 'photo-desc';
    const slider = this.createSlider();
    const description = this.createDescription();
    photoWithDescription.append(slider, description);

    this._componentElement.append(breadcrumbs, photoWithDescription);
  }

  private createSlider(): HTMLElement {
    const slider = document.createElement('div');
    slider.className = 'slider';
    return slider;
  }

  private createDescription(): HTMLElement {
    const description = document.createElement('div');
    description.className = 'description';

    const title = document.createElement('h1');
    title.className = 'product__h1';
    title.textContent = this._product.title;

    description.append(title);
    return description;
  }

  private createBreadcrumbs(): HTMLElement {
    const breadcrumbs = document.createElement('div');
    const location = window.location.hash.slice(1);
    breadcrumbs.textContent = location;

    return breadcrumbs;
  }
}

export default ProductPage;
