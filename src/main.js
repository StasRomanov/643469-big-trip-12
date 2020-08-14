import SiteMenu from "./view/siteMenu";
import SiteFilterHeaderTemplate from "./view/siteFilterHeader";
import SiteFilterTemplate from "./view/siteFilter";
import SiteSortFilterTemplate from "./view/siteSortFilter";
import SiteEditEventTemplate from "./view/siteEditEvent";
import SiteEventTemplate from "./view/siteEvent";
import SiteTripEvent from "./view/siteTripEvent";
import SiteEventTitleTemplate from "./view/siteEventTitle";
import SiteDayListTemplate from "./view/siteDayList";
import SiteDayItem from "./view/siteDayItem";
import SiteNoWaypointMessage from "./view/siteNoWaypointMessage";
import {RenderPosition} from "./const";
import {render} from "./utilFunction";
import {travelDays} from "./utilData";
import {WaypointMode} from "./const";
import {MouseKey} from "./const";
import {KeyboardKey} from "./const";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);

const renderFilter = (days) => {
  render(headerWrapper, new SiteMenu(travelDays).getElement(), RenderPosition.AFTERBEGIN);
  render(filterWrapper, new SiteFilterHeaderTemplate().getElement());
  render(filterWrapper, new SiteFilterTemplate().getElement());
  if (days.length > 0) {
    render(sortFilterWrapper, new SiteSortFilterTemplate().getElement());
  }
};

const renderWaypoint = (dayCount, waypointCount) => {
  let trimEventItem = sortFilterWrapper.querySelectorAll(`.trip-events__list`);
  trimEventItem = trimEventItem[trimEventItem.length - 1];
  renderWaypointMode(trimEventItem, travelDays[dayCount].waypoints[waypointCount]);
  let eventOffer = trimEventItem.querySelectorAll(`.event__selected-offers`);
  let lastEventOffer = eventOffer[eventOffer.length - 1];
  travelDays[dayCount].waypoints[waypointCount].bonusOptions.forEach(function (item, index) {
    let optionCount = lastEventOffer.querySelectorAll(`.event__offer`).length;
    if (travelDays[dayCount].waypoints[waypointCount].bonusOptions[index].used && optionCount < 3) {
      render(lastEventOffer, new SiteEventTitleTemplate(travelDays[dayCount].waypoints[waypointCount].bonusOptions[index]).getElement());
    }
  });
};

const renderDays = () => {
  render(sortFilterWrapper, new SiteDayListTemplate().getElement());
  if (travelDays.length > 0) {
    travelDays.forEach(function (item, travelDaysIndex) {
      render(sortFilterWrapper.querySelector(`.trip-days`), new SiteDayItem(item).getElement());
      item.waypoints.forEach(function (value, waypointsIndex) {
        renderWaypoint(travelDaysIndex, waypointsIndex);
      });
    });
  } else {
    render(sortFilterWrapper.querySelector(`.trip-days`), new SiteNoWaypointMessage().getElement());
  }
};

const renderWaypointMode = (wrapper, waypoint) => {
  const waypointElement = new SiteTripEvent(waypoint);
  const waypointEdit = new SiteEditEventTemplate(waypoint);

  const replaceWaypointMode = (mode = WaypointMode.VIEW) => {
    if (mode === WaypointMode.EDIT) {
      wrapper.replaceChild(waypointEdit.getElement(), waypointElement.getElement());
      const {bonusOptions} = waypoint;
      const bonusOptionWrapper = mainWrapper.querySelector(`.event__available-offers`);
      bonusOptionWrapper.innerHTML = ``;
      for (let bonusOption of bonusOptions) {
        render(bonusOptionWrapper, new SiteEventTemplate(bonusOption).getElement());
      }
    }
    if (mode === WaypointMode.VIEW) {
      wrapper.replaceChild(waypointElement.getElement(), waypointEdit.getElement());
    }
  };

  const editModeListener = () => {
    waypointElement.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, onWaypointElementClick);
    waypointEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onWaypointEditClick);
    waypointEdit.getElement().addEventListener(`submit`, onWaypointEditSubmit);
    document.addEventListener(`keydown`, onDocumentKeydown);
  };

  const normalModeListener = () => {
    waypointElement.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onWaypointElementClick);
    waypointEdit.getElement().querySelector(`.event__rollup-btn`).removeEventListener(`click`, onWaypointEditClick);
    waypointEdit.getElement().removeEventListener(`submit`, onWaypointEditSubmit);
    document.removeEventListener(`keydown`, onDocumentKeydown);
  };

  const onWaypointElementClick = function (evt) {
    if (evt.button === MouseKey.LEFT) {
      replaceWaypointMode(WaypointMode.EDIT);
      editModeListener();
    }
  };

  const onWaypointEditClick = function (evt) {
    if (evt.button === MouseKey.LEFT) {
      replaceWaypointMode(WaypointMode.VIEW);
      normalModeListener();
    }
  };

  const onWaypointEditSubmit = function (evt) {
    evt.preventDefault();
    replaceWaypointMode(WaypointMode.VIEW);
    normalModeListener();
  };

  const onDocumentKeydown = function (evt) {
    if (evt.code === KeyboardKey.ESCAPE) {
      replaceWaypointMode(WaypointMode.VIEW);
      normalModeListener();
    }
  };

  waypointElement.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, onWaypointElementClick);
  render(wrapper, waypointElement.getElement());
};

renderFilter(travelDays);
renderDays();
