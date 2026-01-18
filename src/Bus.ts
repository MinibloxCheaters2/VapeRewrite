import EventBus from "./event/api/Bus";
import type ClientEvents from "./event/api/Events";

export default new EventBus<ClientEvents>();
