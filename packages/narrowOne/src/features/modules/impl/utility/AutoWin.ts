/**
 * CTF AutoWin module.
 * @todo refactor this so its cleaner
 * @todo if the player wins, it still tries to grab flags.
 * @module
 */
import type { Vector3 } from "three";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { CancelableWrapper } from "@vape/core/index";
import { showNotification } from "@vape/core/ui/notifications";
import { Flag, Player } from "@wq2/narrow-one-types";

import Bus from "@/Bus";
import { FlagChange, FlagChangeType, ServerMove, SpawnData } from "@/events";
import gameRefs from "@/utils/refs/game";
import THREE from "@/utils/refs/three";

enum State {
	/** send a GRAB and set state to {@link State.ReturnToBase} */
	GrabbingEnemyFlag,
	/** send a SPAWN perform action & send a respawn request. requires network access */
	ReturnToBase,
	WaitingForRespawn,
	ReturnedToBase,
	CapturingFlag,
	Idle,
}

// lazy ahh just asked catgpt for ts basic function
function lerpTo(to: Vector3, from: Vector3, speed: number): Vector3[] {
	const distance = from.distanceTo(to);
	const steps = Math.ceil(distance / speed);
	const points: Vector3[] = [];

	for (let i = 0; i <= steps; i++) {
		const t = steps === 0 ? 1 : i / steps;
		points.push(from.clone().lerp(to, t));
	}

	return points;
}

export default class AutoWin extends Mod {
	name = "AutoWin";
	category = Category.UTILITY;
	#state = State.Idle;
	#targetFlag: Flag | null = null;
	#movePath: Vector3[] = [];
	#moveDelay = -1;
	/** range that you have to be within from the flag, otherwise your action gets rejected. */
	#maxDistanceSetting = this.createSliderSetting("MaxDistance", 1.5, 1.5, 2.5, 0.01);
	/** lerping speed */
	#speedSetting = this.createSliderSetting("Speed", 5, 2, 15, 0.1);
	/** delay between moves */
	#delaySetting = this.createSliderSetting("MoveDelay", 15, 0, 25, 1);

	get #maxDistance() {
		return this.#maxDistanceSetting.value();
	}
	get #speed() {
		return this.#speedSetting.value();
	}

	get #delay() {
		return this.#delaySetting.value();
	}

	#findTargetFlag() {
		const { player, onlineInstance: instance } = gameRefs;
		if (!instance) return;
		const [myFlag] = instance.getMyFlags(player.teamId).toArray();
		if (!myFlag) return;
		for (const enemyFlag of instance.getEnemyFlags(player.teamId)) {
			if (enemyFlag.currentHoldingPlayer) continue;
			return enemyFlag;
		}
	}

	@Bus.Subscribe("receivedSpawn")
	private onReceivedSpawn(spawn: SpawnData) {
		if (this.#state !== State.WaitingForRespawn) return;
		if (spawn.player !== gameRefs.player) return;
		this.#state = State.ReturnedToBase;
	}

	@Bus.Subscribe("flagChange")
	private onFlagChange({ player, type }: FlagChange) {
		if (player !== gameRefs.player) return;
		switch (type) {
			case FlagChangeType.GRAB:
				this.#state = State.ReturnToBase;
				break;
			case FlagChangeType.CAPTURE:
				this.#reset();
				break;
			case FlagChangeType.DROP:
				break;
			case FlagChangeType.RETURN:
				break;
		}
	}

	@Bus.Subscribe("serverMove")
	private onServerMove({ data }: CancelableWrapper<ServerMove>) {
		// TODO: if the move path finishes, but the server rejects the player's position and setbacks again,
		// it doesn't re-do the move path again.
		const { player } = gameRefs;
		if (data.player !== player) return;
		if (!data.setback) return;
		if (this.#movePath.length <= 0) return;
		showNotification("AutoWin", "setback detected, re-calculating path.", "warning", 0.5e3);
		this.#movePath = lerpTo(this.#targetFlag.position, new THREE.Vec3(...data.pos), this.#speed);
	}

	@Bus.Subscribe("playerTick")
	private onTick() {
		const { player, onlineInstance: instance } = gameRefs;
		if (!instance) return;
		if (this.#movePath.length > 0) {
			if (this.#moveDelay < this.#delay) return this.#moveDelay++;
			const lr = player.lookRot.toArray();
			const pos = this.#movePath[0];
			console.log(pos, this.#movePath[1]);
			if (pos === undefined) return;
			player.setPosition(pos);
			this.#movePath.splice(0, 1);
			this.#moveDelay = 0;
			return;
		}
		switch (this.#state) {
			case State.GrabbingEnemyFlag: {
				if (player.holdingFlag) return (this.#state = State.ReturnToBase);
				// TODO: server could setback when this gets handled,
				//		and the distance check for handling GRAB flag changes would reject this
				const dist = player.pos.distanceTo(this.#targetFlag.position);
				if (dist > this.#maxDistance) return;
				player.sendChangeFlag(this.#targetFlag.id, 0);
				showNotification("AutoWin", "grabbing enemy flag", "info", 0.5e3);
				this.#state = State.ReturnToBase;
				return;
			}
			case State.ReturnToBase: {
				if (!player.holdingFlag) return;
				const { network } = gameRefs;
				if (!network)
					return showNotification(
						"AutoWin",
						"missing network access, can't respawn right now.",
						"alert",
						0.1e3,
					);
				player.sendPerformAction(
					(player.constructor as unknown as typeof Player).PlayerAction.SPAWN,
				);
				network.sendRequestRespawn(player.id);
				this.#state = State.WaitingForRespawn;
				return;
			}
			case State.WaitingForRespawn: {
				return;
			}
			case State.ReturnedToBase: {
				const [myFlag] = instance.getMyFlags(player.teamId).toArray();
				if (!myFlag) return;
				if (!player.holdingFlag) return;
				this.#targetFlag = myFlag;
				this.#movePath = lerpTo(myFlag.defaultPosition, player.pos, this.#speed);
				this.#state = State.CapturingFlag;
				return;
			}
			case State.CapturingFlag: {
				// TODO: server could setback when this gets handled,
				//		and the distance check for handling GRAB flag changes would reject this
				const dist = player.pos.distanceTo(this.#targetFlag.defaultPosition);
				if (dist > this.#maxDistance) return;
				if (!player.holdingFlag) return;
				player.sendChangeFlag(player.holdingFlag.id, 1);
				return;
			}
			case State.Idle: {
				const target = this.#findTargetFlag();
				if (!target) return;
				this.#targetFlag = target;
				this.#movePath = lerpTo(target.position, player.pos, this.#speed);
				this.#state = State.GrabbingEnemyFlag;
				return;
			}
		}
	}
	#reset() {
		this.#state = State.Idle;
		this.#targetFlag = null;
		this.#movePath = [];
		this.#moveDelay = -1;
	}
	protected onDisable(): void {
		this.#reset();
	}
}
