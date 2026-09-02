import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { SimpleVec3 } from "@vape/core/utils/math/vec";
import { EntityLivingBase } from "@wq2/waybackhq-types/src/entity/entityliving";

import Bus from "@/Bus";
import Refs from "@/hooks/game";
import { lookAtEntity } from "@/utils/aiming/lookAt";
import RotationManager, { RotationPlan } from "@/utils/aiming/rotate";
import swing from "@/utils/combat/swing";
import { findTargets } from "@/utils/combat/targets";
import { SETTING } from "@/utils/movement/MovementCorrection";

export default class KillAura extends Mod {
	public name = "KillAura";
	public category = Category.BLATANT;
	// private attackDelay = Date.now();
	private blocking = false;

	// Settings
	private rangeSetting = this.createSliderSetting("Range", 6, 3, 10, 0.5);
	private angleSetting = this.createSliderSetting("Angle", 360, 1, 360, 1);
	private autoBlockSetting = this.createToggleSetting("Auto Block", true);
	private wallCheckSetting = this.createToggleSetting("Wall Check", false);
	private swingSetting = this.createDropdownSetting("Swing", ["none", "client", "server", "both"]);
	private movementCorrection = this.createDropdownSetting("MovementCorrection", SETTING);

	get swing() {
		return this.swingSetting.value();
	}

	get range() {
		return this.rangeSetting.value();
	}

	get angle() {
		return this.angleSetting.value();
	}

	get autoBlock() {
		return this.autoBlockSetting.value();
	}

	get wallCheck() {
		return this.wallCheckSetting.value();
	}

	block() {
		if (!this.autoBlock) {
			this.blocking = false;
			return;
		}
		if (this.blocking) return;
		// Prevent updateLocalInput from calling stopUsingItem
		Refs.input.rightDown = true;
		Refs.game.rightClickMouse();
		this.blocking = true;
	}

	unblock() {
		if (!this.blocking) return;
		Refs.input.rightDown = false;
		Refs.player.stopUsingItem();
		this.blocking = false;
	}

	sendAttack(e: EntityLivingBase) {
		if (this.swing !== "none") swing(this.swing);
		const { game: g, player, session } = Refs;
		player.attackTargetEntityWithCurrentItem(e);
		const rot = lookAtEntity(
			new SimpleVec3(player.posX, player.posY, player.posZ),
			player.getEyeHeight(),
			e,
		);
		RotationManager.scheduleRotation(
			new RotationPlan(rot, this.movementCorrection.value().value, 1),
		);
		if (g.netRole === "client") session.sendActions(1, e.entityId, true, true, 0);
	}

	@Bus.Subscribe("playerTick")
	onTick() {
		const targets = findTargets(this.range, this.angle, this.wallCheck);
		if (targets.length > 0) this.block();
		for (const target of targets) {
			this.sendAttack(target);
		}
	}
}
