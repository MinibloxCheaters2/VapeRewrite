import { setBusInstance } from "@vape/core";
import EventBus from "@wq2/event-bus";

import ClientEvents from "./events";

const bus = new EventBus<ClientEvents>();
setBusInstance(bus);

export default bus;
