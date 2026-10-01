import type { ArrayVec3, ArrayVec2 } from "@vape/core/src/utils/math/vec";

import game from "../refs/game";
import { origSendPos } from "@/hooks/hookSendPos";

export default function sendPosSilently(pos: ArrayVec3, rot: ArrayVec2) {
	const { player, network } = game;
	if (!player) return;
	if (network) {
		network.sendPlayerData(player.game, player.id, {
			posX: pos[0],
			posY: pos[1],
			posZ: pos[2],
			rotX: rot[0],
			rotY: rot[1],
		});
		return;
	}
	const [x, y, z] = pos;
	const [yaw, pitch] = rot;
	const { x: oX, y: oY, z: oZ } = player.pos;
	const { x: oYaw, y: oPitch } = player.lookRot;
	player.pos.set(x, y, z);
	player.lookRot.set(yaw, pitch);
	(origSendPos.bind(player) ?? player.sendPlayerDataToServer)();
	player.pos.set(oX, oY, oZ);
	player.lookRot.set(oYaw, oPitch);
}
