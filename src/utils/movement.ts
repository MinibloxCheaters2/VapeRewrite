import Refs from "./refs";

export default function getMoveDirection(moveSpeed: number) {
	const { player, Vec3 } = Refs;
	let moveStrafe = Refs.player.moveStrafe;
	let moveForward = Refs.player.moveForward;
	let speed = moveStrafe * moveStrafe + moveForward * moveForward;
	if (speed >= 0.0001) {
		speed = Math.sqrt(speed);
		if (speed < 1) {
			speed = 1;
		}
		speed = 1 / speed;
		moveStrafe = moveStrafe * speed;
		moveForward = moveForward * speed;
		const rt = Math.cos(player.yaw) * moveSpeed;
		const nt = -Math.sin(player.yaw) * moveSpeed;
		return new Vec3(
			moveStrafe * rt - moveForward * nt,
			0,
			moveForward * rt + moveStrafe * nt,
		);
	}
	return new Vec3(0, 0, 0);
}
