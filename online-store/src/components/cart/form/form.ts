import Cart from '../Cart';
import './form.scss';

class Form {
  private _componentElement!: HTMLElement;
  static valid = {
    name: false,
    number: false,
    address: false,
    email: false,
    cardNumber: false,
    date: false,
    cvv: false,
  };

  constructor() {
    this._componentElement = document.createElement('div');
  }

  createComponent(): HTMLElement {
    const darkBlock = document.createElement('div');
    darkBlock.className = 'dark-block';
    darkBlock.addEventListener('click', () => {
      this._componentElement.remove();
    });
    this._componentElement.append(darkBlock);

    const registration = document.createElement('div');
    registration.className = 'registr';

    registration.append(this.createForm());
    this._componentElement.append(registration);
    return this._componentElement;
  }

  private createForm(): HTMLElement {
    const form = document.createElement('form');
    form.className = 'registr__form';

    const regDetails = document.createElement('h2');
    regDetails.className = 'registr__details';
    regDetails.innerText = 'Личные данные';
    form.append(regDetails);

    const labelName = document.createElement('label');
    labelName.className = 'input__label label_wrong';
    const textName = document.createElement('span');
    labelName.prepend(textName);
    let inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'input input-name';
    inputName.placeholder = 'Имя и фамилия';
    inputName.addEventListener('input', function (): void {
      const arr = this.value.split(' ');
      if (arr.length > 1) {
        if (arr.every((item) => item.length > 2)) {
          Form.valid.name = true;
          textName.innerText = '';
          return;
        }
      }
      Form.valid.name = false;
      textName.innerText = 'Имя и фамилия введены неправильно';
    });
    labelName.append(inputName);
    form.append(labelName);

    const labelPhone = document.createElement('label');
    labelPhone.className = 'input__label label_wrong';
    const textPhone = document.createElement('span');
    labelPhone.prepend(textPhone);
    inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'input input-number';
    inputName.placeholder = 'Номер телефона';
    inputName.addEventListener('input', function (): void {
      const number = '1234567890';
      if (
        this.value[0] === '+' &&
        this.value.length > 8 &&
        this.value
          .split('')
          .slice(1)
          .every((item) => number.indexOf(item) > -1)
      ) {
        Form.valid.number = true;
        textPhone.innerText = '';
        return;
      }
      Form.valid.number = false;
      textPhone.innerText = 'Номер введен неправильно';
    });
    labelPhone.append(inputName);
    form.append(labelPhone);

    const labelAdr = document.createElement('label');
    labelAdr.className = 'input__label label_wrong';
    const textAdr = document.createElement('span');
    labelAdr.prepend(textAdr);
    inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'input input-address';
    inputName.placeholder = 'Адрес';
    inputName.addEventListener('input', function (): void {
      const arr = this.value.split(' ');
      if (arr.length > 2) {
        if (arr.every((item) => item.length > 4)) {
          Form.valid.address = true;
          textAdr.innerText = '';
          return;
        }
      }
      Form.valid.address = false;
      textAdr.innerText = 'Адрес введен неправильно';
    });
    labelAdr.append(inputName);
    form.append(labelAdr);

    const labelMail = document.createElement('label');
    labelMail.className = 'input__label label_wrong';
    const textEmail = document.createElement('span');
    labelMail.prepend(textEmail);
    inputName = document.createElement('input');
    inputName.type = 'email';
    inputName.className = 'input input-mail';
    inputName.placeholder = 'Email';
    inputName.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
    inputName.addEventListener('input', function (): void {
      if (this.checkValidity()) {
        Form.valid.email = true;
        textEmail.innerText = '';
        return;
      }
      Form.valid.email = false;
      textEmail.innerText = 'Email введен неправильно';
    });
    labelMail.append(inputName);
    form.append(labelMail);

    const cardHeader = document.createElement('h3');
    cardHeader.className = 'card__details';
    cardHeader.innerText = 'Данные карты';
    form.append(cardHeader);

    const card = document.createElement('div');
    card.className = 'card';

    const labelNum = document.createElement('label');
    labelNum.className = 'card__label';
    const img = new Image();
    img.src = require('../../../assets/icons/empty-card.png') as string;
    img.alt = 'empty-card';
    img.className = 'card__img';
    labelNum.append(img);
    inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'card-input card__number';
    inputName.placeholder = 'Номер карты';
    inputName.addEventListener('keydown', function (e) {
      const number = '1234567890';
      if (number.indexOf(e.key) === -1) {
        if (e.key !== 'Backspace') {
          e.preventDefault();
          return;
        }
      }
      if (this.value.length === 16 && e.key !== 'Backspace') {
        e.preventDefault();
        return;
      }
      if (this.value.length === 15 && e.key !== 'Backspace') {
        Form.valid.cardNumber = true;
        cardError1.innerText = '';
        return;
      }
      Form.valid.cardNumber = false;
      cardError1.innerText = 'Номер карты введен неправильно';
    });
    inputName.addEventListener('input', function () {
      switch (this.value[0]) {
        case '3':
          img.src = require('../../../assets/icons/ae-logo.png') as string;
          break;
        case '4':
          img.src = require('../../../assets/icons/visa-logo.png') as string;
          break;
        case '5':
          img.src = require('../../../assets/icons/mastercard-logo.png') as string;
          break;
        default:
          img.src = require('../../../assets/icons/empty-card.png') as string;
      }
    });
    labelNum.append(inputName);
    card.append(labelNum);

    const cardBlock = document.createElement('div');
    cardBlock.className = 'card__block';

    const labelDate = document.createElement('label');
    labelDate.className = 'card__label';
    inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'card-input card__date';
    inputName.placeholder = 'Дата';

    inputName.addEventListener('keydown', function (e) {
      const number = '1234567890';
      if (number.indexOf(e.key) === -1) {
        if (e.key != 'Backspace') {
          e.preventDefault();
          return;
        }
      }
      if (this.value.length === 5 && e.key !== 'Backspace') {
        e.preventDefault();
        return;
      }
    });

    inputName.addEventListener('input', function () {
      if (
        (this.value.length === 4 && this.value.indexOf('/') === -1) ||
        (this.value.length === 5 && this.value.indexOf('/') > -1)
      ) {
        let month: string;
        let date: string;
        if (this.value.indexOf('/') > -1) {
          month = this.value.split('/')[0];
          date = this.value.split('/')[1];
        } else {
          month = this.value[0] + this.value[1];
          date = this.value[2] + this.value[3];
        }

        this.value = month + '/' + date;
        if (+month <= 12 && +date <= 31) {
          Form.valid.date = true;
          cardError2.innerText = '';
          return;
        }
      }
      Form.valid.cvv = false;
      cardError2.innerText = 'Дата введена неправильно';
    });

    labelDate.append(inputName);
    cardBlock.append(labelDate);

    const labelCVV = document.createElement('label');
    labelCVV.className = 'card__label';
    inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'card-input card__cvv';
    inputName.placeholder = 'CVV';
    inputName.addEventListener('keydown', function (e) {
      const number = '1234567890';
      if (number.indexOf(e.key) === -1) {
        if (e.key != 'Backspace') {
          e.preventDefault();
          return;
        }
      }
      if (this.value.length === 3 && e.key !== 'Backspace') {
        e.preventDefault();
        return;
      }
      if (this.value.length === 2 && e.key !== 'Backspace') {
        Form.valid.cvv = true;
        cardError3.innerText = '';
        return;
      }
      Form.valid.cvv = false;
      cardError3.innerText = 'CVV введен неправильно';
    });
    labelCVV.append(inputName);
    cardBlock.append(labelCVV);

    card.append(cardBlock);
    form.append(card);

    const cardError1 = document.createElement('p');
    cardError1.className = 'card_wrong';
    form.append(cardError1);

    const cardError2 = document.createElement('p');
    cardError2.className = 'card_wrong';
    form.append(cardError2);

    const cardError3 = document.createElement('p');
    cardError3.className = 'card_wrong';
    form.append(cardError3);

    const submitLabel = document.createElement('p');
    submitLabel.className = 'card_true';
    form.append(submitLabel);

    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.className = 'button registr__submit';
    submit.value = 'Подтвердить';
    submit.addEventListener('click', function (e) {
      e.preventDefault();
      let flag = true;
      if (!Form.valid.name) {
        textName.innerText = 'Имя и фамилия введены неправильно';
        flag = false;
      }
      if (!Form.valid.number) {
        textPhone.innerText = 'Номер введен неправильно';
        flag = false;
      }
      if (!Form.valid.address) {
        textAdr.innerText = 'Адрес введен неправильно';
        flag = false;
      }
      if (!Form.valid.email) {
        textEmail.innerText = 'Email введен неправильно';
        flag = false;
      }
      if (!Form.valid.cardNumber) {
        cardError1.innerText = 'Номер карты введен неправильно';
        flag = false;
      }
      if (!Form.valid.date) {
        cardError2.innerText = 'Дата введена неправильно';
        flag = false;
      }
      if (!Form.valid.cvv) {
        cardError3.innerText = 'CVV введен неправильно';
        flag = false;
      }
      if (flag) {
        submitLabel.innerText = 'Заказ оформлен';
        setTimeout(() => {
          Cart.clearItemList();
          window.location.hash = '#';
        }, 3000);
      } else {
        submitLabel.innerText = '';
      }
    });
    form.append(submit);

    return form;
  }
}

export default Form;
