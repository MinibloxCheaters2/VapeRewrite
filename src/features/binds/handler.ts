export type Callback = (e: KeyboardEvent) => void;
interface Bind {
	id: string;
	callback: Callback;
}

const bound: { [k: string]: Bind[] } = {};

const keyMap: Record<string | number, string> = {};
for (let i = 0; i < 26; i++)
	keyMap[i + 65] = keyMap[`Key${String.fromCharCode(i + 65)}`] =
		String.fromCharCode(i + 97);
for (let i = 0; i < 10; i++) keyMap[48 + i] = keyMap[`Digit${i}`] = `${i}`;

export function normalizeCase(s: string): string {
	return s.toLowerCase();
}

export function addBind(key: string, id: string, callback: Callback) {
	const k = normalizeCase(key);
	bound[k] ??= [];
	bound[k]?.push({
		callback,
		id,
	});
}

export function setBind(
	oldKey: string,
	newKey: string,
	id: string,
	callback?: Callback,
): boolean {
	const oK = normalizeCase(oldKey);
	const nK = normalizeCase(newKey);
	const oldBound = bound[oK];
	if (!oldBound) return false;
	const idx = oldBound.findIndex((b) => b.id === id);
	if (idx === -1) return false;
	const old = oldBound.splice(idx)?.[0];
	if (!old) return false;
	bound[nK] ??= [];
	bound[nK]?.push({
		callback: callback ?? old.callback,
		id,
	});
	return true;
}

export function removeBind(key: string, id: string): boolean {
	const k = normalizeCase(key);
	const b = bound[k];
	if (!b) return false;
	const idx = b.findIndex((b) => b.id === id);
	if (idx === -1) return false;
	b.splice(idx);
	return true;
}

unsafeWindow.addEventListener("keydown", (e) => {
	bound[normalizeCase(keyMap[e.code] ?? e.code)]?.forEach?.((x) => {
		x.callback(e);
	});
});
