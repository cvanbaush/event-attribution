import _ from "lodash";

export default function logResponse(hull, actions) {
  _.map(_.groupBy(_.flatten(actions), "action"), (logs, action) => {
    if (action === "skip") {
      hull.logger.info(`outgoing.user.${action}`, {
        messages: _.uniq(logs.map(l => l.message)),
        ids: logs.map(l => l.id)
      });
    } else {
      _.map(logs, (response = {}) => {
        if (!response) return;
        const { target, type, message } = response;
        if (!target) return;
        target.logger.info(`outgoing.${type}.${action}`, message);
      });
    }
  });
}
