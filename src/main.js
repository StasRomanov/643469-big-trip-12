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
import {travelDays} from "./utilData";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const filterWrapperHeading = filterWrapper.querySelector(`.trip-main__trip-controls h2`);
const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);

const render = (wrapper, template, mode = `beforeend`) => {
  wrapper.insertAdjacentHTML(mode, template);
};

const renderFilter = () => {
  render(headerWrapper, createSiteMenuTemplate(travelDays), `afterbegin`);
  render(filterWrapperHeading, createSiteFilterHeaderTemplate(), `afterend`);
  render(filterWrapper, createSiteFilterTemplate());
  render(sortFilterWrapper, createSiteSortFilterTemplate());
};

const renderNewWaypoint = (waypoint) => {
  const {bonusOptions, photos, description} = waypoint;
  render(sortFilterWrapper, createSiteWaypointTemplate(waypoint));
  render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointPriceTemplate());
  for (let bonusOption of bonusOptions) {
    render(mainWrapper.querySelector(`.event__available-offers`), createSiteEventTemplate(bonusOption));
  }
  render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointDestinationTemplate(description));
  for (let photo of photos) {
    render(mainWrapper.querySelector(`.event__photos-tape`), createEventPhotoTemplate(photo));
  }
};

const renderWaypoint = (dayCount, waypointCount) => {
  let trimEventItem = sortFilterWrapper.querySelectorAll(`.trip-events__list`);
  trimEventItem = trimEventItem[trimEventItem.length - 1];
  render(trimEventItem, createSiteTripEvent(travelDays[dayCount].waypoints[waypointCount]));
  let eventOffer = trimEventItem.querySelectorAll(`.event__selected-offers`);
  let lastEventOffer = eventOffer[eventOffer.length - 1];
  travelDays[dayCount].waypoints[waypointCount].bonusOptions.forEach(function (item, index) {
    let optionCount = lastEventOffer.querySelectorAll(`.event__offer`).length;
    if (travelDays[dayCount].waypoints[waypointCount].bonusOptions[index].used && optionCount < 3) {
      render(lastEventOffer, createSiteEventTitleTemplate(travelDays[dayCount].waypoints[waypointCount].bonusOptions[index]));
    }
  });
};

const renderDays = () => {
  render(sortFilterWrapper, createSiteDayListTemplate());
  travelDays.forEach(function (item, travelDaysIndex) {
    render(sortFilterWrapper.querySelector(`.trip-days`), createSiteDayItem(item));
    item.waypoints.forEach(function (value, waypointsIndex) {
      renderWaypoint(travelDaysIndex, waypointsIndex);
    });
  });
};

renderFilter();
renderNewWaypoint(travelDays[0].waypoints[0]);
renderDays();
