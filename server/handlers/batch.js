import { notifHandler } from "hull/lib/utils";
// import attribute from "../processors/attribution";
import logResponses from "../lib/log-responses";
import migrateAttributes from "../processors/migrate-attribution";

export default function batchHandlerFactory(options) {
  return notifHandler({
    hostSecret: options.hostSecret,
    userHandlerOptions: {
      groupTraits: true,
      maxSize: 100,
      maxTime: 120
    },
    handlers: {
      "user:update": function userUpdate(context, messages = []) {
        const { client } = context;
        // client.logger.info("outgoing.user.error", {
        //   ids: messages.map(m => m.user.id),
        //   message:
        //     "batch isn't supported for user attribution since we don't have events in there!"
        // });
        client.logger.info("outgoing.user.start", {
          ids: messages.map(m => m.user.id)
        });
        return Promise.all(
          messages.map(message => migrateAttributes(context, { message }))
        ).then(responses => logResponses(client, responses));
      }
    }
  });
}
