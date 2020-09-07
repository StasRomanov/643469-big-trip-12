import {remove, render} from "../util/render-function";
import SiteStats from "../view/site-stats";
import {ChartType, TRANSFER_TYPE, TypeEmoji} from "../const";
import {getTimeDifference} from "../util/data-function";

export default class Stats {
  constructor(waypointsModel, daysList) {
    this._listPresenter = daysList;
    this._waypointsModel = waypointsModel;
    this._statisticsComponent = null;
  }

  init() {
    if (this._statisticsComponent !== null) {
      this.destroy();
    }
    this._listPresenter.destroyAll();
    this._statisticsComponent = new SiteStats(this._waypointsModel.getWaypoint());
    render(document.querySelector(`.page-body__page-main`), this._statisticsComponent);
  }

  destroy() {
    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }

  _getMoneyData() {
    const waypointTypes = {};

    this._waypointsModel.getWaypoint().forEach((waypoint) => {
      if (waypointTypes[waypoint.type]) {
        waypointTypes[waypoint.type] += waypoint.price;
      } else {
        waypointTypes[waypoint.type] = waypoint.price;
      }
    });

    return this._getFormattedStructure(waypointTypes, ChartType.MONEY);
  }

  _getTransportData() {
    const transportTypes = TRANSFER_TYPE;
    const waypointsTransport = {};

    this._waypointsModel.getWaypoint().forEach((waypoint) => {
      if (waypointsTransport[waypoint.type]) {
        waypointsTransport[waypoint.type]++;
      } else {
        if (transportTypes.includes(waypoint.type)) {
          waypointsTransport[waypoint.type] = 1;
        }
      }
    });

    return this._getFormattedStructure(waypointsTransport, ChartType.TRANSPORT);
  }

  _getTimeSpentData() {
    const waypointTypes = {};

    this._waypointsModel.getWaypoint().forEach((waypoint) => {
      if (waypointTypes[waypoint.type]) {
        waypointTypes[waypoint.type] += getTimeDifference(waypoint.startTime, waypoint.endTime, true);
      } else {
        waypointTypes[waypoint.type] = getTimeDifference(waypoint.startTime, waypoint.endTime, true);
      }
    });

    return this._getFormattedStructure(waypointTypes, ChartType.TIME_SPENT);
  }

  _getFormattedStructure(items, name) {
    return [...Object.entries(items)]
      .sort((a, b) => b[1] - a[1])
      .reduce((result, [key, value]) => {
        result[name].labels.push(`${TypeEmoji.get(key)} ${key.toUpperCase()}`);
        result[name].data.push(value);
        return result;
      }, {[name]: {labels: [], data: []}});
  }
}
