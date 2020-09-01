import Abstract from "./abstract";
import moment from "moment";

const createSiteDayItem = (waypoint) => {
  const {day, date} = waypoint;
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${day + 1}</span>
        <time class="day__date" datetime="2019-03-18">${moment(date).format(`MMMM DD`)}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
};

export default class SiteDayItem extends Abstract {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;
  }

  getTemplate() {
    return createSiteDayItem(this._waypoint);
  }
}
