import Abstract from "./abstract";
import {ERROR_STYLE, MouseKey, TOWNS} from "../const";
import moment from "moment";
import he from "he";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import {getEventTypeLabel} from "../util/data-function";

const createSiteEditEventTemplate = (waypoint) => {
  const {type, town, startTime, endTime, important, id} = waypoint;
  let {price} = waypoint;
  if (isNaN(price)) {
    price = 0;
  }
  return `<form class="event  event--edit" action="#" method="post" data-id="${id}">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" data-type="${type}">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>

            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === `Taxi` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === `Bus` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === `Train` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === `Ship` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport" ${type === `Transport` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === `Drive` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === `Flight` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
            </div>
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>

            <div class="event__type-item">
              <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === `Check-in` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === `Sightseeing` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
            </div>

            <div class="event__type-item">
              <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === `Restaurant` ? `checked` : ``}>
              <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
            </div>
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${getEventTypeLabel(type)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(town)}" list="destination-list-1" autocomplete="off">
        <datalist id="destination-list-1">
        ${TOWNS.map((townName) => `<option value="${townName}"></option>`).join(``)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input readonly="readonly" class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(startTime).format(`DD/MM/YY HH:mm`)}" data-time="${startTime}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input readonly="readonly" class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(endTime).format(`DD/MM/YY HH:mm`)}" data-time="${endTime}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" pattern="[0-9]*">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${important ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>

    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers"></div>
      </section>
    </section>
  </form>`;
};

export default class SiteEditEventTemplate extends Abstract {
  constructor(waypoint) {
    super();
    this._dropBoxOpen = false;
    this._datepickerStart = null;
    this._datepickerEnd = null;
    this._currentEditData = Object.assign({}, waypoint);
    this._waypoint = Object.assign({}, waypoint);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._importantMarkClickHandler = this._importantMarkClickHandler.bind(this);
    this._waypointEditInputHandler = this._waypointEditInputHandler.bind(this);
    this._travelTypeChangeHandler = this._travelTypeChangeHandler.bind(this);
    this._waypointTownChangeHandler = this._waypointTownChangeHandler.bind(this);
    this._dueDateStartChangeHandler = this._dueDateStartChangeHandler.bind(this);
    this._dueDateEndChangeHandler = this._dueDateEndChangeHandler.bind(this);
    this._waypointDeleteChangeHandler = this._waypointDeleteChangeHandler.bind(this);
  }

  setImportantMarkClickHandler(callback) {
    this._callback.importantMarkClick = callback;
    this.getElement().querySelector(`.event__favorite-icon`).addEventListener(`click`, this._importantMarkClickHandler);
  }

  setTravelTypeChangeHandler(callback) {
    this._callback.travelTypeChange = callback;
    this.getElement().addEventListener(`change`, this._travelTypeChangeHandler);
  }

  saveData() {
    const updateWaypoint = {
      id: this.getElement().getAttribute(`data-id`),
      bonusOptions: [],
      destination: {
        description: this.getElement().querySelector(`.event__destination-description`).getAttribute(`data-description`),
        name: this.getElement().querySelector(`.event__input--destination`).value,
        photos: [],
      },
      important: false,
      price: Number(this.getElement().querySelector(`.event__input--price`).value),
      type: this.getElement().querySelector(`.event__type-toggle`).getAttribute(`data-type`),
      town: this.getElement().querySelector(`.event__input--destination`).value,
      startTime: this.getElement().querySelector(`#event-start-time-1`).getAttribute(`data-time`),
      endTime: this.getElement().querySelector(`#event-end-time-1`).getAttribute(`data-time`),
      description: this.getElement().querySelector(`.event__destination-description`).getAttribute(`data-description`),
    };
    if (this.getElement().querySelector(`.event__favorite-checkbox`)) {
      updateWaypoint.important = this.getElement().querySelector(`.event__favorite-checkbox`).checked;
    }
    const offers = this.getElement().querySelectorAll(`.event__offer-selector`);
    const offersName = this.getElement().querySelectorAll(`.event__offer-title`);
    const offersPrice = this.getElement().querySelectorAll(`.event__offer-price`);
    const offersChecked = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    this.getElement().querySelectorAll(`.event__photo`).forEach((item) => {
      updateWaypoint.destination.photos.push({
        src: item.getAttribute(`src`),
        description: item.getAttribute(`alt`),
      });
    });

    offers.forEach((bonusOptionItem, index) => {
      updateWaypoint.bonusOptions.push({
        name: offersName[index].textContent,
        price: offersPrice[index].textContent,
        used: offersChecked[index].checked,
      });
    });
    return updateWaypoint;
  }

  getTemplate() {
    return createSiteEditEventTemplate(this._waypoint);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupButtonClickHandler);
  }

  setWaypointEditInputHandler(callback) {
    this._callback.travelTypeChange = callback;
    this.getElement().addEventListener(`change`, this._waypointEditInputHandler);
  }

  removeFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().removeEventListener(`submit`, this._formSubmitHandler);
  }

  removeRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, this._rollupButtonClickHandler);
  }

  removeImportantMarkClickHandler(callback) {
    this._callback.importantMarkClick = callback;
    this.getElement().querySelector(`.event__favorite-icon`).removeEventListener(`click`, this._importantMarkClickHandler);
  }

  setWaypointTownChangeHandler(callback) {
    this._callback.townChange = callback;
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._waypointTownChangeHandler);
  }

  setWaypointDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._waypointDeleteChangeHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  _rollupButtonClickHandler(evt) {
    if (evt.button === MouseKey.LEFT) {
      this._callback.rollupButtonClick();
    }
  }

  _importantMarkClickHandler(evt) {
    if (evt.button === MouseKey.LEFT && this.getElement().querySelector(`.event__favorite-checkbox`)) {
      const importantStatusDefault = this.getElement().querySelector(`.event__favorite-checkbox`).checked;
      this._callback.importantMarkClick(!importantStatusDefault);
    }
  }

  _waypointEditInputHandler(evt) {
    const target = evt.target;
    if (target.classList.contains(`event__type-toggle`)) {
      this._dropBoxOpen = !this._dropBoxOpen;
    }
    this._callback.travelTypeChange(this._currentEditData, target);
  }

  _travelTypeChangeHandler(evt) {
    const target = evt.target;
    if (target.classList.contains(`event__type-input`)) {
      const targetValue = target.getAttribute(`value`);
      this._callback.travelTypeChange(targetValue);
    }
  }

  _waypointTownChangeHandler() {
    if (TOWNS.indexOf(this.getElement().querySelector(`.event__input--destination`).value) === -1) {
      this.getElement().querySelector(`.event__input--destination`).setCustomValidity(`Выбранный город отсутствует в списке`);
      this.getElement().querySelector(`.event__save-btn`).setAttribute(`disable`, `true`);
    } else {
      this.getElement().querySelector(`.event__input--destination`).setCustomValidity(``);
      this.getElement().querySelector(`.event__save-btn`).removeAttribute(`disable`);
      this._callback.townChange();
    }
  }

  _setDatepickerStart() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    this._datepickerStart = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          defaultDate: this._waypoint.startTime,
          enableTime: true,
          [`time_24hr`]: true,
          altFormat: `F j, Y`,
          dateFormat: `d/m/y H:i`,
          onChange: this._dueDateStartChangeHandler,
        }
    );
    this._datepickerStart.set(`maxDate`, this._getEndDate());
  }

  _setDatepickerEnd() {
    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }

    this._datepickerEnd = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          defaultDate: this._waypoint.endTime,
          enableTime: true,
          [`time_24hr`]: true,
          altFormat: `F j, Y`,
          dateFormat: `d/m/y H:i`,
          onChange: this._dueDateEndChangeHandler,
        }
    );
    this._datepickerEnd.set(`minDate`, this._getStartDate());
  }

  _dueDateStartChangeHandler(selectedDates) {
    this.getElement().querySelector(`#event-start-time-1`).setAttribute(`data-time`, selectedDates[0].toISOString());
    this._datepickerEnd.set(`minDate`, selectedDates[0].toISOString());
  }

  _dueDateEndChangeHandler(selectedDates) {
    this.getElement().querySelector(`#event-end-time-1`).setAttribute(`data-time`, selectedDates[0].toISOString());
    this._datepickerStart.set(`maxDate`, selectedDates[0].toISOString());
  }

  _getEndDate() {
    return this.getElement().querySelector(`#event-end-time-1`).getAttribute(`data-time`);
  }

  _getStartDate() {
    return this.getElement().querySelector(`#event-start-time-1`).getAttribute(`data-time`);
  }

  _waypointDeleteChangeHandler() {
    this._callback.deleteClick();
  }

  disableAll(toggle = true) {
    this._fields = [
      this.getElement().querySelector(`.event__type-toggle`),
      this.getElement().querySelector(`.event__save-btn`),
      this.getElement().querySelector(`.event__reset-btn`),
    ];
    this.getElement().querySelectorAll(`.event__input`).forEach((item) => {
      this._fields.push(item);
    });
    this.getElement().querySelectorAll(`.event__offer-checkbox`).forEach((item) => {
      this._fields.push(item);
    });
    if (this.getElement().querySelector(`#event-favorite-1`)) {
      this._fields.push(this.getElement().querySelector(`#event-favorite-1`));
    }
    if (toggle) {
      this._fields.forEach((item) => item.setAttribute(`disabled`, `true`));
    } else {
      this._fields.forEach((item) => item.removeAttribute(`disabled`));
    }
  }

  setSavingMode(toggle = true) {
    if (toggle) {
      this.getElement().querySelector(`.event__save-btn`).textContent = `Saving…`;
    } else {
      this.getElement().querySelector(`.event__save-btn`).textContent = `Save`;
    }
  }

  setRemovingMode(toggle = true) {
    if (toggle) {
      this.getElement().querySelector(`.event__reset-btn`).textContent = `Deleting…`;
    } else {
      this.getElement().querySelector(`.event__reset-btn`).textContent = `Delete`;
    }
  }

  removeErrorMode() {
    this.getElement().removeAttribute(`style`);
  }

  setErrorMode() {
    this.getElement().setAttribute(`style`, ERROR_STYLE);
  }
}
