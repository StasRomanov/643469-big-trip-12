import {render} from "../util/render-function";
import SiteMenu from "../view/site-menu";
import {MouseKey, RenderPosition} from "../const";
import SitePages from "../view/site-pages";
import SiteFilter from "../view/site-filter";
import Abstract from "../view/abstract";
import TravelDaysList from "./travel-day-list";

export default class Header extends Abstract {
  constructor(waypointsModel, statsPresenter, offersModel, api) {
    super();
    this._api = api;
    this._waypointsModel = waypointsModel;
    this._stats = statsPresenter;
    this._header = document.querySelector(`.page-header`);
    this._mainWrapper = document.querySelector(`.page-body__page-main`);
    this._siteMenu = new SiteMenu(waypointsModel.getWaypoints());
    this._siteFilterHeaderTemplate = new SitePages();
    this._siteFilterTemplate = new SiteFilter();
    this._travelDayPresenter = new TravelDaysList(waypointsModel, this, offersModel, this._api);
    this._addWaypointButtonClickListener = this._addWaypointButtonClickListener.bind(this);
  }

  init() {
    const headerWrapper = document.querySelector(`.trip-main`);
    const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
    render(headerWrapper, this._siteMenu, RenderPosition.AFTERBEGIN);
    render(filterWrapper, this._siteFilterHeaderTemplate);
    render(filterWrapper, this._siteFilterTemplate);
    this._siteFilterHeaderTemplate.setStatsClickListener(() => {
      this._siteFilterTemplate.setFilterDefault();
      this._siteFilterTemplate.disableFilters();
      this._mainWrapper.querySelector(`.page-body__container`).classList.add(`trip-main--hidden`);
      this._callback.destroyWaypointsAll();
      this._header.querySelector(`.trip-main__event-add-btn`).setAttribute(`disabled`, `true`);
      this._stats.init();
    });
    this._siteFilterHeaderTemplate.setTableClickListener(() => {
      this._siteFilterTemplate.enableFilters();
      this._mainWrapper.querySelector(`.page-body__container`).classList.remove(`trip-main--hidden`);
      this._callback.destroyStats();
      this._header.querySelector(`.trip-main__event-add-btn`).removeAttribute(`disabled`);
      this._travelDayPresenter.init();
    });
    this._siteFilterTemplate.setFilterChangeListener((type) => {
      this._callback.renderFilterWaypoints(type);
    });
  }

  set renderFilterWaypoints(callback) {
    this._callback.renderFilterWaypoints = callback;
  }

  set destroyWaypoints(callback) {
    this._callback.destroyWaypointsAll = callback;
  }

  set destroyStats(callback) {
    this._callback.destroyStats = callback;
  }

  set renderTable(callback) {
    this._callback.renderTable = callback;
  }

  setAddWaypointButtonClickListener(callback) {
    this._callback.addWaypointButtonClick = callback;
    this._newWaypointButton = this._header.querySelector(`.trip-main__event-add-btn`);
    this._newWaypointButton.addEventListener(`click`, this._addWaypointButtonClickListener);
  }

  _addWaypointButtonClickListener(evt) {
    if (evt.button === MouseKey.LEFT) {
      this._callback.addWaypointButtonClick();
    }
  }

  static updateHeader(waypoints) {
    document.querySelector(`.trip-main__trip-info`).remove();
    render(document.querySelector(`.trip-main`), new SiteMenu(waypoints), RenderPosition.AFTERBEGIN);
  }

  static updateFilter(waypoints) {
    SiteFilter.smartDisableFilters(waypoints);
  }

  static disableAddButton() {
    document.querySelector(`.trip-main__event-add-btn`).setAttribute(`disabled`, `true`);
  }
}
