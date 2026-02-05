import { Subscribe } from "@/event/api/Bus";
import { MATCHED_DUMPS } from "@/hooks/replacement";
import Refs from "@/utils/refs";
import { findTargets } from "@/utils/target";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class TargetStrafe extends Mod {
	public name = "TargetStrafe";
	public category = Category.COMBAT;

	private rangeSetting = this.createSliderSetting("Range", 6, 3, 10, 0.5);
	private radiusSetting = this.createSliderSetting("Radius", 2.5, 1, 6, 0.1);
	private speedSetting = this.createSliderSetting("Speed", 0.36, 0.1, 1, 0.01);
	private directionSetting = this.createDropdownSetting("Direction", [
		"Left",
		"Right",
	]);
	private onlyOnGroundSetting = this.createToggleSetting(
		"Only On Ground",
		true,
	);
	private onlyWhenMovingSetting = this.createToggleSetting(
		"Only When Moving",
		false,
	);

	get range() {
		return this.rangeSetting.value();
	}

	get radius() {
		return this.radiusSetting.value();
	}

	get speed() {
		return this.speedSetting.value();
	}

	get direction() {
		return this.directionSetting.value();
	}

	get onlyOnGround() {
		return this.onlyOnGroundSetting.value();
	}

	get onlyWhenMoving() {
		return this.onlyWhenMovingSetting.value();
	}

	@Subscribe("tick")
	public onTick() {
		const { player } = Refs;
		if (this.onlyOnGround && !player.onGround) return;

		if (this.onlyWhenMoving) {
			const moveForwardDump = MATCHED_DUMPS.moveForward as "moveForward";
			const moveStrafeDump = MATCHED_DUMPS.moveStrafe as "moveStrafe";
			const isMoving =
				player[moveForwardDump] !== 0 || player[moveStrafeDump] !== 0;
			if (!isMoving) return;
		}

		const targets = findTargets(this.range);
		if (targets.length === 0) return;

		const target = targets.reduce((closest, cur) => {
			const curDist = player.getDistanceSqToEntity(cur);
			const bestDist = player.getDistanceSqToEntity(closest);
			return curDist < bestDist ? cur : closest;
		}, targets[0]);

		const dx = target.pos.x - player.pos.x;
		const dz = target.pos.z - player.pos.z;
		const distance = Math.hypot(dx, dz);
		if (distance <= 0.0001) return;

		const dirSign = this.direction === "Left" ? 1 : -1;
		const invDist = 1 / distance;
		const toTargetX = dx * invDist;
		const toTargetZ = dz * invDist;
		const strafeX = -toTargetZ * dirSign;
		const strafeZ = toTargetX * dirSign;

		const radiusDelta = distance - this.radius;
		const correction = Math.max(-1, Math.min(1, radiusDelta / this.radius));

		let desiredX = strafeX + toTargetX * correction;
		let desiredZ = strafeZ + toTargetZ * correction;
		const desiredMag = Math.hypot(desiredX, desiredZ);
		if (desiredMag <= 0.0001) return;
		desiredX /= desiredMag;
		desiredZ /= desiredMag;

		player.motion.x = desiredX * this.speed;
		player.motion.z = desiredZ * this.speed;
	}
}
