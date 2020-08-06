export const createSiteEventTemplate = (bonusOption) =>
  `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${bonusOption.used ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${bonusOption.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${bonusOption.price}</span>
      </label>
  </div>`;
