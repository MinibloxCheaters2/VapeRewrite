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
import { ArrayVec2 } from "@vape/core/utils/math/vec";

import Bus from "@/Bus";
import { ServerMove } from "@/events";
import sendPosSilently from "@/utils/movement/sendPos";
import Refs from "@/utils/refs/game";

export default class Disabler extends Mod {
	name = "Disabler";
	category = Category.BLATANT;

	@Bus.Subscribe("serverMove")
	private onServerMove(wrap: CancelableWrapper<ServerMove>) {
		const { data } = wrap;
		const { player } = Refs;
		if (!data.setback || data.player !== player) return;
		const lr: ArrayVec2 = [player.lookRot.x, player.lookRot.y];
		for (let i = 0; i < 5; i++) {
			sendPosSilently([NaN, NaN, NaN], lr);
			sendPosSilently(data.pos, lr);
		}
		sendPosSilently([player.pos.x, player.pos.y, player.pos.z], lr);
		wrap.cancel();
	}
}
