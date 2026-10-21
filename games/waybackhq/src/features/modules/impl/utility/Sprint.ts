import Bus from "@/Bus";
import Refs from "@/hooks/game";
import { Category } from "@vape-rewrite/core"
import { Mod } from "@vape-rewrite/core"

export default class Sprint extends Mod {
	name = "Sprint";
	category = Category.UTILITY;
	private readonly mode = this.createDropdownSetting("Mode", ["Legit", "Omni"], "Legit");

	@Bus.Subscribe("playerTick")
	private onPlayerTick() {
		const player = Refs.player!;

		switch (this.mode.value()) {
			case "Legit":
				player.sprintKeyHeld = true;
				break;
			case "Omni":
				player.sprinting = true;
				break;
		}
	}
}
