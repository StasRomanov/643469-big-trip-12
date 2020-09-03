import Observer from "../util/observer";
import {removeItem, updateItem} from "../util/data-function";

export class Waypoint extends Observer {
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

  addWaypoint() {}

  deleteWaypoint(update) {
    this._tasks = removeItem(this._tasks, update);
  }
}
