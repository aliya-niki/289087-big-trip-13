import flatpickr from "flatpickr";
import {DESTINATIONS, EVENT_TYPES, OFFERS, DESTINATIONS_DESCRIPTIONS} from "../utils/events.js";
import SmartView from "./smart.js";

const createEventTypeTemplate = (eventType) => {
  return EVENT_TYPES.map((eventTypeItem) => `<div class="event__type-item">
    <input id="event-type-${eventTypeItem.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeItem.toLowerCase()}" ${eventTypeItem === eventType ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${eventTypeItem.toLowerCase()}" for="event-type-${eventTypeItem.toLowerCase()}-1">${eventTypeItem}</label>
  </div>`).join(``);
};

const createOffersTemplate = (offers) => {
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map((offer) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="${offer.id}" ${offer.isChecked ? `checked` : ``}>
      <label class="event__offer-label" for="${offer.id}">
        <span class="event__offer-title">${offer.description}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join(``)}
    </div>
  </section>`;
};

const createPhotoTemplate = (photo) => {
  return `<img class="event__photo" src="${photo}" alt="Event photo"></img>`;
};

const createDescriptionTemplate = (description, photos) => {
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${photos.map((photo) => createPhotoTemplate(photo)).join(``)}
      </div>
    </div>
  </section>`;
};

const createEditEventFormTemplate = (event = {}) => {
  const {destination, description, photos, eventType, offers, startTime, finishTime, price} = event;

  const offersTemplate = createOffersTemplate(offers);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType ? eventType.toLowerCase() : `flight`}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeTemplate(eventType)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${DESTINATIONS.map((destinationItem) => `<option value="${destinationItem}"></option>`).join(``)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime ? flatpickr.formatDate(startTime, `d/m/Y H:i`) : ``}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${finishTime ? flatpickr.formatDate(finishTime, `d/m/Y H:i`) : ``}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${Object.entries(event).length ? `<button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : `<button class="event__reset-btn" type="reset">Cancel</button>`
}

      </header>
      <section class="event__details">
        ${offers.length ? offersTemplate : ``}

        ${destination !== `` ? createDescriptionTemplate(description, photos) : ``}

      </section>
    </form>
  </li>`;
};

export default class EditEventFormView extends SmartView {
  constructor(event) {
    super();
    this._data = EditEventFormView.parseEventToData(event);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._offersCheckHandler = this._offersCheckHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditEventFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.submit);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._eventTypeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationChangeHandler);

    if (this._data.offers.length) {
      this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._offersCheckHandler);
    }
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();
    const getNewEventType = (value) => {
      return EVENT_TYPES.find((type) => type.toLowerCase() === value);
    };
    const newEventType = getNewEventType(evt.target.value);

    this.updateData({
      eventType: newEventType,
      offers: OFFERS.get(newEventType)
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
      description: DESTINATIONS_DESCRIPTIONS.get(evt.target.value).description,
      photos: DESTINATIONS_DESCRIPTIONS.get(evt.target.value).photos,
    });
  }

  _offersCheckHandler(evt) {
    evt.preventDefault();
    let changedOfferIndex = this._data.offers.findIndex((offer) => offer.id === evt.target.id);
    let update = this._data.offers.slice();
    update[changedOfferIndex] = Object.assign(
        {},
        this._data.offers[changedOfferIndex],
        {isChecked: evt.target.checked}
    );

    this.updateData({
      offers: update
    }, true);
  }

  reset(event) {
    this.updateData(EditEventFormView.parseEventToData(event));
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EditEventFormView.parseDataToEvent(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  static parseEventToData(event) {
    return Object.assign({}, event);
  }

  static parseDataToEvent(data) {
    return Object.assign({}, data);
  }
}
