import type { C2SPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { isC2S, sendSilently } from "@/utils";
import PacketRefs from "@/utils/network/packetRefs";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

function teleport(y: number, onGround: boolean) {
	const { player } = Miniblox;
	sendSilently(
		new PacketRefs.s.SPacketPlayerPosLook({
			pos: {
				x: player.pos.x,
				y,
				z: player.pos.z,
			},
			onGround,
		}),
	);
}

export default class MaceKill extends Mod {
	public name = "MaceKill";
	public category = Category.BLATANT;

	#fallDistance = this.createSliderSetting(
		"FallDistance",
		100,
		15,
		1_000_000,
	);

	get fallDistance() {
		return this.#fallDistance.value();
	}

	@Subscribe("sendPacket")
	onSendPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		if (!isC2S("SPacketUseEntity", pkt) || pkt.action !== 1) return;
		const { player, Items } = Miniblox;
		if (player.inventory.getCurrentItem()?.item !== Items.mace) return;
		teleport(player.pos.y + this.fallDistance, false);
		teleport(player.pos.y + (this.fallDistance - 0.08), false);
		teleport(player.pos.y + 1, false);
	}
}
