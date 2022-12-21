import Page404 from './_page404/page404';

class App {
  private _componentElement = document.querySelector('main') as HTMLElement;
  private pageToLoad!: HTMLElement;

  constructor() {
    window.addEventListener('hashchange', () => this.renderPage());
  }

  init(): void {
    this.renderPage();
  }

  private renderPage(): void {
    console.log('render');
    console.log(window.location.hash);
    const location = window.location.hash.slice(1);
    this._componentElement.innerHTML = '';
    switch (location) {
      case '':
        this.pageToLoad = document.createElement('div');
        break;
      default:
        this.pageToLoad = new Page404().createComponent();
        break;
    }
    this._componentElement.append(this.pageToLoad);
  }
}

export default App;
