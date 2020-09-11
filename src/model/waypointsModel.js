import Observer from "../util/observer";
import {getCapitalizedWord, getTimeDifference, removeItem, updateItem} from "../util/data-function";

export default class WaypointsModel extends Observer {
  constructor() {
    super();
    this._waypoints = [];
  }

  setWaypoint(waypoint) {
    this._waypoints = waypoint.slice();
  }

  getWaypoint() {
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
            name: waypoint.destination.name,
            description: waypoint.destination.description
          }
        }
    );
    delete adaptedWaypoint.destination.pictures;
    delete adaptedWaypoint.date_to;
    delete adaptedWaypoint.date_from;
    delete adaptedWaypoint.is_favorite;
    delete adaptedWaypoint.offers;
    delete adaptedWaypoint.base_price;

    adaptedWaypoint.bonusOptions.forEach((item) => {
      item.used = false;
      item.name = item.title;
      delete item.title;
    });
    return adaptedWaypoint;
  }

  // static adaptToServer(waypoint) {
  //   const adaptedTask = Object.assign(
  //       {},
  //       waypoint,
  //       {
  //         "date_to": waypoint.endTime instanceof Date ? waypoint.endTime.toISOString() : null,
  //         "date_from": waypoint.startTime instanceof Date ? waypoint.startTime.toISOString() : null,
  //         "is_favorite": waypoint.important,
  //         "base_price": waypoint.price,
  //         "type": waypoint.type.toLowerCase(),
  //         "offers": waypoint.bonusOptions,
  //       }
  //   );
  //
  //   delete adaptedTask.dueDate;
  //   delete adaptedTask.isArchive;
  //   delete adaptedTask.isFavorite;
  //   delete adaptedTask.repeating;
  //   adaptedTask.offers.forEach((item) => {
  //     delete item.used;
  //   });
  //
  //   return adaptedTask;
  // }
}
