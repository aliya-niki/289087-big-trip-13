import flatpickr from "flatpickr";
import {getRandomInteger, createElement} from "../utils.js";

const MIN_IN_DAY = 1440;
const MIN_IN_HOUR = 60;

const createOfferTemplate = (offers) => {
  return offers.map((offer) => {
    let isChecked = Boolean(getRandomInteger(0, 1));
    return isChecked ? `<li class="event__offer">
      <span class="event__offer-title">${offer.description}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>` : ``;
  }).join(``);
};

const createTripEventTemplate = (event) => {
  const {destination, eventType, offers, startTime, finishTime, duration, price, isFavorite} = event;

  const durationFormat = (durationInMin) => {
    let days = Math.floor(durationInMin / MIN_IN_DAY);
    let hours = Math.floor((durationInMin - days * MIN_IN_DAY) / MIN_IN_HOUR);
    let minutes = durationInMin - days * MIN_IN_DAY - hours * MIN_IN_HOUR;
    return `${days ? days + `D ` : ``} ${hours ? hours + `H ` : ``} ${minutes ? minutes + `M` : `00M`}`;
  };

  const favoriteActive = isFavorite ? `event__favorite-btn--active` : ``;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${flatpickr.formatDate(startTime, `Y-m-d`)}">${flatpickr.formatDate(startTime, `M d`)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventType} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${flatpickr.formatDate(startTime, `Y-m-dTH:i`)}">${flatpickr.formatDate(startTime, `H:i`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${flatpickr.formatDate(finishTime, `Y-m-dTH:i`)}">${flatpickr.formatDate(finishTime, `H:i`)}</time>
        </p>
        <p class="event__duration">${durationFormat(duration)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${createOfferTemplate(offers)}
      </ul>
      <button class="event__favorite-btn ${favoriteActive}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Event {
  constructor(event) {
    this._event = event;
    this._element = null;
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
