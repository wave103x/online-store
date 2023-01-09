import './footer.scss';

class Footer {
  private _componentElement: HTMLElement;

  constructor() {
    this._componentElement = document.createElement('footer');
    this.createComponent();
  }

  getComponent(): HTMLElement {
    return this._componentElement;
  }

  private createComponent() {
    this._componentElement.className = 'footer';

    const date = new Date();
    const rsLogoSrc = require('../../assets/icons/rs_school_js.svg') as string;
    const logo1 = require('../../assets/icons/pepper1.svg') as string;
    const logo2 = require('../../assets/icons/pepper2.svg') as string;
    const gitLogoSrc = require('../../assets/icons/github.svg') as string;

    this._componentElement.append(
      this.createPerson(logo1, 'misha', 'https://github.com/wave103x'),
      this.createPerson(rsLogoSrc, date.getFullYear().toString(), 'https://rs.school/js/'),
      this.createPerson(logo2, 'vlad', 'https://github.com/nimboo1')
    );
  }

  private createPerson(logoSrc: string, name: string, linkStr: string): HTMLElement {
    const person = document.createElement('div');

    const logo = new Image();
    logo.className = 'footer__person-logo';
    logo.src = logoSrc;

    const nameEl = document.createElement('p');
    nameEl.className = 'footer__person-name';
    nameEl.textContent = name;

    const link = document.createElement('a');
    link.className = 'footer__person';
    link.href = linkStr;

    link.append(logo, nameEl);
    person.append(link)
    return person;
  }
}

export default Footer;
