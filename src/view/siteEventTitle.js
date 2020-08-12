export const createSiteEventTitleTemplate = (option) => {
  const {name, price} = option;
  return `<li class="event__offer">
    <span class="event__offer-title">${name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
 </li>`;
};
