import _ from "lodash";
import moment from "moment";
import {
  getFirstAttribution,
  getLastAttribution
} from "./utils/attribution-values";

export default function({ user, account, userAttribution }) {
  const { attribution } = account;

  let accountAttribution = {};

  // Process first Account attribution
  if (
    !_.size(attribution) ||
    (moment(userAttribution.source_date).isBefore(attribution.source_date) &&
      userAttribution.rank >= attribution.rank)
  ) {
    accountAttribution = {
      user_id: user.id, // The ID of the user who triggered attribution
      ...getFirstAttribution(userAttribution)
    };
  }

  // Process last Account attribution
  if (
    !_.size(attribution) ||
    (moment(userAttribution.last_source_date).isAfter(
      attribution.last_source_date
    ) &&
      userAttribution.last_rank >= attribution.last_rank)
  ) {
    accountAttribution = {
      ...accountAttribution,
      user_id: user.id, // The ID of the user who triggered attribution
      ...getLastAttribution(userAttribution)
    };
  }
  return accountAttribution;
}
