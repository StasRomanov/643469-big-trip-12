import Observer from "../util/observer";
import {FilterType} from "../const";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(filter) {
    this._activeFilter = filter;
  }

  getFilter() {
    return this._activeFilter;
  }
}
