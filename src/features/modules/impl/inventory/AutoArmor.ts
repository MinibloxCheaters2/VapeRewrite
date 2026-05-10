import { Subscribe } from "@/event/api/Bus";
import type { ItemStack } from "@/features/sdk/types/items";
import type Slot from "@/features/sdk/types/slot";
import SlotActionType from "@/features/sdk/types/slotActionType";
import Refs from "@/utils/helpers/refs";
import remapObj from "@/utils/helpers/remapProxy";
import { dropItem } from "@/utils/inventory";
import mappings from "@/utils/mapping/mappings";
import Category from "../../api/Category";
import Mod from "../../api/Module";

function getItemStrength(stack: ItemStack) {
	if (stack === null) return 0;
	const itemBase = stack.getItem();
	let base = 1;
	const { ItemSword, ItemArmor, Enchantments } = Refs;

	if (itemBase instanceof ItemSword) base += itemBase.attackDamage;
	else if (itemBase instanceof ItemArmor) {
		const proxied = remapObj(itemBase, mappings.ItemArmor);
		base += proxied.damageReduceAmount;
	}

	const nbtTagList = stack.getEnchantmentTagList();
	if (nbtTagList != null) {
		for (const { id, lvl } of nbtTagList) {
			if (id === Enchantments.sharpness.effectId) base += lvl * 1.25;
			else if (id === Enchantments.protection.effectId)
				base += Math.floor(((6 + lvl * lvl) / 3) * 0.75);
			else if (id === Enchantments.efficiency.effectId)
				base += lvl * lvl + 1;
			else if (id === Enchantments.power.effectId) base += lvl;
			else base += lvl * 0.01;
		}
	}

	return base * stack.stackSize;
}

function getArmorSlot(armorSlot: number, slots: (Slot | null)[]) {
	let returned = armorSlot;
	let dist = 0;
	const { ItemArmor } = Refs; // *slight* optimization, doesn't matter that much since it just stops you from constantly hitting cache
	for (let i = 0; i < 40; i++) {
		const stack = slots[i]?.getStack();
		if (!stack) continue;
		const item = stack.getItem();

		if (item instanceof ItemArmor && 3 - item.armorType === armorSlot) {
			const strength = getItemStrength(stack);
			if (strength > dist) {
				returned = i;
				dist = strength;
			}
		}
	}
	return returned;
}

export default class AutoArmor extends Mod {
	name = "AutoArmor";
	category = Category.INVENTORY;

	@Subscribe("gameTick")
	private onTick() {
		const { player, playerController } = Refs;
		// if (player.openContainer === player.inventoryContainer) {
		for (let i = 0; i < 4; i++) {
			const slots = player.inventoryContainer.inventorySlots;
			const slot = getArmorSlot(i, slots);
			if (slot !== i) {
				if (slots[i]?.getHasStack()) dropItem(i);
				playerController.windowClick(
					player.openContainer.windowId,
					slot,
					0,
					SlotActionType.PICKUP_RIGHT,
					player,
				);
			}
		}
		// }
	}
}
