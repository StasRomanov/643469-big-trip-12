import {createElement} from "../utilFunction";

export const createSiteWaypointPriceTemplate = () =>
  `<section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers"></div>
    </section>
  </section>`;

export default class SiteWaypointPriceTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteWaypointPriceTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
