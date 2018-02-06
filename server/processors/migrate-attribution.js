const RANKS = {
  PQL: 1,
  CQL: 1,
  MQL: 2,
  GROWTH: 3
};

const getRank = source => RANKS[source] || 1;

export default function(context, message) {
  const { user, account } = message;
  context.client.asUser(user).traits({}, { source: "attribution" });
  const promises = [];
  if (
    user.id &&
    // Only proceed if we don't have user attribution data;
    (!user.attribution && !user.attribution && !user.source_date)
  ) {
    const {
      lead_source,
      lead_details,
      source_timestamp,
      last_lead_source,
      last_lead_details,
      last_source_timestamp
    } = user;

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
  }

  if (
    account.id &&
    // Only proceed if we don't have account attribution data;
    (!account.attribution && !account.attribution && !account.source_date)
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
    promises.push(
      asAccount
        .traits(accountAttribution, { source: "attribution" })
        .then(() => ({
          action: "success",
          target: asAccount,
          id: account.id,
          type: "user",
          message: {
            message: "Copied attribution data",
            attribution: accountAttribution
          }
        }))
    );
  }
  return Promise.all(promises);
}
