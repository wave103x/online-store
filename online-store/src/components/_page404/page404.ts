import './_page404.scss';

class Page404 {
  private _componentElement: HTMLElement;

  constructor() {
    this._componentElement = document.createElement('article');
  }

  createComponent(): HTMLElement {
    this._componentElement.append(this.createContainer());
    this._componentElement.className = 'not-found';
    return this._componentElement;
  }

  private createContainer(): HTMLElement {
    const container: HTMLElement = document.createElement('div');
    container.append(this.createTitle(), this.createDescription(), this.createButton(), this.createImage());
    container.className = 'not-found_container';
    return container;
  }

  private createTitle(): HTMLElement {
    const title = document.createElement('h2');
    title.className = 'not-found_title';
    title.innerText = '404';
    return title;
  }

  private createDescription(): HTMLElement {
    const desc = document.createElement('p');
    desc.className = 'not-found_desc';
    desc.innerText = 'Страница не найдена.';
    return desc;
  }

  private createButton(): HTMLElement {
    const button = document.createElement('a');
    button.classList.add('button');
    button.classList.add('not-found_button');
    button.innerText = 'Перейти на главную';
    button.setAttribute('href', 'index.html');
    return button;
  }

  private createImage(): HTMLElement {
    const img = new Image();
    img.src = require('../../assets/images/metr404.png') as string;
    img.classList.add('not-found_img');
    img.setAttribute('alt', 'metr');
    return img;
  }
}

export default Page404;
