import {remove, render} from "../util/render-function";
import SiteStats from "../view/site-stats";
import {ChartType, TRANSFER_TYPE, TypeEmoji} from "../const";
import {getTimeDifference} from "../util/data-function";

export default class Stats {
  constructor(waypointModel, daysList) {
    this._presenter = daysList;
    this._pointsModel = waypointModel;
    this._statisticsComponent = null;
    console.log(waypointModel.getWaypoint());
  }

  init() {
    if (this._statisticsComponent !== null) {
      this.destroy();
    }

    this._presenter.destroyAll();
    this._statisticsComponent = new SiteStats(this._pointsModel.getWaypoint());
    render(document.querySelector(`.page-body__page-main`), this._statisticsComponent);
  }

  destroy() {
    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }

  _getMoneyData() {
    const pointTypes = {};

    this._pointsModel.getWaypoint().forEach((point) => {
      if (pointTypes[point.type]) {
        pointTypes[point.type] += point.price;
      } else {
        pointTypes[point.type] = point.price;
      }
    });

    return this._getFormattedStructure(pointTypes, ChartType.MONEY);
  }

  _getTransportData() {
    const transportTypes = TRANSFER_TYPE;
    const pointsTransport = {};

    this._pointsModel.getWaypoint().forEach((point) => {
      if (pointsTransport[point.type]) {
        pointsTransport[point.type]++;
      } else {
        if (transportTypes.includes(point.type)) {
          pointsTransport[point.type] = 1;
        }
      }
    });

    return this._getFormattedStructure(pointsTransport, ChartType.TRANSPORT);
  }

  _getTimeSpentData() {
    const pointTypes = {};

    this._pointsModel.getWaypoint().forEach((point) => {
      if (pointTypes[point.type]) {
        pointTypes[point.type] += getTimeDifference(point.startTime, point.endTime);
      } else {
        pointTypes[point.type] = getTimeDifference(point.startTime, point.endTime);
      }
    });

    return this._getFormattedStructure(pointTypes, ChartType.TIME_SPENT);
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
