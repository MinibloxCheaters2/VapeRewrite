import { storeName } from "../../Client";
import { Replacement, Shift } from "./replacementTypes";

// an interesting note, remove the type parameters (<string | RegExp, Replacement>) and then TypeScript starts complaining about types not being the same.
const replacementWorldTypes = `availableWorldTypes = {
		[GameModeId.SURVIVAL]: [WorldGenerationType.NORMAL, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.DEBUG],
		[GameModeId.CREATIVE]: [WorldGenerationType.NORMAL, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.DEBUG],
		[GameModeId.ADVENTURE]: [WorldGenerationType.NORMAL, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.DEBUG]
	},`;


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
  "blitzbuild"
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
    [new RegExp(`index_browserExports\\.useFlag\\("${FLAGS_TO_FORCE_ENABLE.join("|")}"\\)`), {
      replacement: "true",
      shift: Shift.REPLACE
    }],
    // Enable all ranks gifting
    ['jsxRuntimeExports.jsx("option",{value:"legend",children:"Legend"})', {
      replacement:
        `,jsxRuntimeExports.jsx("option", { value: "immortal", children: "Immortal" })`,
      shift: Shift.AFTER,
    }],

    // Enable Debug World Type
    [/availableWorldTypes\s*=\s*\{[\s\S]*?\}\s*,/g, {
      replacement: replacementWorldTypes,
      shift: Shift.REPLACE,
    }],


    // Enable Moderator-Only Features
    ['getRankLevel(player.profile.rank)',{
      replacement: '1000',
      shift: Shift.REPLACE,
    }],

    // Enable Moderator-Private-World Bypass (altDown)
    [/altDown\s*&&\s*getRankLevel\([\s\S]*?\)/g,{
      replacement: 'altDown && 1000',
      shift: Shift.REPLACE,
    }]

  ],
);
