import MenuView from "./view/menu.js";// Меню
import FiltersView from "./view/filters.js";// Фильтры
import TripInfoView from "./view/trip-info.js";// Информация о маршруте
import EditEventFormView from "./view/edit-event-form.js";// Форма редактирования
import TripCostView from "./view/trip-cost.js";// Стоимость поездки
import SortView from "./view/sort.js";// Сортировка
import EventsListView from "./view/events-list.js";
import TripEventView from "./view/trip-event.js";// Точка маршрута (в списке)
import ListEmptyView from "./view/list-empty.js";
import {generateEvent} from "./mock/event.js";
import {render, RenderPosition, replace} from "./utils/render.js";
import {sortEventsByDate} from "./utils/events.js";

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
  const eventComponent = new TripEventView(eventElement);
  const editEventComponent = new EditEventFormView(eventElement);

  eventComponent.setClickHandler(() => {
    replace(editEventComponent, eventComponent);
  });

  editEventComponent.setFormSubmitHandler(() => {
    replace(eventComponent, editEventComponent);
  });

  render(eventsListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};


render(tripControlsElements, new MenuView(), RenderPosition.AFTERBEGIN);// Меню
render(tripControlsElements, new FiltersView(), RenderPosition.BEFOREEND);// Фильтры

if (!events) {
  render(tripEventsElement, new ListEmptyView(), RenderPosition.BEFOREEND);
} else {
  const tripInfoComponent = new TripInfoView(tripStartDate, tripFinishDate, tripDestinations);
  render(tripMainElement, tripInfoComponent, RenderPosition.AFTERBEGIN);// Информация о маршруте

  render(tripInfoComponent, new TripCostView(), RenderPosition.BEFOREEND);// Стоимость поездки

  render(tripEventsElement, new SortView(), RenderPosition.AFTERBEGIN);// Сортировка

  const eventsListComponent = new EventsListView();
  render(tripEventsElement, eventsListComponent, RenderPosition.BEFOREEND);

  const renderTripEvents = (number) => {
    for (let i = 0; i < number; i++) {
      renderEvent(eventsListComponent, events[i]);
    }
  };

  renderTripEvents(EVENTS_NUMBER);
}
