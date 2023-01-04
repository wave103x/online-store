import Cart from '../cart/Cart';
import './header.scss';

class Header {
  private _componentElement: HTMLElement;
  private _cartSum = document.createElement('p');
  private _currentSum = Cart.productSummary;
  private _currentCount = Cart.productsCount;

  constructor() {
    this._componentElement = document.createElement('header');
  }

  getComponent(): HTMLElement {
    this.createComponent();
    return this._componentElement;
  }

  private createComponent(): void {
    this._componentElement.append(this.createLogo(), this.createCart());
    this._componentElement.className = 'header';
  }

  private createLogo(): HTMLElement {
    const logoDiv = document.createElement('div');
    const link = document.createElement('a');
    link.href = '#';

    const logo = new Image();
    logo.src = require('../../assets/icons/site_logo.svg') as string;
    logo.className = 'logo';
    link.append(logo);
    logoDiv.append(link);
    return logoDiv;
  }

  private createCart(): HTMLElement {
    const cartDiv = document.createElement('div');
    cartDiv.className = 'cart';

    const link = document.createElement('a');
    link.href = `#cart`;

    this._cartSum.className = 'cart__amount';
    this._cartSum.textContent = this._currentSum.toString();

    const logoCart = new Image();
    logoCart.src = require('../../assets/icons/cart_logo.svg') as string;

    const logoDiv = document.createElement('div');
    logoDiv.className = 'cart__logo';
    logoDiv.dataset.cartCount = this._currentCount.toString();
    logoDiv.append(logoCart);
    link.append(logoDiv);

    cartDiv.append(this._cartSum, link);

    return cartDiv;
  }

  updateState(sum: number, count: number) {
    // this._cartSum.textContent = sum.toString(); // починить
    const cartSum = document.querySelector('.cart__amount');
    if (cartSum) cartSum.textContent = sum.toString();

    const cartCount = document.querySelector('.cart__logo');
    if (cartCount instanceof HTMLElement) cartCount.dataset.cartCount = count.toString();
  }

}

export default Header;
