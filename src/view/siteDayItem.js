export const createSiteDayItem = (waypoint) => {
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${waypoint.day + 1}</span>
        <time class="day__date" datetime="2019-03-18">${waypoint.data}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
};
