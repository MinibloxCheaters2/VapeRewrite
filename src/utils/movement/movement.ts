import Miniblox from "../refs/miniblox";

export default function getMoveDirection(moveSpeed: number) {
	const { player, Vec3 } = Miniblox;
	let moveStrafe = Miniblox.player.moveStrafe;
	let moveForward = Miniblox.player.moveForward;
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
