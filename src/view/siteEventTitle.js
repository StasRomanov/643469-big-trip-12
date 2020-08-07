export const createSiteEventTitleTemplate = (option) => {
  return `<li class="event__offer">
          <span class="event__offer-title">${option.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
         </li>`;
};
