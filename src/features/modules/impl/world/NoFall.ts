import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import PacketFallDistance from "@/utils/ServerFallDistance";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class NoFall extends Mod {
	public name = "NoFall";
	public category = Category.WORLD;

	protected onEnable(): void {}

	@Subscribe("sendPacket")
	onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (
			packet instanceof PacketRefs.getRef("SPacketPlayerPosLook") &&
			!packet.onGround &&
			PacketFallDistance.currentFallDistance >=
				Refs.player.getMaxFallHeight()
		) {
			packet.onGround = true;
			Refs.player.fallDistance = 0.0;
		}
	}
}
