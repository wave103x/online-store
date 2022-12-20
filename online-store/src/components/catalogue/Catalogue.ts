import './catalogue.scss';

class Catalogue {
  private readonly TAG_MAIN = 'main';
  private readonly TAG_A = 'a';
  private readonly CLASS_MAIN = 'main';
  private readonly LINK_TEXT = 'to product';
  private readonly LINK_HREF = '#product';
  private _componentElement: HTMLElement;

  constructor() {
    this._componentElement = document.createElement(this.TAG_MAIN);
  }

  createComponent(): HTMLElement {
    const link = document.createElement(this.TAG_A);
    link.textContent = this.LINK_TEXT;
    link.href = this.LINK_HREF;
    this._componentElement.append(link);

    this._componentElement.className = this.CLASS_MAIN;

    return this._componentElement;
  }
}

export default Catalogue;