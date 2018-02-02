import Promise from "bluebird";
import _ from "lodash";
import { smartNotifierHandler } from "hull/lib/utils";
import getAttribution from "../processors/attribution";

const notify = smartNotifierHandler({
  handlers: {
    "user:update": ({ smartNotifierResponse, client: hull }, messages = []) => {
      messages.map(message => {
        const { user } = message;
        const asUser = hull.asUser(user);
        const asAccount = asUser().account();

        const attribution = getAttribution(message);
        if (_.size(attribution.user)) {
          asUser.traits(attribution, { source: "attribution" });
          asUser.logger.info("outgoing.user.success", {
            message: "Attribution Updated",
            attribution: attribution.user
          });
        }
        if (_.size(attribution.account)) {
          asAccount.traits(attribution, { source: "attribution" });
          asAccount.logger.info("outgoing.account.success", {
            message: "Attribution Updated",
            attribution: attribution.account
          });
        }
        return true;
      });
      // Get 100 users every 100ms at most.
      smartNotifierResponse.setFlowControl({
        type: "next",
        size: 100,
        in: 100
      });
      return Promise.resolve();
    }
  }
});

export default notify;
