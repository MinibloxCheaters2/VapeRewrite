import { storeName } from "../../../Client";
import { Replacement, Shift } from "../replacementTypes";
import {
  ENABLE_ALL_WORLD_TYPES,
  FORCE_ENABLE_RANK_GIFTING,
  STAFF_PRIVATE_WORLD_BYPASS,
  STAFF_PROFILE_SET,
} from "./utils/staffFeatures";

// an interesting note, remove the type parameters (<string | RegExp, Replacement>) and then TypeScript starts complaining about types not being the same.

const FLAGS_TO_FORCE_ENABLE = [
  // Disables... ads.
  "disable-ads",
  //#region Enable all mini games
  "skywars",
  "spleef",
  "eggwars",
  "eggwars2",
  "eggwars3",
  "eggwars4",
  "kitpvp",
  "pvp",
  "duels_bridge",
  "oitq",
  "blockhunt",
  "murder",
  "blitzbuild",
  //#endregion
];

export const REPLACEMENTS = new Map<string | RegExp, Replacement>(
  [
    ['document.addEventListener("DOMContentLoaded",startGame,!1);', {
      replacement: `setTimeout(function() {
			const DOMContentLoaded_event = document.createEvent("Event");
			DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
			document.dispatchEvent(DOMContentLoaded_event);
		}, 0);`,
      shift: Shift.AFTER,
    }],

    [
      "new SPacketLoginStart({" +
      "requestedUuid:localStorage.getItem(REQUESTED_UUID_KEY)??void 0," +
      'session:localStorage.getItem(SESSION_TOKEN_KEY)??"",' +
      'hydration:localStorage.getItem("hydration")??"0",' +
      'metricsId:localStorage.getItem("metrics_id")??"",' +
      "clientVersion:VERSION$1" +
      "})",
      {
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
    ],
    ["static sendPacket(u){", {
      replacement:
        `window["${storeName}"].exposed.emitEvent("sendPacket", window["${storeName}"].exposed.newCancelableWrapper(u));`,
      shift: Shift.AFTER,
    }],
    // enable all game modes
    [
      new RegExp(
        `index_browserExports\\.useFlag\\("${
          FLAGS_TO_FORCE_ENABLE.join("|")
        }"\\)`,
      ),
      {
        replacement: "true",
        shift: Shift.REPLACE,
      },
    ],
    // Enable all ranks gifting
    FORCE_ENABLE_RANK_GIFTING,

    // Enable Debug World Type
    ENABLE_ALL_WORLD_TYPES,

    // Enable Staff Profile Set
    STAFF_PROFILE_SET,


    // Enable Moderator-Private-World Bypass (altDown)
    STAFF_PRIVATE_WORLD_BYPASS,
  ],
);
