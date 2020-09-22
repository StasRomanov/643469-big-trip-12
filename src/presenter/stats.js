import {remove, render} from "../util/render-function";
import SiteStats from "../view/site-stats";

export default class Stats {
  constructor(waypointsModel) {
    this._waypointsModel = waypointsModel;
    this._statisticsComponent = null;
  }

  init() {
    if (this._statisticsComponent !== null) {
      this.destroy();
    }
    this._statisticsComponent = new SiteStats(this._waypointsModel.getWaypoints());
    render(document.querySelector(`.page-body__page-main`), this._statisticsComponent);
  }

  destroy() {
    remove(this._statisticsComponent);
    this._statisticsComponent = null;
  }
}
