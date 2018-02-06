import Promise from "bluebird";
import { smartNotifierHandler } from "hull/lib/utils";
import attribute from "../processors/attribution";

const notify = smartNotifierHandler({
  handlers: {
    "account:update": () => {},
    "user:update": (context, messages = []) => {
      const { smartNotifierResponse, client: hull } = context;

      hull.logger.info("outgoing.user.start", {
        ids: messages.map(m => m.user.id)
      });

      // Get 100 users every 100ms at most.
      smartNotifierResponse.setFlowControl({
        type: "next",
        size: 100,
        in: 100
      });

      return Promise.all(
        messages.map(message => attribute(context, message))
      ).then(responses => {
        context.client.logger.info("outgoing.user.success", responses);
      });
    }
  }
});

export default notify;
