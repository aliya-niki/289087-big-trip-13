import flatpickr from "flatpickr";
import {DESTINATIONS, EVENT_TYPES, getRandomInteger} from "../utils.js";

const createEventTypeTemplate = (eventType) => {
  return EVENT_TYPES.map((eventTypeItem) => `<div class="event__type-item">
    <input id="event-type-${eventTypeItem.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeItem.toLowerCase()}" ${eventTypeItem === eventType ? `checked` : ``}>
    <label class="event__type-label  event__type-label--${eventTypeItem.toLowerCase()}" for="event-type-${eventTypeItem.toLowerCase()}-1">${eventTypeItem}</label>
  </div>`).join(``);
};

const createOfferTemplate = (availableOffers) => {
  let isChecked = () => {
    return Boolean(getRandomInteger(0, 1));
  };
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${availableOffers.map((offer) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${isChecked() ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${offer.id}-1">
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

export const createEditEventFormTemplate = (event = {}) => {
  const {destination, description, photos, eventType, availableOffers, startTime, finishTime, price} = event;

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
        ${availableOffers.length ? createOfferTemplate(availableOffers) : ``}

        ${destination !== `` ? createDescriptionTemplate(description, photos) : ``}

      </section>
    </form>
  </li>`;
};
