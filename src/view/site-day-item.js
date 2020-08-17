import Abstract from "./abstract";

const createSiteDayItem = (waypoint) => {
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

export default class SiteDayItem extends Abstract {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;
  }

  getTemplate() {
    return createSiteDayItem(this._waypoint);
  }
}
