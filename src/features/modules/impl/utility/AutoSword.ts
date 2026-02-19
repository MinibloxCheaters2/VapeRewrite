import { SubscribeAsync } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { ItemStack } from "@/features/sdk/types/items";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import { c2s } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import waitTicks from "@/utils/wait";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class AutoSword extends Mod {
	public name = "AutoSword";
	public category = Category.UTILITY;

	private rangeSetting = this.createSliderSetting("Range", 10, 3, 20, 0.5);
	private swapBackSetting = this.createToggleSetting("Swap Back", true);
	private swapDelaySetting = this.createSliderSetting(
		"Swap Back Delay",
		2,
		2,
		20,
		1,
	);
	private prioritySetting = this.createDropdownSetting(
		"Priority",
		["Damage", "Durability"],
		"Damage",
	);

	private previousSlot: number | null = null;
	private lastSlotSwitch = 0;

	get range() {
		return this.rangeSetting.value();
	}

	get swapBack() {
		return this.swapBackSetting.value();
	}

	get swapDelay() {
		return this.swapDelaySetting.value();
	}

	get priority() {
		return this.prioritySetting.value();
	}

	private isSword(item: ItemStack): boolean {
		if (!item) return false;

		const itemName = item.getItem().name?.toLowerCase() || "";
		return itemName.includes("sword");
	}

	private getSwordDamage(itemName: string): number {
		const name = itemName.toLowerCase();

		if (name.includes("infernium")) return 10;
		if (name.includes("emerald")) return 8;
		if (name.includes("diamond")) return 7;
		if (name.includes("gold")) return 4;
		if (name.includes("iron")) return 6;
		if (name.includes("wooden")) return 3;
		if (name.includes("stone")) return 5;

		return 0;
	}

	private getDurability(item: ItemStack): number {
		if (!item) return 0;
		const max = item.getMaxDamage() || 1;
		return max - (item.getItemDamage() || 0);
	}

	private findBestSword(): number | null {
		const { player } = Refs;
		if (!player) return null;

		const inventory = player.inventory.main || [];
		let bestSlot = -1;
		let bestScore = -1;

		for (let i = 0; i < inventory.length; i++) {
			const item = inventory[i];

			if (!this.isSword(item)) continue;

			let score = 0;

			if (this.priority === "Damage") {
				const itemName = item.getItem().name || "";
				score = this.getSwordDamage(itemName);
			} else if (this.priority === "Durability") {
				score = this.getDurability(item);
			}

			if (score > bestScore) {
				bestScore = score;
				bestSlot = i;
			}
		}

		return bestSlot !== -1 ? bestSlot : null;
	}

	private switchToSword(): void {
		const { player, game } = Refs;
		if (!player || !game) return;

		const now = Date.now();
		if (now - this.lastSlotSwitch < 50) {
			return;
		}

		const swordSlot = this.findBestSword();
		if (swordSlot === null) return;

		if (this.previousSlot === null) {
			this.previousSlot = game.info.selectedSlot;
		}

		player.inventory.currentItem = swordSlot;
		// this should work if my remap proxy works
		Refs.playerControllerMP.syncItem();
		game.info.selectedSlot = swordSlot;
		this.lastSlotSwitch = now;
	}

	private swapBackToPrevious(): void {
		const { player, game } = Refs;
		if (!player || !game || this.previousSlot === null) return;

		player.inventory.currentItem = this.previousSlot;
		game.info.selectedSlot = this.previousSlot;
		Refs.playerControllerMP.syncItem();
		this.previousSlot = null;
	}

	// we can use `SubscribeAsync` because we don't modify the event after `await`ing.
	@SubscribeAsync("sendPacket")
	private async onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			packet instanceof c2s("SPacketUseEntity") &&
			packet.action === 1 /*ATTACK*/
		) {
			this.switchToSword();
			if (this.swapBack) {
				await waitTicks(this.swapDelay);
				this.swapBackToPrevious();
			}
		}
	}
}
