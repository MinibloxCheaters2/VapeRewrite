import Category from "../../api/Category";
import Mod from "../../api/Module";
import Refs from "../../../sdk/api/refs";

export default class NoCLIP extends Mod {
    public name = "NoCLIP";
    public category = Category.BLATANT;

    onEnable(): void {
        Refs.player.height = 0;
    }

    onDisable(): void {
        Refs.player.height = 1.8;
    }
}