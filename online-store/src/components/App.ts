import Page404 from './_page404/page404';

class App {
  private _componentElement = document.body;
  private contentToLoad!: HTMLElement;

  constructor() {
    window.addEventListener('hashchange', () => this.renderContent());
  }

  init(): void {
    const header = document.createElement('header');
    this._componentElement.prepend(header);
    this.renderContent();
  }

  private renderContent(): void {
    const location = window.location.hash.slice(1);
    if (this.contentToLoad) this.contentToLoad.remove();
    switch (location) {
      case '':
        this.contentToLoad = document.createElement('div');
        break;
      default:
        this.contentToLoad = new Page404().createComponent();
        break;
    }
    this._componentElement.append(this.contentToLoad);
  }
}

export default App;
