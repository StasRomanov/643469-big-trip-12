import SiteMenu from "./view/siteMenu";
import SiteFilterHeaderTemplate from "./view/siteFilterHeader";
import SiteFilterTemplate from "./view/siteFilter";
import SiteSortFilterTemplate from "./view/siteSortFilter";
import SiteWaypointTemplate from "./view/siteWaypoint";
import SiteWaypointPriceTemplate from "./view/siteWaypointPrice";
import SiteEventTemplate from "./view/siteEvent";
import SiteWaypointDestinationTemplate from "./view/siteWaypointDestination";
import SiteEventPhotoTemplate from "./view/siteEventPhoto";
import SiteTripEvent from "./view/siteTripEvent";
import SiteEventTitleTemplate from "./view/siteEventTitle";
import SiteDayListTemplate from "./view/siteDayList";
import SiteDayItem from "./view/siteDayItem";
import {renderElement} from "./utilFunction";
import {travelDays} from "./utilData";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);

const renderFilter = () => {
  renderElement(headerWrapper, new SiteMenu(travelDays).getElement(), `afterbegin`);
  renderElement(filterWrapper, new SiteFilterHeaderTemplate().getElement());
  renderElement(filterWrapper, new SiteFilterTemplate().getElement());
  renderElement(sortFilterWrapper, new SiteSortFilterTemplate().getElement());
};

const renderNewWaypoint = (waypoint) => {
  const {bonusOptions, photos, description} = waypoint;
  renderElement(sortFilterWrapper, new SiteWaypointTemplate(waypoint).getElement());
  renderElement(mainWrapper.querySelector(`.trip-events__item`), new SiteWaypointPriceTemplate().getElement());
  for (let bonusOption of bonusOptions) {
    renderElement(mainWrapper.querySelector(`.event__available-offers`), new SiteEventTemplate(bonusOption).getElement());
  }
  renderElement(mainWrapper.querySelector(`.trip-events__item`), new SiteWaypointDestinationTemplate(description).getElement());
  for (let photo of photos) {
    renderElement(mainWrapper.querySelector(`.event__photos-tape`), new SiteEventPhotoTemplate(photo).getElement());
  }
};

const renderWaypoint = (dayCount, waypointCount) => {
  let trimEventItem = sortFilterWrapper.querySelectorAll(`.trip-events__list`);
  trimEventItem = trimEventItem[trimEventItem.length - 1];
  renderElement(trimEventItem, new SiteTripEvent(travelDays[dayCount].waypoints[waypointCount]).getElement());
  let eventOffer = trimEventItem.querySelectorAll(`.event__selected-offers`);
  let lastEventOffer = eventOffer[eventOffer.length - 1];
  travelDays[dayCount].waypoints[waypointCount].bonusOptions.forEach(function (item, index) {
    let optionCount = lastEventOffer.querySelectorAll(`.event__offer`).length;
    if (travelDays[dayCount].waypoints[waypointCount].bonusOptions[index].used && optionCount < 3) {
      renderElement(lastEventOffer, new SiteEventTitleTemplate(travelDays[dayCount].waypoints[waypointCount].bonusOptions[index]).getElement());
    }
  });
};

const renderDays = () => {
  renderElement(sortFilterWrapper, new SiteDayListTemplate().getElement());
  travelDays.forEach(function (item, travelDaysIndex) {
    renderElement(sortFilterWrapper.querySelector(`.trip-days`), new SiteDayItem(item).getElement());
    item.waypoints.forEach(function (value, waypointsIndex) {
      renderWaypoint(travelDaysIndex, waypointsIndex);
    });
  });
};

renderFilter();
renderNewWaypoint(travelDays[0].waypoints[0]);
renderDays();
