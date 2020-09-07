import Abstract from "./abstract";
import moment from "moment";

const createSiteDayItem = (dayCount, waypoint) => {
  const {startTime} = waypoint;
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayCount}</span>
        <time class="day__date" datetime="2019-03-18">${moment(startTime).format(`MMMM DD`)}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
};

export default class SiteDayItem extends Abstract {
  constructor(dayCount, waypoint) {
    super();
    this._waypoint = waypoint;
    this._dayCount = dayCount;
  }

  getTemplate() {
    return createSiteDayItem(this._dayCount, this._waypoint);
  }
}
