import Page404 from './_page404/page404';
import Header from './header/Header';
import Cart from './cart/Cart';

class App {
  private _componentElement = document.body;
  private contentToLoad!: HTMLElement;

  constructor() {
    window.addEventListener('hashchange', () => this.renderContent());
  }

  init(): void {
    const header = new Header().createComponent();
    this._componentElement.prepend(header);
    this.renderContent();
  }

  private renderContent(): void {
    const location = window.location.hash.slice(1);
    if (this.contentToLoad) this.contentToLoad.remove();
    switch (location) {
      case '':
        this.contentToLoad = document.createElement('div');
        document.title = 'Магазин навесного оборудования для вашей спецтехники.';
        break;
      case 'cart':
        document.title = 'Корзина';
        this.contentToLoad = new Cart().createComponent();
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
