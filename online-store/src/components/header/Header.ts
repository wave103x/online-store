import Cart from '../cart/Cart';
import './header.scss';

class Header {
  private _componentElement: HTMLElement;
  private _cartSum = document.createElement('p');
  private _logoDiv = document.createElement('div');
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

    this._logoDiv.className = 'cart__logo';
    this._logoDiv.dataset.cartCount = this._currentCount.toString();
    this._logoDiv.append(logoCart);
    link.append(this._logoDiv);

    cartDiv.append(this._cartSum, link);

    return cartDiv;
  }

  updateState(sum: number, count: number) {
    this._cartSum.textContent = sum.toString();
    this._logoDiv.dataset.cartCount = count.toString();
  }

}

export default Header;
