import Abstract from "./abstract";

const createSiteDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class SiteDayListTemplate extends Abstract {
  getTemplate() {
    return createSiteDayListTemplate();
  }
}
