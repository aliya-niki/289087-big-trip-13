import {generateEvent} from "./mock/event.js";
import {sortEventsByDate} from "./utils/events.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import EventsModel from "./model/events.js";
import FiltersModel from "./model/filters.js";
import MenuView from "./view/menu.js";
import FiltersPresenter from "./presenter/filter.js";

const EVENTS_NUMBER = 15;

const events = new Array(EVENTS_NUMBER).fill().map(generateEvent).sort(sortEventsByDate);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filtersModel = new FiltersModel();

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);

const tripControlsElements = tripMainElement.querySelector(`.trip-controls`);

const menuComponent = new MenuView();
render(tripControlsElements, menuComponent, RenderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, eventsModel, filtersModel);
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});

const filterPresenter = new FiltersPresenter(tripMainElement, filtersModel, eventsModel);
filterPresenter.init();

