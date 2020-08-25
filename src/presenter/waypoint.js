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
    this._waypointElement = new SiteTripEvent(waypoint);
    this._waypointEdit = new SiteEditEventTemplate(waypoint);

    const replaceWaypointMode = (mode = WaypointMode.VIEW) => {
      if (mode === WaypointMode.EDIT) {
        this._waypointEdit = new SiteEditEventTemplate(waypoint);
        replace(this._waypointEdit, this._waypointElement);
        this._renderBonusOptionEditMode(waypoint);

        this._waypointEdit.setWaypointEditInputHandler((data, target) => {
          updateWaypoint(data, target);
        });
      }
      if (mode === WaypointMode.VIEW) {
        this._waypointElement = new SiteTripEvent(waypoint);
        replace(this._waypointElement, this._waypointEdit);
        waypoint.bonusOptions.forEach((item) => {
          const optionCount = this._waypointElement.getElement().querySelectorAll(`.event__offer`).length;
          if (item.used && optionCount < MAX_OFFERS_IN_VIEW_MODE) {
            render(this._waypointElement.getElement().querySelector(`.event__selected-offers`), new SiteEventTitleTemplate(item));
          }
        });
      }
    };

    const updateWaypoint = (data, target) => {
      const noChangeWaypointEdit = this._waypointEdit;
      this._waypointEdit = new SiteEditEventTemplate(data);
      replace(this._waypointEdit, noChangeWaypointEdit);
      const elemFocus = this._waypointEdit.getElement().querySelector(`.${target.classList[target.classList.length - 1]}`);
      if (elemFocus.tagName === `INPUT`) {
        elemFocus.focus();
        elemFocus.selectionStart = elemFocus.value.length;
      }
      this._renderBonusOptionEditMode(data);
      setEditModeListener();
      this._waypointEdit.setWaypointEditInputHandler((data1, target1) => {
        updateWaypoint(data1, target1);
      });
    };

    const setEditModeListener = () => {
      this._waypointElement.setRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.EDIT);
        setEditModeListener();
      });
      this._waypointEdit.setRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      });
      this._waypointEdit.setFormSubmitHandler(() => {
        this._waypointEdit.saveDataMode(true, this._travelDays);
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      });
      document.addEventListener(`keydown`, onDocumentKeydown);
    };

    const setNormalModeListener = () => {
      this._waypointElement.setRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.EDIT);
        setEditModeListener();
      });
      this._waypointEdit.removeRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      });
      this._waypointEdit.removeFormSubmitHandler(() => {
        this._waypointEdit.saveDataMode(true, this._travelDays);
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

    this._waypointElement.setRollupButtonClickHandler(() => {
      replaceWaypointMode(WaypointMode.EDIT);
      setEditModeListener();
    });
    render(dayWrapper, this._waypointElement);
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

  _renderBonusOptionEditMode(waypoint) {
    const {bonusOptions} = waypoint;
    const bonusOptionWrapper = this._mainWrapper.querySelectorAll(`.event__available-offers`);
    bonusOptionWrapper.forEach((item) => {
      item.innerHTML = ``;
    });
    const lastBonusOptionWrapper = bonusOptionWrapper[bonusOptionWrapper.length - 1];
    for (let bonusOption of bonusOptions) {
      render(lastBonusOptionWrapper, new SiteEventTemplate(bonusOption));
    }
  }
}
