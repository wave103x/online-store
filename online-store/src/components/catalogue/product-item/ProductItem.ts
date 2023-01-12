import Cart from '../../cart/Cart';
import './product-item.scss';
import type ProductData from '../../types/ProductData';

class ProductItem {
  private _componentElement = document.createElement('div');
  private _productData: ProductData;
  private _isHidden = false;
  private _inCart: boolean;
  private _addToCartBtn = document.createElement('button');

  constructor(productData: ProductData, searchParams: URLSearchParams) {
    this._productData = productData;
    this._inCart = Cart.isInCart(this._productData.id);
    document.addEventListener('eventGeneral', (event) => this.updateState(<CustomEvent>event));
    document.addEventListener('isInCart', (event) => this.updateInCart(<CustomEvent>event));
    this.createElement(this._productData, searchParams);
  }

  private updateInCart(event: CustomEvent) {
    const isInCart: boolean = event.detail?.isInCart;
    const id: number = event.detail?.id;
    if (id !== this._productData.id) return;
    if (isInCart) {
      this._addToCartBtn.classList.add('product__button_added');
      this._addToCartBtn.textContent = 'В корзине';
      this._inCart = true;
    } else {
      this._addToCartBtn.textContent = 'В корзину';
      this._addToCartBtn.classList.remove('product__button_added');
      this._inCart = false;
    }
  }

  private updateState(event: CustomEvent) {
    const category: string[] = event.detail?.category;
    const baseVehicle: string[] = event.detail?.baseVehicle;
    const price: string = event.detail?.price;
    const stock: string = event.detail?.stock;
    const search: string = event.detail.search?.trim().toLowerCase();

    const resultCat = category.length ? category.includes(this._productData.category) : true;
    const resultBase = baseVehicle.length ? baseVehicle.includes(this._productData.baseVehicle) : true;
    const resultPrice = price
      ? this._productData.price >= Number(price.slice(0, price.indexOf('-'))) &&
        this._productData.price <= Number(price.slice(price.indexOf('-') + 1))
      : true;
    const resultStock = stock
      ? this._productData.stock >= Number(stock.slice(0, stock.indexOf('-'))) &&
        this._productData.stock <= Number(stock.slice(stock.indexOf('-') + 1))
      : true;

    const resultSearch =
      this._productData.title.toLowerCase().includes(search) ||
      this._productData.category.toLowerCase().includes(search) ||
      this._productData.baseVehicle.toLowerCase().includes(search) ||
      this._productData.price.toString().includes(search) ||
      this._productData.stock.toString().includes(search);

    if (resultBase && resultCat && resultPrice && resultStock && resultSearch) {
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

    this._addToCartBtn.textContent = this._inCart ? 'В корзине' : 'В корзину';
    this._addToCartBtn.className = 'button product__button';

    this._inCart ? this._addToCartBtn.classList.add('product__button_added') : null;
    this._addToCartBtn.addEventListener('click', () => {
      if (this._inCart) {
        this._addToCartBtn.textContent = 'В корзину';
        Cart.deleteItem(this._productData.id);
        this._addToCartBtn.classList.remove('product__button_added');
        this._inCart = false;
      } else {
        this._addToCartBtn.classList.add('product__button_added');
        Cart.addItem(this._productData);
        this._addToCartBtn.textContent = 'В корзине';
        this._inCart = true;
      }
    });

    const priceWithBtn = document.createElement('div');
    priceWithBtn.className = 'product__price-btn';
    priceWithBtn.append(price, this._addToCartBtn);

    this._componentElement.dataset.price = String(data.price);
    this._componentElement.dataset.stock = String(data.stock);
    this._componentElement.dataset.category = String(data.category);
    this._componentElement.dataset.baseVehicle = String(data.baseVehicle);
    this._componentElement.append(link, productProps, priceWithBtn);
  }
}

export default ProductItem;