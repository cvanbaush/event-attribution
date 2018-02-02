import _ from "lodash";
import urijs from "urijs";

const driftPattern = /.*drift.com.*/;
const mainPagePattern = /https:\/\/www.drift.com.*/;
const blogPagePattern = /.*blog.drift.com.*/;

export default function attribute(user, event) {
  const {
    properties = {},
    context = {},
    event_source,
    created_at,
    event: name
  } = event;
  const { page = {} } = context || {};
  console.log(event)
  // Signup -> PQL
  if (name === "Signed Up" || name === "Started Subscription") {
    return {
      event: name,
      source: "PQL",
      rank: 1,
      source_date: created_at,
      user_id: user.id,
      details: properties.billing_plan || page.url || properties.type || ""
    };
  }

  // Email Capture (BlogPage) -> CQL
  if (name === "Email Captured" && mainPagePattern.test(page.url)) {
    return {
      event: name,
      source: "CQL",
      rank: 1,
      source_date: created_at,
      user_id: user.id,
      details: page.url
    };
  }

  // Email Capture (MainPage) -> MQL
  if (name === "Email Captured" && blogPagePattern.test(page.url)) {
    return {
      event: name,
      rank: 2,
      source: "MQL",
      source_date: created_at,
      user_id: user.id,
      details: page.url
    };
  }

  // Scheduled calls -> G2Crowd
  if (event_source === "scheduled-calls" && /.*G2Crowd.*/.test(name)) {
    return {
      event: name,
      rank: 3,
      source: "Growth",
      source_date: created_at,
      user_id: user.id,
      details: "G2Crowd"
    };
  }

  // Segment: G2Crowd & Siftery events -> Growth
  if (
    event_source === "segment" &&
    _.includes(["G2Crowd", "Siftery"], properties.name)
  ) {
    return {
      event: name,
      rank: 3,
      source: "Growth",
      source_date: created_at,
      user_id: user.id,
      details: properties.name
    };
  }

  // ASK: in code, this is treated the same way as a page view. What `details`
  // should it have ? -> Prospected users come only from the Prospector.
  // We could have at the account level the attribution only if it has a higher
  // priority than this one.

  // Clearbit User Created -> Growth
  if (name === "User created" && event_source === "Clearbit") {
    return {
      event: name,
      rank: 3,
      source: "Growth",
      source_date: created_at,
      user_id: user.id,
      details: "Anonymous Drift Visit"
    };
  }

  // Page view -> Growth
  if (!user.email && (name === "page" && driftPattern.test(page.url))) {
    return _.reduce(
      _.pick(
        urijs(properties.search || "").search(true),
        "utm_source",
        "utm_campaign"
      ),
      (memo, value, key) => {
        memo[key] = value;
        return memo;
      },
      {
        event: name,
        rank: 3,
        source: "Growth",
        source_date: created_at,
        user_id: user.id,
        details: "Anonymous Drift Visit"
      }
    );
  }

  // This event isn't attributable
  // Return null so it's removed when compacting;
  return null;
}
