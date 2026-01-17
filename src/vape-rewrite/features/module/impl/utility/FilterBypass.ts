import { Subscribe } from "../../../../event/api/Bus";
import CancelableWrapper from "../../../../event/api/CancelableWrapper";
import { C2SPacket } from "../../../sdk/types/packetTypes";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class FilterBypass extends Mod {
  public name = "FilterBypass";
  category = Category.UTILITY;

  @Subscribe("sendPacket")
  public rape(pkt: CancelableWrapper<C2SPacket>) {
    if ("text" in pkt.data) {
      // "(www.roblox.com) <message here>" filter bypass method ahh
      // (yes, that is for Roblox, it apparently was a private method, and I don't know if it got patched.)
      pkt.data.text = pkt.data.text.split(" ").map(w => `${w.charAt(0)}\\${w.slice(1)}`).join(" ");
    }
  }
}
