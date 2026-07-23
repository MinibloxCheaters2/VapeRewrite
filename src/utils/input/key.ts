import Miniblox from "../refs/miniblox";

const pressedKeys: Record<string, boolean> = {};

document.addEventListener("keydown", (x) => (pressedKeys[x.code] = true));
document.addEventListener("keyup", (x) => (pressedKeys[x.code] = false));

export default function isKeyDown(key: string): boolean {
	const { Game } = Miniblox;
	if (!Game.isActive(false)) return false;
	return pressedKeys[key] ?? false;
}
