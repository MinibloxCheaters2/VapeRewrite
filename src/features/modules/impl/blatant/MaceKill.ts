import { Subscribe } from "@/event/Bus";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import CancelableWrapper from "@/event/CancelableWrapper";
import { C2SPacket } from "@wq2/miniblox-sdk";
import { isC2S } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";
import PacketRefs from "@/utils/network/packetRefs";

export default class MaceKill extends Mod {
	public name = "MaceKill";
	public category = Category.BLATANT;

	#clipAmount = this.createSliderSetting("ClipAmount", 100, 15, 50);

	get clipAmount() {
		return this.#clipAmount.value();
	}

	@Subscribe("sendPacket")
	onSendPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		if (!isC2S("SPacketUseEntity", pkt) || pkt.action !== 1) return;
		const { ClientSocket, player, Items } = Miniblox;
		if (player.inventory.getCurrentItem()?.item !== Items.mace) return;
		ClientSocket.sendPacket(
			new PacketRefs.s.SPacketPlayerPosLook({
				pos: {
					x: player.pos.x,
					y: player.pos.y + this.clipAmount,
					z: player.pos.z,
				},
				onGround: true,
			}),
		);
	}
}
