import PageTitles from './types/PageTitles';
import Page404 from './_page404/page404';
import Header from './header/Header';
import Catalogue from './catalogue/Catalogue';
import ProductPage from './product-page/ProductPage';
import Cart from './cart/Cart';
import Footer from './footer/Footer';

class App {
  private _componentElement = document.createElement('main');
  private contentToLoad!: HTMLElement;
  private _cart: Cart;
  private _catalogue: HTMLElement;
  private _footer = new Footer();
  private HASH_CHANGE_EVENT = 'hashchange';
  private MAIN_BASKET_CLASS = '.main-basket';
  private QUESTION_MARK = '?';

  constructor() {
    window.addEventListener(this.HASH_CHANGE_EVENT, () => this.renderContent());
    this._cart = new Cart();
    Cart.setValues();
    this._catalogue = new Catalogue().createComponent();
  }

  init(): void {
    const header = new Header();
    this._cart.getHeader(header);
    this._componentElement.append(this._catalogue);
    this.renderContent();
    document.body.append(header.getComponent(), this._componentElement, this._footer.getComponent());
  }

  private renderContent(): void {
    const location = window.location.hash.slice(1);
    const main = document.querySelector(this.MAIN_BASKET_CLASS) as HTMLElement;
    if (main) main.remove();

    if (this.contentToLoad) this.contentToLoad.remove();

    const path = location.includes(this.QUESTION_MARK) ? location.slice(0, location.indexOf(this.QUESTION_MARK)) : location;

    switch (path) {
      case location.match(/products\/\d+/gi)?.at(0):
        this._catalogue.hidden = true;
        this.contentToLoad = new ProductPage().getComponent();
        this._componentElement.append(this.contentToLoad);
        break;
      case '':
        this._catalogue.hidden = false;
        document.title = PageTitles.Main;
        break;
      case 'cart':
        this._catalogue.hidden = true;
        document.title = PageTitles.Cart;
        this.contentToLoad = this._cart.createComponent();
        this._componentElement.append(this.contentToLoad);
        break;
      default:
        this._catalogue.hidden = true;
        document.title = PageTitles.NotFound;
        this.contentToLoad = new Page404().createComponent();
        this._componentElement.append(this.contentToLoad);
        break;
    }
  }
}

export default App;
