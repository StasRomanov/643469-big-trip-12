export const createSiteEventTemplate = (bonusOption) => {
  const {name, price, used} = bonusOption;
  return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${used ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
  </div>`;
};
