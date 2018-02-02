import _ from "lodash";
import moment from "moment";

export default function attributeUser({
  user,
  firstAttributionEvent,
  lastAttributionEvent
}) {
  let userAttribution = {};

  const { attribution = {} } = user;
  const { source_date, last_source_date } = attribution || {};

  // console.log("Chosen Attribution Event", firstAttributionEvent);

  // If We don't have attribution
  // or it's still "day one"
  if (
    !source_date ||
    (firstAttributionEvent.rank <= attribution.rank &&
      moment(firstAttributionEvent.source_date).isSame(source_date, "day"))
  ) {
    userAttribution = { ...userAttribution, ...firstAttributionEvent };
  }

  // console.log("Chosen Last Attribution Event", lastAttributionEvent);

  if (
    // If we don't have a last_source_date already
    !last_source_date ||
    // or we have a higher rank and we're on the same day
    ((lastAttributionEvent.rank <= attribution.last_rank &&
      moment(lastAttributionEvent.source_date).isSame(
        last_source_date,
        "day"
      )) ||
      // or we are on another day
      moment(lastAttributionEvent.source_date).isAfter(last_source_date, "day"))
  ) {
    userAttribution = {
      ...userAttribution,
      ..._.mapKeys(lastAttributionEvent, (v, k) => `last_${k}`)
    };
  }

  return userAttribution;
}
