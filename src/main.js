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
import {render, replace} from "./util/renderFunction";
import {travelDays} from "./mock/data";
import {KeyboardKey, RenderPosition, WaypointMode} from "./const";

const headerWrapper = document.querySelector(`.trip-main`);
const mainWrapper = document.querySelector(`.page-main`);
const filterWrapper = headerWrapper.querySelector(`.trip-main__trip-controls`);
const sortFilterWrapper = mainWrapper.querySelector(`.trip-events`);

const renderFilter = (days) => {
  render(headerWrapper, new SiteMenu(travelDays), RenderPosition.AFTERBEGIN);
  render(filterWrapper, new SiteFilterHeaderTemplate());
  render(filterWrapper, new SiteFilterTemplate());
  if (days.length > 0) {
    render(sortFilterWrapper, new SiteSortFilterTemplate());
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
      render(lastEventOffer, new SiteEventTitleTemplate(travelDays[dayCount].waypoints[waypointCount].bonusOptions[index]));
    }
  });
};

const renderDays = () => {
  render(sortFilterWrapper, new SiteDayListTemplate());
  if (travelDays.length > 0) {
    travelDays.forEach(function (item, travelDaysIndex) {
      render(sortFilterWrapper.querySelector(`.trip-days`), new SiteDayItem(item));
      item.waypoints.forEach(function (value, waypointsIndex) {
        renderWaypoint(travelDaysIndex, waypointsIndex);
      });
    });
  } else {
    render(sortFilterWrapper.querySelector(`.trip-days`), new SiteNoWaypointMessage());
  }
};

const renderWaypointMode = (wrapper, waypoint) => {
  const waypointElement = new SiteTripEvent(waypoint);
  const waypointEdit = new SiteEditEventTemplate(waypoint);

  const replaceWaypointMode = (mode = WaypointMode.VIEW) => {
    if (mode === WaypointMode.EDIT) {
      replace(waypointEdit, waypointElement);
      const {bonusOptions} = waypoint;
      const bonusOptionWrapper = mainWrapper.querySelector(`.event__available-offers`);
      bonusOptionWrapper.innerHTML = ``;
      for (let bonusOption of bonusOptions) {
        render(bonusOptionWrapper, new SiteEventTemplate(bonusOption));
      }
    }
    if (mode === WaypointMode.VIEW) {
      replace(waypointElement, waypointEdit);
    }
  };

  const setEditModeListener = () => {
    waypointElement.setRollupButtonClickHandler(() => {
      replaceWaypointMode(WaypointMode.EDIT);
      setEditModeListener();
    });
    waypointEdit.setRollupButtonClickHandler(() => {
      replaceWaypointMode(WaypointMode.VIEW);
      setNormalModeListener();
    });
    waypointEdit.setFormSubmitHandler(() => {
      replaceWaypointMode(WaypointMode.VIEW);
      setNormalModeListener();
    });
    document.addEventListener(`keydown`, onDocumentKeydown);
  };

  const setNormalModeListener = () => {
    waypointElement.setRollupButtonClickHandler(() => {
      replaceWaypointMode(WaypointMode.EDIT);
      setEditModeListener();
    });
    waypointEdit.removeRollupButtonClickHandler(() => {
      replaceWaypointMode(WaypointMode.VIEW);
      setNormalModeListener();
    });
    waypointEdit.removeFormSubmitHandler(() => {
      replaceWaypointMode(WaypointMode.VIEW);
      setNormalModeListener();
    });
    document.removeEventListener(`keydown`, onDocumentKeydown);
  };

  const onDocumentKeydown = function (evt) {
    if (evt.code === KeyboardKey.ESCAPE) {
      replaceWaypointMode(WaypointMode.VIEW);
      setNormalModeListener();
    }
  };

  waypointElement.setRollupButtonClickHandler(() => {
    replaceWaypointMode(WaypointMode.EDIT);
    setEditModeListener();
  });
  render(wrapper, waypointElement);
};

renderFilter(travelDays);
renderDays();
