import { Subscribe } from "@/event/Bus";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import CancelableWrapper from "@/event/CancelableWrapper";
import { C2SPacket } from "@wq2/miniblox-sdk";
import { isC2S, MAIN_LOGGER as logger } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";
import PacketRefs from "@/utils/network/packetRefs";
import ServerFallDistance from "@/utils/movement/ServerFallDistance";

export default class MaceKill extends Mod {
	public name = "MaceKill";
	public category = Category.BLATANT;

	#fallDistance = this.createSliderSetting("FallDistance", 100, 15, 1_000_000);

	get fallDistance() {
		return this.#fallDistance.value();
	}

	@Subscribe("sendPacket")
	onSendPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		if (!isC2S("SPacketUseEntity", pkt) || pkt.action !== 1) return;
		const { ClientSocket, player, Items } = Miniblox;
		if (player.inventory.getCurrentItem()?.item !== Items.mace) return;
		logger.info("a", PacketRefs.s.SPacketPlayerPosLook);
		ClientSocket.sendPacket(
			new PacketRefs.s.SPacketPlayerPosLook({
				pos: {
					x: player.pos.x,
					y: player.pos.y + this.fallDistance,
					z: player.pos.z,
				},
				onGround: false,
			}),
		);
		ClientSocket.sendPacket(
			new PacketRefs.s.SPacketPlayerPosLook({
				pos: {
					x: player.pos.x,
					y: player.pos.y + 1,
					z: player.pos.z,
				},
				onGround: false,
			}),
		);
		player.fallDistance = ServerFallDistance.currentFallDistance;
	}
}
