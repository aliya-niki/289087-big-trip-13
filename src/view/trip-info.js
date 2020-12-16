import flatpickr from "flatpickr";
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

const createTripInfoTemplate = (events) => {
  const tripStartDate = events[0].startTime;
  const tripFinishDate = events[events.length - 1].finishTime;
  const startDate = flatpickr.formatDate(tripStartDate, `M d`);
  const finishDate = flatpickr.formatDate(tripFinishDate, `M d`);

  const tripDestinations = new Set();
  events.forEach((event) => tripDestinations.add(event.destination));

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTripDestinations(events)}</h1>

      <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${finishDate}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
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
