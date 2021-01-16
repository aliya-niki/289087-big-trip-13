import {render, RenderPosition, remove} from "./utils/render.js";
import {MenuItem, UpdateType} from "./const.js";
import EventsModel from "./model/events.js";
import FiltersModel from "./model/filters.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import TripPresenter from "./presenter/trip.js";
import FiltersPresenter from "./presenter/filters.js";
import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistics.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic fr33d3li78n43bn19`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel();
const filtersModel = new FiltersModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);

const menuComponent = new MenuView();

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

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, eventsModel, filtersModel, destinationsModel, offersModel, api);
const filtersPresenter = new FiltersPresenter(tripControlsElement, filtersModel, eventsModel);
tripPresenter.init();
filtersPresenter.init();

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEvents()
])
  .then(([offers, destinations, events]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    eventsModel.setEvents(UpdateType.INIT, events);
    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(handleMenuClick);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(handleMenuClick);
  });

