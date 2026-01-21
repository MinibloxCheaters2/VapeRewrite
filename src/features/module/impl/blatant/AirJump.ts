import Category from "../../api/Category";
import Mod from "../../api/Module";
import game from "../../../sdk/api/game";
import Refs from "../../../sdk/api/refs";

export default class AirJump extends Mod {
    public name = "AirJump";
    public category = Category.BLATANT;

    onEnable(): void {
        Refs.player.__defineSetter__("onGround", () => true);
        Refs.player.__defineGetter__("onGround", () => true);
    }

    onDisable(): void {
        delete Refs.player.onGround;
        Refs.player.onGround = false;
    }
}