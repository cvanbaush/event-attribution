import _ from "lodash";

export default function logResponse(hull, actions) {
  _.map(_.groupBy(_.flatten(actions), "action"), (logs, action) => {
    if (action === "skip") {
      context.client.logger.info(
        `outgoing.user.${action}`,
        logs.map("message")
      );
    } else {
      _.map(logs, ({ target, message }) => {
        target.logger.info(`outgoing.${type}.${action}`, message);
      });
    }
  });
}
