import './form.scss';

class Form {
  private _componentElement!: HTMLElement;
  private valid = {
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

    form.append(createLabel('text', 'input input-name', 'Имя', 'input__label label_wrong'));
    form.append(createLabel('text', 'input input-number', 'Номер телефона', 'input__label label_wrong'));
    form.append(createLabel('text', 'input input-address', 'Адрес', 'input__label label_wrong'));
    form.append(createLabel('email', 'input input-mail', 'Email', 'input__label label_wrong'));

    const cardHeader = document.createElement('h3');
    cardHeader.className = 'card__details';
    cardHeader.innerText = 'Данные карты';
    form.append(cardHeader);

    const card = document.createElement('div');
    card.className = 'card';

    const labelName = document.createElement('label');
    labelName.className = 'card__label';
    const img = new Image();
    img.src = require('../../../assets/icons/empty-card.png') as string;
    img.alt = 'empty-card';
    img.className = 'card__img';
    labelName.append(img);
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'card-input card__number';
    inputName.placeholder = 'Номер карты';
    labelName.append(inputName);
    card.append(labelName);

    const cardBlock = document.createElement('div');
    cardBlock.className = 'card__block';
    cardBlock.append(createLabel('text', 'card-input card__date', 'Дата', 'card__label'));
    cardBlock.append(createLabel('text', 'card-input card__cvv', 'CVV', 'card__label'));
    card.append(cardBlock);
    form.append(card);

    const cardErrors = document.createElement('p');
    cardErrors.className = 'card_wrong';
    form.append(cardErrors);

    const submitErrors = document.createElement('p');
    submitErrors.className = 'card_wrong';
    form.append(submitErrors);

    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.className = 'button registr__submit';
    submit.value = 'Подтвердить';
    form.append(submit);

    return form;

    function createLabel(
      type: string,
      inputClassName: string,
      placeholder: string,
      labelClassName: string
    ): HTMLLabelElement {
      const labelName = document.createElement('label');
      labelName.className = labelClassName;
      const inputName = document.createElement('input');
      inputName.type = type;
      inputName.className = inputClassName;
      inputName.placeholder = placeholder;
      labelName.append(inputName);

      return labelName;
    }
  }
}

export default Form;
