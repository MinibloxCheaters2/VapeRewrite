import { storeName } from "../../Client";
import { Replacement, Shift } from "./replacementTypes";

// an interesting note, remove the type parameters (<string | RegExp, Replacement>) and then TypeScript starts complaining about types not being the same.
const replacementWorldTypes = `availableWorldTypes = {
		[GameModeId.SURVIVAL]: [WorldGenerationType.NORMAL, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.DEBUG],
		[GameModeId.CREATIVE]: [WorldGenerationType.NORMAL, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.DEBUG],
		[GameModeId.ADVENTURE]: [WorldGenerationType.NORMAL, WorldGenerationType.FLAT, WorldGenerationType.VOID, WorldGenerationType.SKYBLOCK, WorldGenerationType.ONEBLOCK, WorldGenerationType.DEBUG]
	},`;

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

    ['this.game.unleash.isEnabled("disable-ads")', {
      replacement: "true",
      shift: Shift.REPLACE,
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
    [/index_browserExports\.useFlag\("[^"]+"\)/g, {
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



  ],
);
