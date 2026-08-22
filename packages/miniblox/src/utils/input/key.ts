import Miniblox from "../refs/miniblox";

let pressedKeys: Record<string, boolean> = {};

function handler(value: boolean) {
	return (e: KeyboardEvent) => {
		pressedKeys[e.code] = value;
	};
}

window.addEventListener("keydown", handler(true));
window.addEventListener("keyup", handler(false));
window.addEventListener("blur", () => (pressedKeys = {}));

export default function isKeyDown(key: string): boolean {
	const { Game } = Miniblox;
	if (!Game.isActive(false)) return false;
	return pressedKeys[key] ?? false;
}
