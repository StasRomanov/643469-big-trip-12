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

const renderNewWaypoint = () => {
  render(sortFilterWrapper, createSiteWaypointTemplate(days, 0));
  render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointPriceTemplate(days, 0));
  for (let bonusOption of days[0].waypoints[0].bonusOptions) {
    render(mainWrapper.querySelector(`.event__available-offers`), createSiteEventTemplate(bonusOption));
  }
  render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointDestinationTemplate(days[0].waypoints[0].description));
  for (let photo of days[0].waypoints[0].photos) {
    render(mainWrapper.querySelector(`.event__photos-tape`), createEventPhotoTemplate(photo));
  }
};

const renderFilter = () => {
  render(headerWrapper, createSiteMenuTemplate(days), `afterbegin`);
  render(filterWrapperHeading, createSiteFilterHeaderTemplate(), `afterend`);
  render(filterWrapper, createSiteFilterTemplate());
  render(sortFilterWrapper, createSiteSortFilterTemplate());
};

const renderWaypoint = (dayCount, waypointCount) => {
  let trimEventItem = sortFilterWrapper.querySelectorAll(`.trip-events__list`);
  trimEventItem = trimEventItem[trimEventItem.length - 1];
  render(trimEventItem, createSiteTripEvent(days[dayCount].waypoints[waypointCount]));
  let eventOffer = trimEventItem.querySelectorAll(`.event__selected-offers`);
  let lastEventOffer = eventOffer[eventOffer.length - 1];
  for (let k = 0; k < days[dayCount].waypoints[waypointCount].bonusOptions.length; k++) {
    let optionCount = lastEventOffer.querySelectorAll(`.event__offer`).length;
    if (days[dayCount].waypoints[waypointCount].bonusOptions[k].used && optionCount < 3) {
      render(lastEventOffer, createSiteEventTitleTemplate(days[dayCount].waypoints[waypointCount].bonusOptions[k]));
    }
  }
};

const renderDays = () => {
  render(sortFilterWrapper, createSiteDayListTemplate());
  for (let j = 0; j < days.length; j++) {
    render(sortFilterWrapper.querySelector(`.trip-days`), createSiteDayItem(days[j]));
    for (let i = 0; i < days[j].waypoints.length; i++) {
      renderWaypoint(j, i);
    }
  }
};

renderFilter();
renderNewWaypoint();
renderDays();
