import SortView from "../view/sort.js";
import EventsListView from "../view/events-list.js";
import ListEmptyView from "../view/list-empty.js";
import TripInfoView from "../view/trip-info.js";
import LoadingView from "../view/loading.js";
import EventPresenter from "./event.js";
import NewEventPresenter from "./new-event.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {applyFilter} from "../utils/filter.js";
import {UserAction, UpdateType, FilterType, SortType, State} from "../const.js";
import {sortEventsByDate, sortEventsByPrice, sortEventsByTime} from "../utils/sort.js";
import {isOnline} from "../utils/common.js";

export default class TripPresenter {
  constructor(tripMainContainer, tripEventsContainer, eventsModel, filtersModel, destinationsModel, offersModel, api) {
    this._tripMainContainer = tripMainContainer;
    this._tripEventsContainer = tripEventsContainer;
    this._eventsModel = eventsModel;
    this._filtersModel = filtersModel;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;
    this._isLoading = true;
    this._currentSortType = SortType.DEFAULT;

    this._tripInfoComponent = null;
    this._listEmptyComponent = new ListEmptyView();
    this._loadingComponent = new LoadingView();
    this._eventsListComponent = new EventsListView();
    this._sortComponent = null;

    this._eventPresenter = {};

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleView = this._handleView.bind(this);
    this._handleModel = this._handleModel.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._newEventPresenter = new NewEventPresenter(this._eventsListComponent, this._offersModel, this._destinationsModel, this._handleView);
  }

  init() {
    if (!this._isLoading) {
      this._renderTripInfo(this._eventsModel.getEvents());
    }
    this._renderEventsList();
    this._renderTrip();

    this._eventsModel.addObserver(this._handleModel);
    this._filtersModel.addObserver(this._handleModel);
    this._destinationsModel.addObserver(this._handleModel);
    this._offersModel.addObserver(this._handleModel);
  }

  destroy() {
    this._clearTripBoard(true);
    remove(this._eventsListComponent);

    this._eventsModel.removeObserver(this._handleModel);
    this._filtersModel.removeObserver(this._handleModel);
    this._destinationsModel.removeObserver(this._handleModel);
    this._offersModel.removeObserver(this._handleModel);
  }

  createEvent(callback) {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());

    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this._newEventPresenter.init(callback);
  }

  _getEvents() {
    const filterType = this._filtersModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = applyFilter[filterType](events);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredEvents.sort(sortEventsByPrice);
      case SortType.TIME:
        return filteredEvents.sort(sortEventsByTime);
      default:
        return filteredEvents.sort(sortEventsByDate);
    }
  }

  _handleView(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventPresenter[update.id].setViewState(State.SAVING);

        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(State.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._newEventPresenter.setSaving();

        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._newEventPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(State.DELETING);

        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(State.ABORTING);
          });
        break;
    }
  }

  _handleModel(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        if (!isOnline()) {
          window.addEventListener(`online`, () => {
            this._eventPresenter[data.id].init(data);
          });
        }
        break;
      case UpdateType.MINOR:
        this._clearTripBoard();
        this._renderTrip();
        this._renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this._clearTripBoard(true);
        this._renderTrip();
        this._renderTripInfo();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        this._renderTripInfo();
        break;
    }
  }

  _clearTripBoard(resetSortType = false) {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
    this._newEventPresenter.destroy();

    remove(this._sortComponent);
    remove(this._listEmptyComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripBoard();
    this._renderTrip();
  }

  _handleModeChange() {
    this._newEventPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventsListComponent, this._offersModel, this._destinationsModel, this._handleView, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderEvents(events) {
    events.forEach((event) => this._renderEvent(event));
  }

  _renderListEmpty() {
    render(this._tripEventsContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderTripInfo() {
    if (!this._eventsModel.getEvents().length) {
      return;
    }

    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }

    this._tripInfoComponent = new TripInfoView(this._eventsModel.getEvents());
    render(this._tripMainContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (!this._eventsModel.getEvents().length) {
      this._renderListEmpty();
      return;
    }

    this._renderSort();
    this._renderEvents(this._getEvents());
  }
}

