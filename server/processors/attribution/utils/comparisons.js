import moment from "moment";

export const isEarlier = (source, dest) => moment(source).isBefore(dest);
export const isLater = (source, dest) => moment(source).isAfter(dest);

export const isSameDay = (source, dest) => moment(source).isSame(dest, "day");
export const isPreviousDay = (source, dest) =>
  moment(source).isBefore(dest, "day");
export const isLaterDay = (source, dest) => moment(source).isAfter(dest, "day");

export const isLaterSameDay = (source, dest) =>
  isLater(source, dest) && isSameDay(source, dest);
export const isEarlierSameDay = (source, dest) =>
  isEarlier(source, dest) && isSameDay(source, dest);

export const isHigherRank = (source, dest) => source < dest;
export const isSameRank = (source, dest) => source === dest;
