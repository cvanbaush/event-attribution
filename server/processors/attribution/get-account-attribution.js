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

export default function({ account, user, userAttribution }) {
  const { attribution } = account;
  const { source_date, last_source_date, rank, last_rank } = attribution || {};

  let accountAttribution = {};

  const finalUserAttribution = {
    ...(user.attribution || {}),
    ...userAttribution
  };
  // Process first Account attribution
  if (
    finalUserAttribution &&
    finalUserAttribution.source_date &&
    (!source_date ||
      isPreviousDay(finalUserAttribution.source_date, source_date) ||
      (isHigherRank(finalUserAttribution.rank, rank) &&
        isSameDay(finalUserAttribution.source_date, source_date)) ||
      (isSameRank(finalUserAttribution.rank, rank) &&
        isEarlierSameDay(finalUserAttribution.source_date, source_date)))
  ) {
    accountAttribution = {
      ...getFirstAttribution(finalUserAttribution)
    };
  }

  // Process last Account attribution
  if (
    finalUserAttribution &&
    finalUserAttribution.last_source_date &&
    (!last_source_date ||
      isLaterDay(finalUserAttribution.last_source_date, last_source_date) ||
      (isHigherRank(finalUserAttribution.last_rank, last_rank) &&
        isSameDay(finalUserAttribution.last_source_date, last_source_date)) ||
      (isSameRank(finalUserAttribution.last_rank, last_rank) &&
        isLaterSameDay(
          finalUserAttribution.last_source_date,
          last_source_date
        )))
  ) {
    accountAttribution = {
      ...accountAttribution,
      ...getLastAttribution(finalUserAttribution)
    };
  }
  return accountAttribution;
}
