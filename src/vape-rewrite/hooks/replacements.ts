import { storeName } from "../../Client";
import { Replacements, Shift } from "./replacementTypes";

export const REPLACEMENTS: Replacements = {
  // DOM-Content Loader
  'document.addEventListener("DOMContentLoaded",startGame,!1);': {
    replacement: `setTimeout(function() {
			const DOMContentLoaded_event = document.createEvent("Event");
			DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
			document.dispatchEvent(DOMContentLoaded_event);
		}, 0);`,
    shift: Shift.AFTER,
  },
  // Disable Ads (ads flag)
  'this.game.unleash.isEnabled("disable-ads")': {
    replacement: "true",
    shift: Shift.REPLACE,
  },
  // Login Bypass LOL
  [
    "new SPacketLoginStart({" +
    "requestedUuid:localStorage.getItem(REQUESTED_UUID_KEY)??void 0," +
    'session:localStorage.getItem(SESSION_TOKEN_KEY)??"",' +
    'hydration:localStorage.getItem("hydration")??"0",' +
    'metricsId:localStorage.getItem("metrics_id")??"",' +
    "clientVersion:VERSION$1" +
    "})"
  ]: {
    replacement: `new SPacketLoginStart({
requestedUuid: undefined,
session: (window["${storeName}"].exposed.moduleManager.antiBan.enabled
	? ""
	: (localStorage.getItem(SESSION_TOKEN_KEY) ?? "")),
hydration: "0",
metricsId: uuid$1(),
clientVersion: VERSION$1
})`,
    shift: Shift.REPLACE,
  },

  // Packet Interception
  "static sendPacket(u){": {
    replacement:
      `window["${storeName}"].exposed.emitEvent("sendPacket", window["${storeName}"].exposed.newCancelableWrapper(u));`,
    shift: Shift.AFTER,
  },


  // GameMode InterCeption
  'index_browserExports.useFlag("blitzbuild")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("oitq")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("blockhunt")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("murder")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("duels_bridge")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("pvp")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("kitpvp")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("skywars")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("spleef")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("eggwars")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("eggwars2")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("eggwars3")': { replacement: 'true', shift: Shift.REPLACE },
  'index_browserExports.useFlag("eggwars4")': { replacement: 'true', shift: Shift.REPLACE },



  // Enable all ranks gifting
  'jsxRuntimeExports.jsx("option", { value: "legend", children: "Legend" })': {
    replacement: `,jsxRuntimeExports.jsx("option", { value: "immortal", children: "Immortal" })`,
    shift: Shift.AFTER
  },


  
};
