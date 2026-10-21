import { Cancelable } from "@vape/core";

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
};

export default ClientEvents;
