import MenuView from "./view/menu.js";// Меню
import FiltersView from "./view/filters.js";// Фильтры
import TripInfoView from "./view/trip-info.js";// Информация о маршруте
import EditEventFormView from "./view/edit-event-form.js";// Форма редактирования
import TripCostView from "./view/trip-cost.js";// Стоимость поездки
import SortView from "./view/sort.js";// Сортировка
import EventsListView from "./view/events-list.js";
import EventView from "./view/trip-event.js";// Точка маршрута (в списке)
import ListEmptyMessageView from "./view/list-empty.js";
import {generateEvent} from "./mock/event.js";
import {sortEventsByDate, render, RenderPosition} from "./utils.js";

const EVENTS_NUMBER = 15;

const events = new Array(EVENTS_NUMBER).fill().map(generateEvent).sort(sortEventsByDate);
const tripStartDate = events[0].startTime;
const tripFinishDate = events[events.length - 1].finishTime;
const tripDestinations = new Set();
events.forEach((event) => tripDestinations.add(event.destination));

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElements = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const renderEvent = (eventsListElement, eventElement) => {
  const eventComponent = new EventView(eventElement);
  const editEventComponent = new EditEventFormView(eventElement);

  const replaceFormToEvent = () => {
    eventsListElement.replaceChild(eventComponent.getElement(), editEventComponent.getElement());
  };
  const replaceEventToForm = () => {
    eventsListElement.replaceChild(editEventComponent.getElement(), eventComponent.getElement());
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToForm();
  });

  editEventComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
  });

  render(eventsListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};


render(tripControlsElements, new MenuView().getElement(), RenderPosition.AFTERBEGIN);// Меню
render(tripControlsElements, new FiltersView().getElement(), RenderPosition.BEFOREEND);// Фильтры

if (!events) {
  render(tripEventsElement, new ListEmptyMessageView().getElement(), RenderPosition.BEFOREEND);
} else {
  const tripInfoComponent = new TripInfoView(tripStartDate, tripFinishDate, tripDestinations);
  render(tripMainElement, tripInfoComponent.getElement(), RenderPosition.AFTERBEGIN);// Информация о маршруте

  render(tripInfoComponent.getElement(), new TripCostView().getElement(), RenderPosition.BEFOREEND);// Стоимость поездки

  render(tripEventsElement, new SortView().getElement(), RenderPosition.AFTERBEGIN);// Сортировка

  const eventsListComponent = new EventsListView();
  render(tripEventsElement, eventsListComponent.getElement(), RenderPosition.BEFOREEND);

  const renderTripEvents = (number) => {
    for (let i = 0; i < number; i++) {
      renderEvent(eventsListComponent.getElement(), events[i]);
    }
  };

  renderTripEvents(EVENTS_NUMBER);
}
