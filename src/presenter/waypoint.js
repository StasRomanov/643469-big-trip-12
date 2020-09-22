import SiteTripEvent from "../view/site-trip-event";
import SiteEditEvent from "../view/site-edit-event";
import {
  defaultWaypoint,
  KeyboardKey,
  MAX_OFFERS_IN_VIEW_MODE,
  RenderPosition,
  TRANSFER_TYPES,
  WaypointAction,
  WaypointMode,
} from "../const";
import {remove, render, replace} from "../util/render-function";
import SiteEvent from "../view/site-event";
import SiteEventTitle from "../view/site-event-title";
import SiteWaypointDestination from "../view/site-waypoint-destination";
import SiteEventPhoto from "../view/site-event-photo";
import {
  getCapitalizedWord,
  getOffers,
  getWaypointDestination,
  updateWaypointImportantStatus,
  updateWaypoints,
} from "../util/data-function";
import SiteWaypoint from "../view/site-waypoint";
import Header from "./header";

export default class Waypoint {
  constructor(api, offers, waypoint, waypointsModel, position = RenderPosition.BEFOREEND) {
    this.onRollupButtonEditClickHandler = this.onRollupButtonEditClickHandler.bind(this);
    this._onDocumentKeydownEscHandler = this._onDocumentKeydownEscHandler.bind(this);
    this._onDocumentKeydownHandler = this._onDocumentKeydownHandler.bind(this);
    this._position = position;
    this._api = api;
    this._newWaypoint = new SiteWaypoint();
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

  set resetTable(callback) {
    this._callback.resetTable = callback;
  }

  renderWaypoint(mode = WaypointMode.VIEW) {
    const trimEventItem = this._position === RenderPosition.BEFOREEND ?
      this._sortWrapper.querySelectorAll(`.trip-events__list`)[this._sortWrapper.querySelectorAll(`.trip-events__list`).length - 1] :
      this._sortWrapper.querySelectorAll(`.trip-events__list`)[0];
    this.renderWaypointMode(trimEventItem, mode);
  }

  renderWaypointMode(dayWrapper, mode = WaypointMode.VIEW) {
    this._waypointElement = new SiteTripEvent(this._waypoint);
    this._waypointEdit = new SiteEditEvent(this._waypoint);
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
      this._newWaypoint.disableAll();
      this._newWaypoint.setSavingMode();
      this._newWaypoint.removeErrorMode();
      this._api.addWaypoint((this._newWaypoint.saveData())).then((response) => {
        this._newWaypoint.setSavingMode(false);
        this._newWaypoint.disableAll(false);
        this._waypoints.addWaypoint(response);
        remove(this._newWaypoint);
        this._callback.renderNewWaypointView();
        Header.updateHeader(this._waypoints.getWaypoints());
        Header.updateFilter(this._waypoints.getWaypoints());
      }).catch(() => {
        this._errorMode(WaypointAction.SAVE, this._newWaypoint);
      });
    });
    this._newWaypoint.setCancelButtonClickHandler(() => {
      remove(this._newWaypoint);
      this._callback.resetNewWaypointBtn();
    });
    document.addEventListener(`keydown`, this._onDocumentKeydownEscHandler);
    this._newWaypoint.setTravelTypeChangeHandler((travelType) => this._updateTravelType(travelType, this._newWaypoint));
    this._newWaypoint.setWaypointTownChangeHandler(() => this._replaceDestinationAndPhotoEditMode(this._newWaypoint));
    this._newWaypoint._setDatepickerStart();
    this._newWaypoint._setDatepickerEnd();
  }

  onRollupButtonEditClickHandler() {
    this._replaceWaypointMode();
    this._setNormalModeListener();
  }

  _replaceWaypointMode(mode = WaypointMode.VIEW) {
    let id = ``;
    if (this._mainWrapper.querySelector(`.event--edit`)) {
      id = this._mainWrapper.querySelector(`.event--edit`).getAttribute(`data-id`);
    }
    if (mode === WaypointMode.EDIT) {
      this._callback.editMode();
      this._waypointEdit = new SiteEditEvent(this._waypoint);
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
    this._waypointEdit.setImportantMarkClickHandler((important) => {
      updateWaypointImportantStatus(this._waypoint, important);
      this._api.updateWaypoint(this._waypoint).then(() => {
        this._waypointEdit.setSavingMode(false);
        this._waypointEdit.disableAll(false);
      }).catch(() => {
        this._errorMode(WaypointAction.SAVE);
      });
    });
    this._waypointEdit.setFormSubmitHandler(() => {
      this._waypointEdit.disableAll();
      this._waypointEdit.setSavingMode();
      this._waypointEdit.removeErrorMode();
      this._api.updateWaypoint(this._waypointEdit.saveData()).then((response) => {
        this._waypointEdit.setSavingMode(false);
        this._waypointEdit.disableAll(false);
        updateWaypoints(this._waypoint, response);
        Header.updateHeader(this._waypoints.getWaypoints());
        Header.updateFilter(this._waypoints.getWaypoints());
        this._replaceWaypointMode();
        this._setNormalModeListener();
        this._callback.resetTable();
      }).catch(() => {
        this._errorMode(WaypointAction.SAVE);
      });
    });
    document.addEventListener(`keydown`, this._onDocumentKeydownHandler);
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
    document.removeEventListener(`keydown`, this._onDocumentKeydownHandler);
  }

  _onDocumentKeydownHandler(evt) {
    if (evt.code === KeyboardKey.ESCAPE) {
      this._replaceWaypointMode();
      this._setNormalModeListener();
      document.removeEventListener(`keydown`, this._onDocumentKeydownHandler);
    }
  }

  _renderBonusOptionEditMode(waypoint, element = this._waypointEdit, defaultMode = false) {
    let {bonusOptions} = waypoint;
    if (defaultMode) {
      bonusOptions = getOffers(defaultWaypoint.type, this._offersAll);
    }
    const bonusOptionsWrappers = element.getElement().querySelectorAll(`.event__available-offers`);
    bonusOptionsWrappers.forEach((item) => {
      item.innerHTML = ``;
    });
    const lastBonusOptionWrapper = element.getElement().querySelector(`.event__available-offers`);
    for (const bonusOption of bonusOptions) {
      render(lastBonusOptionWrapper, new SiteEvent(bonusOption));
    }
  }

  _renderDestinationAndPhotoEditMode(destination = this._waypoint.destination, element = this._waypointEdit) {
    this._waypointDestination = new SiteWaypointDestination(destination.description);
    render(element.getElement().querySelector(`.event__details`), this._waypointDestination);
    destination.photos.forEach((item) => {
      render(this._waypointDestination.getElement().querySelector(`.event__photos-tape`), new SiteEventPhoto(item));
    });
  }

  _renderBonusOptionViewMode() {
    this._waypoint.bonusOptions.forEach((item) => {
      const optionCount = this._waypointElement.getElement().querySelectorAll(`.event__offer`).length;
      if (item.used && optionCount < MAX_OFFERS_IN_VIEW_MODE) {
        render(this._waypointElement.getElement().querySelector(`.event__selected-offers`), new SiteEventTitle(item));
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
    text.textContent = `${getCapitalizedWord(travelType)} ${TRANSFER_TYPES.indexOf(getCapitalizedWord(travelType)) !== -1 ? `to` : `in`}`;
    this._avatarInput.setAttribute(`data-type`, travelType);
    this._updateOffers(travelType, element);
  }

  _updateOffers(type, element) {
    const updateWaypoint = Object.assign({}, this._waypoint);
    updateWaypoint.type = type;
    updateWaypoint.bonusOptions = getOffers(updateWaypoint.type, this._offersAll);
    this._renderBonusOptionEditMode(updateWaypoint, element);
  }

  _errorMode(toggle = WaypointAction.SAVE, waypointMode = this._waypointEdit) {
    if (toggle === WaypointAction.REMOVE) {
      waypointMode.setRemovingMode(false);
    } else {
      waypointMode.setSavingMode(false);
    }
    waypointMode.disableAll(false);
    waypointMode.setErrorMode();
  }

  _onRollupButtonViewClickHandler() {
    this._replaceWaypointMode(WaypointMode.EDIT);
    this._setEditModeListener();
  }

  _removeWaypoint() {
    this._waypointEdit.disableAll();
    this._waypointEdit.setRemovingMode();
    this._waypointEdit.removeErrorMode();
    this._api.deleteWaypoint(this._waypoint).then(() => {
      this._waypointEdit.disableAll(true);
      this._waypointEdit.setRemovingMode(true);
      this._waypoints.deleteWaypoint(this._waypoint);
      Header.updateHeader(this._waypoints.getWaypoints());
      Header.updateFilter(this._waypoints.getWaypoints());
      this._waypointEdit.getElement().remove();
      this._waypointElement.getElement().remove();
      this._callback.removeDay();
    }).catch(() => {
      this._errorMode();
    });
  }

  _onDocumentKeydownEscHandler(evt) {
    if (evt.code === KeyboardKey.ESCAPE) {
      remove(this._newWaypoint);
      this._callback.resetNewWaypointBtn();
      document.removeEventListener(`keydown`, this._onDocumentKeydownEscHandler);
    }
  }
}
