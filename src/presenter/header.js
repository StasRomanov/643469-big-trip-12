import {render} from "../util/render-function";
import SiteMenu from "../view/site-menu";
import {waypoints} from "../mock/data";
import {RenderPosition} from "../const";
import SiteFilterHeaderTemplate from "../view/site-filter-header";
import SiteFilterTemplate from "../view/site-filter";

export class Header {
  init() {
    const headerWrapper = document.querySelector(`.trip-main`);
    const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
    render(headerWrapper, new SiteMenu(waypoints), RenderPosition.AFTERBEGIN);
    render(filterWrapper, new SiteFilterHeaderTemplate());
    render(filterWrapper, new SiteFilterTemplate());
  }
}
