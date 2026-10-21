import { Cancelable } from "@vape-rewrite/core";

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
};

export default ClientEvents;
