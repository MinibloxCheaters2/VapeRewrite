/**
 * CTF AutoWin module.
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

const enum State {
	Idle,
	GrabbingEnemyFlag,
	ReturnToBase,
	WaitingForRespawn,
	ReturnedToBase,
	CapturingFlag,
}

function lerpTo(start: Vector3, destination: Vector3, range: number) {
	const moveVec = new THREE.Vec3().subVectors(destination, start);
	const distance = moveVec.length();

	if (distance === 0) {
		return [start.clone()];
	}

	const steps = Math.ceil(distance / range);
	const path = [];

	for (let i = 0; i <= steps; i++) {
		const t = i / steps;
		path.push(new THREE.Vec3().lerpVectors(start, destination, t));
	}

	return path;
}

export default class AutoWin extends Mod {
	name = "AutoWin";
	category = Category.UTILITY;

	#state = State.Idle;
	#targetFlag: Flag | null = null;
	#movePath: Vector3[] = [];
	#moveDelay = 0;
	#grabRequested = false;
	#captureRequested = false;
	#networkWarningShown = false;
	#moving = false;

	/** Maximum distance allowed for a flag action. */
	#maxDistanceSetting = this.createSliderSetting("MaxDistance", 1.5, 1.5, 2.5, 0.01);

	/** Maximum distance between consecutive movement points. */
	#speedSetting = this.createSliderSetting("Speed", 5, 2, 15, 0.1);

	/** Delay between movement points, measured in ticks. */
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

	#notify(message: string, type: "info" | "warning" | "alert" = "info") {
		showNotification("AutoWin", message, type, 500);
	}

	#reset() {
		this.#state = State.Idle;
		this.#targetFlag = null;
		this.#movePath = [];
		this.#moveDelay = 0;
		this.#grabRequested = false;
		this.#captureRequested = false;
		this.#networkWarningShown = false;
	}

	#findTargetFlag(): Flag | null {
		const { player, onlineInstance: instance } = gameRefs;

		if (!instance || player.holdingFlag) return null;

		for (const flag of instance.getEnemyFlags(player.teamId)) {
			if (flag.currentHoldingPlayer || flag.holdingHandler) continue;
			return flag;
		}

		return null;
	}

	#moveTo(destination: Vector3, from?: Vector3) {
		const { player } = gameRefs;

		this.#movePath = lerpTo(from ?? player.pos, destination, this.#speed);
		this.#moveDelay = 0;
	}

	#getMovementDestination(): Vector3 | null {
		if (!this.#targetFlag) return null;

		switch (this.#state) {
			case State.GrabbingEnemyFlag:
				return this.#targetFlag.position;

			case State.CapturingFlag:
				return this.#targetFlag.defaultPosition;

			default:
				return null;
		}
	}

	#recalculatePath(position: Vector3) {
		const destination = this.#getMovementDestination();

		if (!destination) {
			this.#movePath = [];
			return;
		}

		this.#moveTo(destination, position);
	}

	@Bus.Subscribe("receivedSpawn")
	private onReceivedSpawn(spawn: SpawnData) {
		if (this.#state !== State.WaitingForRespawn) return;
		if (!spawn.player.hasOwnership) return;

		this.#state = State.ReturnedToBase;
		this.#movePath = [];
		this.#moveDelay = 0;
	}

	@Bus.Subscribe("flagChange")
	private onFlagChange({ player, type }: FlagChange) {
		if (!player.hasOwnership) return;

		switch (type) {
			case FlagChangeType.GRAB:
				this.#state = State.ReturnToBase;
				this.#movePath = [];
				this.#moveDelay = 0;
				this.#grabRequested = false;
				return;

			case FlagChangeType.DROP:
				this.#reset();
				return;

			case FlagChangeType.CAPTURE:
				this.#reset();
				return;
			case FlagChangeType.RETURN:
				return;
		}
	}

	@Bus.Subscribe("preStepVelocity")
	private onStepVelocity() {
		this.#moving = this.#tickMovement();
	}

	@Bus.Subscribe("serverMove")
	private onServerMove({ data }: CancelableWrapper<ServerMove>) {
		if (!data.player.hasOwnership || !data.setback) return;

		const destination = this.#getMovementDestination();
		if (!destination) return;

		this.#notify("Setback detected; recalculating path.", "warning");

		this.#recalculatePath(new THREE.Vec3(...data.pos));
		this.#moveDelay = this.#delay;
	}

	#tickMovement(): boolean {
		if (this.#movePath.length === 0) return false;

		if (this.#moveDelay < this.#delay) {
			this.#moveDelay++;
			return true;
		}

		const nextPosition = this.#movePath.shift();
		if (!nextPosition) return true;

		gameRefs.player.setPosition(nextPosition);
		this.#moveDelay = 0;

		return true;
	}

	#grabEnemyFlag() {
		const { player } = gameRefs;
		const flag = this.#targetFlag;

		if (player.holdingFlag) {
			this.#state = State.ReturnToBase;
			return;
		}

		if (!flag || flag.holdingHandler || flag.currentHoldingPlayer) {
			this.#reset();
			return;
		}

		if (this.#grabRequested) return;

		if (player.pos.distanceTo(flag.position) > this.#maxDistance) {
			this.#moveTo(flag.position);
			return;
		}

		player.sendChangeFlag(flag.id, 0);
		this.#grabRequested = true;
		this.#state = State.ReturnToBase;
		this.#notify("Grabbing enemy flag.");
	}

	#returnToBase() {
		const { player, network } = gameRefs;

		if (!player.holdingFlag) {
			return;
		}

		if (!network) {
			if (!this.#networkWarningShown) {
				this.#notify("Missing network access; cannot request respawn.", "alert");
				this.#networkWarningShown = true;
			}
			return;
		}

		player.sendPerformAction((player.constructor as unknown as typeof Player).PlayerAction.SPAWN);
		network.sendRequestRespawn(player.id);

		this.#state = State.WaitingForRespawn;
		this.#movePath = [];
		this.#moveDelay = 0;
	}

	#prepareCapture() {
		const { player, onlineInstance: instance } = gameRefs;

		if (!instance) return;

		const [myFlag] = instance.getMyFlags(player.teamId).toArray();
		if (!myFlag) return;

		if (!player.holdingFlag) {
			this.#reset();
			return;
		}

		this.#targetFlag = myFlag;
		this.#captureRequested = false;
		this.#moveTo(myFlag.defaultPosition);
		this.#state = State.CapturingFlag;
	}

	#captureFlag() {
		const { player } = gameRefs;
		const flag = this.#targetFlag ?? player.holdingFlag;

		if (!flag) {
			this.#reset();
			return;
		}

		if (this.#captureRequested) return;

		if (player.pos.distanceTo(flag.defaultPosition) > this.#maxDistance) {
			this.#moveTo(flag.defaultPosition);
			return;
		}

		player.sendChangeFlag(player.holdingFlag.id, 1);
		this.#captureRequested = true;
	}

	@Bus.Subscribe("playerTick")
	private onTick() {
		const { onlineInstance: instance } = gameRefs;

		if (!instance || instance.gameEnded) return;

		if (this.#state === State.GrabbingEnemyFlag && this.#targetFlag.currentHoldingPlayer)
			this.#reset();

		if (this.#moving) return;

		switch (this.#state) {
			case State.Idle: {
				const target = this.#findTargetFlag();
				if (!target) return;

				this.#targetFlag = target;
				this.#grabRequested = false;
				this.#moveTo(target.position);
				this.#state = State.GrabbingEnemyFlag;
				break;
			}

			case State.GrabbingEnemyFlag:
				this.#grabEnemyFlag();
				break;

			case State.ReturnToBase:
				this.#returnToBase();
				break;

			case State.WaitingForRespawn:
				break;

			case State.ReturnedToBase:
				this.#prepareCapture();
				break;

			case State.CapturingFlag:
				this.#captureFlag();
				break;
		}
	}

	protected onDisable(): void {
		this.#reset();
	}
}
