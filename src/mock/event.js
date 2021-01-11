import dayjs from "dayjs";
import {getRandomInteger, generateId} from "../utils/common.js";
import {DESTINATIONS, EVENT_TYPES, OFFERS, DESTINATIONS_DESCRIPTIONS} from "../utils/events.js";

const generateDate = () => {
  const maxDaysGap = 10;
  const daysGap = getRandomInteger(0, maxDaysGap);

  return dayjs().add(daysGap, `day`).toDate();
};

const generateFinishTime = (date) => {
  return dayjs(date).add(getRandomInteger(0, 48), `hours`).add(getRandomInteger(0, 60), `minutes`).toDate();
};

const generateDestination = (destinations) => {
  const randomIndex = getRandomInteger(0, destinations.length - 1);
  return destinations[randomIndex];
};

const generateEventType = (eventTypes) => {
  const randomIndex = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[randomIndex];
};

export const generateEvent = () => {
  let startTime = generateDate();
  let finishTime = generateFinishTime(startTime);
  let eventType = generateEventType(EVENT_TYPES);
  let offers = OFFERS.get(eventType);
  let destination = generateDestination(DESTINATIONS);
  return {
    destination,
    description: DESTINATIONS_DESCRIPTIONS.get(destination).description,
    photos: DESTINATIONS_DESCRIPTIONS.get(destination).photos,
    eventType,
    offers,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    startTime,
    finishTime,
    price: getRandomInteger(0, 1000),
    id: generateId()
  };
};
