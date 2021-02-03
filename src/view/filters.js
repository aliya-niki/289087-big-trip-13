import AbstractView from "./abstract.js";
import {capitalizeFirstLetter} from "../utils/common.js";

const createFiltersTemplate = (filters, activeFilter) => {
  return `<form class="trip-filters" action="#" method="get">
    ${filters.map(({type, number}) => `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === activeFilter ? `checked` : ``} ${number === 0 ? `disabled` : ``}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizeFirstLetter(type)}</label>
    </div>`).join(``)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FiltersView extends AbstractView {
  constructor(filters, activeFilterType) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._activeFilter);
  }

  disableFilters() {
    const filters = this.getElement().querySelectorAll(`.trip-filters__filter-input`);
    filters.forEach((filter) => filter.setAttribute(`disabled`, ``));
  }

  enableFilters() {
    const filters = this.getElement().querySelectorAll(`.trip-filters__filter-input`);
    filters.forEach((filter) => filter.removeAttribute(`disabled`));
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}
