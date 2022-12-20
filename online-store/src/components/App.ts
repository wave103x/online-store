import Catalogue from './catalogue/Catalogue';
import ProductPage from './product-page/ProductPage';

class App {
  private _componentElement = document.body;
  private pageToLoad!: HTMLElement;

  constructor() {
    window.addEventListener('hashchange', () => this.renderPage());
  }

  init() :void {
    this.renderPage()
  }

  private renderPage() :void {
    const location = window.location.hash.slice(1);
    this._componentElement.innerHTML = '';
    switch (location) {
      case 'product':
        this.pageToLoad = new ProductPage().createComponent();
        break;
      case '':
        this.pageToLoad = new Catalogue().createComponent();
        break;
      default:
        break;
    }
    this._componentElement.append(this.pageToLoad);
  }
}

export default App;
