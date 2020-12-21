import SortView from "../view/sort.js";
import EventsListView from "../view/events-list.js";
import ListEmptyView from "../view/list-empty.js";
import TripInfoView from "../view/trip-info.js";
import MenuView from "../view/menu.js";
import FiltersView from "../view/filters.js";
import EventPresenter from "./event.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";

export default class TripPresenter {
  constructor(tripMainContainer, tripEventsContainer) {
    this._tripMainContainer = tripMainContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._eventsListComponent = new EventsListView();
    this._sortComponent = new SortView();
    this._menuComponent = new MenuView();
    this._filtersComponent = new FiltersView();
    this._listEmptyComponent = new ListEmptyView();
    this._eventPresenter = {};
    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._renderTrip();
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._eventPresenter[updatedEvent.id].init(updatedEvent);
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _clearEventsList() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(eventElement) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(eventElement);
    this._eventPresenter[eventElement.id] = eventPresenter;
  }

  _renderEvents(events) {
    const EVENTS_NUMBER = 15;
    for (let i = 0; i < EVENTS_NUMBER; i++) {
      this._renderEvent(events[i]);
    }
  }

  _renderListEmpty() {
    render(this._tripEventsContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    const tripInfoComponent = new TripInfoView(this._events);
    render(this._tripMainContainer, tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripControls() {
    const tripControlsElements = this._tripMainContainer.querySelector(`.trip-controls`);
    render(tripControlsElements, this._menuComponent, RenderPosition.AFTERBEGIN);
    render(tripControlsElements, this._filtersComponent, RenderPosition.BEFOREEND);
  }

  _renderEventsList() {
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    this._renderTripControls();
    if (this._events.length === 0) {
      this._renderListEmpty();
      return;
    }
    this._renderTripInfo();
    this._renderSort();
    this._renderEventsList();
    this._renderEvents(this._events);
  }
}

