import Abstract from "./abstract";
import moment from "moment";
import {getSimilarWaypointInfo} from "../util/data-function";

const createSiteMenuTemplate = (days) => {
  let allMoney = 0;
  for (let day of days) {
    for (let waypoint of day.waypoints) {
      allMoney += waypoint.price;
    }
  }
  const first = {
    day: moment(days[0].waypoints[0].startTime).format(`D`),
    month: moment(days[0].waypoints[0].startTime).format(`MMM`),
    town: days[0].waypoints[0].town,
  };
  const last = {
    day: moment(days[days.length - 1].waypoints[days.length - 1].startTime).format(`D`),
    month: moment(days[days.length - 1].waypoints[days.length - 1].startTime).format(`MMM`),
    town: days[days.length - 1].waypoints[days[days.length - 1].waypoints.length - 1].town,
  };
  const similarWaypointInfo = getSimilarWaypointInfo(days);
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${first.town} &mdash; ${similarWaypointInfo.status ? similarWaypointInfo.items[1] : `...`} &mdash; ${last.town}</h1>
        <p class="trip-info__dates">${first.month} ${first.day}&nbsp;&mdash;&nbsp;${first.month === last.month ? `` : last.month} ${last.day}</p>
    </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${allMoney}</span>
      </p>
  </section>`;
};

export default class SiteMenu extends Abstract {
  constructor(days) {
    super();
    this._days = days;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._days);
  }
}
