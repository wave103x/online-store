class FilterGeneral {
  private _category: string[] = [];
  private _baseVehicle: string[] = [];
  private _price: string = '';

  constructor() {
    document.addEventListener('baseVehicle', (event) => {this.baseHandler.call(this, <CustomEvent>event)});
    document.addEventListener('category', (event) => this.categoryHandler.call(this, <CustomEvent>event));
    document.addEventListener('price', (event) => this.priceHandler.call(this, <CustomEvent>event));
  }

  private generateEvent() {
    const newEvent = new CustomEvent('eventGeneral', {
      detail: {
        category: this._category,
        baseVehicle: this._baseVehicle,
        price: this._price,
      },
    });
    document.dispatchEvent(newEvent);
  }
  private baseHandler(event: CustomEvent) {
    this._baseVehicle = event.detail?.baseVehicle;
    this.generateEvent();
  }
  private categoryHandler(event: CustomEvent) {
    this._category = event.detail?.category;
    this.generateEvent();
  }
  private priceHandler(event: CustomEvent) {
    this._price = event.detail?.price;
    this.generateEvent();
  }
}

export default FilterGeneral;
