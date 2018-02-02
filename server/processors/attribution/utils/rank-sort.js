import _ from "lodash";
import moment from "moment";
import eventsFromDay from "./events-from-day";

// Sort events by Rank, ensuring we only have the earliest (or latest) for a given rank;
export default function(events, day = "first") {
  return _.sortBy(
    _.values(
      _.reduce(
        // Filter to only use events from first or last day of this batch
        eventsFromDay(events, day),
        (ranks, event) => {
          // Get a previously ranked event at the same rank
          const compare = ranks[event.rank];
          // If we don't have events at this rank,
          // or if event is before (or after, depending on direction) already ranked event
          const current = moment(event.source_date);
          if (
            !compare ||
            (day === "first"
              ? current.isBefore(compare.source_date)
              : current.isAfter(compare.source_date))
          ) {
            // Replace event in given rank
            ranks[event.rank] = event;
          }
          return ranks;
        },
        {}
      )
    ),
    "rank"
  );
}
