import EventsModel from "../model/events.js";
import {isOnline} from "../utils/common.js";

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.event);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, eventsStore, offersStore, destinationsStore) {
    this._api = api;
    this._eventsStore = eventsStore;
    this._offersStore = offersStore;
    this._destinationsStore = destinationsStore;
  }

  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventsModel.adaptToServer));
          this._eventsStore.setItems(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._eventsStore.getItems());

    return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._offersStore.setItems(offers);
          return offers;
        });
    }

    const storeOffers = Object.values(this._offersStore.getItems());

    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._destinationsStore.setItems(destinations);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._destinationsStore.getItems());

    return Promise.resolve(storeDestinations);
  }

  updateEvent(event) {
    if (isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._eventsStore.setItem(updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._eventsStore.setItem(event.id, EventsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._eventsStore.setItem(newEvent.id, EventsModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    return Promise.reject(new Error(`Add event failed`));
  }

  deleteEvent(event) {
    if (isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._eventsStore.removeItem(event.id));
    }

    return Promise.reject(new Error(`Delete event failed`));
  }

  sync() {
    if (isOnline()) {
      const storeEvents = Object.values(this._eventsStore.getItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);

          const items = createStoreStructure([...createdEvents, ...updatedEvents]);

          this._eventsStore.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
