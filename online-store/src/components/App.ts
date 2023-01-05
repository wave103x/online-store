import Page404 from './_page404/page404';
import Header from './header/Header';
import Catalogue from './catalogue/Catalogue';
import ProductPage from './product-page/ProductPage';
import Cart from './cart/Cart';

class App {
  private _componentElement = document.body;
  private contentToLoad!: HTMLElement;
  private _cart: Cart;

  constructor() {
    window.addEventListener('hashchange', () => this.renderContent());
    this._cart = new Cart();
  }

  init(): void {
    Cart.setValues();
    const header = new Header();
    this._cart.getHeader(header);
    this._componentElement.prepend(header.getComponent());
    this.renderContent();
  }

  private renderContent(): void {
    const location = window.location.hash.slice(1);
    const main = document.querySelector('.main-basket') as HTMLElement;
    if (main) main.remove();
    if (this.contentToLoad && location.includes('?')) return;
    if (this.contentToLoad) this.contentToLoad.remove();

    const path = location.includes('?') ? location.slice(0, location.indexOf('?')) : location;

    switch (path) {
      case location.match(/products\/\d+/gi)?.at(0):
        this.contentToLoad = new ProductPage().getComponent();
        break;
      case '':
        this.contentToLoad = new Catalogue().createComponent();
        document.title = 'Магазин навесного оборудования для вашей спецтехники.';
        break;
      case 'cart':
        document.title = 'Корзина';
        this.contentToLoad = this._cart.createComponent();
        break;
      default:
        document.title = 'ой! 404';
        this.contentToLoad = new Page404().createComponent();
        break;
    }
    this._componentElement.append(this.contentToLoad);
  }
}

export default App;
