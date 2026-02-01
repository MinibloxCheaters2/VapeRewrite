import { Subscribe } from "@/event/api/Bus";
// import packetQueueManager, { Action, type PacketOutcome } from "@/utils/packetQueueManager";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import { findTargets } from "@/utils/target";
import Category from "../../api/Category";
import Mod from "../../api/Module";

// TODO: settings
const FLUSH_ON_ACTION = true;
const RANGE = 12; // 6 * 2

export default class FakeLag extends Mod {
	public name = "FakeLag";
	public category = Category.BLATANT;
	#enemyNearby = false;

	protected onDisable(): void {
		this.#enemyNearby = false;
	}

	#flushPreconditions(packet: C2SPacket): boolean {
		if (
			FLUSH_ON_ACTION &&
			packet instanceof PacketRefs.getRef("SPacketEntityAction") &&
			packet.id === Refs.player.id
		) {
			return true;
		}

		return false;
	}

	@Subscribe("tick")
	private onTick() {
		this.#enemyNearby = findTargets(RANGE).length !== 0;
	}

	@Subscribe("queueC2SPacket")
	private handleQueue(outcome: PacketOutcome<C2SPacket>) {
		if (!this.#enemyNearby) return;

		if (this.#flushPreconditions(outcome.packet)) {
			outcome.action = Action.FLUSH;
			return;
		}

		const targets = findTargets(RANGE);

		// no opps
		if (targets.length === 0) return;

		const anyIntersects = targets.find((t) =>
			t.boundingBox.intersectsBox(Refs.player.boundingBox),
		);

		if (anyIntersects) return;

		// const serverPos = packetQueueManager.serverPos;

		// TODO: finish this
		// const serverDist = targets.sort((a, b) => a.getDistance());
	}
}
