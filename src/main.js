import {travelDays} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import {RenderPosition} from "./const";
import SiteMenu from "./view/site-menu";
import {render} from "./util/render-function";
import SiteFilterHeaderTemplate from "./view/site-filter-header";
import SiteFilterTemplate from "./view/site-filter";
import SiteSortFilterTemplate from "./view/site-sort-filter";
import {offerSort} from "./mock/filter-data";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
export const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);
const renderDemo = new TravelDaysList();

const renderFilter = (days) => {
  render(headerWrapper, new SiteMenu(travelDays), RenderPosition.AFTERBEGIN);
  render(filterWrapper, new SiteFilterHeaderTemplate());
  render(filterWrapper, new SiteFilterTemplate());
  if (days.length > 0) {
    render(sortFilterWrapper, new SiteSortFilterTemplate());
  }
};

renderFilter(travelDays);
renderDemo.init(travelDays);
