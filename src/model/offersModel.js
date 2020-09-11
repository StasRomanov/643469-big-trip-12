import Observer from "../util/observer";
import {removeItem, updateItem} from "../util/data-function";

export default class OffersModel extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  static updateToClient(offers) {
    return Object.assign({},
        offers,
        offers.offers.forEach((item) => {
          item.name = item.title;
          delete item.title;
        })
    );
  }

  updateOffer(update) {
    this._offers = updateItem(this._offers, update);
  }

  addOffer(update) {
    this._offers = [
      update,
      ...this._offers
    ];
  }

  deleteOffers(update) {
    this._offers = removeItem(this._offers, update);
  }
}
