import _ from "lodash";
import attribute from "./attribute";

export default function perform(context, message) {
  const { user } = message;
  const { client: hull, ship = {} } = context;
  const { private_settings = {} } = ship || {};
  const { attribution_enabled } = private_settings;
  const asUser = hull.asUser(user);
  const actions = [];
  try {
    const attribution = attribute(context, message);

    if (_.size(attribution.user)) {
      if (attribution_enabled) {
        asUser.traits(attribution.user, { source: "attribution" });
      }
      actions.push({
        action: "success",
        target: asUser,
        message: { attribution: attribution.user }
      });
    } else {
      actions.push({
        action: "skip",
        target: asUser,
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
        message: { attribution: attribution.account }
      });
    } else {
      actions.push({
        action: "skip",
        target: asAccount,
        message: "no new account attribution data"
      });
    }
  } catch (e) {
    actions.push({ target: asUser, action: "error", message: e.message });
  }
  return actions;
}
