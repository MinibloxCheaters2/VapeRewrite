import Cancelable from "@vape/core/event/Cancelable";

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
	connect: void;
	join: void;
};

export default ClientEvents;
