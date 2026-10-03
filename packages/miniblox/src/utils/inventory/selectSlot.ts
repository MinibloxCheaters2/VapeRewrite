import Miniblox from "../refs/miniblox";

export function getSelectedSlot() {
	return Miniblox.game.info.selectedSlot;
}
export default function selectSlot(slot: number) {
	const { player, game } = Miniblox;
	if (!player || !game) return;
	player.inventory.currentItem = slot;
	game.info.selectedSlot = slot;
}
