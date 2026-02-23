import { Subscribe } from "@/event/api/Bus";
import type { Entity } from "@/features/sdk/types/entity";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import packetQueueManager, {
	Action,
	type PacketOutcome,
} from "@/utils/packetQueueManager";
import { c2s } from "@/utils/packetRefs";
import { getRandomArbitrary } from "@/utils/random";
import Refs from "@/utils/refs";
import { findTargets } from "@/utils/target";
import { SimpleVec3 } from "@/utils/vec";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class FakeLag extends Mod {
	public name = "FakeLag";
	// you can config FakeLag to be legit-looking.
	public category = Category.UTILITY;
	#targetsInRange: Entity[] = [];
	#enemyNearby = false;

	#rng = this.createSliderSetting("Range", 12, 1, 18, 0.1);
	#miD = this.createSliderSetting("MinDelayMS", 267, 0, 1.5e3, 1.5);
	#maD = this.createSliderSetting("MaxDelayMS", 342, 1, 1.5e3, 1.5);
	#fOA = this.createToggleSetting("FlushOnAction", true);

	get #range() {
		return this.#rng.value();
	}

	get #minDelay() {
		return this.#miD.value();
	}

	get #maxDelay() {
		return this.#maD.value();
	}

	get #flushOnAction() {
		return this.#fOA.value();
	}

	get #delay() {
		return getRandomArbitrary(this.#minDelay, this.#maxDelay);
	}

	protected onDisable(): void {
		this.#enemyNearby = false;
		this.#targetsInRange = [];
	}

	#flushPreconditions(packet: C2SPacket): boolean {
		if (this.#flushOnAction) {
			if (
				packet instanceof c2s("SPacketEntityAction") &&
				packet.id === Refs.player.id
			) {
				return true;
			}
			if (packet instanceof c2s("SPacketUseEntity")) {
				return true;
			}
			if (packet instanceof c2s("SPacketUseItem")) {
				return true;
			}
			if (packet instanceof c2s("SPacketPlayerAction")) {
				return true;
			}
			if (packet instanceof c2s("SPacketUpdateSign")) {
				return true;
			}
		}

		return false;
	}

	@Subscribe("gameTick")
	private onTick() {
		this.#targetsInRange = findTargets(this.#range);
		this.#enemyNearby = this.#targetsInRange.length !== 0;
	}

	@Subscribe("queueC2SPacket")
	private handleQueue(outcome: PacketOutcome<C2SPacket>) {
		if (!this.#enemyNearby) return;

		if (
			packetQueueManager.laggingFor() > this.#delay ||
			this.#flushPreconditions(outcome.packet)
		) {
			outcome.action = Action.FLUSH;
			return;
		}

		const targets = this.#targetsInRange;

		// no opps
		if (targets.length === 0) return;

		const anyIntersects = targets.find((t) =>
			t.boundingBox.intersectsBox(Refs.player.boundingBox),
		);

		if (anyIntersects) return;

		const svPos = packetQueueManager.serverPos; // CAN BE UNDEFINED
		const playerPos = Refs.player.pos;
		const srvPos = svPos
			? SimpleVec3.fromFloatVec3(svPos)
			: SimpleVec3.fromThreeVec3(Refs.player.pos);
		const serverPos = playerPos
			.clone()
			.setX(srvPos.x)
			.setY(srvPos.y)
			.setZ(srvPos.z);

		const serverDistance = Math.min(
			...targets.map((e) => e.pos.distanceTo(serverPos)),
		);

		const clientDistance = Math.min(
			...targets.map((e) => e.pos.distanceTo(Refs.player.pos)),
		);

		if (serverDistance < clientDistance) {
			return;
		}

		outcome.action = Action.QUEUE;
	}
}
