import Observer from "../util/observer";
import {removeItem, updateItem} from "../util/data-function";

export default class DestinationModel extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setDestinations(destination) {
    this._destinations = destination.slice();
  }

  getDestinations() {
    return this._destinations;
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
    this._destinations = updateItem(this._destinations, update);
  }

  addDestination(update) {
    this._destinations = [
      update,
      ...this._destinations
    ];
  }

  deleteDestinations(update) {
    this._destinations = removeItem(this._destinations, update);
  }
}
