import Abstract from "./abstract";

const createSiteWaypointPriceTemplate = () =>
  `<section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers"></div>
    </section>
  </section>`;

export default class SiteWaypointPriceTemplate extends Abstract {
  getTemplate() {
    return createSiteWaypointPriceTemplate();
  }
}
