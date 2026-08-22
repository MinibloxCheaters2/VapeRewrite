import type CancelableWrapper from "@vape/core/event/CancelableWrapper";
import type { ItemStack } from "@wq2/miniblox-sdk";

import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { showNotification } from "@vape/core/ui/notifications";

import { Subscribe } from "@/event/Bus";
import { S2CData } from "@/event/Events";
import { isS2C } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";

export default class MurderMystery extends Mod {
	name = "MurderMystery";
	category = Category.MINIGAMES;
	@Subscribe("receivePacket")
	private onReceivePacket({ data }: CancelableWrapper<S2CData>) {
		if (!isS2C("CPacketEntityEquipment", data)) return;
		const { player, world, ItemStack, ItemSword, ItemBow } = Miniblox;
		if (!world) return;
		if (data.id === player.id) return;
		const plr = world.entities.get(data.id);
		if (!plr) return;
		for (const equipment of data.equipment) {
			//@ts-expect-error: TODO: typings for this in @wq2/miniblox-sdk
			const is: ItemStack | undefined = ItemStack.fromProto(equipment.item);
			const item = is?.getItem();
			if (!item) continue;
			if (item instanceof ItemSword) {
				showNotification("MurderMystery", `${plr.getName()} is holding a sword`);
			} else if (item instanceof ItemBow) {
				showNotification("MurderMystery", `${plr.getName()} is holding a bow`);
			}
		}
	}
}
