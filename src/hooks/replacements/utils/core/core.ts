import { EXPOSED } from "@/utils/patchHelper";
import { type MultipleReplacements, Shift } from "@/hooks/replacementTypes";

export const CORE_REPLACEMENTS: MultipleReplacements = [
	[
		'document.addEventListener("DOMContentLoaded",startGame,!1);',
		{
			replacement: `setTimeout(function() {
        const DOMContentLoaded_event = document.createEvent("Event");
        DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true);
        document.dispatchEvent(DOMContentLoaded_event);
      }, 0);`,
			shift: Shift.AFTER,
		},
	],

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
  session: (${EXPOSED}.moduleManager.antiBan.enabled
    ? await ${EXPOSED}.moduleManager.antiBan.getToken()
    : (localStorage.getItem(SESSION_TOKEN_KEY) ?? "")),
  hydration: "0",
  metricsId: uuid$1(),
  clientVersion: VERSION$1
  })`,
			shift: Shift.REPLACE,
		},
	],

	[
		"static sendPacket(u){",
		{
			replacement: `const cWrap = ${EXPOSED}.newCancelableWrapper(u);
${EXPOSED}.emitEvent("sendPacket", cWrap);
if (cWrap.canceled)
	return;
`,
			shift: Shift.AFTER,
		},
	],

];
