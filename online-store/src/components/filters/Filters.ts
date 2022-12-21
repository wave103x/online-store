import type ProductData from '../types/ProductData';
import './filters.scss'

class Filters {
  createComponent(): HTMLElement {
    const filters = document.createElement('sidebar');
    const copyLinkBtn = document.createElement('button');

    const test = document.createElement('div')
    test.classList.add('simple-box');
    return test;
  }

  private createFilter(type: 'checkbox' | 'radio' | 'slide', key: keyof ProductData, data: ProductData[]) {

  }
}

export default Filters;