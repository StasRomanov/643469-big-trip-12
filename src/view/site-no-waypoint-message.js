import Abstract from "./abstract";

const createSiteNoWaypointMessage = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;

export default class SiteNoWaypointMessage extends Abstract {
  getTemplate() {
    return createSiteNoWaypointMessage();
  }
}
