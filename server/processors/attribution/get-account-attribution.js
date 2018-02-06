import {
  isSameDay,
  isPreviousDay,
  isLaterDay,
  isLaterSameDay,
  isEarlierSameDay,
  isHigherRank,
  isSameRank
} from "./utils/comparisons";

import {
  getFirstAttribution,
  getLastAttribution
} from "./utils/attribution-values";

export default function({ account, userAttribution }) {
  const { attribution } = account;
  const { source_date, last_source_date, rank, last_rank } = attribution || {};

  let accountAttribution = {};

  // Process first Account attribution
  if (
    userAttribution &&
    userAttribution.source_date &&
    (!source_date ||
      isPreviousDay(userAttribution.source_date, source_date) ||
      (isHigherRank(userAttribution.rank, rank) &&
        isSameDay(userAttribution.source_date, source_date)) ||
      (isSameRank(userAttribution.rank, rank) &&
        isEarlierSameDay(userAttribution.source_date, source_date)))
  ) {
    accountAttribution = {
      ...getFirstAttribution(userAttribution)
    };
  }

  // Process last Account attribution
  if (
    userAttribution &&
    userAttribution.last_source_date &&
    (!last_source_date ||
      isLaterDay(userAttribution.last_source_date, last_source_date) ||
      (isHigherRank(userAttribution.last_rank, last_rank) &&
        isSameDay(userAttribution.last_source_date, last_source_date)) ||
      (isSameRank(userAttribution.last_rank, last_rank) &&
        isLaterSameDay(userAttribution.last_source_date, last_source_date)))
  ) {
    accountAttribution = {
      ...accountAttribution,
      ...getLastAttribution(userAttribution)
    };
  }
  return accountAttribution;
}
