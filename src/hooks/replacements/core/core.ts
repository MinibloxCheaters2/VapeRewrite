import { type MultipleReplacements, Shift } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils/patchHelper";

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
