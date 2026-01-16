import { storeName } from "../../Client";
import { Replacements, Shift } from "./replacementTypes";

export const REPLACEMENTS: Replacements = {
  'document.addEventListener("DOMContentLoaded",startGame,!1);': {
    replacement: `setTimeout(function() {
			const DOMContentLoaded_event = document.createEvent("Event");
			DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
			document.dispatchEvent(DOMContentLoaded_event);
		}, 0);`,
    shift: Shift.AFTER
  },
  'this.game.unleash.isEnabled("disable-ads")': {
    replacement: 'true',
    shift: Shift.REPLACE
  },
  'static sendPacket(u){': {
    replacement: `window["${storeName}"].exposed.emitEvent("sendPacket", window["${storeName}"].exposed.newCancelableWrapper(u));`,
    shift: Shift.AFTER
  }
};
