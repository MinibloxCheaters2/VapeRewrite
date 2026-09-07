import game from "@/utils/refs/game";
import { Category, Mod } from "@vape/core/index";

export default class NoClip extends Mod {
	name = "NoClip";
	category = Category.BLATANT;

    onEnable() {
		const {player} = game;
		if (!player) return;
        player.rigidBody.noclip = true;
    }

    onDisable() {
		const {player} = game;
		if (!player) return;
        player.rigidBody.noclip = false;
    }
};
