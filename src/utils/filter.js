import dayjs from "dayjs";
import {FilterType} from "../const.js";

export const isPastEvent = (finishTime) => {
  return finishTime && dayjs().isAfter(finishTime, `D`);
};

export const isFutureEvent = (startTime) => {
  return startTime && (dayjs(startTime).isAfter(dayjs(), `D`) || dayjs(startTime).isSame(dayjs(), `D`));
};

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.PAST]: (events) => events.filter((event) => isPastEvent(event.finishTime)),
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureEvent(event.startTime))
};
