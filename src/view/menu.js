import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createMenuTemplate = () => {
  const defaultActiveTab = MenuItem.TABLE;
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${Object.values(MenuItem).map((menuItem) =>
    `<a class="trip-tabs__btn  ${menuItem === defaultActiveTab ? `trip-tabs__btn--active` : ``}" href="#" data-value="${menuItem}">${menuItem}</a>`
  ).join(``)}
  </nav>`;
};

export default class MenuView extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();

    this.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
    evt.target.classList.add(`trip-tabs__btn--active`);

    this._callback.menuClick(evt.target.dataset.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
