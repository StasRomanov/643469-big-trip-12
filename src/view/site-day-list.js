import Abstract from "./abstract";

const createSiteDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class SiteDayList extends Abstract {
  getTemplate() {
    return createSiteDayListTemplate();
  }

  getFirstEditWaypointId() {
    if (this.getElement().querySelector(`.event--edit`)) {
      return this._find();
    } else {
      return ``;
    }
  }

  _find() {
    return this.getElement().querySelector(`.event--edit`);
  }
}
