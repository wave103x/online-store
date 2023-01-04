class FilterGeneral {
  private _category: string[] = [];
  private _baseVehicle: string[] = [];

  constructor() {
    document.addEventListener('baseVehicle', (event) => this.baseHandler.call(this, <CustomEvent>event));
    document.addEventListener('category', (event) => this.categoryHandler.call(this, <CustomEvent>event));
  }

  private generateEvent() {
    const newEvent = new CustomEvent('eventGeneral', {
      detail: {
        category: this._category,
        baseVehicle: this._baseVehicle,
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
}

export default FilterGeneral;
