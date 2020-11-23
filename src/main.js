import {createMenuTemplate} from "./view/menu.js";// Меню
import {createFiltersTemplate} from "./view/filters.js";// Фильтры
import {createTripInfoTemplate} from "./view/trip-info.js";// Информация о маршруте
import {createEditEventFormTemplate} from "./view/edit-event-form.js";// Форма редактирования
import {createAddNewEventFormTemplate} from "./view/add-new-event-form.js";// Форма создания
import {createTripCostTemplate} from "./view/trip-cost.js";// Стоимость поездки
import {createSortTemplate} from "./view/sort.js";// Сортировка
import {createEventsListTemplate} from "./view/events-list.js";
import {createTripPointTemplate} from "./view/trip-event.js";// Точка маршрута (в списке)

const EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripMainElement, createTripInfoTemplate(), `afterbegin`);// Информация о маршруте

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(), `beforeend`);// Стоимость поездки

render(tripControlsElements[0], createMenuTemplate(), `afterend`);// Меню
render(tripControlsElements[1], createFiltersTemplate(), `afterend`);// Фильтры
render(tripEventsElement, createSortTemplate(), `afterbegin`);// Сортировка

render(tripEventsElement, createEventsListTemplate(), `beforeend`);
const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);
render(tripEventsListElement, createEditEventFormTemplate(), `beforeend`);// Форма редактирования
render(tripEventsListElement, createAddNewEventFormTemplate(), `beforeend`);// Форма создания

const renderTripEvents = (number) => {
  for (let i = 0; i < number; i++) {
    render(tripEventsListElement, createTripPointTemplate(), `beforeend`);
  }
};

renderTripEvents(EVENTS_COUNT);// Точка маршрута (в списке)


