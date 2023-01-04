import Cart from '../cart/Cart';
import products from '../../data/data.json';
import type ProductData from '../types/ProductData';
import './product-page.scss';

class ProductPage {
  private readonly TAG_MAIN = 'main';
  private _componentElement: HTMLElement;
  private _id: number;
  private _product: ProductData;
  private _inCart: boolean;

  constructor() {
    this._componentElement = document.createElement(this.TAG_MAIN);
    const url = window.location.hash;
    this._id = Number(url.substring(url.indexOf('/') + 1));
    const product = products.find((e) => e.id === this._id) as ProductData;
    this._product = product;
    document.title = this._product.title;
    this._inCart = Cart.isInCart(this._product.id);
    this.createComponent();
  }

  getComponent() {
    return this._componentElement;
  }

  private createComponent(): void {
    this._componentElement.className = 'main-catalogue';

    const breadcrumbs = this.createBreadcrumbs();

    const photoWithDescription = document.createElement('div');
    photoWithDescription.className = 'photos-description';
    const photos = this.createPhotos();
    const description = this.createDescription();
    photoWithDescription.append(photos, description);

    this._componentElement.append(breadcrumbs, photoWithDescription);
  }

  private createPhotos(): HTMLElement {
    const photos = document.createElement('div');
    photos.className = 'photos';

    const viewer = document.createElement('div');
    viewer.className = 'photos__viewer';
    const viewerImg = new Image();
    viewerImg.className = 'photos-viewer__img';
    viewer.append(viewerImg);

    const thumbs = document.createElement('div');
    thumbs.className = 'photos__thumbs';

    const images = this._product.images;
    if (!images) return document.createElement('div');
    images.forEach((imageSrc, index) => {
      const image = new Image();
      image.src = imageSrc;
      image.className = 'photos__thumb';
      thumbs.append(image);
      if (index === 0) {
        image.classList.add('photos__thumb_hover');
        viewerImg.src = imageSrc;
      }

      image.addEventListener('mouseover', () => {
        viewerImg.src = imageSrc;
        Array.from(thumbs.children).forEach((e) => e.classList.remove('photos__thumb_hover'));
        image.classList.add('photos__thumb_hover');
      });
    });

    photos.append(thumbs, viewer);
    return photos;
  }

  private createDescription(): HTMLElement {
    const description = document.createElement('div');
    description.className = 'description';

    const artikul = document.createElement('p');
    artikul.textContent = 'Арт. ' + this._product.id.toString();
    artikul.className = 'description__artikul';

    const title = document.createElement('h1');
    title.className = 'description__title';
    title.textContent = `${this._product.title} на технику ${this._product.baseVehicle}`;

    const price = document.createElement('p');
    price.textContent = this._product.price.toString() + ' руб.';
    price.className = 'description__price';

    const aviability = document.createElement('p');
    aviability.className = 'description__aviability';
    aviability.textContent = this._product.stock > 0 ? 'Доступно для заказа' : 'Нет в наличии';

    const textDescription = document.createElement('p');
    textDescription.textContent = this._product.description;
    textDescription.className = 'description__text-description';

    const toCartBtn = document.createElement('button');
    toCartBtn.textContent = Cart.isInCart(this._product.id) ? 'В корзине' : 'В корзину';
    toCartBtn.className = 'button description__to-cart';
    this._inCart ? toCartBtn.classList.add('product__button_added') : null;
    toCartBtn.addEventListener('click', () => {
      if (this._inCart) {
        toCartBtn.textContent = 'В корзину';
        this._inCart = false;
        Cart.deleteItem(this._product.id);
        toCartBtn.classList.remove('product__button_added')
      } else {
        this._inCart = true;
        Cart.addItem(this._product);
        toCartBtn.textContent = 'В корзине';
        toCartBtn.classList.add('product__button_added')
      }
    });

    const fastBuyBtn = document.createElement('button');
    fastBuyBtn.className = 'button description__fast-buy';
    fastBuyBtn.textContent = 'Быстрый заказ';

    description.append(artikul, title, price, aviability, toCartBtn, fastBuyBtn, textDescription);
    return description;
  }

  private createBreadcrumbs(): HTMLElement {
    const breadcrumbs = document.createElement('div');
    breadcrumbs.className = 'breadcrumbs';

    breadcrumbs.innerHTML = `<span>Catalogue</span> <span>${this._product.category}</span> <span>${this._product.baseVehicle}</span> <span>${this._product.title}</span>`;

    return breadcrumbs;
  }
}

export default ProductPage;
