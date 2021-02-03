import Observer from "../utils/observer.js";

export default class OffersModel extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = OffersModel.adaptToClient(offers);
  }

  getAllOffers() {
    return this._offers;
  }

  static adaptToClient(offers) {
    const adaptedOffers = new Map();

    for (const offer of offers) {
      adaptedOffers.set(offer.type, offer.offers);
    }

    return adaptedOffers;
  }
}
