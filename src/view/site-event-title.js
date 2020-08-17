import Abstract from "./abstract";

const createSiteEventTitleTemplate = (option) => {
  const {name, price} = option;
  return `<li class="event__offer">
    <span class="event__offer-title">${name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
 </li>`;
};

export default class SiteEventTitleTemplate extends Abstract {
  constructor(option) {
    super();
    this._option = option;
  }

  getTemplate() {
    return createSiteEventTitleTemplate(this._option);
  }
}
