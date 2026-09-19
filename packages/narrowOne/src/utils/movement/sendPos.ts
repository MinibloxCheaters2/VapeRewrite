import type { ArrayVec3, ArrayVec2 } from "@vape/core/src/utils/math/vec";

import game from "../refs/game";

export default function sendPosSilently(pos: ArrayVec3, rot: ArrayVec2) {
	const { player } = game;
	if (!player) return;
	const [x, y, z] = pos;
	const [yaw, pitch] = rot;
	const { x: oX, y: oY, z: oZ } = player.pos;
	const { x: oYaw, y: oPitch } = player.lookRot;
	player.pos.set(x, y, z);
	player.lookRot.set(yaw, pitch);
	player.sendPlayerDataToServer();
	player.pos.set(oX, oY, oZ);
	player.lookRot.set(oYaw, oPitch);
}
