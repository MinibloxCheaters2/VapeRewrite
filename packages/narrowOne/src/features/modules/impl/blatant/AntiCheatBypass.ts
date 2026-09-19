/**
 * Makes the speed check more "lenient".
 *
 * @module
 */

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { CancelableWrapper } from "@vape/core/index";
import { ArrayVec2, ArrayVec3 } from "@vape/core/utils/math/vec";

import Bus from "@/Bus";
import { ServerMove } from "@/events";
import sendPosSilently from "@/utils/movement/sendPos";
import game from "@/utils/refs/game";
// import { PosData } from "@/events";

// let i = 0;

// SKIDDING! from xylex layer
function lerpToPosition(
	pos: ArrayVec3,
	serverPos: ArrayVec3,
	range: number,
): [value: ArrayVec3, outOfRange: boolean] {
	const moveVec = { x: pos[0] - serverPos[0], y: pos[1] - serverPos[1], z: pos[2] - serverPos[2] };
	const moveMag = Math.sqrt(
		moveVec.x * moveVec.x +
		moveVec.y * moveVec.y +
		moveVec.z * moveVec.z
	);
	const outOfRange = moveMag > range;

	return [
		outOfRange
			? [
					serverPos[0] + (moveVec.x / moveMag) * range,
					serverPos[1] + (moveVec.y / moveMag) * range,
					serverPos[2] + (moveVec.z / moveMag) * range,
				]
			: pos,
		outOfRange,
	];
}
export default class AntiCheatBypass extends Mod {
	name = "AntiCheatBypass";
	category = Category.BLATANT;

	private readonly speedSetting = this.createSliderSetting("Speed", 14, 0.01, 45, 0.01);

	private get speed() {
		return this.speedSetting.value();
	}

	@Bus.Subscribe("serverMove")
	private onServerMove(wrap: CancelableWrapper<ServerMove>) {
		const { data } = wrap;
		if (!data.setback || data.player !== game.player) return;
		const lr: ArrayVec2 = [game.player.lookRot.x, game.player.lookRot.y];
		sendPosSilently(data.pos, lr);
		const lPos: ArrayVec3 = [game.player.pos.x, game.player.pos.y, game.player.pos.z];
		let finished = false;
		for (let iterations = 0; !finished && iterations < 30; iterations++) {
			const [pos, f] = lerpToPosition(lPos, data.pos, this.speed);
			finished = f;
			console.info(
				`lerping: ${data.pos} -> ${lPos} @ ${this.speed} = ${pos} in ${iterations} iters`,
			);
			sendPosSilently(pos, lr);
			if (finished) {
				wrap.cancel();
				break;
			}
		}
	}
	// @Bus.Subscribe("sendPos")
	// private onSendPos(wrap: CancelableWrapper<PosData>) {
	// 	// testing
	// 	if (i++ > 4) {
	// 		wrap.cancel();
	// 		i = 0;
	// 	}
	// }
}
