import Abstract from "./abstract";

const createSiteLoadInfo = () => `<p class="trip-events__msg">Loading...</p>`;

export default class SiteLoading extends Abstract {
  getTemplate() {
    return createSiteLoadInfo();
  }
}
