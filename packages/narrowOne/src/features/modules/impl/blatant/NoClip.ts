import Refs from "@/utils/Refs";
import { Category, Mod } from "@vape/core/index";

export default class NoClip extends Mod {
	name = "NoClip";
	category = Category.BLATANT;

    onEnable() {
		const {player} = Refs;
		if (!player) return;
        player.rigidBody.noclip = true;
    }

    onDisable() {
		const {player} = Refs;
		if (!player) return;
        player.rigidBody.noclip = false;
    }
};
