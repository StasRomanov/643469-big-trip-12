import Observer from "../util/observer";
import {getCapitalizedWord, getTimeDifference, removeItem, updateItem} from "../util/data-function";
import Header from "../presenter/header";
import {getDefaultSortWaypoints} from "../util/sort-data-function";

export default class WaypointsModel extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  setWaypoint(waypoint) {
    this._waypoints = waypoint.slice();
  }

  setWaypointAsDefaultSort(waypoint) {
    this._waypoints = getDefaultSortWaypoints(waypoint.slice());
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
          bonusOptions: [],
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
    waypoint.offers.forEach((item) => {
      adaptedWaypoint.bonusOptions.push({
        "used": item.used !== undefined ? item.used : false,
        "name": item.title,
        "price": item.price,
      });
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
          "offers": [],
          "type": waypoint.type.toLowerCase(),
          "destination": {
            "pictures": waypoint.destination.photos,
            "description": waypoint.destination.description,
            "name": waypoint.town,
          }
        }
    );
    waypoint.bonusOptions.forEach((item) => {
      adaptedWaypoint.offers.push({
        "title": item.name,
        "price": Number(item.price),
        "used": item.used,
      });
    });
    delete adaptedWaypoint.startTime;
    delete adaptedWaypoint.endTime;
    delete adaptedWaypoint.important;
    delete adaptedWaypoint.price;
    delete adaptedWaypoint.bonusOptions;
    delete adaptedWaypoint.town;
    return adaptedWaypoint;
  }
}
