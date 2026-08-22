/**
 * Only works on servers with AntiCheat off
 * @module
 */
import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { EntityLivingBase } from "@wq2/waybackhq-types/src/entity/entityliving";

import Bus from "@/Bus";
import Refs from "@/hooks/game";
import swing from "@/utils/combat/swing";
import { findTargets } from "@/utils/combat/targets";

export default class InfiniteAura extends Mod {
	public name = "InfiniteAura";
	public category = Category.BLATANT;
	private blocking = false;

	// Settings
	private autoBlockSetting = this.createToggleSetting("Auto Block", true);
	private swingSetting = this.createDropdownSetting("Swing", ["none", "client", "server", "both"]);

	get swing() {
		return this.swingSetting.value();
	}

	get autoBlock() {
		return this.autoBlockSetting.value();
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
		Refs.player.attackTargetEntityWithCurrentItem(e);
	}

	@Bus.Subscribe("playerTick")
	onTick() {
		const targets = findTargets(Infinity);
		this.block();
		for (const target of targets) {
			this.sendAttack(target);
		}
	}
}
