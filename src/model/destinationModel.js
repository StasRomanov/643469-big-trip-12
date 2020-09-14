import Observer from "../util/observer";
import {removeItem, updateItem} from "../util/data-function";

export default class DestinationModel extends Observer {
  constructor() {
    super();
    this._destination = [];
  }

  setDestinations(destination) {
    this._destination = destination.slice();
  }

  getDestinations() {
    return this._destination;
  }

  static updateToClient(destination) {
    const adaptedDestination = Object.assign({},
        destination,
        {
          town: destination.name,
          photos: destination.pictures,
        }
    );
    delete adaptedDestination.pictures;
    delete adaptedDestination.name;
    return adaptedDestination;
  }

  updateDestination(update) {
    this._destination = updateItem(this._destination, update);
  }

  addDestination(update) {
    this._destination = [
      update,
      ...this._destination
    ];
  }

  deleteDestinations(update) {
    this._destination = removeItem(this._destination, update);
  }
}
