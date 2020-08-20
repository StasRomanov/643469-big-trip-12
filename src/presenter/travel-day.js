import SiteTripEvent from "../view/site-trip-event";
import SiteDayItem from "../view/site-day-item";
import SiteNoWaypointMessage from "../view/site-no-waypoint-message";
import {render, replace} from "../util/render-function";
import {KeyboardKey, MAX_OFFERS_IN_VIEW_MODE, WaypointMode} from "../const";
import SiteEditEventTemplate from "../view/site-edit-event";
import SiteEventTemplate from "../view/site-event";
import SiteDayListTemplate from "../view/site-day-list";
import SiteEventTitleTemplate from "../view/site-event-title";
import SiteSortFilterTemplate from "../view/site-sort-filter";
import {priceSort, timeSort} from "../mock/filter-data";

export default class TravelDaysList {
  constructor() {
    this._mainWrapper = document.querySelector(`.page-main`);
    this._sortWrapper = this._mainWrapper.querySelector(`.trip-events`);
  }

  init(travelDays) {
    this._travelDays = travelDays.slice();
    this._renderDay();
  }

  _renderDay() {
    if (!this._travelDays.length) {
      this._noWaypointRender();
    } else {
      render(this._sortWrapper, new SiteSortFilterTemplate());
      render(this._sortWrapper, new SiteDayListTemplate());
      this._setSortListener();
      const dayWrapper = this._sortWrapper.querySelector(`.trip-days`);
      this._travelDays.forEach((item, travelDaysIndex) => {
        render(dayWrapper, new SiteDayItem(item));
        item.waypoints.forEach((value, waypointsIndex) => {
          this._renderWaypoint(travelDaysIndex, waypointsIndex);
        });
      });
    }
  }

  _renderWaypointMode(dayWrapper, waypoint) {
    const waypointElement = new SiteTripEvent(waypoint);
    const waypointEdit = new SiteEditEventTemplate(waypoint);

    const replaceWaypointMode = (mode = WaypointMode.VIEW) => {
      if (mode === WaypointMode.EDIT) {
        replace(waypointEdit, waypointElement);
        const {bonusOptions} = waypoint;
        this._bonusOptionWrapper = this._mainWrapper.querySelector(`.event__available-offers`);
        this._bonusOptionWrapper.innerHTML = ``;
        for (let bonusOption of bonusOptions) {
          render(this._bonusOptionWrapper, new SiteEventTemplate(bonusOption));
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
    render(dayWrapper, waypointElement);
  }

  _renderWaypoint(dayCount, waypointCount) {
    let trimEventItem = this._sortWrapper.querySelectorAll(`.trip-events__list`);
    trimEventItem = trimEventItem[trimEventItem.length - 1];
    this._renderWaypointMode(trimEventItem, this._travelDays[dayCount].waypoints[waypointCount]);
    const eventOffer = trimEventItem.querySelectorAll(`.event__selected-offers`);
    this._lastEventOffer = eventOffer[eventOffer.length - 1];
    this._travelDays[dayCount].waypoints[waypointCount].bonusOptions.forEach((item, index) => this._renderBonusOption(index, dayCount, waypointCount));
  }

  _noWaypointRender() {
    render(this._sortWrapper.querySelector(`.trip-days`), new SiteNoWaypointMessage());
  }

  _renderBonusOption(index, dayCount, waypointCount) {
    const optionCount = this._lastEventOffer.querySelectorAll(`.event__offer`).length;
    if (this._travelDays[dayCount].waypoints[waypointCount].bonusOptions[index].used && optionCount < MAX_OFFERS_IN_VIEW_MODE) {
      render(this._lastEventOffer, new SiteEventTitleTemplate(this._travelDays[dayCount].waypoints[waypointCount].bonusOptions[index]));
    }
  }

  _setSortListener() {
    this._sortWrapper.addEventListener(`change`, (evt) => {
      this._onSortWrapperChange(evt);
    });
  }

  _onSortWrapperChange(evt) {
    const target = evt.target;
    const targetType = target.id.split(`-`)[1];

    switch (targetType) {
      case `event`:
        this._sortWrapper.innerHTML = ``;
        this._renderDay();
        break;
      case `time`:
        this._sort(timeSort);
        break;
      case `price`:
        this._sort(priceSort);
        break;
    }
  }

  _sort(sortTravelDays) {
    this._clearWaypoint();
    sortTravelDays.forEach((value, index) => {
      this._renderWaypointMode(this._allDay[0].querySelector(`.trip-events__list`), value);
      const optionWrapper = this._allDay[0].querySelectorAll(`.event__selected-offers`)[index];
      value.bonusOptions.forEach((bonusOptionsValue) => {
        if (bonusOptionsValue.used && optionWrapper.childElementCount < MAX_OFFERS_IN_VIEW_MODE) {
          render(optionWrapper, new SiteEventTitleTemplate(bonusOptionsValue));
        }
      });
    });
  }

  _clearWaypoint() {
    this._allDay = this._sortWrapper.querySelectorAll(`.trip-days__item`);
    this._sortWrapper.querySelector(`.trip-sort__item--day`).textContent = ``;
    this._allDay.forEach(((value, key) => {
      if (key > 0) {
        value.remove();
      }
    }));
    this._allDay[0].querySelector(`.day__counter`).textContent = ``;
    this._allDay[0].querySelector(`.day__date`).textContent = ``;
    this._allDay[0].querySelectorAll(`.trip-events__item`).forEach((value) => {
      value.remove();
    });
  }
}
