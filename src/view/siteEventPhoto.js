import {createElement} from "../utilFunction";

const createSiteEventPhotoTemplate = (photo) => {
  return `<img class="event__photo" src="${photo}" alt="Event photo">`;
};

export default class SiteEventPhotoTemplate {
  constructor(photo) {
    this._element = null;
    this._photo = photo;
  }

  getTemplate() {
    return createSiteEventPhotoTemplate(this._photo);
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
