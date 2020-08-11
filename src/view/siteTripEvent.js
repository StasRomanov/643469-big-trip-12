export const createSiteTripEvent = (waypoint) => {
  const options = {
    hour: `numeric`,
    minute: `numeric`,
  };

  return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${waypoint.type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${waypoint.type} to ${waypoint.town}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${waypoint.startTime}">${waypoint.startTime.toLocaleString(`ru`, options)}</time>
          &mdash;
          <time class="event__end-time" datetime="${waypoint.startTime}">${waypoint.endTime.toLocaleString(`ru`, options)}</time>
        </p>
        <p class="event__duration">${waypoint.differenceTime}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${waypoint.price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers"></ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
