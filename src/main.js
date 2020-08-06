import {createSiteDayListTemplate} from './view/siteDayList';
import {createSiteFilterTemplate} from './view/siteFilter';
import {createSiteFilterHeaderTemplate} from './view/siteFilterHeader';
import {createSiteMenuTemplate} from './view/siteMenu';
import {createSiteSortFilterTemplate} from './view/siteSortFilter';
import {createSiteWaypointTemplate} from './view/siteWaypoint';
import {createSiteWaypointDestinationTemplate} from './view/siteWaypointDestination';
import {createSiteWaypointPriceTemplate} from './view/siteWaypointPrice';
import {waypoints} from "./utilData";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const filterWrapperHeading = filterWrapper.querySelector(`.trip-main__trip-controls h2`);
const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);

const render = (wrapper, template, mode = `beforeend`) => {
  wrapper.insertAdjacentHTML(mode, template);
};

console.log(waypoints);

render(headerWrapper, createSiteMenuTemplate(), `afterbegin`);
render(filterWrapperHeading, createSiteFilterHeaderTemplate(), `afterend`);
render(filterWrapper, createSiteFilterTemplate());
render(sortFilterWrapper, createSiteSortFilterTemplate());
render(sortFilterWrapper, createSiteWaypointTemplate(waypoints, 0));
render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointPriceTemplate());
render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointDestinationTemplate());
render(sortFilterWrapper, createSiteDayListTemplate());
