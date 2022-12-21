import Header from '../header/Header';
import './product-page.scss';

class Catalogue {
  private readonly TAG_MAIN = 'main';
  private readonly TAG_A = 'a';
  private readonly CLASS_COMPONENT = 'product';
  private readonly LINK_TEXT = 'to catalog';
  private readonly LINK_HREF = '#';
  private _componentElement: HTMLElement;

  constructor() {
    this._componentElement = document.createElement(this.TAG_MAIN);
  }

  createComponent(): HTMLElement {
    const link = document.createElement(this.TAG_A);
    link.textContent = this.LINK_TEXT;
    link.href = this.LINK_HREF;
    this._componentElement.className = this.CLASS_COMPONENT;

    this._componentElement.append(link);

    return this._componentElement;
  }
}

export default Catalogue;