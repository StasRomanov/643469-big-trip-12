import SiteTripEvent from "../view/siteTripEvent";
import SiteDayItem from "../view/siteDayItem";
import SiteNoWaypointMessage from "../view/siteNoWaypointMessage";
import {render, replace} from "../util/renderFunction";
import {KeyboardKey, WaypointMode} from "../const";
import SiteEditEventTemplate from "../view/siteEditEvent";
import SiteEventTemplate from "../view/siteEvent";
import SiteDayListTemplate from "../view/siteDayList";
import SiteEventTitleTemplate from "../view/siteEventTitle";

export default class TravelDaysList {
  constructor() {
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortFilterWrapper = this._mainWrapper.querySelector(`.trip-events`);
  }

  init(travelDays) {
    this._travelDays = travelDays.slice();
    this._renderDay();
  }

  _renderDay() {
    if (this._travelDays.length === 0) {
      this._noWaypointRender();
    } else {
      render(this._sortFilterWrapper, new SiteDayListTemplate());
      this._travelDays.forEach((item, travelDaysIndex) => {
        render(this._sortFilterWrapper.querySelector(`.trip-days`), new SiteDayItem(item));
        item.waypoints.forEach((value, waypointsIndex) => {
          this._renderWaypoint(travelDaysIndex, waypointsIndex);
        });
      });
    }
  }

  _renderWaypointMode(dayWrapper, waypoint) {
    const waypointElement = new SiteTripEvent(waypoint);
    const waypointEdit = new SiteEditEventTemplate(waypoint);

    const replaceWaypointMode = (mode = WaypointMode.VIEW) => {
      if (mode === WaypointMode.EDIT) {
        replace(waypointEdit, waypointElement);
        const {bonusOptions} = waypoint;
        this._bonusOptionWrapper = this._mainWrapper.querySelector(`.event__available-offers`);
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
}
