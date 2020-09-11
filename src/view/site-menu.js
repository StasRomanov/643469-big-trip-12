import Abstract from "./abstract";
import moment from "moment";
import {getSimilarWaypointInfo} from "../util/data-function";

const createSiteMenuTemplate = (waypoints) => {
  if (!waypoints.length) {
    return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title"></h1>

              <p class="trip-info__dates"></p>
            </div>

            <p class="trip-info__cost">
               <span class="trip-info__cost-value"></span>
            </p>
          </section>`;
  }
  let allMoney = 0;
  for (let waypoint of waypoints) {
    allMoney += waypoint.price;
  }
  const first = {
    day: moment(waypoints[0].startTime).format(`D`),
    month: moment(waypoints[0].startTime).format(`MMM`),
    town: waypoints[0].town,
  };
  const last = {
    day: moment(waypoints[waypoints.length - 1].startTime).format(`D`),
    month: moment(waypoints[waypoints.length - 1].startTime).format(`MMM`),
    town: waypoints[waypoints.length - 1].town,
  };
  const similarWaypointInfo = getSimilarWaypointInfo(waypoints);
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${first.town} &mdash; ${similarWaypointInfo.status ? similarWaypointInfo.items.length : `...`} &mdash; ${last.town}</h1>
        <p class="trip-info__dates">${first.month} ${first.day}&nbsp;&mdash;&nbsp;${first.month === last.month ? `` : last.month} ${last.day}</p>
    </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${allMoney}</span>
      </p>
  </section>`;
};

export default class SiteMenu extends Abstract {
  constructor(waypoints) {
    super();
    this._waypoints = waypoints;
  }

  getTemplate() {
    return createSiteMenuTemplate(this._waypoints);
  }
}
