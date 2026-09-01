export function getMovementDirection(): [number, number] {
	throw "TODO: implement getMovementDirection";
}
export default function getMovement(speed: number): [number, number] {
	return getMovementDirection().map((x) => x * speed) as [number, number];
}
