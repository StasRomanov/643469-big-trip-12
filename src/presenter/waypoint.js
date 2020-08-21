import SiteTripEvent from "../view/site-trip-event";
import SiteEditEventTemplate from "../view/site-edit-event";
import {KeyboardKey, MAX_OFFERS_IN_VIEW_MODE, WaypointMode} from "../const";
import {render, replace} from "../util/render-function";
import SiteEventTemplate from "../view/site-event";
import SiteEventTitleTemplate from "../view/site-event-title";

export default class Waypoint {
  constructor(travelDays) {
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
    this._travelDays = travelDays.slice();
  }

  renderWaypointMode(dayWrapper, waypoint) {
    const waypointElement = new SiteTripEvent(waypoint);
    const waypointEdit = new SiteEditEventTemplate(waypoint);

    const replaceWaypointMode = (mode = WaypointMode.VIEW) => {
      if (mode === WaypointMode.EDIT) {
        replace(waypointEdit, waypointElement);
        const {bonusOptions} = waypoint;
        const bonusOptionWrapper = this._mainWrapper.querySelectorAll(`.event__available-offers`);
        bonusOptionWrapper.forEach((item) => {
          item.innerHTML = ``;
        });
        const lastBonusOptionWrapper = bonusOptionWrapper[bonusOptionWrapper.length - 1];
        for (let bonusOption of bonusOptions) {
          render(lastBonusOptionWrapper, new SiteEventTemplate(bonusOption));
        }
        waypointEdit.setImportantMarkClickHandler(() => setImportantMode());

      }
      if (mode === WaypointMode.VIEW) {
        replace(waypointElement, waypointEdit);
        waypointEdit.removeImportantMarkClickHandler(() => setImportantMode());
      }
    };

    const setImportantMode = () => {
      this._travelDays.forEach((item) => {
        item.waypoints.forEach((waypointsItem) => {
          if (waypointsItem.id === waypointEdit.getElement().getAttribute(`data-id`)) {
            waypointsItem.important = !waypointsItem.important;
          }
        });
      });
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

  renderWaypoint(dayCount, waypointCount) {
    let trimEventItem = this._sortWrapper.querySelectorAll(`.trip-events__list`);
    trimEventItem = trimEventItem[trimEventItem.length - 1];
    this.renderWaypointMode(trimEventItem, this._travelDays[dayCount].waypoints[waypointCount]);
    const eventOffer = trimEventItem.querySelectorAll(`.event__selected-offers`);
    this._lastEventOffer = eventOffer[eventOffer.length - 1];
    this._travelDays[dayCount].waypoints[waypointCount].bonusOptions.forEach((item, index) => this._renderBonusOption(index, dayCount, waypointCount));
  }

  _renderBonusOption(index, dayCount, waypointCount) {
    const optionCount = this._lastEventOffer.querySelectorAll(`.event__offer`).length;
    if (this._travelDays[dayCount].waypoints[waypointCount].bonusOptions[index].used && optionCount < MAX_OFFERS_IN_VIEW_MODE) {
      render(this._lastEventOffer, new SiteEventTitleTemplate(this._travelDays[dayCount].waypoints[waypointCount].bonusOptions[index]));
    }
  }
}
