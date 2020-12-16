import {generateEvent} from "./mock/event.js";
import {sortEventsByDate} from "./utils/events.js";
import TripPresenter from "./presenter/trip.js";

const EVENTS_NUMBER = 15;

const events = new Array(EVENTS_NUMBER).fill().map(generateEvent).sort(sortEventsByDate);

const tripMainElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement);
tripPresenter.init(events);

