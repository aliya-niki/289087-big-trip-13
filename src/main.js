import {createMenuTemplate} from "./view/menu.js";// Меню
import {createFiltersTemplate} from "./view/filters.js";// Фильтры
import {createTripInfoTemplate} from "./view/trip-info.js";// Информация о маршруте
import {createEditEventFormTemplate} from "./view/edit-event-form.js";// Форма редактирования
import {createAddNewEventFormTemplate} from "./view/add-new-event-form.js";// Форма создания
import {createTripCostTemplate} from "./view/trip-cost.js";// Стоимость поездки
import {createSortTemplate} from "./view/sort.js";// Сортировка
import {createTripPointTemplate} from "./view/trip-event.js";// Точка маршрута (в списке)

const EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsMenuElement = tripMainElement.querySelector(`.trip-controls__menu`);
const tripControlsFiltersElement = tripMainElement.querySelector(`.trip-controls__filters`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);// Информация о маршруте

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(), `beforeend`);// Стоимость поездки

render(tripControlsMenuElement, createMenuTemplate(), `afterend`);// Меню
render(tripControlsFiltersElement, createFiltersTemplate(), `afterend`);// Фильтры
render(tripEventsElement, createSortTemplate(), `beforeend`);// Сортировка

render(tripEventsElement, `<ul class="trip-events__list"></ul>`, `beforeend`);
const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);
render(tripEventsListElement, createEditEventFormTemplate(), `beforeend`);// Форма редактирования
render(tripEventsListElement, createAddNewEventFormTemplate(), `beforeend`);// Форма создания

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsListElement, createTripPointTemplate(), `beforeend`);// Точка маршрута (в списке)
}
