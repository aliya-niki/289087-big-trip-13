import dayjs from "dayjs";

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

const destinationsList = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Paris`,
  `Zurich`,
  `London`,
  `Stuttgart`
];

const generateDestination = (destinations) => {
  const randomIndex = getRandomInteger(0, destinations.length - 1);
  return destinations[randomIndex];
};

const eventTypesList = [
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

const generateEventType = (eventTypes) => {
  const randomIndex = getRandomInteger(0, eventTypes.length - 1);
  return eventTypes[randomIndex];
};

const offersList = [
  {
    description: `Add luggage`,
    type: `luggage`,
    price: `30`,
  },
  {
    description: `Switch to comfort`,
    type: `comfort`,
    price: `100`,
  },
  {
    description: `Add meal`,
    type: `meal`,
    price: `15`,
  },
  {
    description: `Choose seats`,
    type: `seats`,
    price: `5`,
  },
  {
    description: `Travel by train`,
    type: `train`,
    price: `40`,
  },
  {
    description: `Book tickets`,
    type: `tickets`,
    price: `40`,
  },
  {
    description: `Lunch in city`,
    type: `lunch`,
    price: `30`,
  },
  {
    description: `Add breakfast`,
    type: `breakfast`,
    price: `50`,
  },
  {
    description: `Order Uber`,
    type: `uber`,
    price: `20`,
  }
];

const generateOffers = () => {
  const maxOffersNumber = 5;

  let offers = new Set();
  for (let i = 0; i < getRandomInteger(1, maxOffersNumber); i++) {
    let randomIndex = getRandomInteger(0, offersList.length - 1);
    offers.add(offersList[randomIndex]);
  }
  return Array.from(offers);
};

const offers = new Map();
eventTypesList.forEach((eventType) => {
  offers.set(eventType, generateOffers());
});

const generateDestinationPhoto = () => {
  let photos = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    photos.push(`img/photos/${getRandomInteger(1, 5)}.jpg`);
  }
  return photos;
};


const generateEvent = () => {
  let startTime = generateDate();
  let finishTime = generateFinishTime(startTime);
  let duration = dayjs(finishTime).diff(startTime, `minute`);
  let eventType = generateEventType(eventTypesList);
  return {
    destination: generateDestination(destinationsList),
    description: generateDestinationDescription(),
    destinationPhotos: generateDestinationPhoto(),
    eventType,
    offers: offers.get(eventType),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    startTime,
    finishTime,
    duration,
    price: getRandomInteger(0, 1000)
  };
};

export {destinationsList, eventTypesList, generateEvent};
