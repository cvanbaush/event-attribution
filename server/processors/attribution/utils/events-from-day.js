import _ from "lodash";
import isSameDay from "./is-same-day";

// Select only events from same day (first or last)
// (which will probably always be the same day in micro-batches, but still.)
export default function(events, day = "first") {
  const getter = day === "first" ? _.first : _.last;
  return _.reduce(
    events,
    (evts, e) => {
      // Add event only if we don't have one yet,
      // or it's on same day as the first matching event.
      if (!evts.length || isSameDay(e.source_date, getter(evts).source_date)) {
        evts.push(e);
      }
      return evts;
    },
    []
  );
}
