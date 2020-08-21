import SiteDayItem from "../view/site-day-item";
import SiteNoWaypointMessage from "../view/site-no-waypoint-message";
import {render} from "../util/render-function";
import {MAX_OFFERS_IN_VIEW_MODE} from "../const";
import SiteDayListTemplate from "../view/site-day-list";
import SiteEventTitleTemplate from "../view/site-event-title";
import SiteSortFilterTemplate from "../view/site-sort-filter";
import {getPriceSortWaypoints, getTimeSortWaypoints} from "../mock/sort-data";
import Waypoint from "./waypoint";

export default class TravelDaysList {
  constructor() {
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
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
      this._travelDays.forEach((item, travelDaysIndex) => {
        render(dayWrapper, new SiteDayItem(item));
        item.waypoints.forEach((value, waypointsIndex) => {
          new Waypoint(this._travelDays).renderWaypoint(travelDaysIndex, waypointsIndex);
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
    this._clearWaypoint();
    sortTravelDays.forEach((value, index) => {
      new Waypoint(this._travelDays).renderWaypointMode(this._allDay[0].querySelector(`.trip-events__list`), value);
      const optionWrapper = this._allDay[0].querySelectorAll(`.event__selected-offers`)[index];
      value.bonusOptions.forEach((bonusOptionsValue) => {
        if (bonusOptionsValue.used && optionWrapper.childElementCount < MAX_OFFERS_IN_VIEW_MODE) {
          render(optionWrapper, new SiteEventTitleTemplate(bonusOptionsValue));
        }
      });
    });
  }

  _clearWaypoint() {
    this._allDay = this._sortWrapper.querySelectorAll(`.trip-days__item`);
    this._sortWrapper.querySelector(`.trip-sort__item--day`).textContent = ``;
    this._allDay.forEach(((value, key) => {
      if (key > 0) {
        value.remove();
      }
    }));
    this._allDay[0].querySelector(`.day__counter`).textContent = ``;
    this._allDay[0].querySelector(`.day__date`).textContent = ``;
    this._allDay[0].querySelectorAll(`.trip-events__item`).forEach((value) => {
      value.remove();
    });
  }
}

