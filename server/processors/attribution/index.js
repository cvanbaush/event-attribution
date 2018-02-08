import moment from "moment";
import _ from "lodash";
import attribute from "./attribute";

function isInSegments(userSegments = [], segmentsListIds = []) {
  return (
    _.isEmpty(segmentsListIds) ||
    _.intersection(userSegments.map(({ id }) => id), segmentsListIds).length > 0
  );
}

export default function perform(context, message) {
  const { user, segments } = message;
  const { client: hull, ship = {} } = context;
  const { private_settings = {} } = ship || {};
  const { attribution_enabled, synchronized_segments } = private_settings;
  const asUser = hull.asUser(user);
  const actions = [];
  try {
    if (!moment(user.created_at).isAfter("2018-02-06T00:00:00Z")) {
      actions.push({
        action: "skip",
        target: asUser,
        id: user.id,
        type: "user",
        created_at: user.created_at,
        message: "User created before cutoff date"
      });
      return actions;
    }
    // if (!_.size(synchronized_segments)) {
    //   actions.push({
    //     action: "skip",
    //     target: asUser,
    //     id: user.id,
    //     type: "user",
    //     message: "No segments enabled"
    //   });
    //   return actions;
    // }

    // if (!isInSegments(segments, synchronized_segments)) {
    //   hull.asUser(user).logger.debug("No Match", {
    //     segments: segments.map(m => m.id),
    //     synchronized_segments,
    //     match: isInSegments(segments, synchronized_segments)
    //   });
    //   actions.push({
    //     action: "skip",
    //     target: asUser,
    //     id: user.id,
    //     type: "user",
    //     message: "User not in whitelisted segments"
    //   });
    //   return actions;
    // }

    const attribution = attribute(context, message);

    if (_.size(attribution.user)) {
      if (attribution_enabled) {
        asUser.traits(attribution.user, { source: "attribution" });
      }
      actions.push({
        action: "success",
        target: asUser,
        id: user.id,
        type: "user",
        message: { attribution: attribution.user }
      });
    } else {
      actions.push({
        action: "skip",
        target: asUser,
        id: user.id,
        type: "user",
        message: "no new user attribution data"
      });
    }

    const asAccount = asUser.account();
    if (_.size(attribution.account)) {
      if (attribution_enabled) {
        asAccount.traits(attribution.account, { source: "attribution" });
      }
      actions.push({
        action: "success",
        target: asAccount,
        id: user.id,
        type: "account",
        message: { attribution: attribution.account }
      });
    } else {
      actions.push({
        action: "skip",
        target: asAccount,
        id: user.id,
        type: "account",
        message: "no new account attribution data"
      });
    }
  } catch (e) {
    actions.push({
      target: asUser,
      id: user.id,
      type: "user",
      action: "error",
      message: e.message
    });
  }
  return actions;
}
