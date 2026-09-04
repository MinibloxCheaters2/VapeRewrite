import Refs from "../Refs";

function getMovementDirection() {
	const { player } = Refs;
	if (!player) return [0, 0];
	const { walkInput } = player.inputManager;
	const len = Math.sqrt(walkInput.x ** 2 + walkInput.y ** 2);
	if (len < 1e-4) return [0, 0];

	const yaw = player.lookRot.x;
	// inverted so -1 is forward :skull:
	const dx = (walkInput.y * Math.sin(yaw) + walkInput.x * Math.cos(yaw)) / len;
	const dz = (walkInput.y * Math.cos(yaw) - walkInput.x * Math.sin(yaw)) / len;
	return [dx, dz];
}

export default function getMovement(speed: number): [number, number] {
	return getMovementDirection().map((x) => x * speed) as [number, number];
}
