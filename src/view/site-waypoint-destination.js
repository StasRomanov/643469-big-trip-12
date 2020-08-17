import Abstract from "./abstract";

const createSiteWaypointDestinationTemplate = (description) => {
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape"></div>
    </div>
  </section>`;
};

export default class SiteWaypointDestinationTemplate extends Abstract {
  constructor(description) {
    super();
    this._description = description;
  }

  getTemplate() {
    return createSiteWaypointDestinationTemplate(this._description);
  }
}
