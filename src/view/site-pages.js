import Abstract from "./abstract";
import {MouseKey, PageType} from "../const";

const createSitePagesTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-type="table">Table</a>
    <a class="trip-tabs__btn" href="#" data-type="stats">Stats</a>
  </nav>`;
};

export default class SitePagesTemplate extends Abstract {
  constructor() {
    super();
    this._buttons = Array.from(this.getElement().querySelectorAll(`.trip-tabs__btn`));
    this._tableButton = this._buttons.find((item) => item.getAttribute(`data-type`) === PageType.TABLE);
    this._statsButton = this._buttons.find((item) => item.getAttribute(`data-type`) === PageType.STATS);
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
