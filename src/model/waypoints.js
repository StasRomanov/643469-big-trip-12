import Observer from "../util/observer";
import {getTimeDifference, removeItem, updateItem} from "../util/data-function";

export default class Waypoints extends Observer {
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
}
