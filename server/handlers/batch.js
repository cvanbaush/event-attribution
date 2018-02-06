import { notifHandler } from "hull/lib/utils";
import attribute from "../processors/attribution";
import logResponses from "../lib/log-responses";

export default function batchHandlerFactory(options) {
  return notifHandler({
    hostSecret: options.hostSecret,
    userHandlerOptions: {
      groupTraits: false,
      maxSize: 100,
      maxTime: 120
    },
    handlers: {
      "user:update": function userUpdate(context, messages = []) {
        context.client.logger.info("outgoing.user.start", {
          ids: messages.map(m => m.user.id)
        });
        return Promise.all(
          messages.map(message => attribute(context, message))
        ).then(responses => logResponses(hull, responses));
      }
    }
  });
}
