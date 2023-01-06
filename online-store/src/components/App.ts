import Page404 from './_page404/page404';
import Header from './header/Header';
import Catalogue from './catalogue/Catalogue';
import ProductPage from './product-page/ProductPage';
import Cart from './cart/Cart';

class App {
  private _componentElement = document.body;
  private contentToLoad!: HTMLElement;
  private _cart: Cart;
  private _catalogue = new Catalogue().createComponent();

  constructor() {
    window.addEventListener('hashchange', () => this.renderContent());
    this._cart = new Cart();
  }

  init(): void {
    Cart.setValues();
    const header = new Header();
    this._cart.getHeader(header);
    this._componentElement.append(header.getComponent(), this._catalogue);
    this.renderContent();
  }

  private renderContent(): void {
    const location = window.location.hash.slice(1);
    const main = document.querySelector('.main-basket') as HTMLElement;
    if (main) main.remove();

    // if (this.contentToLoad && location.includes('?') && this.contentToLoad.classList.contains('main-catalogue')) return;
    // if (this.contentToLoad && this.contentToLoad.classList.contains('main-catalogue')) this.contentToLoad.hidden = true;

    if (this.contentToLoad) this.contentToLoad.remove();
    
    const path = location.includes('?') ? location.slice(0, location.indexOf('?')) : location;

    switch (path) {
      case location.match(/products\/\d+/gi)?.at(0):
        this._catalogue.hidden = true;
        this.contentToLoad = new ProductPage().getComponent();
        this._componentElement.append(this.contentToLoad)
        break;
      case '':
        this._catalogue.hidden = false;
        document.title = 'Магазин навесного оборудования для вашей спецтехники.';
        break;
      case 'cart':
        this._catalogue.hidden = true;
        document.title = 'Корзина';
        this.contentToLoad = this._cart.createComponent();
        this._componentElement.append(this.contentToLoad)
        break;
      default:
        this._catalogue.hidden = true;
        document.title = 'ой! 404';
        this.contentToLoad = new Page404().createComponent();
        this._componentElement.append(this.contentToLoad)
        break;
    }

    // if (this._componentElement) this._componentElement.append(this.contentToLoad);
  }
}

export default App;
