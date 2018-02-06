import _ from "lodash";

export default function logResponse(hull, responses) {
  _.map(_.groupBy(responses, "action"), (logs, action) => {
    if (action === "skip") {
      context.client.logger.info(
        `outgoing.user.${action}`,
        logs.map("message")
      );
    } else {
      _.map(logs, ({ user, message }) => {
        hull.asUser(user).logger.info(`outgoing.user.${action}`, message);
      });
    }
  });
}
