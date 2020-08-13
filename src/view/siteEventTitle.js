import {createElement} from "../utilFunction";

const createSiteEventTitleTemplate = (option) => {
  const {name, price} = option;
  return `<li class="event__offer">
    <span class="event__offer-title">${name}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${price}</span>
 </li>`;
};

export default class SiteEventTitleTemplate {
  constructor(option) {
    this._element = null;
    this._option = option;
  }

  getTemplate() {
    return createSiteEventTitleTemplate(this._option);
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
