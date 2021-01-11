import dayjs from "dayjs";
import {getRandomInteger} from "../utils/common.js";

export const BLANK_EVENT = {
  destination: ``,
  description: ``,
  photos: ``,
  eventType: ``,
  offers: [],
  startTime: new Date(),
  finishTime: new Date(),
  price: 0,
  isFavorite: false
};

export const DESTINATIONS = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Paris`,
  `Zurich`,
  `London`,
  `Stuttgart`
];

export const EVENT_TYPES = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];


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

      availableOffers.push({
        type: eventType.toLowerCase(),
        id: `${eventType.toLowerCase()}-${i}`,
        description: randomDescription,
        price: getRandomInteger(1, 50),
        isChecked: Boolean(getRandomInteger(0, 1))
      });

    }
    offers.set(eventType, availableOffers);
  });
  return offers;
};

export const OFFERS = generateOffers();

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

const generateDestinationPhoto = () => {
  let photos = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    photos.push(`img/photos/${getRandomInteger(1, 5)}.jpg`);
  }
  return photos;
};

const generateDestinationsDescriptions = () => {
  let destinationsDescriptions = new Map();
  DESTINATIONS.forEach((destination) => {
    let destinationDescription = ``;

    for (let i = 0; i < getRandomInteger(1, 5); i++) {
      let randomIndex = getRandomInteger(0, descriptions.length - 1);
      destinationDescription += descriptions[randomIndex];
    }

    destinationsDescriptions.set(destination, {
      description: destinationDescription,
      photos: generateDestinationPhoto()
    });
  });

  return destinationsDescriptions;
};


export const DESTINATIONS_DESCRIPTIONS = generateDestinationsDescriptions();

export const sortEventsByDate = (a, b) => {
  return dayjs(a.startTime).diff(b.startTime);
};

export const sortEventsByTime = (a, b) => {
  return dayjs(b.finishTime).diff(b.startTime, `minute`) - dayjs(a.finishTime).diff(a.startTime, `minute`);
};

export const sortEventsByPrice = (a, b) => {
  return b.price - a.price;
};
