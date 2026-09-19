import type { Quaternion, Vector3 } from "three";

import Cancelable from "@vape/core/event/Cancelable";
import { CancelableWrapper } from "@vape/core/index";
import { ArrayVec2, ArrayVec3 } from "@vape/core/utils/math/vec";

export interface PosData {
	pos: Vector3;
	rot: Quaternion;
}

export interface ServerMove {
	player: any;
	pos: ArrayVec3;
	rot: ArrayVec2;
	setback: boolean;
}

type ClientEvents = {
	gameTick: void;
	playerTick: Cancelable;
	sendPos: CancelableWrapper<PosData>;
	serverMove: CancelableWrapper<ServerMove>;
};

export default ClientEvents;
