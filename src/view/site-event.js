import Abstract from "./abstract";

const createSiteEventTemplate = (bonusOption) => {
  const {name, price, used} = bonusOption;
  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}" type="checkbox" name="event-offer-luggage" ${used ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${name}">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
  </div>`;
};

export default class SiteEvent extends Abstract {
  constructor(bonusOption) {
    super();
    this._bonusOption = bonusOption;
  }

  getTemplate() {
    return createSiteEventTemplate(this._bonusOption);
  }
}
