import Abstract from "./abstract";

const createSiteEventPhotoTemplate = (photo) => {
  return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
};

export default class SiteEventPhoto extends Abstract {
  constructor(photo) {
    super();
    this._photo = photo;
  }

  getTemplate() {
    return createSiteEventPhotoTemplate(this._photo);
  }
}
