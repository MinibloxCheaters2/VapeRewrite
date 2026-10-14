/**
 * idea²:
 * I was messing with holding in packets and then re-sending them.
 * I figured out that, sending NaN pos, setbacks you.
 * With a normal distance setback,
 * it'd pull you back to a more previous position that it deems safe.
 * With NaN, it just goes back to the old pos.
 * Send NaN when the setback lands and ignore the teleport.
 * @module
 */

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { CancelableWrapper } from "@vape/core/index";

import Bus from "@/Bus";
import { PosData, ServerMove } from "@/events";
import sendPosSilently from "@/utils/movement/sendPos";
import Refs from "@/utils/refs/game";
import { ArrayVec2 } from "@vape/core/utils/math/vec";
import THREE from "@/utils/refs/three";
import { Vector3 } from "three";

/** threshold to completely silently accept */
const SILENT_ACCEPT_THRESHOLD = 12;

export default class Disabler extends Mod {
	name = "Disabler";
	category = Category.BLATANT;
	#lastMove = -1;
	#lastPos: Vector3;

	@Bus.Subscribe("serverMove")
	private onServerMove(wrap: CancelableWrapper<ServerMove>) {
		if (this.#lastMove - Date.now() > 1e3) return;
		const { data } = wrap;
		if (!data.setback) return;
		const { player } = Refs;
		if (!player) return;
		if (data.player !== player) return;
		const playerPos: Vector3 = this.#lastPos;
		const setbackPosVec = new THREE.Vec3(...data.pos);
		const distance: number = playerPos.distanceTo(setbackPosVec);
		const silentAccept = distance < SILENT_ACCEPT_THRESHOLD;
		console.info(`[Disabler] silent accept?: ${silentAccept ? "Y" : "N"}. distance: ${distance}.`, playerPos, setbackPosVec);
		if (silentAccept) {
			wrap.cancel();
			sendPosSilently(data.pos, [player.lookRot.x, player.lookRot.y]);
			sendPosSilently(playerPos.toArray(), [player.lookRot.x, player.lookRot.y]);
		}
	}

	@Bus.Subscribe("sendPos")
	private onSendPos(wrap: CancelableWrapper<PosData>) {
		const { player } = Refs;
		if (!player) return;
		const pos: Vector3 = player.rigidBody.pos;
		const lastPos = this.#lastPos ??= pos.clone();
		const distance = pos.distanceTo(lastPos);
		if (distance < 11) return;
		const lr: ArrayVec2 = [player.lookRot.x, player.lookRot.y];
		sendPosSilently(pos.toArray(), lr);
		sendPosSilently([NaN, NaN, NaN], lr);
		this.#lastMove = Date.now();
		this.#lastPos = pos.clone();
		wrap.cancel();
	}
}
