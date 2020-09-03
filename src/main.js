import {waypoints} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import {RenderPosition} from "./const";
import SiteMenu from "./view/site-menu";
import {render} from "./util/render-function";
import SiteFilterHeaderTemplate from "./view/site-filter-header";
import SiteFilterTemplate from "./view/site-filter";

const headerWrapper = document.querySelector(`.trip-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const renderDemo = new TravelDaysList();

const renderFilter = () => {
  render(headerWrapper, new SiteMenu(waypoints), RenderPosition.AFTERBEGIN);
  render(filterWrapper, new SiteFilterHeaderTemplate());
  render(filterWrapper, new SiteFilterTemplate());
};

renderFilter();
renderDemo.init(waypoints);
