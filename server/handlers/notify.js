import Promise from "bluebird";
import { smartNotifierHandler } from "hull/lib/utils";
import attribute from "../processors/attribution";
import logResponses from "../lib/log-responses";

const notify = smartNotifierHandler({
  userHandlerOptions: {
    groupTraits: true
  },
  handlers: {
    "account:update": () => {
      return Promise.resolve();
    },
    "user:update": (context, messages = []) => {
      const { smartNotifierResponse, client } = context;

      client.logger.info("outgoing.user.start", {
        ids: messages.map(m => m.user.id)
      });

      // Get 100 users every 100ms at most.
      smartNotifierResponse.setFlowControl({
        type: "next",
        size: 10,
        in: 1
      });

      return Promise.all(
        messages.map(message => attribute(context, message))
      ).then(responses => logResponses(client, responses));
    }
  }
});

export default notify;
