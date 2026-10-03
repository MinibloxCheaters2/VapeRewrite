import selectSlot, { getSelectedSlot } from "@/utils/inventory/selectSlot";
import Miniblox from "@/utils/refs/miniblox";
import Category from "@vape/core/features/modules/api/Category"
import Mod from "@vape/core/features/modules/api/Module"
import { showNotification } from "@vape/core/ui/notifications";

export default class Lunge extends Mod {
	name = "Lunge";
	category = Category.COMBAT;
	private findSpear(): number {
		const { player, ItemSpear } = Miniblox;
		if (!player || !ItemSpear) return -1;
		return player.inventory.main.findIndex(i => i != null && i.item instanceof ItemSpear);
	}

	protected onEnable(): void {
		this.toggleSilently();
		const origSlot = getSelectedSlot();
		const spearIdx = this.findSpear();
		if (spearIdx === -1) {
			return showNotification("Lunge", "No spear in hotbar", "alert");
		}
		selectSlot(spearIdx);
		const {player} = Miniblox;
		if (!player.trySpearLunge()) {
			return showNotification("Lunge", "Lunge failed (missing enchantment?)", "alert");
		}
		selectSlot(origSlot);
	}
}
