import type ClientEvents from "./event/Events";

import { setBusInstance } from "@vape-rewrite/core";

import EventBus from "./event/Bus";

const bus = new EventBus<ClientEvents>();
setBusInstance(bus);

export default bus;
