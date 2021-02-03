import dayjs from "dayjs";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import {isOnline} from "../utils/common.js";
import {BLANK_EVENT, EVENT_TYPES} from "../utils/events.js";
import SmartView from "./smart.js";

const REGEX_PRICE = /^\d*$/;

const createEventTypeTemplate = (eventType) => {
  return EVENT_TYPES.map((eventTypeItem) => `<div class="event__type-item">
    <input id="event-type-${eventTypeItem.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeItem.toLowerCase()}" ${eventTypeItem === eventType ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${eventTypeItem.toLowerCase()}" for="event-type-${eventTypeItem.toLowerCase()}-1">${eventTypeItem}</label>
  </div>`).join(``);
};

const createOffersTemplate = (offers, availableOffers, isDisabled) => {
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${availableOffers.map((offer) => {
    const {title, price} = offer;
    const id = title.split(` `).join(`-`).toLowerCase();
    const isChecked = offers.find((item) => offer.title === item.title);

    return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${id}" type="checkbox" name="event-offer-${id}" ${isChecked ? `checked` : ``} ${isDisabled ? `disabled` : ``} data-id=${id}>
          <label class="event__offer-label" for="event-offer-${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`;
  }).join(``)}
    </div>
  </section>`;
};

const createPhotoTemplate = (photo) => {
  if (!isOnline()) {
    return ``;
  }
  return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
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

const createEditEventFormTemplate = (event, allOffers, allDestinations, isNewEvent) => {
  const availableDestinations = [...allDestinations.keys()];
  const {destination, description, photos, type, offers, startTime, finishTime, price, isDisabled, isSaving, isDeleting} = event;
  const isSubmitButtonDisabled = !destination || !dayjs(finishTime).isAfter(dayjs(startTime).toDate());

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypeTemplate(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" ${isDisabled ? `disabled` : ``}>
          <datalist id="destination-list-1">
            ${availableDestinations ? availableDestinations.map((destinationItem) => `<option value="${destinationItem}"></option>`).join(``) : ``}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(startTime).format(`DD/MM/YYYY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(finishTime).format(`DD/MM/YYYY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" ${isDisabled ? `disabled` : ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitButtonDisabled || isDisabled ? `disabled` : ``}>
          ${isSaving ? `Saving...` : `Save`}
        </button>
        ${!isNewEvent ? `<button class="event__reset-btn" type="reset">
          ${isDeleting ? `Deleting...` : `Delete`}
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : `<button class="event__reset-btn" type="reset">Cancel</button>`
}

      </header>
      <section class="event__details">
        ${allOffers.get(type.toLowerCase()).length ? createOffersTemplate(offers, allOffers.get(type.toLowerCase()), isDisabled) : ``}

        ${destination !== `` ? createDescriptionTemplate(description, photos) : ``}

      </section>
    </form>
  </li>`;
};

export default class EditEventFormView extends SmartView {
  constructor(event = BLANK_EVENT, allOffers, allDestinations, isNewEvent = false) {
    super();
    this._data = EditEventFormView.parseEventToData(event);
    this._allOffers = allOffers;
    this._allDestinations = allDestinations;
    this._isNewEvent = isNewEvent;

    this._startTimePicker = null;
    this._finishTimePicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteEventClickHandler = this._deleteEventClickHandler.bind(this);
    this._rollupButtonClickHandler = this._rollupButtonClickHandler.bind(this);

    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._offersCheckHandler = this._offersCheckHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._startTimeChangeHandler = this._startTimeChangeHandler.bind(this);
    this._finishTimeChangeHandler = this._finishTimeChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  getTemplate() {
    return createEditEventFormTemplate(this._data, this._allOffers, this._allDestinations, this._isNewEvent);
  }

  removeElement() {
    super.removeElement();

    this._destroyDatepicker(this._startTimePicker);
    this._destroyDatepicker(this._finishTimePicker);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.setFormSubmitHandler(this._callback.submit);

    if (!this._isNewEvent) {
      this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    }

    this.setDeleteEventClickHandler(this._callback.deleteEvent);
  }

  reset(event) {
    this.updateData(EditEventFormView.parseEventToData(event));
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setDeleteEventClickHandler(callback) {
    this._callback.deleteEvent = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteEventClickHandler);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._rollupButtonClickHandler);
  }

  _destroyDatepicker(datepicker) {
    if (datepicker) {
      datepicker.destroy();
      datepicker = null;
    }
  }

  _setDatepicker() {
    this._destroyDatepicker(this._startTimePicker);
    this._destroyDatepicker(this._finishTimePicker);

    this._startTimePicker = flatpickr(
        this.getElement().querySelector(`#event-start-time-1`),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: `d/m/Y H:i`,
          defaultDate: this._data.startTime,
          onChange: this._startTimeChangeHandler
        }
    );

    this._finishTimePicker = flatpickr(
        this.getElement().querySelector(`#event-end-time-1`),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: `d/m/Y H:i`,
          defaultDate: this._data.finishTime,
          onChange: this._finishTimeChangeHandler
        }
    );
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, this._eventTypeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceInputHandler);

    if (this._allOffers.get(this._data.type.toLowerCase()).length) {
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
      type: newEventType,
      offers: []
    });
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();
    const availableDestinations = [...this._allDestinations.keys()];
    if (!availableDestinations.includes(evt.target.value)) {
      evt.target.setCustomValidity(`Choose from suggested values`);
      evt.target.reportValidity();
      return;
    }
    this.updateData({
      destination: evt.target.value,
      description: this._allDestinations.get(evt.target.value).description,
      photos: this._allDestinations.get(evt.target.value).photos,
    });
  }

  _offersCheckHandler(evt) {
    evt.preventDefault();
    let updatedOffers = this._data.offers.slice();
    const availableOffers = this._allOffers.get(this._data.type.toLowerCase());
    const clickedOfferTitle = evt.target.closest(`div`).querySelector(`.event__offer-title`).textContent;

    if (!this._data.offers.find(({title}) => title === clickedOfferTitle)) {
      updatedOffers.push(availableOffers.find(({title}) => title === clickedOfferTitle));
    } else {
      updatedOffers = updatedOffers.filter(({title}) => title !== clickedOfferTitle);
    }

    this.updateData({
      offers: updatedOffers
    }, true);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    let validityMessage = ``;

    if (!REGEX_PRICE.test(evt.target.value)) {
      validityMessage = `Use numbers`;
    }
    evt.target.setCustomValidity(validityMessage);
    evt.target.reportValidity();

    this.updateData({
      price: parseInt(evt.target.value, 10)
    }, true);

  }

  _startTimeChangeHandler([userDate]) {
    this.updateData({
      startTime: dayjs(userDate).toDate()
    });
  }

  _finishTimeChangeHandler([userDate]) {
    this.updateData({
      finishTime: dayjs(userDate).toDate()
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EditEventFormView.parseDataToEvent(this._data));
  }

  _deleteEventClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteEvent(EditEventFormView.parseDataToEvent(this._data));
  }

  _rollupButtonClickHandler(event) {
    this._callback.rollupButtonClick(EditEventFormView.parseEventToData(event));
  }

  static parseEventToData(event) {
    return Object.assign(
        {},
        event,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToEvent(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
