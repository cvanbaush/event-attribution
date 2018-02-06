import _ from "lodash";

const RANKS = {
  PQL: 1,
  CQL: 1,
  MQL: 2,
  GROWTH: 3
};

const getRank = source => RANKS[source] || 1;

export default function(context, message) {
  const { user, account } = message;
  const promises = [];
  if (
    user.id &&
    // Only proceed if we don't have user attribution data;
    !_.get(user, "attribution.source_date")
  ) {
    const {
      lead_source,
      lead_details,
      source_timestamp,
      last_lead_source,
      last_lead_details,
      last_source_timestamp
    } =
      user.traits || {};

    let userAttribution = {};

    if (lead_source) {
      userAttribution = {
        rank: getRank(lead_source),
        source: lead_source,
        details: lead_details,
        source_date: source_timestamp
      };
    }
    if (last_lead_source) {
      userAttribution = {
        ...userAttribution,
        last_rank: getRank(last_lead_source),
        last_details: last_lead_details,
        last_source_date: last_source_timestamp,
        last_source: last_lead_source
      };
    }
    const asUser = context.client.asUser(user);
    if (_.size(userAttribution)) {
      promises.push(
        asUser.traits(userAttribution, { source: "attribution" }).then(() => ({
          action: "success",
          target: asUser,
          id: user.id,
          type: "user",
          message: {
            message: "Copied attribution data",
            attribution: userAttribution
          }
        }))
      );
    } else {
      promises.push({
        action: "skip",
        target: asUser,
        id: user.id,
        type: "user",
        message: {
          message: "No Attribution Data",
          attribution: userAttribution
        }
      });
    }
  }

  if (
    account.id &&
    // Only proceed if we don't have account attribution data;
    (!account.attribution || !account.attribution.source_date)
  ) {
    const {
      lead_source,
      lead_details,
      source_timestamp,
      last_lead_source,
      last_lead_details,
      last_source_timestamp
    } = account;

    let accountAttribution = {};

    if (lead_source) {
      accountAttribution = {
        rank: getRank(lead_source),
        source: lead_source,
        details: lead_details,
        source_date: source_timestamp
      };
    }
    if (last_lead_source) {
      accountAttribution = {
        ...accountAttribution,
        last_rank: getRank(last_lead_source),
        last_details: last_lead_details,
        last_source_date: last_source_timestamp,
        last_source: last_lead_source
      };
    }
    const asAccount = context.client.asAccount(account);
    if (_.size(accountAttribution)) {
      promises.push(
        asAccount
          .traits(accountAttribution, { source: "attribution" })
          .then(() => ({
            action: "success",
            target: asAccount,
            id: account.id,
            type: "account",
            message: {
              message: "Copied attribution data",
              attribution: accountAttribution
            }
          }))
      );
    } else {
      promises.push({
        action: "skip",
        target: asAccount,
        id: account.id,
        type: "account",
        message: {
          message: "No Attribution Data",
          attribution: accountAttribution
        }
      });
    }
  }
  return Promise.all(promises);
}
