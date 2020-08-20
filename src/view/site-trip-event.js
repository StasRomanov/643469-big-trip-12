import SiteEditEventTemplate from "./site-edit-event";

const createSiteTripEvent = (waypoint) => {
  const {type, town, startTime, endTime, differenceTime, price, id} = waypoint;
  const options = {
    hour: `numeric`,
    minute: `numeric`,
  };

  return `<li class="trip-events__item" data-id="${id}">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} to ${town}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startTime}">${startTime.toLocaleString(`ru`, options)}</time>
          &mdash;
          <time class="event__end-time" datetime="${endTime}">${endTime.toLocaleString(`ru`, options)}</time>
        </p>
        <p class="event__duration">${differenceTime}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers"></ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class SiteTripEvent extends SiteEditEventTemplate {
  constructor(waypoint) {
    super();
    this._waypoint = waypoint;
  }

  getTemplate() {
    return createSiteTripEvent(this._waypoint);
  }
}
