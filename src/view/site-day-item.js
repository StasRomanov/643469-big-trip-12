import Abstract from "./abstract";
import moment from "moment";

const createSiteDayItem = (dayCount, waypoint) => {
  const {startTime} = waypoint;
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayCount}</span>
        <time class="day__date" datetime="${moment(startTime).format(`MMMM DD`)}">${moment(startTime).format(`MMMM DD`)}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
};

export default class SiteDayItem extends Abstract {
  constructor(dayCount, waypoint) {
    super();
    this._waypoint = waypoint;
    this._dayCount = dayCount;
    if (this._waypoint === undefined && this._dayCount === undefined) {
      this._waypoint = {
        startTime: ``,
      };
      this._dayCount = ``;
      this.getElement().querySelector(`.day__counter`).textContent = ``;
      this.getElement().querySelector(`.day__date`).textContent = ``;
    }
  }

  getTemplate() {
    return createSiteDayItem(this._dayCount, this._waypoint);
  }

  destroy() {
    this.getElement().remove();
  }

  updateDayCount(dayCount) {
    this.getElement().querySelector(`.day__counter`).textContent = dayCount;
  }
}
