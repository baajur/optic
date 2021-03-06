import {
  commandsToJson,
  Facade,
  JsonHelper,
  lengthScala,
  mapScala,
  opticEngine,
  Queries,
  RfcCommandContext,
} from '@useoptic/domain';
import uuidv4 from 'uuid/v4';

const clientSessionId = uuidv4();
const clientId = 'anonymous';

export function batchCommandHandler(eventStore, rfcId) {
  const initialEventStore = eventStore.getCopy(rfcId);

  const rfcService = Facade.makeRfcService(initialEventStore);

  const pendingCommands = [];

  function emitCommands(commands) {
    const batchId = uuidv4();
    const commandContext = new RfcCommandContext(
      clientId,
      clientSessionId,
      batchId
    );
    pendingCommands.push(...commands);
    rfcService.handleCommands(rfcId, commandContext, ...commands);
  }

  return {
    doWork: (handler) => {
      const queries = Queries(eventStore, rfcService, rfcId);
      handler({
        emitCommands,
        queries,
        rfcState: rfcService.currentState(rfcId),
        rfcService,
        rfcId,
      });
    },
    getAllCommands: () => pendingCommands,
    getAllCommandsJs: () => {
      const commandsAsVector = JsonHelper.jsArrayToVector(pendingCommands);
      return opticEngine.CommandSerialization.toJs(commandsAsVector);
    },
  };
}
