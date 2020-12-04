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

export const sortEventsByDate = (a, b) => {
  return new Date(a.startTime) - new Date(b.startTime);
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
