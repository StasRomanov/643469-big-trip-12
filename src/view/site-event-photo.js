import Abstract from "./abstract";

const createSiteEventPhotoTemplate = (photo) => {
  return `<img class="event__photo" src="${photo}" alt="Event photo">`;
};

export default class SiteEventPhotoTemplate extends Abstract {
  constructor(photo) {
    super();
    this._photo = photo;
  }

  getTemplate() {
    return createSiteEventPhotoTemplate(this._photo);
  }
}
