import {getRandomInteger} from "../utils/common.js";

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
        id: `event-offer-${eventType.toLowerCase()}-${i}`,
        description: randomDescription,
        price: getRandomInteger(1, 50),
        isChecked: false
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
  return new Date(a.startTime) - new Date(b.startTime);
};
