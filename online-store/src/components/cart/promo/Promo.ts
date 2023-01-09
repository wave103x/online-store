import './promo.scss';
import PromoType from '../../types/PromoType';
import Cart from '../Cart';

class Promo {
  private promo: PromoType = {
    rs: {
      name: 'RS School',
      sale: 10,
    },
    vladimish: {
      name: 'VladiMish',
      sale: 20,
    },
  };
  private promoUsed: {
    [index: string]: boolean;
  } = {
    rs: false,
    vladimish: false,
  };

  private promoInput;
  private summaryDiv;
  private promoDiv!: HTMLElement;
  private summaryWithSaleDiv!: HTMLElement;
  private sale: number = 0;
  private summary;
  private summaryWithSale = 0;
  private readonly rubleSymbol = ' &#8381;';

  constructor(elem: HTMLElement, sum: number) {
    this.promoInput = elem.querySelector('.summary__promo') as HTMLInputElement;
    this.summaryDiv = elem.querySelector('.summary__total') as HTMLInputElement;
    this.summary = sum;
  }

  addListener() {
    this.promoInput.addEventListener('input', () => {
      this.checkForPromo();
    });
  }

  private checkForPromo(): void {
    const inputValue: string = this.promoInput.value.toLowerCase();
    if (this.promoDiv) this.promoDiv.remove();
    if (Object.keys(this.promo).indexOf(inputValue) > -1) {
      this.promoDiv = document.createElement('div');
      this.promoDiv.className = 'promo';

      const span = document.createElement('span');
      span.innerText = this.promo[inputValue].name + ' - ' + this.promo[inputValue].sale + '%';
      this.promoDiv.append(span);

      if (!this.promoUsed[inputValue]) {
        const promoButton = document.createElement('button');
        promoButton.className = 'promo__button';
        promoButton.innerText = 'Добавить';
        promoButton.addEventListener('click', () => {
          this.createPromo(inputValue, promoButton);
        });
        this.promoDiv.append(promoButton);
      }

      this.promoInput.after(this.promoDiv);
    }
  }

  private createPromo(name: string, button: HTMLButtonElement): void {
    button.remove();
    this.promoUsed[name] = true;

    const promoDivAdded = document.createElement('div');
    promoDivAdded.className = 'promo_added';

    const span = document.createElement('span');
    span.innerText = this.promo[name].name + ' - ' + this.promo[name].sale + '%';
    promoDivAdded.append(span);

    const promoButton = document.createElement('button');
    promoButton.className = 'promo__button';
    promoButton.innerText = 'Удалить';
    promoButton.addEventListener('click', () => {
      this.deletePromo(promoDivAdded, name);
    });
    promoDivAdded.append(promoButton);

    this.promoInput.before(promoDivAdded);

    this.sale += this.promo[name].sale / 100;
    this.summaryWithSale = this.summary * (1 - this.sale);
    Cart._header.updateState(this.summaryWithSale, Cart.productsCount);

    if (!this.summaryWithSaleDiv) {
      this.summaryWithSaleDiv = document.createElement('p');
      this.summaryWithSaleDiv.className = 'summary-with-sale';
    }

    this.summaryWithSaleDiv.innerHTML = 'Итого: ' + this.summaryWithSale + ' ' + this.rubleSymbol;
    this.summaryDiv.after(this.summaryWithSaleDiv);
    this.summaryDiv.classList.add('summary_old');
  }

  private deletePromo(elem: HTMLElement, name: string): void {
    elem.remove();
    this.promoUsed[name] = false;

    this.checkForPromo();

    this.sale -= this.promo[name].sale / 100;
    this.summaryWithSale = Math.floor(this.summary * (1 - this.sale));
    Cart._header.updateState(this.summaryWithSale, Cart.productsCount);

    if (this.summaryWithSale === this.summary) {
      this.summaryDiv.classList.remove('summary_old');
      this.summaryWithSaleDiv.remove();
    } else {
      this.summaryWithSaleDiv.innerHTML = 'Итого: ' + this.summaryWithSale + ' ' + this.rubleSymbol;
    }
  }
}

export default Promo;
