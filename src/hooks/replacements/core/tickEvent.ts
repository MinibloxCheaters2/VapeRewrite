import { Shift, type SingleReplacement } from "@/hooks/replacementTypes";
import { EXPOSED } from "@/utils/patchHelper";

export const GAME_TICK_EVENT_REPLACEMENT: SingleReplacement = [
	"fixedUpdate(){game.world.",
	{
		replacement: `
fixedUpdate() {
	${EXPOSED}.emitEvent("gameTick");
	game.world.
`,
		shift: Shift.REPLACE,
	},
];
export const PLAYER_TICK_EVENT_REPLACEMENT: SingleReplacement = [
	"fixedUpdate(){var h;",
	{
		replacement: `
fixedUpdate() {
{
	const cancelable = ${EXPOSED}.newCancelable();
	${EXPOSED}.emitEvent("playerTick", cancelable);
	if (cancelable.canceled) {
		return;
	}
}
var h;
`,
		shift: Shift.REPLACE,
	},
];
