import Observer from "../utils/observer.js";
import {capitalizeFirstLetter} from "../utils/common.js";

export default class EventsModel extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this.notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this.notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this.notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this.notify(updateType);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          photos: event.destination.pictures,
          description: event.destination.description,
          destination: event.destination.name,
          type: capitalizeFirstLetter(event.type),
          price: event.base_price,
          startTime: event.date_from,
          finishTime: event.date_to,
          isFavorite: event.is_favorite,
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          "destination": {
            "name": event.destination,
            "description": event.description,
            "pictures": event.photos
          },
          "base_price": event.price,
          "date_from": event.startTime,
          "date_to": event.finishTime,
          "is_favorite": event.isFavorite,
          "type": event.type.toLowerCase()
        }
    );
    delete adaptedEvent.photos;
    delete adaptedEvent.description;
    delete adaptedEvent.price;
    delete adaptedEvent.startTime;
    delete adaptedEvent.finishTime;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
