import Abstract from "./abstract";
import {MouseKey} from "../const";

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
          ${type} to
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${town}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime.getDate()}/${startTime.getMonth() < 9 ? `0` + startTime.getMonth() : startTime.getMonth()}/${startTime.getFullYear().toString().slice(-2)} ${startTime.getHours() < 9 ? `0` + startTime.getHours() : startTime.getHours()}:${startTime.getMinutes() < 9 ? `0` + startTime.getMinutes() : startTime.getMinutes()}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime.getDate()}/${endTime.getMonth() < 9 ? `0` + endTime.getMonth() : endTime.getMonth()}/${endTime.getFullYear().toString().slice(-2)} ${endTime.getHours() < 9 ? `0` + endTime.getHours() : endTime.getHours()}:${endTime.getMinutes() < 9 ? `0` + endTime.getMinutes() : endTime.getMinutes()}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
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
    this._currentEditData = Object.assign({}, waypoint);
    this._waypoint = Object.assign({}, waypoint);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);
    this._importantMarkClickHandler = this._importantMarkClickHandler.bind(this);
    this._waypointEditInputHandler = this._waypointEditInputHandler.bind(this);
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
    if (evt.button === MouseKey.LEFT) {
      this._callback.importantMarkClick();
    }
  }

  _waypointEditInputHandler(evt) {
    const target = evt.target;
    if (target.classList.contains(`event__type-toggle`)) {
      this._dropBoxOpen = !this._dropBoxOpen;
    }
    this.saveDataMode();
    this._callback.travelTypeChange(this._currentEditData, target);
  }

  saveDataMode(saveInMock = false, mock) {
    const bonusOptions = [];
    const importantMode = this.getElement().querySelector(`.event__favorite-checkbox`).checked;
    const price = Number(this.getElement().querySelector(`.event__input--price`).value);
    const type = this.getElement().querySelector(`.event__type-toggle`).getAttribute(`data-type`);
    const town = this.getElement().querySelector(`.event__input--destination`).value;
    const offers = this.getElement().querySelectorAll(`.event__offer-selector`);
    const offersName = this.getElement().querySelectorAll(`.event__offer-title`);
    const offersPrice = this.getElement().querySelectorAll(`.event__offer-price`);
    const offersChecked = this.getElement().querySelectorAll(`.event__offer-checkbox`);
    offers.forEach((bonusOptionItem, index) => {
      bonusOptions.push({
        name: offersName[index].textContent,
        price: offersPrice[index].textContent,
        used: offersChecked[index].checked,
      });
    });
    if (saveInMock) {
      mock.forEach((item) => {
        item.waypoints.forEach((waypointsItem) => {
          if (waypointsItem.id === this.getElement().getAttribute(`data-id`)) {
            waypointsItem.important = importantMode;
            waypointsItem.price = price;
            waypointsItem.type = type;
            waypointsItem.town = town;
            waypointsItem.bonusOptions = bonusOptions;
          }
        });
      });
    } else {
      this._currentEditData.important = importantMode;
      this._currentEditData.price = price;
      this._currentEditData.type = type;
      this._currentEditData.town = town;
      this._currentEditData.bonusOptions = bonusOptions;
    }
  }

  getTemplate() {
    const {type, town, startTime, endTime, important, id} = this._waypoint;
    let {price} = this._waypoint;
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
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" data-type="${type}" ${this._dropBoxOpen ? `checked` : ``}>

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
          ${type} to
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${town}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime.getDate()}/${startTime.getMonth() < 9 ? `0` + startTime.getMonth() : startTime.getMonth()}/${startTime.getFullYear().toString().slice(-2)} ${startTime.getHours() < 9 ? `0` + startTime.getHours() : startTime.getHours()}:${startTime.getMinutes() < 9 ? `0` + startTime.getMinutes() : startTime.getMinutes()}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime.getDate()}/${endTime.getMonth() < 9 ? `0` + endTime.getMonth() : endTime.getMonth()}/${endTime.getFullYear().toString().slice(-2)} ${endTime.getHours() < 9 ? `0` + endTime.getHours() : endTime.getHours()}:${endTime.getMinutes() < 9 ? `0` + endTime.getMinutes() : endTime.getMinutes()}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
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
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupButtonClickHandler);
  }

  setImportantMarkClickHandler(callback) {
    this._callback.importantMarkClick = callback;
    this.getElement().querySelector(`.event__favorite-icon`).addEventListener(`click`, this._importantMarkClickHandler);
  }

  setWaypointEditInputHandler(callback) {
    this._callback.travelTypeChange = callback;
    this.getElement().addEventListener(`input`, this._waypointEditInputHandler);
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
}
