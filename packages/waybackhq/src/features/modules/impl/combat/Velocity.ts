import type CancelableWrapper from "@vape/core/event/CancelableWrapper";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { DecodedVelocity } from "@wq2/waybackhq-types/src/net/session";

import Bus from "@/Bus";
import Refs from "@/hooks/game";

function motionOrReduce<T extends "X" | "Y" | "Z">(axis: T, n: number, reduce: number) {
	return reduce === 0 ? Refs.player[`motion${axis}`] : n * reduce;
}

export default class Velocity extends Mod {
	public name = "Velocity";
	public category = Category.COMBAT;

	// Settings
	private hS = this.createSliderSetting("Horizontal", 0, 0, 100, 1);
	private vS = this.createSliderSetting("Vertical", 0, 0, 100, 1);

	get h() {
		return this.hS.value();
	}

	get v() {
		return this.vS.value();
	}

	@Bus.Subscribe("velocity")
	onPacket(e: CancelableWrapper<DecodedVelocity>) {
		if (this.h === 0 && this.v === 0) e.cancel();
		motionOrReduce("X", e.data.x, this.h);
		motionOrReduce("Y", e.data.y, this.v);
		motionOrReduce("Z", e.data.z, this.h);
	}
}
