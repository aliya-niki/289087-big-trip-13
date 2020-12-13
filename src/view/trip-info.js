import flatpickr from "flatpickr";
import AbstractView from "./abstract.js";

const renderTripDestinations = (tripList) => {
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

const createTripInfoTemplate = (tripStartDate, tripFinishDate, tripDestinations) => {
  const startDate = flatpickr.formatDate(tripStartDate, `M d`);
  const finishDate = flatpickr.formatDate(tripFinishDate, `M d`);


  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTripDestinations(Array.from(tripDestinations))}</h1>

      <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${finishDate}</p>
    </div>

  </section>`;
};

export default class TripInfoView extends AbstractView {
  constructor(tripStartDate, tripFinishDate, tripDestinations) {
    super();
    this._tripStartDate = tripStartDate;
    this._tripFinishDate = tripFinishDate;
    this._tripDestinations = tripDestinations;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripStartDate, this._tripFinishDate, this._tripDestinations);
  }
}
