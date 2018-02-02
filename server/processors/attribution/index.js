import _ from "lodash";
import attributeEvents from "./attribute-events";
import getUserAttribution from "./get-user-attribution";
import getAccountAttribution from "./get-account-attribution";
import rankSort from "./utils/rank-sort";

export default function({ user, events, account }) {
  const attributedEvents = events.map(event => attributeEvents(user, event));
  // returns
  // [
  //   { event: "xxx", rank: 1, source: "PQL", details: "xxx", source_date: event.created_at }
  //   { event: "xxx", rank: 2, source: "CQL", details: "xxx", source_date: event.created_at }
  //   { event: "xxx", rank: 1, source: "PQL", details: "xxx", source_date: event.created_at }
  //   { event: "xxx", rank: 3, source: "MQL", details: "xxx", source_date: event.created_at }
  // ]

  // console.log("Attributed Events", attributedEvents);

  // Sort events by time, removing `nulls`
  const sortedEvents = _.compact(
    _.sortBy(_.compact(attributedEvents), e => e.event.source_date)
  );

  // console.log("All Attribution Events", sortedEvents);

  const earliestRanked = rankSort(sortedEvents, "first");
  const latestRanked = rankSort(sortedEvents, "last");
  // We now have a short array of events with the following properties:
  // - We only have events that happened on the first|last day of this microbatch
  // (will probably all be on the same day but still... for security)
  // - For those events, we only have the earliest (or latest) for any given rank
  // It's now 1 entry per event level,
  // with the first being the lowest value for "rank"
  // Looks like this:
  // [
  //   "(Earliest/Latest) CQL/PQL",
  //   "(Earliest/Latest) MQL",
  //   "(Earliest/Latest) Growth"
  // ]
  // console.log("Ranked Earliest", earliestRanked);
  // console.log("Ranked Latest", latestRanked);

  const userAttribution = getUserAttribution({
    user,
    firstAttributionEvent: _.first(earliestRanked),
    lastAttributionEvent: _.first(latestRanked)
  });

  //-------------------------
  // ACCOUNT ATTRIBUTION
  // The code below is "meant" to go in a second pass of the processor,
  // once the user "comes back" with attribution data embedded;
  //-------------------------

  // console.log("Final Attribution", userAttribution);

  const accountAttribution = getAccountAttribution({
    user,
    account,
    userAttribution
  });

  // console.log("Final Attribution", { userAttribution, accountAttribution });

  return {
    user: userAttribution,
    account: accountAttribution
  };
}
