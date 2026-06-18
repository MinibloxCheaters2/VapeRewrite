import EventBus from "./event/Bus";
import type ClientEvents from "./event/Events";

export default new EventBus<ClientEvents>();
