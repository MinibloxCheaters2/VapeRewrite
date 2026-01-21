import { Subscribe } from "../../../../event/api/Bus";
import isKeyDown from "../../../../utils/key";
import getMoveDirection from "../../../../utils/movement";
import Refs from "../../../../utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class InfiniteFly extends Mod {
	public name = "InfiniteFly";
	public category = Category.BLATANT;
	private warned = false;
	private speed = 0.394;
	private reduceVerticalMotion = false;
	private ticks = 0;
	private verticalSpeed = 0.67;

	protected onDisable(): void {
		this.ticks = 0;
	}

	@Subscribe("tick")
	public onTick() {
		if (!this.warned) {
			Refs.game.chat.addChat({
				text: `Infinite Fly only works on servers using the old ac
(KitPvP, Skywars, Eggwars, Bridge Duels,
Classic PvP, and OITQ use the new ac, everything else is using the old ac)`
			});
			this.warned = true;
		}
		const {player} = Refs;
		const dir = getMoveDirection(this.speed);
		player.motion.x = dir.x;
		player.motion.z = dir.z;
		const goUp = isKeyDown("space");
		const goDown = isKeyDown("shift");
		this.ticks++;
		if (goUp || goDown) {
			player.motion.y = goUp ? this.verticalSpeed : -this.verticalSpeed;
		} else if (this.ticks <= 6) {
			player.motion.y = 0;
		} else if (!this.reduceVerticalMotion || this.ticks % 2 == 0) {
			player.motion.y = 0.18;
		}
	}
}
