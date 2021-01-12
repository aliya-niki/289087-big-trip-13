import {generateEvent} from "./mock/event.js";
import {sortEventsByDate} from "./utils/events.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {MenuItem} from "./const.js";
import EventsModel from "./model/events.js";
import FiltersModel from "./model/filters.js";
import TripPresenter from "./presenter/trip.js";
import FiltersPresenter from "./presenter/filters.js";
import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistics.js";

const EVENTS_NUMBER = 15;

const events = new Array(EVENTS_NUMBER).fill().map(generateEvent).sort(sortEventsByDate);

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const filtersModel = new FiltersModel();

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, eventsModel, filtersModel);
tripPresenter.init();

const filtersPresenter = new FiltersPresenter(tripControlsElement, filtersModel, eventsModel);
filtersPresenter.init();

const menuComponent = new MenuView();
render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);

let statisticsComponent = null;

const handleCreateEventFormClose = () => {
  tripMainElement.querySelector(`.trip-main__event-add-btn`).disabled = false;
};

const newEventClickHandler = (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent(handleCreateEventFormClose);
  tripMainElement.querySelector(`.trip-main__event-add-btn`).disabled = true;
  if (menuComponent.getElement().querySelector(`.trip-tabs__btn--active`).dataset.value === MenuItem.STATS) {
    tripPresenter.init();
    remove(statisticsComponent);
    menuComponent.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
    menuComponent.getElement().querySelector(`[data-value="${MenuItem.TABLE}"]`).classList.add(`trip-tabs__btn--active`);
  }
};

tripMainElement.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, newEventClickHandler);

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(tripEventsElement, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(handleMenuClick);

