import {render} from "../util/render-function";
import SiteMenu from "../view/site-menu";
import {MouseKey, RenderPosition} from "../const";
import SitePagesTemplate from "../view/site-pages";
import SiteFilterTemplate from "../view/site-filter";
import abstract from "../view/abstract";
import TravelDaysList from "./travel-day";

export default class Header extends abstract {
  constructor(waypointsModel, statsPresenter) {
    super();
    this._stats = statsPresenter;
    this._header = document.querySelector(`.page-header`);
    this._mainWrapper = document.querySelector(`.page-body__page-main`);
    this._siteMenu = new SiteMenu(waypointsModel.getWaypoint());
    this._siteFilterHeaderTemplate = new SitePagesTemplate();
    this._siteFilterTemplate = new SiteFilterTemplate();
    this._travelDayPresenter = new TravelDaysList(waypointsModel, this);
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
      this._stats.init();
    });
    this._siteFilterHeaderTemplate.setTableClickListener(() => {
      this._siteFilterTemplate.enableFilters();
      this._mainWrapper.querySelector(`.page-body__container`).classList.remove(`trip-main--hidden`);
      this._callback.destroyStats();
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
}
