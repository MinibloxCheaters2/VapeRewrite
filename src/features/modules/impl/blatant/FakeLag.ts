import type { C2SPacket, Entity } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import { SimpleVec3 } from "@/utils/math/vec";
import { findTargets } from "@/utils/movement/target";
import packetQueueManager, {
	Action,
	type PacketOutcome,
} from "@/utils/network/packetQueueManager";
import { c2s } from "@/utils/network/packetRefs";
import Miniblox from "@/utils/refs/miniblox";
import { getRandomArbitrary } from "@/utils/time/random";
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
			return (
				(packet instanceof c2s("SPacketEntityAction") &&
					packet.id === Miniblox.player.id) ||
				packet instanceof c2s("SPacketUseEntity") ||
				packet instanceof c2s("SPacketUseItem") ||
				packet instanceof c2s("SPacketPlayerAction") ||
				packet instanceof c2s("SPacketUpdateSign")
			);
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
			t.boundingBox.intersectsBox(Miniblox.player.boundingBox),
		);

		if (anyIntersects) return;

		const svPos = packetQueueManager.serverPos; // CAN BE UNDEFINED
		const playerPos = Miniblox.player.pos;
		const srvPos = svPos
			? SimpleVec3.fromFloatVec3(svPos)
			: SimpleVec3.fromThreeVec3(Miniblox.player.pos);
		const serverPos = playerPos
			.clone()
			.setX(srvPos.x)
			.setY(srvPos.y)
			.setZ(srvPos.z);

		const serverDistance = Math.min(
			...targets.map((e) => e.pos.distanceTo(serverPos)),
		);

		const clientDistance = Math.min(
			...targets.map((e) => e.pos.distanceTo(Miniblox.player.pos)),
		);

		if (serverDistance < clientDistance) {
			return;
		}

		outcome.action = Action.QUEUE;
	}
}
