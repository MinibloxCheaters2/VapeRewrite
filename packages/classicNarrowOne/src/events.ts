import Cancelable from "@vape/core/src/event/Cancelable";

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
};

export default ClientEvents;
