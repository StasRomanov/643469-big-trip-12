import SiteDayItem from "../view/site-day-item";
import SiteNoWaypointMessage from "../view/site-no-waypoint-message";
import {render} from "../util/render-function";
import {WaypointMode} from "../const";
import SiteDayListTemplate from "../view/site-day-list";
import SiteSortFilterTemplate from "../view/site-sort-filter";
import {getPriceSortWaypoints, getTimeSortWaypoints} from "../util/sort-data-function";
import Waypoint from "./waypoint";
import {bonusOptionMock} from "../mock/bonusOption";
import Observer from "../util/observer";
import moment from "moment";

export default class TravelDaysList {
  constructor(waypointsModel) {
    this._waypoints = waypointsModel;
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
    this._observer = new Observer();
  }

  init() {
    this._renderDay();
  }

  _renderDay() {
    if (!this._waypoints.getWaypoint().length) {
      this._noWaypointRender();
    } else {
      let day = null;
      let dayCount = 0;
      let siteSortFilterTemplate = new SiteSortFilterTemplate();
      let siteDayListTemplate = new SiteDayListTemplate();
      render(this._sortWrapper, siteSortFilterTemplate);
      render(this._sortWrapper, siteDayListTemplate);
      siteSortFilterTemplate.setSortChangeListener((sortType) => {
        this._onSortWrapperChange(sortType);
      });
      const dayWrapper = this._sortWrapper.querySelector(`.trip-days`);
      this._waypoints.getWaypoint().forEach((item) => {
        if (day !== moment(item.startTime).format(`D`)) {
          day = moment(item.startTime).format(`D`);
          dayCount++;
          render(dayWrapper, new SiteDayItem(dayCount, item));
        }
        const waypoint = new Waypoint(bonusOptionMock, item, this._waypoints);
        waypoint.renderWaypoint(WaypointMode.VIEW);
        this._observer.addObserver(waypoint.onRollupButtonEditClickHandler);
        waypoint.renderAllWaypointsInViewMode = () => this._observer.notify();
      });
    }
  }

  _noWaypointRender() {
    render(this._sortWrapper.querySelector(`.trip-days`), new SiteNoWaypointMessage());
  }

  _onSortWrapperChange(sortType) {
    switch (sortType) {
      case `event`:
        this._sortWrapper.innerHTML = ``;
        this._renderDay();
        break;
      case `time`:
        this._sort(getTimeSortWaypoints(this._waypoints.getWaypoint()));
        break;
      case `price`:
        this._sort(getPriceSortWaypoints(this._waypoints.getWaypoint()));
        break;
    }
  }

  _sort(sortTravelWaypoints) {
    this.clearWaypoint();
    this._observer.destroyObserver();
    sortTravelWaypoints.forEach((value) => {
      const waypoint = new Waypoint(bonusOptionMock, value, this._waypoints);
      this._observer.addObserver(waypoint.onRollupButtonEditClickHandler);
      waypoint.renderWaypointMode(this._allDays.querySelector(`.trip-events__list`), WaypointMode.VIEW);
      waypoint.renderAllWaypointsInViewMode = () => this._observer.notify();
    });
  }

  clearWaypoint() {
    if (this._mainWrapper.querySelector(`.event--edit`)) {
      this._mainWrapper.querySelector(`.event--edit`).remove();
    }
    this._allDays = this._sortWrapper.querySelectorAll(`.trip-days__item`);
    this._sortWrapper.querySelector(`.trip-sort__item--day`).textContent = ``;
    this._allDays.forEach(((value, key) => {
      if (key > 0) {
        value.remove();
      }
    }));
    this._allDays = this._allDays[0];
    this._allDays.querySelector(`.day__counter`).textContent = ``;
    this._allDays.querySelector(`.day__date`).textContent = ``;
    this._allDays.querySelectorAll(`.trip-events__item`).forEach((value) => {
      value.remove();
    });
  }
}

