import { setBusInstance } from "@vape/core/Bus";
import EventBus from "@wq2/event-bus";

import ClientEvents from "./events";

const Bus = new EventBus<ClientEvents>();
setBusInstance(Bus);

export default Bus;
