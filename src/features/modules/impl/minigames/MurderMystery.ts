import type { ItemStack, S2CPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import { showNotification } from "@/ui/notifications";
import { s2c } from "@/utils";
import Refs from "@/utils/helpers/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class MurderMystery extends Mod {
	name = "MurderMystery";
	category = Category.MINIGAMES;
	@Subscribe("receivePacket")
	private onReceivePacket({ data }: CancelableWrapper<S2CPacket>) {
		if (!(data instanceof s2c("CPacketEntityEquipment"))) return;
		const { player, world, ItemStack, ItemSword, ItemBow } = Refs;
		if (!world) return;
		if (data.id === player.id) return;
		const plr = world.entities.get(data.id);
		if (!plr) return;
		for (const equipment of data.equipment) {
			//@ts-expect-error: TODO: typings for this in @wq2/miniblox-sdk
			const is: ItemStack | undefined = ItemStack.fromProto(
				equipment.item,
			);
			const item = is?.getItem();
			if (!item) continue;
			if (item instanceof ItemSword) {
				showNotification(
					"MurderMystery",
					`${plr.getName()} is holding a sword`,
				);
			} else if (item instanceof ItemBow) {
				showNotification(
					"MurderMystery",
					`${plr.getName()} is holding a bow`,
				);
			}
		}
	}
}
