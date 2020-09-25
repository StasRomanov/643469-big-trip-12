import Abstract from "./abstract";

const createSiteDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class SiteDayList extends Abstract {
  getTemplate() {
    return createSiteDayListTemplate();
  }

  getFirstEditWaypointId() {
    if (this.getElement().querySelector(`.event--edit`)) {
      return this.getElement().querySelector(`.event--edit`);
    } else {
      return ``;
    }
  }

  destroyAllWaypoints() {
    this.getElement().innerHTML = ``;
  }

  destroy() {
    this.getElement().remove();
  }
}
