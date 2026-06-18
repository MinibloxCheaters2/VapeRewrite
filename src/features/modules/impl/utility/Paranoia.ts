/**
 * Listens to a bunch of packets that include things that may identify vanished players.
 * This only works if vector accidentally leaks entity IDs of vanished players in certain packets.
 */

import type { S2CPacket } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import type CancelableWrapper from "@/event/CancelableWrapper";
import { s2c } from "@/utils";
import Refs from "@/utils/helpers/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Paranoia extends Mod {
	name = "Paranoia";
	category = Category.UTILITY;

	#alert(debug: string) {
		Refs.chat.addChat({
			text: `[\\green\\Vape Rewrite\\reset\\: \\blue\\STAFF DETECTOR\\red\\] ${debug}`,
		});
	}
	#alertIfNotFound(id: number, pkt: string) {
		const { world } = Refs;
		if (!world) return;
		const e = world.entities.get(id);
		if (e) return;
		this.#alert(`Entity ${id} not found in world (packet ${pkt})`);
	}
	#alertFromField<P extends S2CPacket, K extends keyof P>(
		pkt: P,
		key: K,
		name = pkt.constructor.name,
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
			pkt instanceof s2c("CPacketEntityVelocity") ||
			pkt instanceof s2c("CPacketEntityEquipment") ||
			pkt instanceof s2c("CPacketAnimation") ||
			pkt instanceof s2c("CPacketEntityAction") ||
			pkt instanceof s2c("CPacketEntityMetadata") ||
			pkt instanceof s2c("CPacketEntityPositionAndRotation") ||
			pkt instanceof s2c("CPacketEntityRelativePositionAndRotation") ||
			pkt instanceof s2c("CPacketUpdateHealth") ||
			pkt instanceof s2c("CPacketEntityEffect") ||
			pkt instanceof s2c("CPacketEntityProperties") ||
			pkt instanceof s2c("CPacketRemoveEntityEffect") ||
			pkt instanceof s2c("CPacketUseBed")
		)
			this.#alertFromField(pkt, "id");
		else if (pkt instanceof s2c("CPacketEntityStatus"))
			this.#alertFromField(pkt, "entityId");
		/*else if (pkt instanceof s2c("CPacketPlayerList"))
			for (const pl of pkt.players) {
				this.#alertFromField(
					pl,
					"id",
					`CPacketPlayerList (${pl.name} ${pl.rank} ${pl.permissionLevel} ${pl.level})`,
				);
				}*/
	}
}
