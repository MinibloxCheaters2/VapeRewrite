import { Subscribe } from "@/event/api/Bus";
import Refs from "@/utils/helpers/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class ServerCrasher extends Mod {
	public name = "ServerCrasher";
	public category = Category.UTILITY;
	#packetsPerTickSetting = this.createSliderSetting(
		"PacketsPerTick",
		20,
		1,
		500,
		1,
	);

	get #packetsPerTick() {
		return this.#packetsPerTickSetting.value();
	}

	@Subscribe("gameTick")
	onTick() {
		for (let _ = 0; _ < this.#packetsPerTick; _++) {
			//new C08PacketPlayerBlockPlacement(BlockPos.ORIGIN, 0, null, 0.0F, 0.0F, 0.0F)
			Refs.ClientSocket.socket.send;
		}
	}
}
