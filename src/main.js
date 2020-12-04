import {createMenuTemplate} from "./view/menu.js";// Меню
import {createFiltersTemplate} from "./view/filters.js";// Фильтры
import {createTripInfoTemplate} from "./view/trip-info.js";// Информация о маршруте
import {createEditEventFormTemplate} from "./view/edit-event-form.js";// Форма редактирования
import {createTripCostTemplate} from "./view/trip-cost.js";// Стоимость поездки
import {createSortTemplate} from "./view/sort.js";// Сортировка
import {createEventsListTemplate} from "./view/events-list.js";
import {createTripPointTemplate} from "./view/trip-event.js";// Точка маршрута (в списке)
import {createListEmptyTemplate} from "./view/list-empty.js";
import {generateEvent} from "./mock/event.js";
import {sortEventsByDate} from "./utils.js";

const EVENTS_NUMBER = 15;

const events = new Array(EVENTS_NUMBER).fill().map(generateEvent).sort(sortEventsByDate);
const tripStartDate = events[0].startTime;
const tripFinishDate = events[events.length - 1].finishTime;
const tripDestinations = new Set();
events.forEach((event) => tripDestinations.add(event.destination));

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const tripEventsElement = document.querySelector(`.trip-events`);

if (!events) {
  render(tripControlsElements[0], createMenuTemplate(), `afterend`);// Меню
  render(tripControlsElements[1], createFiltersTemplate(), `afterend`);// Фильтры
  render(tripEventsElement, createListEmptyTemplate(), `beforeend`);
} else {
  render(tripMainElement, createTripInfoTemplate(tripStartDate, tripFinishDate, tripDestinations), `afterbegin`);// Информация о маршруте

  const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
  render(tripInfoElement, createTripCostTemplate(), `beforeend`);// Стоимость поездки

  render(tripControlsElements[0], createMenuTemplate(), `afterend`);// Меню
  render(tripControlsElements[1], createFiltersTemplate(), `afterend`);// Фильтры
  render(tripEventsElement, createSortTemplate(), `afterbegin`);// Сортировка

  render(tripEventsElement, createEventsListTemplate(), `beforeend`);
  const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);

  render(tripEventsListElement, createEditEventFormTemplate(events[0]), `beforeend`);// Форма редактирования

  const renderTripEvents = (number) => {
    for (let i = 1; i < number; i++) {
      render(tripEventsListElement, createTripPointTemplate(events[i]), `beforeend`);
    }
  };

  renderTripEvents(EVENTS_NUMBER);
}


