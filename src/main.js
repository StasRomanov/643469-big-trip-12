import {travelDays} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import {RenderPosition} from "./const";
import SiteMenu from "./view/site-menu";
import {render} from "./util/render-function";
import SiteFilterHeaderTemplate from "./view/site-filter-header";
import SiteFilterTemplate from "./view/site-filter";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
export const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);
const renderDemo = new TravelDaysList();

const renderFilter = () => {
  render(headerWrapper, new SiteMenu(travelDays), RenderPosition.AFTERBEGIN);
  render(filterWrapper, new SiteFilterHeaderTemplate());
  render(filterWrapper, new SiteFilterTemplate());
};

renderFilter();
renderDemo.init(travelDays);
