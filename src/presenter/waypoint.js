import SiteTripEvent from "../view/site-trip-event";
import SiteEditEventTemplate from "../view/site-edit-event";
import {
  defaultWaypoint,
  KeyboardKey,
  MAX_OFFERS_IN_VIEW_MODE,
  RenderPosition,
  TRANSFER_TYPE,
  WaypointMode,
} from "../const";
import {remove, render, replace} from "../util/render-function";
import SiteEventTemplate from "../view/site-event";
import SiteEventTitleTemplate from "../view/site-event-title";
import SiteWaypointDestinationTemplate from "../view/site-waypoint-destination";
import SiteEventPhotoTemplate from "../view/site-event-photo";
import {getCapitalizedWord, getOffers, getWaypointDestination, updateWaypoints} from "../util/data-function";
import SiteWaypointTemplate from "../view/site-waypoint";
import Header from "./header";

export default class Waypoint {
  constructor(api, offers, waypoint, waypointsModel, position = RenderPosition.BEFOREEND) {
    this.onRollupButtonEditClickHandler = this.onRollupButtonEditClickHandler.bind(this);
    this._documentKeydownListener = this._documentKeydownListener.bind(this);
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
    this._position = position;
    this._api = api;
    this._newWaypoint = new SiteWaypointTemplate();
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
    this._waypoints = waypointsModel;
    this._offersAll = offers;
    this._waypoint = waypoint;
    this._callback = {};
    if (this._waypoint === undefined) {
      this._waypoint = defaultWaypoint;
    }
  }

  set renderAllWaypointsInViewMode(callback) {
    this._callback.editMode = callback;
  }

  set renderNewWaypointInViewMode(callback) {
    this._callback.renderNewWaypointView = callback;
  }

  set resetNewWaypointBtn(callback) {
    this._callback.resetNewWaypointBtn = callback;
  }

  set removeDay(callback) {
    this._callback.removeDay = callback;
  }

  set renderDayWrappers(callback) {
    this._callback.renderDayWrappers = callback;
  }

  renderWaypoint(mode = WaypointMode.VIEW) {
    let trimEventItem = this._sortWrapper.querySelectorAll(`.trip-events__list`);
    if (this._position === RenderPosition.BEFOREEND) {
      trimEventItem = trimEventItem[trimEventItem.length - 1];
    } else {
      trimEventItem = trimEventItem[0];
    }
    this.renderWaypointMode(trimEventItem, mode);
  }

  renderWaypointMode(dayWrapper, mode = WaypointMode.VIEW) {
    this._waypointElement = new SiteTripEvent(this._waypoint);
    this._waypointEdit = new SiteEditEventTemplate(this._waypoint);
    render(dayWrapper, this._waypointElement, this._position);

    if (mode === WaypointMode.VIEW) {
      this._renderBonusOptionViewMode();
      this._waypointElement.setRollupButtonClickHandler(() => {
        this._onRollupButtonViewClickHandler();
      });
    }
    if (mode === WaypointMode.EDIT) {
      this._replaceWaypointMode(WaypointMode.EDIT);
      this._setEditModeListener();
      this._waypointEdit.setRollupButtonClickHandler(() => this.onRollupButtonEditClickHandler());
    }
  }

  renderNewWaypoint() {
    if (!(this._mainWrapper.querySelector(`.trip-events__list`))) {
      this._callback.renderDayWrappers();
    }
    render(this._mainWrapper.querySelector(`.trip-events__list`), this._newWaypoint, RenderPosition.AFTERBEGIN);
    this._renderBonusOptionEditMode(defaultWaypoint, this._newWaypoint, true);
    this._renderDestinationAndPhotoEditMode(defaultWaypoint.destination, this._newWaypoint);
    this._newWaypoint.setSaveButtonSubmitHandler(() => {
      this._api.addWaypoint((this._newWaypoint.saveData())).then((response) => {
        this._waypoints.addWaypoint(response);
        remove(this._newWaypoint);
        this._callback.renderNewWaypointView();
        Header.updateHeader(this._waypoints.getWaypoints());
      }).catch((response) => {
        throw new Error(response);
      });
    });
    this._newWaypoint.setCancelButtonClickHandler(() => {
      remove(this._newWaypoint);
      this._callback.resetNewWaypointBtn();
    });
    document.addEventListener(`keydown`, this._documentKeydownListener);
    this._newWaypoint.setTravelTypeChangeHandler((travelType) => this._updateTravelType(travelType, this._newWaypoint));
    this._newWaypoint.setWaypointTownChangeHandler(() => this._replaceDestinationAndPhotoEditMode(this._newWaypoint));
    this._newWaypoint._setDatepickerStart();
    this._newWaypoint._setDatepickerEnd();
  }

  _replaceWaypointMode(mode = WaypointMode.VIEW) {
    let id = ``;
    if (this._mainWrapper.querySelector(`.event--edit`)) {
      id = this._mainWrapper.querySelector(`.event--edit`).getAttribute(`data-id`);
    }
    if (mode === WaypointMode.EDIT) {
      this._callback.editMode();
      this._waypointEdit = new SiteEditEventTemplate(this._waypoint);
      replace(this._waypointEdit, this._waypointElement);
      this._renderBonusOptionEditMode(this._waypoint);
      this._renderDestinationAndPhotoEditMode();
      this._waypointEdit.setTravelTypeChangeHandler((travelType) => this._updateTravelType(travelType));
      this._waypointEdit.setWaypointTownChangeHandler(() => this._replaceDestinationAndPhotoEditMode());
      this._waypointEdit.setWaypointDeleteClickHandler(() => this._removeWaypoint());
      this._waypointEdit._setDatepickerStart();
      this._waypointEdit._setDatepickerEnd();
    }
    if (mode === WaypointMode.VIEW && id === this._waypoint.id) {
      this._waypointElement = new SiteTripEvent(this._waypoint);
      try {
        replace(this._waypointElement, this._waypointEdit);
      } catch (e) {
        replace(this._waypointElement, this._mainWrapper.querySelector(`.event--edit`));
      }
      this._renderBonusOptionViewMode();
    }
  }

  _setEditModeListener() {
    this._waypointElement.removeRollupButtonClickHandler(() => {
      this._replaceWaypointMode(WaypointMode.EDIT);
      this._setEditModeListener();
    });
    this._waypointEdit.setRollupButtonClickHandler(() => {
      this._replaceWaypointMode();
      this._setNormalModeListener();
    });
    this._waypointEdit.setFormSubmitHandler(() => {
      this._api.updateWaypoint(this._waypointEdit.saveData()).then((response) => {
        updateWaypoints(this._waypoint, response);
        Header.updateHeader(this._waypoints.getWaypoints());
        this._replaceWaypointMode();
        this._setNormalModeListener();
      }).catch((response) => {
        this._replaceWaypointMode();
        this._setNormalModeListener();
        throw new Error(response);
      });
    });
    document.addEventListener(`keydown`, this._onDocumentKeydown);
  }

  _setNormalModeListener() {
    this._waypointElement.setRollupButtonClickHandler(() => {
      this._replaceWaypointMode(WaypointMode.EDIT);
      this._setEditModeListener();
    });
    this._waypointEdit.removeRollupButtonClickHandler(() => {
      this._replaceWaypointMode();
      this._setNormalModeListener();
    });
    this._waypointEdit.removeFormSubmitHandler(() => {
      this._replaceWaypointMode();
      this._setNormalModeListener();
    });
    document.removeEventListener(`keydown`, this._onDocumentKeydown);
  }

  _onDocumentKeydown(evt) {
    if (evt.code === KeyboardKey.ESCAPE) {
      this._replaceWaypointMode();
      this._setNormalModeListener();
      document.removeEventListener(`keydown`, this._onDocumentKeydown);
    }
  }

  _renderBonusOptionEditMode(waypoint, element = this._waypointEdit, defaultMode = false) {
    let {bonusOptions} = waypoint;
    if (defaultMode) {
      bonusOptions = getOffers(defaultWaypoint.type, this._offersAll);
    }
    const bonusOptionWrapper = element.getElement().querySelectorAll(`.event__available-offers`);
    bonusOptionWrapper.forEach((item) => {
      item.innerHTML = ``;
    });
    const lastBonusOptionWrapper = element.getElement().querySelector(`.event__available-offers`);
    for (let bonusOption of bonusOptions) {
      render(lastBonusOptionWrapper, new SiteEventTemplate(bonusOption));
    }
  }

  _renderDestinationAndPhotoEditMode(destination = this._waypoint.destination, element = this._waypointEdit) {
    this._waypointDestination = new SiteWaypointDestinationTemplate(destination.description);
    render(element.getElement().querySelector(`.event__details`), this._waypointDestination);
    destination.photos.forEach((item) => {
      render(this._waypointDestination.getElement().querySelector(`.event__photos-tape`), new SiteEventPhotoTemplate(item));
    });
  }

  _renderBonusOptionViewMode() {
    this._waypoint.bonusOptions.forEach((item) => {
      const optionCount = this._waypointElement.getElement().querySelectorAll(`.event__offer`).length;
      if (item.used && optionCount < MAX_OFFERS_IN_VIEW_MODE) {
        render(this._waypointElement.getElement().querySelector(`.event__selected-offers`), new SiteEventTitleTemplate(item));
      }
    });
  }

  _replaceDestinationAndPhotoEditMode(element = this._waypointEdit) {
    const waypointDescription = getWaypointDestination(element.getElement().querySelector(`.event__input--destination`).value);
    remove(this._waypointDestination);
    this._renderDestinationAndPhotoEditMode(waypointDescription, element);
  }

  _updateTravelType(travelType, element = this._waypointEdit) {
    const img = element.getElement().querySelector(`.event__type-icon`);
    const text = element.getElement().querySelector(`.event__label`);
    this._avatarInput = element.getElement().querySelector(`.event__type-toggle`);
    img.setAttribute(`src`, `img/icons/${travelType}.png`);
    text.textContent = `${getCapitalizedWord(travelType)} ${TRANSFER_TYPE.indexOf(getCapitalizedWord(travelType)) !== -1 ? `to` : `in`}`;
    this._avatarInput.setAttribute(`data-type`, travelType);
    this._updateOffers(travelType, element);
  }

  _updateOffers(type, element) {
    const updateWaypoint = Object.assign({}, this._waypoint);
    updateWaypoint.type = type;
    updateWaypoint.bonusOptions = getOffers(updateWaypoint.type, this._offersAll);
    this._renderBonusOptionEditMode(updateWaypoint, element);
  }

  onRollupButtonEditClickHandler() {
    this._replaceWaypointMode();
    this._setNormalModeListener();
  }

  _onRollupButtonViewClickHandler() {
    this._replaceWaypointMode(WaypointMode.EDIT);
    this._setEditModeListener();
  }

  _removeWaypoint() {
    this._api.deleteWaypoint(this._waypoint).then(() => {
      this._waypoints.deleteWaypoint(this._waypoint);
      this._waypointEdit.getElement().remove();
      this._waypointElement.getElement().remove();
      this._callback.removeDay();
    }).catch((response) => {
      throw new Error(response);
    });
  }

  _documentKeydownListener(evt) {
    if (evt.code === KeyboardKey.ESCAPE) {
      remove(this._newWaypoint);
      this._callback.resetNewWaypointBtn();
      document.removeEventListener(`keydown`, this._documentKeydownListener);
    }
  }
}
