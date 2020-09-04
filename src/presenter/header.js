import {render} from "../util/render-function";
import SiteMenu from "../view/site-menu";
import {MouseKey, RenderPosition} from "../const";
import SiteFilterHeaderTemplate from "../view/site-filter-header";
import SiteFilterTemplate from "../view/site-filter";
import abstract from "../view/abstract";

export default class Header extends abstract {
  constructor(waypointsModel) {
    super();
    this._waypoint = waypointsModel.getWaypoint()[0];
    this._header = document.querySelector(`.page-header`);
    this._mainWrapper = document.querySelector(`.page-body__page-main`);
    this._siteMenu = new SiteMenu(waypointsModel.getWaypoint());
    this._siteFilterHeaderTemplate = new SiteFilterHeaderTemplate();
    this._siteFilterTemplate = new SiteFilterTemplate();
    this._addWaypointButtonClickListener = this._addWaypointButtonClickListener.bind(this);
  }

  init() {
    const headerWrapper = document.querySelector(`.trip-main`);
    const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
    render(headerWrapper, this._siteMenu, RenderPosition.AFTERBEGIN);
    render(filterWrapper, this._siteFilterHeaderTemplate);
    render(filterWrapper, this._siteFilterTemplate);
  }

  setAddWaypointButtonClickListener(callback) {
    this._callback.addWaypointButtonClick = callback;
    this._newWaypointButton = this._header.querySelector(`.trip-main__event-add-btn`);
    this._newWaypointButton.addEventListener(`click`, (evt) => this._addWaypointButtonClickListener(evt));
  }

  _addWaypointButtonClickListener(evt) {
    if (evt.button === MouseKey.LEFT) {
      this._callback.addWaypointButtonClick();
    }
  }
}
