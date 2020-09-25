import SiteDayItem from "../view/site-day-item";
import SiteNoWaypointMessage from "../view/site-no-waypoint-message";
import {render} from "../util/render-function";
import {defaultWaypoint, FilterType, RenderPosition, SortType, WaypointMode} from "../const";
import SiteDayList from "../view/site-day-list";
import SiteSortFilter from "../view/site-sort-filter";
import {getDefaultSortWaypoints, getPriceSortWaypoints, getTimeSortWaypoints} from "../util/sort-data-function";
import Waypoint from "./waypoint";
import Observer from "../util/observer";
import moment from "moment";
import {getFutureWaypointsFilter, getPastWaypointsFilter} from "../util/filter-data-function";
import Header from "./header";
import {siteLoading} from "../main";

export default class TravelDaysList {
  constructor(waypointsModel, headerPresenter, offersModel, api, stats) {
    this._api = api;
    this._stats = stats;
    this._bonusOptions = offersModel;
    this._filterWaypoints = null;
    this._currentSortType = SortType.DEFAULT;
    this._currentFilterType = FilterType.DEFAULT;
    this._waypoints = waypointsModel;
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
    this._observerViewMode = new Observer();
    this._header = headerPresenter;
    this._newWaypointBtn = document.querySelector(`.trip-main__event-add-btn`);
    this._waypontComponents = [];
  }

  init() {
    this._destroyLoadMessage();
    this._renderDay();
  }

  _renderDay() {
    this._dayRenderWaypoints(getDefaultSortWaypoints(this._waypoints.getWaypoints()), this._waypoints);
    Header.updateFilter(this._waypoints.getWaypoints());
    this._createNewWaypointListener();
    this._renderFilterWaypoints();
    this._setHeaderCallbacks();
  }

  _noWaypointRender() {
    if (this._sortWrapper.querySelector(`.trip-days`)) {
      render(this._sortWrapper.querySelector(`.trip-days`), this._noWaypoint);
    } else {
      render(this._sortWrapper, new SiteDayList());
      render(this._sortWrapper.querySelector(`.trip-days`), this._noWaypoint);
    }
  }

  _onSortWrapperChange(sortType) {
    switch (sortType) {
      case `event`:
        this._sortEventCases();
        break;
      case `time`:
        this._sortTimeCases();
        break;
      case `price`:
        this._sortPriceCases();
        break;
    }
  }

  _sort(sortTravelWaypoints) {
    this._siteDayListTemplate.destroyAllWaypoints();
    this._allDays = new SiteDayItem();
    render(this._siteDayListTemplate, this._allDays);
    this._allDays = this._allDays.getElement();
    this._observerViewMode.destroyObserver();
    sortTravelWaypoints.forEach((value) => {
      const place = this._mainWrapper.querySelectorAll(`.trip-events__list`)[this._mainWrapper.querySelectorAll(`.trip-events__list`).length - 1];
      const waypoint = new Waypoint(this._api, this._bonusOptions.getOffers(), value, this._waypoints, place);
      this._observerViewMode.addObserver(waypoint.onRollupButtonEditClickHandler);
      waypoint.renderWaypointMode(this._allDays.querySelector(`.trip-events__list`), WaypointMode.VIEW);
      waypoint.renderAllWaypointsInViewMode = () => this._observerViewMode.notify();
    });
  }

  _sortEventCases() {
    this._waypoints.setWaypointAsDefaultSort(this._waypoints.getWaypoints());
    switch (this._currentFilterType) {
      case FilterType.DEFAULT:
        this._sortDefault(this._waypoints.getWaypoints());
        break;
      case FilterType.FUTURE:
        this._sortDefault(getFutureWaypointsFilter(this._waypoints.getWaypoints()));
        break;
      case FilterType.PAST:
        this._sortDefault(getPastWaypointsFilter(this._waypoints.getWaypoints()));
        break;
    }
  }

  _sortTimeCases() {
    switch (this._currentFilterType) {
      case FilterType.DEFAULT:
        this._sortTime(this._waypoints.getWaypoints());
        break;
      case FilterType.FUTURE:
        this._sortTime(getFutureWaypointsFilter(this._waypoints.getWaypoints()));
        break;
      case FilterType.PAST:
        this._sortTime(getPastWaypointsFilter(this._waypoints.getWaypoints()));
        break;
    }
  }

  _sortPriceCases() {
    switch (this._currentFilterType) {
      case FilterType.DEFAULT:
        this._sortPrice(this._waypoints.getWaypoints());
        break;
      case FilterType.FUTURE:
        this._sortPrice(getFutureWaypointsFilter(this._waypoints.getWaypoints()));
        break;
      case FilterType.PAST:
        this._sortPrice(getPastWaypointsFilter(this._waypoints.getWaypoints()));
        break;
    }
  }

  _sortDefault(waypoints) {
    this._currentSortType = SortType.DEFAULT;
    this._sortWrapper.innerHTML = ``;
    this._dayRenderWaypoints(waypoints, this._waypoints);
  }

  _sortTime(waypoints) {
    this._currentSortType = SortType.TIME;
    this._sort(getTimeSortWaypoints(waypoints));
  }

  _sortPrice(waypoints) {
    this._currentSortType = SortType.PRICE;
    this._sort(getPriceSortWaypoints(waypoints));
  }

  _dayRenderWaypoints(waypoints, waypointsModel) {
    this._noWaypoint = new SiteNoWaypointMessage();
    if (!waypoints.length) {
      this._noWaypointRender();
      Header.updateFilter(waypoints);
      return;
    }
    let day = null;
    let dayCount = 0;
    this._renderWrappers();
    const dayWrapper = this._sortWrapper.querySelector(`.trip-days`);
    this._waypontComponents = [];
    this._dayWrappers = [];
    waypoints.forEach((item) => {
      if (day !== moment(item.startTime).format(`D`)) {
        day = moment(item.startTime).format(`D`);
        dayCount++;
        const dayItem = new SiteDayItem(dayCount, item);
        this._dayWrappers.push(dayItem);
        render(dayWrapper, dayItem);
      }
      const place = this._mainWrapper.querySelectorAll(`.trip-events__list`)[this._mainWrapper.querySelectorAll(`.trip-events__list`).length - 1];
      const waypoint = new Waypoint(this._api, this._bonusOptions.getOffers(), item, waypointsModel, place);
      this._waypontComponents.push(waypoint);
      waypoint.renderWaypoint();
      const currentDay = this._mainWrapper.querySelectorAll(`.trip-days__item`)[this._mainWrapper.querySelectorAll(`.trip-days__item`).length - 1];
      this._observerViewMode.addObserver(waypoint.onRollupButtonEditClickHandler);
      waypoint.renderAllWaypointsInViewMode = () => this._observerViewMode.notify();
      waypoint.removeDay = () => {
        if (!(currentDay.querySelectorAll(`.trip-events__item`).length)) {
          this._dayWrappers.forEach((value) => {
            if (!(value.getElement().querySelectorAll(`.trip-events__item`).length)) {
              value.destroy();
            }
          });
          this._dayWrappers = this._dayWrappers.filter((arrayItem) => {
            return Array.from(arrayItem.getElement().querySelectorAll(`.trip-events__item`)).length !== 0;
          });
          this._dayWrappers.forEach((dayCountTitle, index) => {
            dayCountTitle.updateDayCount(index + 1);
          });
        }
      };
      waypoint.resetTable = () => {
        this._dayRenderWaypoints(waypoints, waypointsModel);
      };
    });
  }

  _renderWrappers() {
    if (this._sortWrapper.querySelector(`.trip-days`)) {
      this._siteDayListTemplate.destroy();
    }
    if (this._sortWrapper.querySelector(`.trip-events__trip-sort`)) {
      this._siteSortFilterTemplate.destroy();
    }
    this._siteSortFilterTemplate = new SiteSortFilter();
    this._siteDayListTemplate = new SiteDayList();
    render(this._sortWrapper, this._siteSortFilterTemplate);
    render(this._sortWrapper, this._siteDayListTemplate);
    this._siteSortFilterTemplate.setSortChangeListener((sortType) => {
      this._onSortWrapperChange(sortType);
    });
  }

  destroyAll() {
    this._siteSortFilterTemplate.destroy();
    this._siteDayListTemplate.destroy();
  }

  destroyStats() {
    if (this._mainWrapper.querySelector(`.statistics`)) {
      this._stats.destroy();
    }
  }

  _destroyLoadMessage() {
    if (this._mainWrapper.querySelector(`.trip-events__msg`)) {
      siteLoading.destroy();
      Header.enableAddButton();
    }
  }

  _destroyNoWaypointMessage() {
    if (this._mainWrapper.querySelector(`.trip-events__msg`)) {
      this._noWaypoint.destroy();
      Header.enableAddButton();
    }
  }

  _setHeaderCallbacks() {
    this._header.destroyWaypoints = () => {
      this._waypoints.setWaypointAsDefaultSort(this._waypoints.getWaypoints());
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

  _renderFilterWaypoints() {
    this._header.renderFilterWaypoints = (filterType) => {
      Header.enableAddButton();
      switch (filterType) {
        case FilterType.DEFAULT:
          this._currentFilterType = FilterType.DEFAULT;
          this._waypoints.setWaypointAsDefaultSort(this._waypoints.getWaypoints());
          this._sortDefault(this._waypoints.getWaypoints());
          return;
        case FilterType.FUTURE:
          this._currentFilterType = FilterType.FUTURE;
          this._filterWaypoints = getFutureWaypointsFilter(this._waypoints.getWaypoints());
          this._sortDefault(this._filterWaypoints);
          Header.disableAddButton();
          return;
        case FilterType.PAST:
          this._currentFilterType = FilterType.PAST;
          this._filterWaypoints = getPastWaypointsFilter(this._waypoints.getWaypoints());
          this._sortDefault(this._filterWaypoints);
          Header.disableAddButton();
          return;
      }
    };
  }

  _createNewWaypointListener() {
    this._header.setAddWaypointButtonClickListener(() => {
      if (this._currentSortType !== SortType.DEFAULT) {
        this._waypoints.setWaypointAsDefaultSort(this._waypoints.getWaypoints());
        this._sortDefault(this._waypoints.getWaypoints());
      }
      const place = this._mainWrapper.querySelectorAll(`.trip-events__list`)[this._mainWrapper.querySelectorAll(`.trip-events__list`).length - 1];
      const waypoint = new Waypoint(this._api, this._bonusOptions.getOffers(), this._waypoints.getWaypoints()[0], this._waypoints, place);
      waypoint.renderDayWrappers = () => {
        this._destroyNoWaypointMessage();
        this._renderWrappers();
        render(this._sortWrapper.querySelector(`.trip-days`), new SiteDayItem(1, defaultWaypoint));
      };
      this._observerViewMode.notify();
      this._waypontComponents.forEach((item) => {
        item.disableWaypointRollupButton();
      });
      Header.disableAddButton();
      waypoint.renderNewWaypoint();
      waypoint.resetNewWaypointBtn = () => {
        Header.enableAddButton();
        this._waypontComponents.forEach((item) => {
          item.enableWaypointRollupButton();
        });
      };
      waypoint.renderNewWaypointInViewMode = () => {
        const firstPlace = this._mainWrapper.querySelector(`.trip-events__list`);
        const newWaypoint = new Waypoint(this._api, this._bonusOptions.getOffers(), this._waypoints.getWaypoints()[0], this._waypoints, firstPlace, RenderPosition.AFTERBEGIN);
        newWaypoint.renderWaypoint();
        this._observerViewMode.addObserver(newWaypoint.onRollupButtonEditClickHandler);
        newWaypoint.renderAllWaypointsInViewMode = () => this._observerViewMode.notify();
        Header.enableAddButton();
        this._waypontComponents.forEach((item) => {
          item.enableWaypointRollupButton();
        });
        this._waypoints.setWaypointAsDefaultSort(this._waypoints.getWaypoints());
        this._sortDefault(this._waypoints.getWaypoints());
      };
    });
  }
}
