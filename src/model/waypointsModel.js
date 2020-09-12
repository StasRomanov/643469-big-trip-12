import Observer from "../util/observer";
import {getCapitalizedWord, getTimeDifference, removeItem, updateItem} from "../util/data-function";
import Header from "../presenter/header";

export default class WaypointsModel extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  setWaypoint(waypoint) {
    this._waypoints = waypoint.slice();
  }

  getWaypoints() {
    return this._waypoints;
  }

  updateWaypoint(update) {
    this._waypoints = updateItem(this._waypoints, update);
  }

  addWaypoint(update) {
    update.differenceTime = getTimeDifference(update.startTime, update.endTime).toUpperCase();
    update.differenceTimeMs = getTimeDifference(update.startTime, update.endTime, true).toUpperCase();
    this._waypoints = [
      update,
      ...this._waypoints
    ];
  }

  deleteWaypoint(update) {
    this._waypoints = removeItem(this._waypoints, update);
    Header.updateHeader(this._waypoints);
  }

  static updateToClient(waypoint) {
    const adaptedWaypoint = Object.assign({},
        waypoint,
        {
          startTime: waypoint.date_from,
          endTime: waypoint.date_to,
          important: waypoint.is_favorite,
          price: waypoint.base_price,
          bonusOptions: waypoint.offers,
          type: getCapitalizedWord(waypoint.type),
          town: waypoint.destination.name,
          destination: {
            photos: waypoint.destination.pictures,
            description: waypoint.destination.description
          },
          differenceTime: getTimeDifference(waypoint.date_from, waypoint.date_to).toUpperCase(),
          differenceTimeMs: getTimeDifference(waypoint.date_from, waypoint.date_to, true),
        }
    );
    adaptedWaypoint.bonusOptions.forEach((item) => {
      item.used = false;
      item.name = item.title;
      delete item.title;
    });
    delete adaptedWaypoint.destination.pictures;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.is_favorite;
    delete adaptedWaypoint.offers;
    delete adaptedWaypoint.base_price;
    return adaptedWaypoint;
  }

  static updateToServer(waypoint) {
    const adaptedWaypoint = Object.assign({},
        waypoint,
        {
          "date_from": waypoint.startTime,
          "date_to": waypoint.endTime,
          "is_favorite": waypoint.important,
          "base_price": Number(waypoint.price),
          "offers": waypoint.bonusOptions,
          "type": waypoint.type.toLowerCase(),
          "destination": {
            "pictures": waypoint.destination.photos,
            "description": waypoint.destination.description,
            "name": waypoint.town,
          }
        }
    );
    adaptedWaypoint.offers.forEach((item) => {
      item.title = item.name;
      item.price = Number(item.price);
      delete item.used;
      delete item.name;
    });
    return adaptedWaypoint;
  }
}
