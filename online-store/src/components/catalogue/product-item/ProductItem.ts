import './product-item.scss';
import type ProductData from '../../types/ProductData';

class ProductItem {
  private _componentElement = document.createElement('div');
  private _productData: ProductData;
  private _isHidden = false;

  constructor(productData: ProductData, searchParams: URLSearchParams) {
    this._productData = productData;
    this.createElement(this._productData, searchParams);
    document.addEventListener('eventGeneral', (event) => this.updateState(<CustomEvent>event));
  }

  private updateState(event: CustomEvent) {
    const category: string[] = event.detail?.category;
    const baseVehicle: string[] = event.detail?.baseVehicle;

    // const resultCat = category.length ? this._productData.category === category.join('') : true;
    const resultCat = category.length ? category.includes(this._productData.category) : true;
    const resultBase = baseVehicle.length ? baseVehicle.includes(this._productData.baseVehicle) : true;

    if (resultBase && resultCat) {
      this._componentElement.style.display = 'flex';
      this._isHidden = false;
    } else {
      this._componentElement.style.display = 'none';
      this._isHidden = true;
    }
  }

  getComponent(): HTMLElement {
    return this._componentElement;
  }

  private createElement(data: ProductData, searchParams: URLSearchParams) {
    this._productData = data;
    this._componentElement.className = 'product';

    if (searchParams.get('viewGrid') === 'false') {
      this._componentElement.classList.add('product_wide');
      this._componentElement.classList.remove('product_grid');
    } else {
      this._componentElement.classList.remove('product_wide');
      this._componentElement.classList.add('product_grid');
    }

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'product__img-wrapper';
    const img = new Image();
    if (data.thumbnail) img.src = data.thumbnail;
    img.className = 'product__img';
    imgWrapper.append(img);

    const link = document.createElement('a');
    link.className = 'link product__link';
    link.href = `#products/${data.id}`;
    link.append(imgWrapper);

    const title = document.createElement('p');
    title.className = 'product__title';
    title.textContent = data.title;

    const linkTitle = link.cloneNode(false);
    if (linkTitle instanceof HTMLElement) linkTitle.append(title);

    const category = document.createElement('p');
    category.className = 'product__category';
    category.textContent = 'Категория: ' + data.category.toLowerCase();

    const price = document.createElement('p');
    price.className = 'product__price';
    price.textContent = String(data.price) + ' руб.';

    const stock = document.createElement('p');
    stock.className = 'product__stock';
    stock.textContent = 'В наличии: ' + String(data.stock);

    const baseVehicle = document.createElement('p');
    baseVehicle.className = 'product__baseVehicle';
    baseVehicle.textContent = 'Базовая машина: ' + data.baseVehicle;

    const productProps = document.createElement('div');
    productProps.className = 'product_props';
    productProps.append(linkTitle, category, stock, baseVehicle);

    const addToCartBtn = document.createElement('button');
    addToCartBtn.textContent = 'В корзину';
    addToCartBtn.className = 'button product__button';

    const priceWithBtn = document.createElement('div');
    priceWithBtn.className = 'product__price-btn';
    priceWithBtn.append(price, addToCartBtn);

    this._componentElement.dataset.price = String(data.price);
    this._componentElement.dataset.stock = String(data.stock);
    this._componentElement.dataset.category = String(data.category);
    this._componentElement.dataset.baseVehicle = String(data.baseVehicle);
    this._componentElement.append(link, productProps, priceWithBtn);
  }
}

export default ProductItem;
