import _ from "lodash";

// returns only the values for first or last attribution

function getAttr(attribution, last = "first") {
  return _.pickBy(
    attribution,
    (v, k) => k.indexOf("last_") === (last === "last" ? 0 : -1)
  );
}

export function getFirstAttribution(attribution) {
  return getAttr(attribution, "first");
}
export function getLastAttribution(attribution) {
  return getAttr(attribution, "last");
}
