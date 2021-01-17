import dayjs from "dayjs";

export const sortEventsByDate = (a, b) => {
  return dayjs(a.startTime).diff(b.startTime);
};

export const sortEventsByTime = (a, b) => {
  return dayjs(b.finishTime).diff(b.startTime, `minute`) - dayjs(a.finishTime).diff(a.startTime, `minute`);
};

export const sortEventsByPrice = (a, b) => {
  return b.price - a.price;
};

