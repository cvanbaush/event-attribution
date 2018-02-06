import _ from "lodash";
import {
  isSameDay,
  isPreviousDay,
  isLaterDay,
  isLaterSameDay,
  isEarlierSameDay,
  isHigherRank,
  isSameRank
} from "./utils/comparisons";

export default function attributeUser({
  user,
  firstAttributionEvent,
  lastAttributionEvent
}) {
  let userAttribution = {};

  const { attribution = {} } = user;
  const { source_date, last_source_date, rank, last_rank } = attribution || {};

  // If We don't have attribution
  // or it's still "day one"
  if (
    _.size(firstAttributionEvent) &&
    (!source_date ||
      isPreviousDay(firstAttributionEvent.source_date, source_date) ||
      (isHigherRank(firstAttributionEvent.rank, rank) &&
        isSameDay(firstAttributionEvent.source_date, source_date)) ||
      (isSameRank(firstAttributionEvent.rank, rank) &&
        isEarlierSameDay(firstAttributionEvent.source_date, source_date)))
  ) {
    userAttribution = { ...userAttribution, ...firstAttributionEvent };
  }

  if (
    _.size(lastAttributionEvent) &&
    (!last_source_date ||
      isLaterDay(lastAttributionEvent.source_date, last_source_date) ||
      (isHigherRank(lastAttributionEvent.rank, last_rank) &&
        isSameDay(lastAttributionEvent.source_date, last_source_date)) ||
      (isSameRank(lastAttributionEvent.rank, last_rank) &&
        isLaterSameDay(lastAttributionEvent.source_date, last_source_date)))
  ) {
    userAttribution = {
      ...userAttribution,
      ..._.mapKeys(lastAttributionEvent, (v, k) => `last_${k}`)
    };
  }

  return userAttribution;
}
