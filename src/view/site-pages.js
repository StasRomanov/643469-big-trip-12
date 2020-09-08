import Abstract from "./abstract";
import {MouseKey} from "../const";

const createSitePagesTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
    <a class="trip-tabs__btn" href="#">Stats</a>
  </nav>`;
};

export default class SitePagesTemplate extends Abstract {
  constructor() {
    super();
    this._tableButton = this.getElement().querySelectorAll(`.trip-tabs__btn`)[0];
    this._statsButton = this.getElement().querySelectorAll(`.trip-tabs__btn`)[1];
    this._tableClickListener = this._tableClickListener.bind(this);
    this._statsClickListener = this._statsClickListener.bind(this);
  }

  getTemplate() {
    return createSitePagesTemplate();
  }

  setTableClickListener(callback) {
    this._callback.tableClick = callback;
    this._tableButton.addEventListener(`click`, this._tableClickListener);
  }

  setStatsClickListener(callback) {
    this._callback.statsClick = callback;
    this._statsButton.addEventListener(`click`, this._statsClickListener);
  }

  _tableClickListener(evt) {
    if (evt.button === MouseKey.LEFT) {
      evt.preventDefault();
      this._statsButton.classList.remove(`trip-tabs__btn--active`);
      this._tableButton.classList.add(`trip-tabs__btn--active`);
      this._callback.tableClick();
    }
  }

  _statsClickListener(evt) {
    if (evt.button === MouseKey.LEFT) {
      evt.preventDefault();
      this._statsButton.classList.add(`trip-tabs__btn--active`);
      this._tableButton.classList.remove(`trip-tabs__btn--active`);
      this._callback.statsClick();
    }
  }
}
