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

export default class TravelDaysList {
  constructor() {
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
    this._observer = new Observer();
  }

  init(travelDays) {
    this._travelDays = travelDays.slice();
    this._renderDay();
  }

  _renderDay() {
    if (!this._travelDays.length) {
      this._noWaypointRender();
    } else {
      let siteSortFilterTemplate = new SiteSortFilterTemplate();
      let siteDayListTemplate = new SiteDayListTemplate();
      render(this._sortWrapper, siteSortFilterTemplate);
      render(this._sortWrapper, siteDayListTemplate);
      siteSortFilterTemplate.setSortChangeListener((sortType) => {
        this._onSortWrapperChange(sortType);
      });
      const dayWrapper = this._sortWrapper.querySelector(`.trip-days`);
      this._travelDays.forEach((item) => {
        render(dayWrapper, new SiteDayItem(item));
        item.waypoints.forEach((value) => {
          const waypoint = new Waypoint(this._travelDays, bonusOptionMock, value);
          waypoint.renderWaypoint(WaypointMode.VIEW);
          this._observer.addObserver(waypoint.onRollupButtonEditClickHandler);
          waypoint.renderAllWaypointsInViewMode = () => this._observer.notify();
        });
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
        this._sort(getTimeSortWaypoints(this._travelDays));
        break;
      case `price`:
        this._sort(getPriceSortWaypoints(this._travelDays));
        break;
    }
  }

  _sort(sortTravelDays) {
    this.clearWaypoint();
    this._observer.destroyObserver();
    sortTravelDays.forEach((value) => {
      const waypoint = new Waypoint(this._travelDays, bonusOptionMock, value);
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

