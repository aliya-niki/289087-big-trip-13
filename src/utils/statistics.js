import dayjs from "dayjs";

export const getMoney = (events, type) => {
  return events.filter((event) => event.eventType === type).reduce((sum, current) => {
    return sum + current.price;
  }, 0);
};

export const getEventsNumber = (events, type) => {
  return events.filter((event) => event.eventType === type).length;
};

export const getTimeSpend = (events, type) => {
  const countDuration = (item) => {
    return dayjs(item.finishTime).diff(item.startTime, `hour`);
  };
  return events.filter((event) => event.eventType === type).reduce((sum, current) => {
    return sum + countDuration(current);
  }, 0);
};
