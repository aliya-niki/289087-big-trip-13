import flatpickr from "flatpickr";

export const createTripInfoTemplate = (tripStartDate, tripFinishDate, tripDestinations) => {
  const startDate = flatpickr.formatDate(tripStartDate, `M d`);
  const finishDate = flatpickr.formatDate(tripFinishDate, `M d`);
  const createTitleTemplate = (title) => {
    return `<h1 class="trip-info__title">${title}</h1>`;
  };
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

    return createTitleTemplate(title);
  };

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${renderTripDestinations(Array.from(tripDestinations))}</h1>

      <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${finishDate}</p>
    </div>

  </section>`;
};
