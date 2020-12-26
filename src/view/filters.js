import AbstractView from "./abstract.js";

const createFiltersTemplate = (filters, activeFilter) => {
  const capitalizeFirstLetter = (str) => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
  };

  return `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => `<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" ${filter === activeFilter ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${capitalizeFirstLetter(filter)}</label>
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

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
