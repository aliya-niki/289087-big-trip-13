import dayjs from "dayjs";
import AbstractView from "./abstract.js";

const renderTripDestinations = (events) => {
  const tripDestinations = new Set();
  events.forEach((event) => tripDestinations.add(event.destination));
  const tripList = Array.from(tripDestinations);
  const tripLength = tripList.length;

  let title;
  switch (tripLength) {
    case 3:
      title = `${tripList[0]} &mdash; ${tripList[1]} &mdash; ${tripList[2]}`;
      break;
    case 2:
      title = `${tripList[0]} &mdash; ${tripList[1]}`;
      break;
    case 1:
      title = `${tripList[0]}`;
      break;
    default:
      title = `${tripList[0]} &mdash; &hellip; &mdash; ${tripList[tripLength - 1]}`;
      break;
  }

  return title;
};

const getOffersPrice = (event) => event.offers.reduce((acc, offer) => parseInt(offer.price, 10) + acc, 0);

const getTotalPrice = (events) => {
  return events.reduce((totalPrice, event) => {
    return parseInt(event.price, 10) + getOffersPrice(event) + totalPrice;
  }, 0);
};

const createTripInfoTemplate = (events) => {
  const tripStartDate = events[0].startTime;
  const tripFinishDate = events[events.length - 1].finishTime;
  const startDate = dayjs(tripStartDate).format(`MMM DD`);
  const finishDate = dayjs(tripFinishDate).format(`MMM DD`);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTripDestinations(events)}</h1>

      <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${finishDate}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(events)}</span>
    </p>
  </section>`;
};

export default class TripInfoView extends AbstractView {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
