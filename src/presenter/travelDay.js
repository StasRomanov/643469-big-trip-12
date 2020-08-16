import SiteTripEvent from "../view/siteTripEvent";
import SiteDayItem from "../view/siteDayItem";
import SiteNoWaypointMessage from "../view/siteNoWaypointMessage";
import {render, replace} from "../util/renderFunction";
import SiteMenu from "../view/siteMenu";
// import {travelDays} from "../mock/data";
import {KeyboardKey, RenderPosition, WaypointMode} from "../const";
import SiteFilterHeaderTemplate from "../view/siteFilterHeader";
import SiteFilterTemplate from "../view/siteFilter";
import SiteSortFilterTemplate from "../view/siteSortFilter";
import SiteEditEventTemplate from "../view/siteEditEvent";
import SiteEventTemplate from "../view/siteEvent";
import SiteWaypointPriceTemplate from "../view/siteWaypointPrice";
import SiteDayListTemplate from "../view/siteDayList";
import SiteEventTitleTemplate from "../view/siteEventTitle";

export default class DayRender {
  constructor() {
    this._headerWrapper = document.querySelector(`.trip-main`);
    this._mainWrapper = document.querySelector(`.page-main`);
    this._filterWrapper = this._headerWrapper.querySelector(`.trip-main__trip-controls`);
    this._sortFilterWrapper = this._mainWrapper.querySelector(`.trip-events`);

    this._dayComponent = new SiteDayItem();
    this._waypointComponent = new SiteTripEvent();
    this._noWaypointComponent = new SiteNoWaypointMessage();
  }

  init(travelDays) {
    this._travelDays = travelDays.slice();

    this._renderFilter(this._travelDays);
    this._renderDay();
  }

  _renderDay() {
    if (this._travelDays.length === 0) {
      this._noWaypointRender();
      return;
    } else {
      render(this._sortFilterWrapper, new SiteDayListTemplate());
      this._travelDays.forEach((item, travelDaysIndex) => {
        render(this._sortFilterWrapper.querySelector(`.trip-days`), new SiteDayItem(item));
        item.waypoints.forEach((value, waypointsIndex) => {
          this._renderWaypoint(travelDaysIndex, waypointsIndex);
        });
      });
    }
    // Метод, куда уйдёт логика созданию и рендерингу дня,
    // текущая функция (часть) renderDays в main.js
  }

  _renderWaypointMode(dayWrapper, waypoint) {
    const waypointElement = new SiteTripEvent(waypoint);
    const waypointEdit = new SiteEditEventTemplate(waypoint);

    const replaceWaypointMode = (mode = WaypointMode.VIEW) => {
      if (mode === WaypointMode.EDIT) {
        replace(waypointEdit, waypointElement);
        const {bonusOptions} = waypoint;
        this._bonusOptionWrapper = new SiteWaypointPriceTemplate().getElement().querySelector(`.event__available-offers`);
        this._bonusOptionWrapper.innerHTML = ``;
        for (let bonusOption of bonusOptions) {
          render(this._bonusOptionWrapper, new SiteEventTemplate(bonusOption));
        }
      }
      if (mode === WaypointMode.VIEW) {
        replace(waypointElement, waypointEdit);
      }
    };

    const setEditModeListener = () => {
      waypointElement.setRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.EDIT);
        setEditModeListener();
      });
      waypointEdit.setRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      });
      waypointEdit.setFormSubmitHandler(() => {
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      });
      document.addEventListener(`keydown`, onDocumentKeydown);
    };

    const setNormalModeListener = () => {
      waypointElement.setRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.EDIT);
        setEditModeListener();
      });
      waypointEdit.removeRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      });
      waypointEdit.removeFormSubmitHandler(() => {
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      });
      document.removeEventListener(`keydown`, onDocumentKeydown);
    };

    const onDocumentKeydown = function (evt) {
      if (evt.code === KeyboardKey.ESCAPE) {
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      }
    };

    waypointElement.setRollupButtonClickHandler(() => {
      replaceWaypointMode(WaypointMode.EDIT);
      setEditModeListener();
    });
    render(dayWrapper, waypointElement);
  }

  _renderWaypoint(dayCount, waypointCount) {
    let trimEventItem = this._sortFilterWrapper.querySelectorAll(`.trip-events__list`);
    trimEventItem = trimEventItem[trimEventItem.length - 1];
    this._renderWaypointMode(trimEventItem, this._travelDays[dayCount].waypoints[waypointCount]);
    let eventOffer = trimEventItem.querySelectorAll(`.event__selected-offers`);
    this._lastEventOffer = eventOffer[eventOffer.length - 1];
    this._travelDays[dayCount].waypoints[waypointCount].bonusOptions.forEach((item, index) => this._renderBonusOption(item, index, dayCount, waypointCount));
  }

  _noWaypointRender() {
    render(this._sortFilterWrapper.querySelector(`.trip-days`), new SiteNoWaypointMessage());
  }

  _renderBonusOption(item, index, dayCount, waypointCount) {
    let optionCount = this._lastEventOffer.querySelectorAll(`.event__offer`).length;
    if (this._travelDays[dayCount].waypoints[waypointCount].bonusOptions[index].used && optionCount < 3) {
      render(this._lastEventOffer, new SiteEventTitleTemplate(this._travelDays[dayCount].waypoints[waypointCount].bonusOptions[index]));
    }
  }

  _renderFilter(traveldays) {
    render(this._headerWrapper, new SiteMenu(this._travelDays), RenderPosition.AFTERBEGIN);
    render(this._filterWrapper, new SiteFilterHeaderTemplate());
    render(this._filterWrapper, new SiteFilterTemplate());
    if (traveldays.length > 0) {
      render(this._sortFilterWrapper, new SiteSortFilterTemplate());
    }
  }
}
