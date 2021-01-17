import dayjs from "dayjs";
import AbstractView from "./abstract.js";

const MIN_IN_DAY = 1440;
const MIN_IN_HOUR = 60;

const durationFormat = (durationInMin) => {
  let days = Math.floor(durationInMin / MIN_IN_DAY);
  let hours = Math.floor((durationInMin - days * MIN_IN_DAY) / MIN_IN_HOUR);
  let minutes = durationInMin - days * MIN_IN_DAY - hours * MIN_IN_HOUR;
  return `${days ? String(days).padStart(2, `0`) + `D ` : ``} ${hours ? String(hours).padStart(2, `0`) + `H ` : ``} ${String(minutes).padStart(2, `0`) + `M`}`;
};

const createOfferTemplate = (offers) => {
  return offers.map((offer) => `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`).join(``);
};

const createTripEventTemplate = (event) => {
  const {destination, type, offers, startTime, finishTime, price, isFavorite} = event;

  const duration = dayjs(finishTime).diff(startTime, `minute`);

  const favoriteActive = isFavorite ? `event__favorite-btn--active` : ``;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dayjs(startTime).format(`YYYY-MM-DD`)}">${dayjs(startTime).format(`MMM DD`)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dayjs(startTime)}">${dayjs(startTime).format(`HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dayjs(finishTime)}">${dayjs(finishTime).format(`HH:mm`)}</time>
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

export default class TripEventView extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
