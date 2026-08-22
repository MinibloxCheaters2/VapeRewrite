import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";

import Bus from "@/Bus";
import Refs, { ready } from "@/hooks/game";

export default class AutoClicker extends Mod {
	name = "AutoClicker";
	category = Category.COMBAT;

	#origAutoClicker: boolean;
	#hook() {
		this.#origAutoClicker = Refs.game.autoClicker;
		Refs.game.autoClicker = true;
	}
	#unhook() {
		Refs.game.autoClicker = this.#origAutoClicker;
	}
	protected onEnable(): void {
		ready.then(() => {
			if (!Refs.player) return;
			this.#hook();
		});
	}
	protected onDisable(): void {
		ready.then(() => {
			if (!Refs.player) return;
			this.#unhook();
		});
	}
	@Bus.Subscribe("join")
	private onJoin() {
		this.#hook();
	}
}
