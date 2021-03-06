import Abstract from "./abstract";
import {FilterType} from "../const";
import {getFutureWaypointsFilter, getPastWaypointsFilter} from "../util/filter-data-function";

const createSiteFilterTemplate = () =>
  `<form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>
    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class SiteFilter extends Abstract {
  constructor() {
    super();
    this._addFilterChangeListener = this._addFilterChangeListener.bind(this);
  }

  getTemplate() {
    return createSiteFilterTemplate();
  }

  disableFilters() {
    this.getElement().querySelectorAll(`.trip-filters__filter-input`).forEach((item) => item.setAttribute(`disabled`, `true`));
  }

  enableFilters() {
    this.getElement().querySelectorAll(`.trip-filters__filter-input`).forEach((item) => item.removeAttribute(`disabled`));
  }

  setFilterDefault() {
    this.getElement().querySelectorAll(`.trip-filters__filter-input`).forEach((item) =>{
      if (item.value === FilterType.DEFAULT) {
        item.checked = true;
      }
      item.removeAttribute(`disabled`);
    });
  }

  static smartDisableFilters(waypoints) {
    const pastFilter = document.querySelector(`#filter-past`);
    const futureFilter = document.querySelector(`#filter-future`);
    pastFilter.removeAttribute(`disabled`);
    futureFilter.removeAttribute(`disabled`);
    if (!(getFutureWaypointsFilter(waypoints).length)) {
      futureFilter.setAttribute(`disabled`, `true`);
    }
    if (!(getPastWaypointsFilter(waypoints).length)) {
      pastFilter.setAttribute(`disabled`, `true`);
    }
  }

  _addFilterChangeListener(evt) {
    const target = evt.target;
    const targetValue = target.value;
    this._callback.setFilterChange(targetValue);
  }

  setFilterChangeListener(callback) {
    this._callback.setFilterChange = callback;
    this.getElement().addEventListener(`change`, this._addFilterChangeListener);
  }
}
