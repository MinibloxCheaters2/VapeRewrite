import Cancelable from "@vape/core/event/Cancelable";
import { CancelableWrapper } from "@vape/core/index";
import type { Quaternion, Vector3 } from "three";

export interface PosData {
	pos: Vector3;
	rot: Quaternion;
};

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
	sendPos: CancelableWrapper<PosData>;
};

export default ClientEvents;
