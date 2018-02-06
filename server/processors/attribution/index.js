import attribute from "./attribute";

export default function perform(context, message) {
  const { client: hull } = context;
  const asUser = hull.asUser(message.user.id);
  try {
    const attribution = attribute(context, message);
    if (attribution.user) {
      asUser.traits(attribution.user, { source: "attribution" });
    }
    if (attribution.account) {
      asUser.account().traits(attribution.account, { source: "attribution" });
    }
  } catch (e) {
    hull
      .asUser(message.user.id)
      .logger.error("outgoing.user.error", { message: e.message });
  }
  return true;
}
