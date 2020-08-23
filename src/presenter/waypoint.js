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
        const {bonusOptions} = waypoint;
        const bonusOptionWrapper = this._mainWrapper.querySelectorAll(`.event__available-offers`);
        bonusOptionWrapper.forEach((item) => {
          item.innerHTML = ``;
        });
        const lastBonusOptionWrapper = bonusOptionWrapper[bonusOptionWrapper.length - 1];
        for (let bonusOption of bonusOptions) {
          render(lastBonusOptionWrapper, new SiteEventTemplate(bonusOption));
        }
        this._waypointEdit.setTravelTypeChangeHandler((travelType) => editTravelMode(travelType));
      }
      if (mode === WaypointMode.VIEW) {
        this._waypointElement = new SiteTripEvent(waypoint);
        replace(this._waypointElement, this._waypointEdit);
      }
    };

    const editTravelMode = (travelType) => {
      const img = this._waypointEdit.getElement().querySelector(`.event__type-icon`);
      const text = this._waypointEdit.getElement().querySelector(`.event__label`);
      this._avatarInput = this._waypointEdit.getElement().querySelector(`.event__type-toggle`);
      img.setAttribute(`src`, `img/icons/${travelType}.png`);
      text.textContent = `${travelType[0].toUpperCase() + travelType.slice(1)} to`;
      this._avatarInput.setAttribute(`data-type`, travelType);
    };

    const saveMode = () => {
      this._travelDays.forEach((item) => {
        item.waypoints.forEach((waypointsItem) => {
          if (waypointsItem.id === this._waypointEdit.getElement().getAttribute(`data-id`)) {
            const bonusOptions = [];
            const importantMode = this._waypointEdit.getElement().querySelector(`.event__favorite-checkbox`).checked;
            const price = Number(this._waypointEdit.getElement().querySelector(`.event__input--price`).value);
            const type = this._avatarInput.getAttribute(`data-type`);
            const town = this._waypointEdit.getElement().querySelector(`.event__input--destination`).value;
            const offers = this._waypointEdit.getElement().querySelectorAll(`.event__offer-selector`);
            const offersName = this._waypointEdit.getElement().querySelectorAll(`.event__offer-title`);
            const offersPrice = this._waypointEdit.getElement().querySelectorAll(`.event__offer-price`);
            const offersChecked = this._waypointEdit.getElement().querySelectorAll(`.event__offer-checkbox`);
            offers.forEach((bonusOptionItem, index) => {
              bonusOptions.push({
                name: offersName[index].textContent,
                price: offersPrice[index].textContent,
                used: offersChecked[index].checked,
              });
            });
            waypointsItem.important = importantMode;
            waypointsItem.price = price;
            waypointsItem.type = type;
            waypointsItem.town = town;
            waypointsItem.bonusOptions = bonusOptions;
          }
        });
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
        saveMode();
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
        saveMode();
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
}
