import SiteTripEvent from "../view/site-trip-event";
import SiteEditEventTemplate from "../view/site-edit-event";
import {KeyboardKey, MAX_OFFERS_IN_VIEW_MODE, WaypointMode} from "../const";
import {remove, render, replace} from "../util/render-function";
import SiteEventTemplate from "../view/site-event";
import SiteEventTitleTemplate from "../view/site-event-title";
import SiteWaypointDestinationTemplate from "../view/site-waypoint-destination";
import SiteEventPhotoTemplate from "../view/site-event-photo";
import {getOffers, shuffle} from "../util/data-function";

export default class Waypoint {
  constructor(travelDays, offers) {
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
    this._travelDays = travelDays.slice();
    this._offersAll = offers.slice();
  }

  renderWaypointMode(dayWrapper, waypoint) {
    this._waypointElement = new SiteTripEvent(waypoint);
    this._waypointEdit = new SiteEditEventTemplate(waypoint);

    const replaceWaypointMode = (mode = WaypointMode.VIEW) => {
      if (mode === WaypointMode.EDIT) {
        this._waypointEdit = new SiteEditEventTemplate(waypoint);
        replace(this._waypointEdit, this._waypointElement);
        this._renderBonusOptionEditMode(waypoint);
        this._renderDestinationAndPhotoEditMode(waypoint);
        this._waypointEdit.setTravelTypeChangeHandler((travelType) => {
          this._updateTravelType(travelType, waypoint);
        });
        this._waypointEdit.setWaypointTownChangeHandler(() => this._replaceDestinationAndPhotoEditMode(waypoint));
      }
      if (mode === WaypointMode.VIEW) {
        this._waypointElement = new SiteTripEvent(waypoint);
        replace(this._waypointElement, this._waypointEdit);
        this._renderBonusOptionViewMode(waypoint);
      }
    };

    const setEditModeListener = () => {
      this._waypointElement.removeRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.EDIT);
        setEditModeListener();
      });
      this._waypointEdit.setRollupButtonClickHandler(() => {
        replaceWaypointMode(WaypointMode.VIEW);
        setNormalModeListener();
      });
      this._waypointEdit.setFormSubmitHandler(() => {
        this._waypointEdit.saveDataMode(this._travelDays);
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
        this._waypointEdit.saveDataMode(this._travelDays);
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

  _renderDestinationAndPhotoEditMode(waypoint, description = waypoint.description) {
    this._waypointDestination = new SiteWaypointDestinationTemplate(description);
    render(this._waypointEdit.getElement().querySelector(`.event__details`), this._waypointDestination);
    waypoint.photos.forEach((item) => {
      render(this._waypointDestination.getElement().querySelector(`.event__photos-tape`), new SiteEventPhotoTemplate(item));
    });
  }

  _renderBonusOptionViewMode(waypoint) {
    waypoint.bonusOptions.forEach((item) => {
      const optionCount = this._waypointElement.getElement().querySelectorAll(`.event__offer`).length;
      if (item.used && optionCount < MAX_OFFERS_IN_VIEW_MODE) {
        render(this._waypointElement.getElement().querySelector(`.event__selected-offers`), new SiteEventTitleTemplate(item));
      }
    });
  }

  _replaceDestinationAndPhotoEditMode(waypoint) {
    const descriptionShuffle = shuffle(waypoint.description);
    remove(this._waypointDestination);
    this._renderDestinationAndPhotoEditMode(waypoint, descriptionShuffle);
  }

  _updateTravelType(travelType, waypoint) {
    const img = this._waypointEdit.getElement().querySelector(`.event__type-icon`);
    const text = this._waypointEdit.getElement().querySelector(`.event__label`);
    this._avatarInput = this._waypointEdit.getElement().querySelector(`.event__type-toggle`);
    img.setAttribute(`src`, `img/icons/${travelType}.png`);
    text.textContent = `${travelType[0].toUpperCase() + travelType.slice(1)} to`;
    this._avatarInput.setAttribute(`data-type`, travelType);
    this._updateOffers(waypoint, this._offersAll, travelType);
  }

  _updateOffers(waypoint, offersMock, type) {
    const updateWaypoint = Object.assign({}, waypoint);
    updateWaypoint.type = type;
    updateWaypoint.bonusOptions = getOffers(updateWaypoint, offersMock);
    this._renderBonusOptionEditMode(updateWaypoint);
  }
}
