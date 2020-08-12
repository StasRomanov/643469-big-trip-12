import {createElement} from "../utilFunction";

export const createSiteDayItem = (waypoint) => {
  const {day, date} = waypoint;
  const options = {
    month: `short`,
  };
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day + 1}</span>
        <time class="day__date" datetime="2019-03-18">${date.toLocaleString(`en`, options).toUpperCase()} ${date.getDate()}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
};

export default class SiteDayItem {
  constructor(waypoint) {
    this._element = null;
    this._waypoint = waypoint;
  }

  getTemplate() {
    return createSiteDayItem(this._waypoint);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
