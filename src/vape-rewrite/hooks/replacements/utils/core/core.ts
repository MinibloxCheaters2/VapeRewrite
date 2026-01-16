import { storeName } from "../../../../../Client";
import { Replacement, Shift } from "../ ../replacementTypes";

export const CORE_REPLACEMENTS: [string | RegExp, Replacement][] = [
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
];
