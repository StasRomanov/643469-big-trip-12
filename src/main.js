import {createSiteMenuTemplate, createSiteFilterHeaderTemplate, createSiteFilterTemplate, createSiteSortFilterTemplate,
  createSiteWaypointTemplate, createSiteWaypointPriceTemplate, createSiteWaypointDestinationTemplate,
  createSiteDayListTemplate} from './index.js';
const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const filterWrapperHeading = filterWrapper.querySelector(`.trip-main__trip-controls h2`);
const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);

const render = (wrapper, template, mode = `beforeend`) => {
  wrapper.insertAdjacentHTML(mode, template);
};

render(headerWrapper, createSiteMenuTemplate(), `afterbegin`);
render(filterWrapperHeading, createSiteFilterHeaderTemplate(), `afterend`);
render(filterWrapper, createSiteFilterTemplate());
render(sortFilterWrapper, createSiteSortFilterTemplate());
render(sortFilterWrapper, createSiteWaypointTemplate());
render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointPriceTemplate());
render(mainWrapper.querySelector(`.trip-events__item`), createSiteWaypointDestinationTemplate());
render(sortFilterWrapper, createSiteDayListTemplate());
