import './header.scss';

class Header {
  private _componentElement: HTMLElement;

  constructor() {
    this._componentElement = document.createElement('header');
  }

  createComponent(): HTMLElement {
    this._componentElement.append(this.createLogo(), this.createCart());
    this._componentElement.className = 'header';
    return this._componentElement;
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

    const logoDiv = document.createElement('div');
    logoDiv.dataset.cartCount = '14';
    logoDiv.className = 'cart__logo';

    const cartAmount = document.createElement('p');
    cartAmount.className = 'cart__amount';
    cartAmount.textContent = '254 000';

    const logoCart = new Image();
    logoDiv.append(logoCart);

    logoCart.src = require('../../assets/icons/cart_logo.svg') as string;
    cartDiv.append(cartAmount, logoDiv);
    return cartDiv;
  }
}

export default Header;
