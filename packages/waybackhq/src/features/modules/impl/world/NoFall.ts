import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import Refs from "@/hooks/game";

const MAX_FALL_DISTANCE = 3;

export default class NoFall extends Mod {
	public name = "NoFall";
	public category = Category.WORLD;
	#modeSetting = this.createDropdownSetting("Mode", ["Normal", "AntiCheat"]);
	#doFlag = false;

	private get mode() {
		return this.#modeSetting.value();
	}

	protected onEnable(): void {}

	@Bus.Subscribe("playerTick")
	onPacket() {
		switch (this.mode) {
			/* how it works:
				- Force an anticheat setback by flagging.
				- When the server sends a setback, it sets your fall distance to 0.
			*/
			case "AntiCheat":
				{
					if (!Refs.player.onGround && Refs.player.fallDistance >= MAX_FALL_DISTANCE) {
						const { localPlayer: player, world } = Refs.game;
						if (Refs.player.onGround) {
							return;
						}
						// const block = world.getBlock(
						// 	Math.floor(player.posX),
						// 	Math.floor(player.boundingBox.minY + player.motionY),
						// 	Math.floor(player.posZ),
						// );
						// if (block.material === "air") return;
						Refs.session.movementSequence -= 2;
						Refs.session.sendMove();
						Refs.session.movementSequence += 1;
						Bus.once("teleport", () => {
							Refs.player.fallDistance = 0;
							Refs.player.onGround = true;
						});
					}
				}
				break;
			case "Normal": {
				if (Refs.player.fallDistance >= MAX_FALL_DISTANCE) {
					const { localPlayer: player } = Refs.game;
					if (!player.onGround) return;
					player.fallDistance = 0;
					player.onGround = true;
				}
				break;
			}
		}
	}
}
