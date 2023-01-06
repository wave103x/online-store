import Header from '../header/Header';
import './cart.scss';
import Form from './form/form';
import ProductData from '../types/ProductData';
import ProductInCart from '../types/ProductInCart';

class Cart {
  private _componentElement!: HTMLElement;
  private html: string = require('./cart.html').default;
  static itemList: ProductInCart[] = [];
  static productsCount: number = 0;
  static productSummary: number = 0;
  static pageItemCount: number = 5;
  private static pageCount: number = 1;
  private static currentPage: number = 1;
  private readonly rubleSymbol = ' &#8381;';
  static _header: Header;

  getHeader(header: Header) {
    Cart._header = header;
  }

  createComponent(): HTMLElement {
    const main = document.querySelector('.main-basket') as HTMLElement;
    if (main) {
      this._componentElement = main;
    } else {
      this._componentElement = document.createElement('div');
      this._componentElement.className = 'main main-basket';
    }
    this._componentElement.innerHTML = this.html;
    (this._componentElement.querySelector('.basket__count-number') as HTMLInputElement).value =
      Cart.pageItemCount.toString();

    const pageNumber = this._componentElement.querySelector('.basket_page-number') as HTMLElement;
    pageNumber.innerText = Cart.currentPage.toString();

    if (Cart.itemList.length === 0) {
      const elem = document.createElement('p');
      elem.innerText = 'Здесь пока что ничего нет.';
      elem.classList.add('nothing');
      this._componentElement.innerHTML = '';
      this._componentElement.append(elem);
    } else {
      this.createItemList();
      this.addListeners();
      this.createSummary();
    }

    if (localStorage.getItem('doModale')) {
      this._componentElement.append(new Form().createComponent());
      localStorage.removeItem('doModale')
    }

    return this._componentElement;
  }

  private addListeners(): void {
    const input = this._componentElement.querySelector('.basket__count-number') as HTMLInputElement;
    input.addEventListener('change', function (): void {
      if (+this.value < 1) {
        this.value = '1';
      }
      Cart.pageItemCount = +this.value;

      const cart = new Cart();
      cart.rebuild();
    });

    const button = this._componentElement.querySelector('.summary__button') as HTMLElement;
    button.addEventListener('click', function () {
      document.querySelector('.main')?.append(new Form().createComponent());
    });



    const leftPageButton = this._componentElement.querySelector('.basket__page-left');
    leftPageButton?.addEventListener('click', () => {
      if (Cart.currentPage - 1 < 1) return;
      Cart.currentPage -= 1;

      const cart = new Cart();
      cart.rebuild();
    });
    const rightPageButton = this._componentElement.querySelector('.basket__page-right');
    rightPageButton?.addEventListener('click', () => {
      if (Cart.currentPage + 1 > Cart.pageCount) return;
      Cart.currentPage += 1;

      const cart = new Cart();
      cart.rebuild();
    });
  }

  private createItemList(): void {
    const basketList = this._componentElement.querySelector('.basket__list');
    Cart.pageCount = Math.ceil(Cart.itemList.length / Cart.pageItemCount);

    const min = Cart.pageItemCount * (Cart.currentPage - 1);
    const max = Cart.currentPage === Cart.pageCount ? Cart.itemList.length : Cart.pageItemCount * Cart.currentPage;
    for (let i = min; i < max; i++) {
      basketList?.append(this.createItem(Cart.itemList[i].product, i + 1, Cart.itemList[i].count));
    }
  }

  private createSummary(): void {
    Cart.productSummary = 0;
    Cart.itemList.forEach((item) => {
      Cart.productSummary += item.count * item.product.price;
    });

    const summary = this._componentElement.querySelector('.summary');

    const total = document.createElement('p');
    total.classList.add('summary__total');
    total.innerHTML = 'Итого: ' + Cart.productSummary + ' ' + this.rubleSymbol;

    summary?.prepend(total);

    const count = document.createElement('p');
    count.classList.add('summary__count');
    count.innerText = 'Количество: ' + Cart.productsCount;

    summary?.prepend(count);
  }

  private createItem(product: ProductData, itemNumber: number, productCount: number): HTMLElement {
    const item = document.createElement('li');
    item.classList.add('cart-item');
    item.dataset.index = product.id.toString();

    const info = document.createElement('div');
    info.classList.add('cart-item__info');
    // info.addEventListener('click', () => )
    const link = document.createElement('a');
    link.href = `#products/${product.id}`;
    link.className = 'cart-item__link';
    link.append(info);

    const itemNumberInList = document.createElement('p');
    itemNumberInList.classList.add('cart-item__number');
    itemNumberInList.innerText = itemNumber.toString();
    info.append(itemNumberInList);

    const img = new Image();
    if (product.thumbnail) {
      img.src = product.thumbnail;
    } else {
      img.src = '#';
    }
    img.alt = 'photo';
    img.className = 'cart-item__img';
    info.append(img);

    const name = document.createElement('p');
    name.classList.add('cart-item__name');
    name.innerText = product.title;
    info.append(name);

    item.append(link);

    const aside = document.createElement('div');
    aside.classList.add('cart-item__aside');

    const maxAmount = document.createElement('p');
    maxAmount.classList.add('cart-item__max-amount');
    maxAmount.innerText = 'Осталось: ' + (product.stock - productCount);
    aside.append(maxAmount);

    const controls = document.createElement('div');
    controls.classList.add('cart-item__controls');

    const less = document.createElement('button');
    less.classList.add('cart-item__less');
    less.classList.add('cart__button');
    less.innerText = '-';
    less.dataset.index = product.id.toString();
    less.addEventListener('click', function (): void {
      const id = this.dataset.index as String;
      Cart.deleteItem(+id);

      const cart = new Cart();
      document.body.querySelector('.main')?.remove();
      document.body.append(cart.createComponent());
    });
    controls.append(less);

    const amount = document.createElement('span');
    amount.classList.add('cart-item__amount');
    amount.innerText = productCount.toString();
    controls.append(amount);

    const more = document.createElement('button');
    more.classList.add('cart-item__more');
    more.classList.add('cart__button');
    more.innerText = '+';
    more.dataset.index = product.id.toString();
    more.addEventListener('click', function (): void {
      const id = this.dataset.index as String;
      let product = Cart.itemList.find((value) => value.product.id === +id);
      if (product) {
        Cart.addItem(product.product);
      }

      const cart = new Cart();
      document.body.querySelector('.main')?.remove();
      document.body.append(cart.createComponent());
    });
    controls.append(more);

    aside.append(controls);

    const price = document.createElement('p');
    price.classList.add('cart-item__price');
    price.innerHTML = product.price * productCount + this.rubleSymbol;

    aside.append(price);
    item.append(aside);

    return item;
  }

  static addItem(item: ProductData): void {
    const product = this.itemList.find((value) => value.product.id === item.id);
    let count = 0;
    if (product) {
      count = product.count;
    }
    if (count + 1 <= item.stock) {
      if (count === 0) {
        this.itemList.push({ count: count + 1, product: item });
      } else {
        this.itemList[this.itemList.findIndex((value) => value.product.id === item.id)].count++;
      }
      this.productsCount++;
      this.productSummary = 0;
      this.itemList.forEach((item) => {
        this.productSummary += item.count * item.product.price;
      });
      this.productSummary = 0;
      this.itemList.forEach((item) => {
        this.productSummary += item.count * item.product.price;
      });
    }
    this.saveValues();
    Cart._header.updateState(this.productSummary, this.productsCount);
  }

  static deleteItem(id: Number): void {
    const product = this.itemList.find((value) => value.product.id === id);
    if (!product) return;
    if (product.count > 1) {
      product.count--;
    } else {
      const index = this.itemList.indexOf(product);
      this.itemList.splice(index, 1);
    }
    this.productsCount--;
    this.productSummary = 0;
    this.itemList.forEach((item) => {
      this.productSummary += item.count * item.product.price;
    });
    this.saveValues();
    Cart._header.updateState(this.productSummary, this.productsCount);
  }

  private static saveValues(): void {
    localStorage.setItem('itemList', JSON.stringify(this.itemList));
    localStorage.setItem('productSummary', JSON.stringify(this.productSummary));
    localStorage.setItem('productsCount', JSON.stringify(this.productsCount));
  }

  static setValues(): void {
    const itemList = localStorage.getItem('itemList');
    if (itemList) {
      this.itemList = JSON.parse(localStorage.getItem('itemList') as string);
    }
    const productSummary = localStorage.getItem('productSummary');
    if (productSummary) {
      this.productSummary = JSON.parse(localStorage.getItem('productSummary') as string);
    }
    const productsCount = localStorage.getItem('productsCount');
    if (productsCount) {
      this.productsCount = JSON.parse(localStorage.getItem('productsCount') as string);
    }
  }

  static clearItemList(): void {
    Cart.itemList = [];
  }

  private rebuild(): void {
    // document.body.querySelector('.main')?.remove();
    this.createComponent();
  }
  static isInCart(id: Number): boolean {
    return !!this.itemList.find((value) => value.product.id === id);
  }
}

export default Cart;
