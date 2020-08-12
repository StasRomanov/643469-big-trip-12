import {createElement} from "../utilFunction";

export const createSiteDayListTemplate = () => `<ul class="trip-days"></ul>`;

export default class SiteDayListTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSiteDayListTemplate();
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
