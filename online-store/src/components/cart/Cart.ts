import './cart.scss';
import ProductData from '../types/ProductData';
import ProductInCart from '../types/ProductInCart';

class Cart {
  private _componentElement!: HTMLElement;
  private html: string = require('./cart.html').default;
  private static itemList: ProductInCart[] = [
    {
      count: 2,
      product: {
        id: 1,
        title: 'Ковш стандартный',
        description:
          'Ковши стандартныйе применяются для разработки котлованов, карьеров в грунтах I-IV категорий и разгрузки сыпучих материалов, плотность до 1600 кг/куб.м',
        price: 120000,
        stock: 4,
        baseVehicle: ['Caterpillar', 'Komatsu'],
        category: 'Ковш экскаваторный',
        thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
        images: [
          'https://i.dummyjson.com/data/products/1/1.jpg',
          'https://i.dummyjson.com/data/products/1/2.jpg',
          'https://i.dummyjson.com/data/products/1/3.jpg',
          'https://i.dummyjson.com/data/products/1/4.jpg',
          'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
        ],
      },
    },
    {
      count: 1,
      product: {
        id: 2,
        title: 'Ковш стандартный',
        description:
          'Ковши стандартныйе применяются для разработки котлованов, карьеров в грунтах I-IV категорий и разгрузки сыпучих материалов, плотность до 1600 кг/куб.м',
        price: 120000,
        stock: 4,
        baseVehicle: ['Caterpillar', 'Komatsu'],
        category: 'Ковш экскаваторный',
        thumbnail: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
        images: [
          'https://i.dummyjson.com/data/products/1/1.jpg',
          'https://i.dummyjson.com/data/products/1/2.jpg',
          'https://i.dummyjson.com/data/products/1/3.jpg',
          'https://i.dummyjson.com/data/products/1/4.jpg',
          'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
        ],
      },
    },
  ];
  static productsCount: number = 3;
  static productSummary: number = 0;
  private pageCount: number = 1;
  static pageItemCount: number = 5;

  private readonly rubleSymbol = ' &#8381;';

  createComponent(): HTMLElement {
    this._componentElement = document.createElement('main');
    this._componentElement.className = 'main';
    this._componentElement.innerHTML = this.html;
    (this._componentElement.querySelector('.basket__count-number') as HTMLInputElement).value =
      Cart.pageItemCount.toString();

    if (Cart.itemList.length === 0) {
      const elem = document.createElement('p');
      elem.innerText = 'Здесь пока что ничего нет.';
      elem.classList.add('nothing');
      this._componentElement.innerHTML = '';
      this._componentElement.append(elem);
    } else {
      this.addListeners();
      this.createItemList();
      this.createSummary();
    }
    return this._componentElement;
  }

  private addListeners(): void {
    const input = this._componentElement.querySelector('.basket__count-number') as HTMLInputElement;
    input.addEventListener('change', function (): void {
      console.log('start');
      if (+this.value > 0) {
        Cart.pageItemCount = +this.value;

        const cart = new Cart();
        document.body.querySelector('.main')?.remove();
        document.body.append(cart.createComponent());
      }
    });
  }

  private createItemList(): void {
    Cart.productSummary = 0;
    const basketList = this._componentElement.querySelector('.basket__list');
    this.pageCount = Math.ceil(Cart.itemList.length / Cart.pageItemCount);
    const itemForShow = Cart.itemList.length < Cart.pageItemCount ? Cart.itemList.length : Cart.pageItemCount;
    for (let i = 0; i < itemForShow; i++) {
      basketList?.append(this.createItem(Cart.itemList[i].product, i + 1, Cart.itemList[i].count));
    }
  }

  private createSummary(): void {
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

    const itemNumberInList = document.createElement('p');
    itemNumberInList.classList.add('cart-item__number');
    itemNumberInList.innerText = itemNumber.toString();
    info.append(itemNumberInList);

    const img = new Image();
    img.src = product.thumbnail;
    img.alt = 'photo';
    img.className = 'cart-item__img';
    info.append(img);

    const name = document.createElement('p');
    name.classList.add('cart-item__name');
    name.innerText = product.title;
    info.append(name);

    item.append(info);

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
    Cart.productSummary += product.price * productCount;

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
    }
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
  }
}

export default Cart;
