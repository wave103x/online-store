import './product-item.scss';
import type ProductData from '../../types/ProductData';

class ProductItem {
  private _componentElement: HTMLElement;
  constructor() {
    this._componentElement = document.createElement('div');
  }

  createElement(data: ProductData): HTMLElement {
    const product = document.createElement('div');
    product.className = 'product';

    const simpleBox = document.createElement('div');
    simpleBox.className = 'stub';

    const link = document.createElement('a');
    link.className = 'product_link-topage';
    link.href = `#products/${data.id}`;
    link.append(simpleBox);

    const title = document.createElement('p');
    title.textContent = data.title;

    product.append(link, title);
    return product;
  }

}

export default ProductItem;
