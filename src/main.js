import {travelDays} from "./mock/data";
import TravelDaysList from "./presenter/travelDay";
import {RenderPosition} from "./const";
import SiteMenu from "./view/siteMenu";
import {render} from "./util/renderFunction";
import SiteFilterHeaderTemplate from "./view/siteFilterHeader";
import SiteFilterTemplate from "./view/siteFilter";
import SiteSortFilterTemplate from "./view/siteSortFilter";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);
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
