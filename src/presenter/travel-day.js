import SiteDayItem from "../view/site-day-item";
import SiteNoWaypointMessage from "../view/site-no-waypoint-message";
import {render} from "../util/render-function";
import {defaultWaypoint, FilterType, RenderPosition, SortType, WaypointMode} from "../const";
import SiteDayListTemplate from "../view/site-day-list";
import SiteSortFilterTemplate from "../view/site-sort-filter";
import {getDefaultSortWaypoints, getPriceSortWaypoints, getTimeSortWaypoints} from "../util/sort-data-function";
import Waypoint from "./waypoint";
import Observer from "../util/observer";
import moment from "moment";
import {getFutureWaypointsFilter, getPastWaypointsFilter} from "../util/filter-data-function";
import Header from "./header";

export default class TravelDaysList {
  constructor(waypointsModel, headerPresenter, offersModel, api) {
    this._api = api;
    this._bonusOptions = offersModel;
    this._filterWaypoints = null;
    this._currentSortType = SortType.DEFAULT;
    this._waypoints = waypointsModel;
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
    this._observerViewMode = new Observer();
    this._header = headerPresenter;
    this._newWaypointBtn = document.querySelector(`.trip-main__event-add-btn`);
  }

  init() {
    this._destroyNoWaypointMessage();
    this._renderDay();
  }

  _renderDay() {
    this._dayRenderWaypoints(getDefaultSortWaypoints(this._waypoints.getWaypoints()), this._waypoints);
    Header.updateFilter(this._waypoints.getWaypoints());
    this._header.setAddWaypointButtonClickListener(() => {
      if (this._currentSortType !== SortType.DEFAULT) {
        this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoints()));
        this._sortDefault(this._waypoints.getWaypoints());
      }
      const waypoint = new Waypoint(this._api, this._bonusOptions.getOffers(), this._waypoints.getWaypoints()[0], this._waypoints);
      waypoint.renderDayWrappers = () => {
        this._destroyNoWaypointMessage();
        this._renderWrappers();
        render(this._sortWrapper.querySelector(`.trip-days`), new SiteDayItem(1, defaultWaypoint));
      };
      this._observerViewMode.notify();
      this._mainWrapper.querySelectorAll(`.event__rollup-btn`).forEach((item) => item.toggleAttribute(`disabled`));
      this._newWaypointBtn.setAttribute(`disabled`, `true`);
      waypoint.renderNewWaypoint();
      waypoint.resetNewWaypointBtn = () => {
        this._newWaypointBtn.removeAttribute(`disabled`);
        this._mainWrapper.querySelectorAll(`.event__rollup-btn`).forEach((item) => item.toggleAttribute(`disabled`));
      };
      waypoint.renderNewWaypointInViewMode = () => {
        const newWaypoint = new Waypoint(this._api, this._bonusOptions.getOffers(), this._waypoints.getWaypoints()[0], this._waypoints, RenderPosition.AFTERBEGIN);
        newWaypoint.renderWaypoint();
        this._observerViewMode.addObserver(newWaypoint.onRollupButtonEditClickHandler);
        newWaypoint.renderAllWaypointsInViewMode = () => this._observerViewMode.notify();
        this._newWaypointBtn.removeAttribute(`disabled`);
        this._mainWrapper.querySelectorAll(`.event__rollup-btn`).forEach((item) => item.removeAttribute(`disabled`));
        this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoints()));
        this._sortDefault(this._waypoints.getWaypoints());
      };
    });
    this._header.renderFilterWaypoints = (filterType) => {
      this._newWaypointBtn.removeAttribute(`disabled`);
      switch (filterType) {
        case FilterType.DEFAULT:
          this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoints()));
          this._sortDefault(this._waypoints.getWaypoints());
          return;
        case FilterType.FUTURE:
          this._filterWaypoints = getFutureWaypointsFilter(this._waypoints.getWaypoints());
          this._sortDefault(this._filterWaypoints);
          this._newWaypointBtn.setAttribute(`disabled`, `true`);
          return;
        case FilterType.PAST:
          this._filterWaypoints = getPastWaypointsFilter(this._waypoints.getWaypoints());
          this._sortDefault(this._filterWaypoints);
          this._newWaypointBtn.setAttribute(`disabled`, `true`);
          return;
      }
    };
    this._header.destroyWaypoints = () => {
      this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoints()));
      this._sortDefault(this._waypoints.getWaypoints());
      this.destroyAll();
    };
    this._header.destroyStats = () => {
      this.destroyStats();
    };
    this._header.renderTable = () => {
      this.init();
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
        this._waypoints.setWaypoint(getDefaultSortWaypoints(this._waypoints.getWaypoints()));
        this._sortDefault(this._waypoints.getWaypoints());
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
      const waypoint = new Waypoint(this._api, this._bonusOptions.getOffers(), value, this._waypoints);
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
    this._sort(getTimeSortWaypoints(this._waypoints.getWaypoints()));
  }

  _sortPrice() {
    this._currentSortType = SortType.PRICE;
    this._sort(getPriceSortWaypoints(this._waypoints.getWaypoints()));
  }

  _dayRenderWaypoints(waypoints, waypointsModel) {
    if (!waypoints.length) {
      this._noWaypointRender();
      Header.updateFilter(waypoints);
      return;
    }
    let day = null;
    let dayCount = 0;
    this._renderWrappers();
    const dayWrapper = this._sortWrapper.querySelector(`.trip-days`);
    waypoints.forEach((item) => {
      if (day !== moment(item.startTime).format(`D`)) {
        day = moment(item.startTime).format(`D`);
        dayCount++;
        render(dayWrapper, new SiteDayItem(dayCount, item));
      }
      const waypoint = new Waypoint(this._api, this._bonusOptions.getOffers(), item, waypointsModel);
      waypoint.renderWaypoint();
      const currentDay = this._mainWrapper.querySelectorAll(`.trip-days__item`)[this._mainWrapper.querySelectorAll(`.trip-days__item`).length - 1];
      this._observerViewMode.addObserver(waypoint.onRollupButtonEditClickHandler);
      waypoint.renderAllWaypointsInViewMode = () => this._observerViewMode.notify();
      waypoint.removeDay = () => {
        if (!(currentDay.querySelectorAll(`.trip-events__item`).length)) {
          currentDay.remove();
        }
      };
    });
  }

  _renderWrappers() {
    if (this._sortWrapper.querySelector(`.trip-days`)) {
      this._sortWrapper.querySelector(`.trip-days`).remove();
    }
    const siteSortFilterTemplate = new SiteSortFilterTemplate();
    const siteDayListTemplate = new SiteDayListTemplate();
    render(this._sortWrapper, siteSortFilterTemplate);
    render(this._sortWrapper, siteDayListTemplate);
    siteSortFilterTemplate.setSortChangeListener((sortType) => {
      this._onSortWrapperChange(sortType);
    });
  }

  destroyAll() {
    this._mainWrapper.querySelector(`.trip-events__trip-sort`).remove();
    this._mainWrapper.querySelector(`.trip-days`).remove();
  }

  destroyStats() {
    if (this._mainWrapper.querySelector(`.statistics`)) {
      this._mainWrapper.querySelector(`.statistics`).remove();
    }
  }

  _destroyNoWaypointMessage() {
    if (this._mainWrapper.querySelector(`.trip-events__msg`)) {
      this._mainWrapper.querySelector(`.trip-events__msg`).remove();
      this._newWaypointBtn.removeAttribute(`disabled`);
    }
  }
}
