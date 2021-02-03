import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createSortTemplate = (currentSortType) => {
  const isDisabled = (sortType) => sortType === `event` || sortType === `offers`;

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SortType).map((sortType) => `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sortType}"
        ${currentSortType === sortType ? `checked` : ``}
        ${isDisabled(sortType) ? `disabled` : ``}>
      <label class="trip-sort__btn" for="sort-${sortType}" ${isDisabled(sortType) ? `` : `data-sort-type="${sortType}"`}>${sortType}</label>
    </div>`).join(``)}
  </form>`;
};

export default class SortView extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    if (evt.target.closest(`.trip-sort__item`).querySelector(`input`).disabled) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
