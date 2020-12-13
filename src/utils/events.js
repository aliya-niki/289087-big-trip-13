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
