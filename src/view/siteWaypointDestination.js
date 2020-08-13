import {createElement} from "../utilFunction";

const createSiteWaypointDestinationTemplate = (description) => {
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape"></div>
    </div>
  </section>`;
};

export default class SiteWaypointDestinationTemplate {
  constructor(description) {
    this._element = null;
    this._description = description;
  }

  getTemplate() {
    return createSiteWaypointDestinationTemplate(this._description);
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
