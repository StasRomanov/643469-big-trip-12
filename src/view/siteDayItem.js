export const createSiteDayItem = (waypoint) => {
  const options = {
    month: `short`,
  };
  return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${waypoint.day + 1}</span>
        <time class="day__date" datetime="2019-03-18">${waypoint.date.toLocaleString(`en`, options).toUpperCase()} ${waypoint.date.getDate()}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>`;
};
