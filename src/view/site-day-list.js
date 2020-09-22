import Abstract from "./abstract";

const createSiteDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class SiteDayList extends Abstract {
  getTemplate() {
    return createSiteDayListTemplate();
  }
}
