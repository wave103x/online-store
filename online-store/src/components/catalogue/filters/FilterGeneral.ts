import CustomEvents from "../../types/CustomEvents";

class FilterGeneral {
  private _category: string[] = [];
  private _baseVehicle: string[] = [];
  private _price: string = '';
  private _stock: string = '';
  private _search: string = '';

  constructor() {
    document.addEventListener(CustomEvents.BaseVehicle, (event) => {this.baseHandler.call(this, <CustomEvent>event)});
    document.addEventListener(CustomEvents.Category, (event) => this.categoryHandler.call(this, <CustomEvent>event));
    document.addEventListener(CustomEvents.Price, (event) => this.priceHandler.call(this, <CustomEvent>event));
    document.addEventListener(CustomEvents.Stock, (event) => this.stockHandler.call(this, <CustomEvent>event));
    document.addEventListener(CustomEvents.Search, (event) => this.searchHandler.call(this, <CustomEvent>event));
  }

  private generateEvent() {
    const newEvent = new CustomEvent(CustomEvents.EventGeneral, {
      detail: {
        category: this._category,
        baseVehicle: this._baseVehicle,
        price: this._price,
        stock: this._stock,
        search: this._search,
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
  private stockHandler(event: CustomEvent) {
    this._stock = event.detail?.stock;
    this.generateEvent();
  }
  private searchHandler(event: CustomEvent) {
    this._search = event.detail?.search;
    this.generateEvent();
  }
}

export default FilterGeneral;
