import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";
import {DESTINATIONS, EVENT_TYPES} from "../utils/events.js";

const offersDescriptions = [
  `Add luggage`,
  `Switch to comfort`,
  `Add meal`,
  `Choose seats`,
  `Travel by train`,
  `Book tickets`,
  `Lunch in city`,
  `Add breakfast`,
  `Order Uber`,
];

const generateOffers = () => {
  const offers = new Map();
  EVENT_TYPES.forEach((eventType) => {
    let availableOffers = [];
    let offersNumber = getRandomInteger(0, 5);

    for (let i = 0; i < offersNumber; i++) {
      let randomIndex = getRandomInteger(0, offersDescriptions.length - 1);
      let randomDescription = offersDescriptions[randomIndex];
      if (!availableOffers.find((item) => item.description === randomDescription)) {
        availableOffers.push({
          name: randomDescription.replaceAll(` `, `-`).toLowerCase(),
          type: eventType.toLowerCase(),
          description: randomDescription,
          price: getRandomInteger(1, 50),
          isChecked: Boolean(getRandomInteger(0, 1))
        });
      }
    }
    offers.set(eventType, availableOffers);
  });
  return offers;
};
const offers = generateOffers();

const generateDate = () => {
  const maxDaysGap = 10;
  const daysGap = getRandomInteger(0, maxDaysGap);

  return dayjs().add(daysGap, `day`).toDate();
};

const generateFinishTime = (date) => {
  return dayjs(date).add(getRandomInteger(0, 48), `hours`).add(getRandomInteger(0, 60), `minutes`).toDate();
};


const generateDestinationDescription = () => {
  const maxLength = 5;

  const descriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. `,
    `Cras aliquet varius magna, non porta ligula feugiat eget. `,
    `Fusce tristique felis at fermentum pharetra. `,
    `Aliquam id orci ut lectus varius viverra. `,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. `,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. `,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. `,
    `Sed sed nisi sed augue convallis suscipit in sed felis. `,
    `Aliquam erat volutpat. `,
    `Nunc fermentum tortor ac porta dapibus. `,
    `In rutrum ac purus sit amet tempus. `
  ];

  let destinationDescription = ``;

  for (let i = 0; i < getRandomInteger(1, maxLength); i++) {
    let randomIndex = getRandomInteger(0, descriptions.length - 1);
    destinationDescription += descriptions[randomIndex];
  }

  return destinationDescription;
};

const generateDestination = (destinations) => {
  const randomIndex = getRandomInteger(0, destinations.length - 1);
  return destinations[randomIndex];
};

const generateEventType = (eventTypes) => {
  const randomIndex = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[randomIndex];
};

const generateDestinationPhoto = () => {
  let photos = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    photos.push(`img/photos/${getRandomInteger(1, 5)}.jpg`);
  }
  return photos;
};

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateEvent = () => {
  let startTime = generateDate();
  let finishTime = generateFinishTime(startTime);
  let duration = dayjs(finishTime).diff(startTime, `minute`);
  let eventType = generateEventType(EVENT_TYPES);
  let availableOffers = offers.get(eventType);
  return {
    destination: generateDestination(DESTINATIONS),
    description: generateDestinationDescription(),
    photos: generateDestinationPhoto(),
    eventType,
    offers: availableOffers,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    startTime,
    finishTime,
    duration,
    price: getRandomInteger(0, 1000),
    id: generateId()
  };
};
