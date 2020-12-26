import SortView from "../view/sort.js";
import EventsListView from "../view/events-list.js";
import ListEmptyView from "../view/list-empty.js";
import TripInfoView from "../view/trip-info.js";

import EventPresenter from "./event.js";
import NewEventPresenter from "./new-event.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {UserAction, UpdateType, FilterType} from "../const.js";

export default class TripPresenter {
  constructor(tripMainContainer, tripEventsContainer, eventsModel, filtersModel) {
    this._tripMainContainer = tripMainContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;

    this._eventsListComponent = new EventsListView();
    this._sortComponent = new SortView();
    this._listEmptyComponent = new ListEmptyView();

    this._eventPresenter = {};

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleView = this._handleView.bind(this);
    this._handleModel = this._handleModel.bind(this);

    this._eventsModel.addObserver(this._handleModel);
    this._filtersModel.addObserver(this._handleModel);

    this._newEventPresenter = new NewEventPresenter(this._eventsListComponent, this._handleView);
  }

  init() {
    this._tripInfoComponent = new TripInfoView(this._getEvents());
    this._renderTrip();
  }

  createEvent() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());

    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newEventPresenter.init();
  }

  _getEvents() {
    const filterType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    return filteredEvents;
  }

  _handleView(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModel(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTripBoard();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTripBoard();
        this._renderTrip();
        break;
    }
  }

  _clearTripBoard() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
    this._newEventPresenter.destroy();

    remove(this._sortComponent);
    remove(this._listEmptyComponent);
    remove(this._eventsListComponent);
    remove(this._tripInfoComponent);
  }

  _handleModeChange() {
    this._newEventPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(eventElement) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._handleView, this._handleModeChange);
    eventPresenter.init(eventElement);
    this._eventPresenter[eventElement.id] = eventPresenter;
  }

  _renderEvents(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _renderListEmpty() {
    render(this._tripEventsContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo(events) {
    this._tripInfoComponent = new TripInfoView(events);
    render(this._tripMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (!this._getEvents().length) {
      this._renderListEmpty();
      return;
    }

    this._renderTripInfo(this._getEvents());
    this._renderSort();
    this._renderEventsList();
    this._renderEvents(this._getEvents());
  }
}

