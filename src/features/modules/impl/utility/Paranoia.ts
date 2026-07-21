/**
 * Listens to a bunch of packets that include things that may identify vanished players.
 * This only works if vector accidentally leaks entity IDs of vanished players in certain packets.
 */

import type { S2CPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { isS2C } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Paranoia extends Mod {
	name = "Paranoia";
	category = Category.UTILITY;

	#alert(debug: string) {
		Miniblox.chat.addChat({
			text: `[\\green\\Vape Rewrite\\reset\\: \\blue\\STAFF DETECTOR\\red\\] ${debug}`,
		});
	}
	#alertIfNotFound(id: number, pkt: string) {
		const { world } = Miniblox;
		if (!world) return;
		const e = world.entities.get(id);
		if (e) return;
		this.#alert(`Entity ${id} not found in world (packet ${pkt})`);
	}
	#alertFromField<P extends S2CPacket, K extends keyof P>(
		pkt: P,
		key: K,
		name = pkt.typeName,
		alertWrongType = true,
	) {
		const v = pkt[key];
		if (typeof v !== "number") {
			if (alertWrongType) {
				this.#alert(
					`Packet ${name} has an improper type for ${String(key)} (got ${typeof v})`,
				);
			}
			return;
		}
		this.#alertIfNotFound(v, name);
	}
	@Subscribe("receivePacket")
	private onReceivePacket({ data: pkt }: CancelableWrapper<S2CPacket>) {
		if (
			isS2C("CPacketEntityVelocity", pkt) ||
			isS2C("CPacketEntityEquipment", pkt) ||
			isS2C("CPacketAnimation", pkt) ||
			isS2C("CPacketEntityAction", pkt) ||
			isS2C("CPacketEntityMetadata", pkt) ||
			isS2C("CPacketEntityPositionAndRotation", pkt) ||
			isS2C("CPacketEntityRelativePositionAndRotation", pkt) ||
			isS2C("CPacketUpdateHealth", pkt) ||
			isS2C("CPacketEntityEffect", pkt) ||
			isS2C("CPacketEntityProperties", pkt) ||
			isS2C("CPacketRemoveEntityEffect", pkt) ||
			isS2C("CPacketUseBed", pkt)
		)
			this.#alertFromField(pkt, "id");
		else if (isS2C("CPacketEntityStatus", pkt))
			this.#alertFromField(pkt, "entityId");
		/*else if (isS2C("CPacketPlayerList", pkt))
			for (const pl of pkt.players) {
				this.#alertFromField(
					pl,
					"id",
					`CPacketPlayerList (${pl.name} ${pl.rank} ${pl.permissionLevel} ${pl.level})`,
				);
				}*/
	}
}
