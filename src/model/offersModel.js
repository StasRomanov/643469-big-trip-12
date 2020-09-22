import Observer from "../util/observer";

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
}
