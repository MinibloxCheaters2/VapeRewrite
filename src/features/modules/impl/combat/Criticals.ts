import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

/** Y offset values, that when used before attacking a player, gives a critical hit. **/
const CRIT_OFFSETS = [0.08, -0.07840000152];

export default class Criticals extends Mod {
	public name = "Criticals";
	public category = Category.COMBAT;

	static sendCritPackets() {
		const { ClientSocket, player } = Refs;
		const SPacketPlayerPosLook = PacketRefs.getRef("SPacketPlayerPosLook");
		for (const offset of CRIT_OFFSETS) {
			const pos = {
				x: player.pos.x,
				y: player.pos.y + offset,
				z: player.pos.z,
			};
			ClientSocket.sendPacket(
				new SPacketPlayerPosLook({
					pos,
					onGround: false,
				}),
			);
		}
	}

	@Subscribe("sendPacket")
	private onPacket({ data: pkt }: CancelableWrapper<C2SPacket>) {
		if (
			pkt instanceof PacketRefs.getRef("SPacketUseEntity") &&
			pkt.action === 1 /*ATTACK*/
		)
			Criticals.sendCritPackets();
	}
}
