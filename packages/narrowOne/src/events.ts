import Cancelable from "@vape/core/event/Cancelable";

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
};

export default ClientEvents;
