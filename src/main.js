import {createSiteDayListTemplate} from './view/siteDayList';
import {createSiteFilterTemplate} from './view/siteFilter';
import {createSiteFilterHeaderTemplate} from './view/siteFilterHeader';
import {createSiteMenuTemplate} from './view/siteMenu';
import {createSiteSortFilterTemplate} from './view/siteSortFilter';
import {createSiteWaypointTemplate} from './view/siteWaypoint';
import {createSiteWaypointDestinationTemplate} from './view/siteWaypointDestination';
import {createSiteWaypointPriceTemplate} from './view/siteWaypointPrice';
import {createSiteEventTemplate} from "./view/siteEvent";
import {createEventPhotoTemplate} from "./view/siteEventPhoto";
import {createSiteDayItem} from "./view/siteDayItem";
import {createSiteTripEvent} from "./view/siteTripEvent";
import {createSiteEventTitleTemplate} from "./view/siteEventTitle";
import {days} from "./utilData";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const filterWrapperHeading = filterWrapper.querySelector(`.trip-main__trip-controls h2`);
const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);

const render = (wrapper, template, mode = `beforeend`) => {
  wrapper.insertAdjacentHTML(mode, template);
};

render(headerWrapper, createSiteMenuTemplate(days), `afterbegin`);
render(filterWrapperHeading, createSiteFilterHeaderTemplate(), `afterend`);
render(filterWrapper, createSiteFilterTemplate());
render(sortFilterWrapper, createSiteSortFilterTemplate());
render(sortFilterWrapper, createSiteWaypointTemplate(days, 0));
render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointPriceTemplate(days, 0));
for (let bonusOption of days[0].waypoints[0].bonusOption) {
  render(mainWrapper.querySelector(`.event__available-offers`), createSiteEventTemplate(bonusOption));
}
render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointDestinationTemplate(days[0].waypoints[0].description));
for (let photo of days[0].waypoints[0].photo) {
  render(mainWrapper.querySelector(`.event__photos-tape`), createEventPhotoTemplate(photo));
}
render(sortFilterWrapper, createSiteDayListTemplate());
for (let j = 0; j < days.length; j++) {
  render(sortFilterWrapper.querySelector(`.trip-days`), createSiteDayItem(days[j]));
  for (let i = 0; i < days[j].waypoints.length; i++) {
    let trimEventItem = sortFilterWrapper.querySelectorAll(`.trip-events__list`);
    trimEventItem = trimEventItem[trimEventItem.length - 1];
    render(trimEventItem, createSiteTripEvent(days[j].waypoints[i]));
    let eventOffer = trimEventItem.querySelectorAll(`.event__selected-offers`);
    let lastEventOffer = eventOffer[eventOffer.length - 1];
    for (let k = 0; k < days[j].waypoints[i].bonusOption.length; k++) {
      let optionCount = lastEventOffer.querySelectorAll(`.event__offer`).length;
      if (days[j].waypoints[i].bonusOption[k].used && optionCount < 3) {
        render(lastEventOffer, createSiteEventTitleTemplate(days[j].waypoints[i].bonusOption[k]));
      }
    }
  }
}
