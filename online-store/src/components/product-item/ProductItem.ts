import './product-item.scss';

class ProductItem {
  private _componentElement: HTMLElement;
  constructor() {
    this._componentElement = document.createElement('div');
  }

  createElement(): HTMLElement {
    const simpleBox = document.createElement('div')
    simpleBox.className = 'simple-item';
    return simpleBox;
  }
}

export default ProductItem;