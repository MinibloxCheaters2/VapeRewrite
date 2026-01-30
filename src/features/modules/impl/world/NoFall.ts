import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { C2SPacket } from "@/features/sdk/types/packetTypes";
import PacketRefs from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class NoFall extends Mod {
	public name = "NoFall";
	public category = Category.WORLD;
	private falling = false;
	protected onEnable(): void {
		Refs.game.chat.addChat({
			text: "[Vape Rewrite] Vector is black and made the `fallDistance` field not update so uh NoFall won't work cat",
			color: "yellow",
			id: "6 + 7 = 13",
		});
	}

	@Subscribe("tick")
	onTick() {
		if (Refs.player.fallDistance >= 3.3) {
			this.falling = true;
		}
	}
	@Subscribe("sendPacket")
	onPacket({ data: packet }: CancelableWrapper<C2SPacket>) {
		if (packet instanceof PacketRefs.getRef("SPacketPlayerPosLook")) {
			if (!this.falling) {
				Refs.game.chat.addChat({ text: "Not falling" });
				return;
			}
			Refs.game.chat.addChat({ text: "Impossible" });
			packet.onGround = false;
			packet.pos.y -= 0.014;
			const pos = Refs.player.pos.clone();
			Refs.player.pos = pos.setY(pos.y - 0.014);
			this.falling = false;
		}
	}
}
