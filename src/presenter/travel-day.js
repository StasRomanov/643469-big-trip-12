import SiteDayItem from "../view/site-day-item";
import SiteNoWaypointMessage from "../view/site-no-waypoint-message";
import {render} from "../util/render-function";
import {FilterType, RenderPosition, SortType, WaypointMode} from "../const";
import SiteDayListTemplate from "../view/site-day-list";
import SiteSortFilterTemplate from "../view/site-sort-filter";
import {getDefaultSortWaypoints, getPriceSortWaypoints, getTimeSortWaypoints} from "../util/sort-data-function";
import Waypoint from "./waypoint";
import {bonusOptions} from "../mock/bonus-option";
import Observer from "../util/observer";
import moment from "moment";
import {getFutureWaypointsFilter, getPastWaypointsFilter} from "../util/filter-data-function";

export default class TravelDaysList {
  constructor(waypointsModel, headerPresenter) {
    this._filterWaypoints = null;
    this._currentSortType = SortType.DEFAULT;
    this._waypoints = waypointsModel;
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
    this._observerViewMode = new Observer();
    this._header = headerPresenter;
    this._headerWrapper = document.querySelector(`.trip-main__event-add-btn`);
  }

  init() {
    this._renderDay();
  }

  _renderDay() {
    this._dayRenderWaypoints(this._waypoints.getWaypoint(), this._waypoints);
    this._header.setAddWaypointButtonClickListener(() => {
      if (this._currentSortType !== SortType.DEFAULT) {
        this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoint()));
        this._sortDefault(this._waypoints.getWaypoint());
      }
      const waypoint = new Waypoint(bonusOptions, this._waypoints.getWaypoint()[0], this._waypoints);
      this._observerViewMode.notify();
      this._mainWrapper.querySelectorAll(`.event__rollup-btn`).forEach((item) => item.toggleAttribute(`disabled`));
      this._headerWrapper.classList.add(`trip-main__event-add-btn--hidden`);
      waypoint.renderNewWaypoint();
      waypoint.resetNewWaypointBtn = () => {
        this._headerWrapper.classList.remove(`trip-main__event-add-btn--hidden`);
        this._mainWrapper.querySelectorAll(`.event__rollup-btn`).forEach((item) => item.toggleAttribute(`disabled`));
      };
      waypoint.renderNewWaypointInViewMode = () => {
        const newWaypoint = new Waypoint(bonusOptions, this._waypoints.getWaypoint()[0], this._waypoints, RenderPosition.AFTERBEGIN);
        newWaypoint.renderWaypoint();
        this._observerViewMode.addObserver(newWaypoint.onRollupButtonEditClickHandler);
        newWaypoint.renderAllWaypointsInViewMode = () => this._observerViewMode.notify();
        this._headerWrapper.classList.remove(`trip-main__event-add-btn--hidden`);
        this._mainWrapper.querySelectorAll(`.event__rollup-btn`).forEach((item) => item.removeAttribute(`disabled`));
        this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoint()));
        this._sortDefault(this._waypoints.getWaypoint());
      };
    });
    this._header.renderFilterWaypoints = (filterType) => {
      this._headerWrapper.classList.remove(`trip-main__event-add-btn--hidden`);
      switch (filterType) {
        case FilterType.DEFAULT:
          this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoint()));
          this._sortDefault(this._waypoints.getWaypoint());
          return;
        case FilterType.FUTURE:
          this._filterWaypoints = getFutureWaypointsFilter(this._waypoints.getWaypoint());
          this._sortDefault(this._filterWaypoints);
          this._headerWrapper.classList.add(`trip-main__event-add-btn--hidden`);
          return;
        case FilterType.PAST:
          this._filterWaypoints = getPastWaypointsFilter(this._waypoints.getWaypoint());
          this._sortDefault(this._filterWaypoints);
          this._headerWrapper.classList.add(`trip-main__event-add-btn--hidden`);
          return;
      }
    };
  }

  _noWaypointRender() {
    if (this._sortWrapper.querySelector(`.trip-days`)) {
      render(this._sortWrapper.querySelector(`.trip-days`), new SiteNoWaypointMessage());
    } else {
      render(this._sortWrapper, new SiteDayListTemplate());
      render(this._sortWrapper.querySelector(`.trip-days`), new SiteNoWaypointMessage());
    }
  }

  _onSortWrapperChange(sortType) {
    switch (sortType) {
      case `event`:
        this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoint()));
        this._sortDefault(this._waypoints.getWaypoint());
        break;
      case `time`:
        this._sortTime();
        break;
      case `price`:
        this._sortPrice();
        break;
    }
  }

  _sort(sortTravelWaypoints) {
    this.clearWaypoint();
    this._observerViewMode.destroyObserver();
    sortTravelWaypoints.forEach((value) => {
      const waypoint = new Waypoint(bonusOptions, value, this._waypoints);
      this._observerViewMode.addObserver(waypoint.onRollupButtonEditClickHandler);
      waypoint.renderWaypointMode(this._allDays.querySelector(`.trip-events__list`), WaypointMode.VIEW);
      waypoint.renderAllWaypointsInViewMode = () => this._observerViewMode.notify();
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

  _sortDefault(waypoints) {
    this._currentSortType = SortType.DEFAULT;
    this._sortWrapper.innerHTML = ``;
    this._dayRenderWaypoints(waypoints, this._waypoints);
  }

  _sortTime() {
    this._currentSortType = SortType.TIME;
    this._sort(getTimeSortWaypoints(this._waypoints.getWaypoint()));
  }

  _sortPrice() {
    this._currentSortType = SortType.PRICE;
    this._sort(getPriceSortWaypoints(this._waypoints.getWaypoint()));
  }

  _dayRenderWaypoints(waypoints, waypointsModel) {
    if (!waypoints.length) {
      this._noWaypointRender();
      return;
    }
    let day = null;
    let dayCount = 0;
    const siteSortFilterTemplate = new SiteSortFilterTemplate();
    const siteDayListTemplate = new SiteDayListTemplate();
    render(this._sortWrapper, siteSortFilterTemplate);
    render(this._sortWrapper, siteDayListTemplate);
    siteSortFilterTemplate.setSortChangeListener((sortType) => {
      this._onSortWrapperChange(sortType);
    });
    const dayWrapper = this._sortWrapper.querySelector(`.trip-days`);
    waypoints.forEach((item) => {
      if (day !== moment(item.startTime).format(`D`)) {
        day = moment(item.startTime).format(`D`);
        dayCount++;
        render(dayWrapper, new SiteDayItem(dayCount, item));
      }
      const waypoint = new Waypoint(bonusOptions, item, waypointsModel);
      waypoint.renderWaypoint();
      this._observerViewMode.addObserver(waypoint.onRollupButtonEditClickHandler);
      waypoint.renderAllWaypointsInViewMode = () => this._observerViewMode.notify();
    });
  }
}

