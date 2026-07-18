import { gameScript, gameScriptReady } from "@/hooks/gameScript";
import logger from "../logging/loggers";
import { expose } from "@/exposed";

// note to self: do NOT add the `g` (global) flag, otherwise it not workong
// even though it works in regexr (you can see /g in the flags enabled) but idk
// https://regexr.com/8nl99, feel free to paste ts as long as the code you put it in is under AGPL
// (which most importantly, requires your code to be open source if the project is public!!! no proprietary/closed source garbage here).
const THREE_IMPORT_REGEX = /from\s*"(\.\/three-\w+\.js)"/;

export function getThreeImport(): string | undefined {
	const m = gameScript.match(THREE_IMPORT_REGEX);
	const v = m?.[1];
	if (!v) {
		logger.error("Failed to find ThreeJS import", gameScript, v);
		return;
	}
	return v.replace("./", "./assets/");
}

export async function importThreeJS() {
	await gameScriptReady;
	const url = getThreeImport();
	if (url === undefined) {
		logger.error("ThreeJS import thing not found!");
		return;
	}
	return await import(url);
}

let three: object;

importThreeJS().then((t) => {
	three = t;
	expose("THREE_RAW", () => t);
});

function findObject(filter: (clazz: NewableFunction) => boolean) {
	return Object.values(three).find(filter);
}

function findObjectByCode(codeFilter: (code: string) => boolean) {
	return Object.values(three).find((x) => codeFilter(x.toString()));
}

function findObjectByType(type: string) {
	return findObjectByCode((x) => x.includes(`this.type=\`${type}\``));
}

const THREE = {
	get BoxGeometry() {
		return findObjectByType("BoxGeometry");
	},

	get Mesh() {
		return findObjectByType("Mesh");
	},

	get Vec3() {
		return findObject((x) => {
			return (
				typeof x === "function" &&
				"prototype" in x &&
				typeof x.prototype === "object" &&
				"isVector3" in x.prototype &&
				x.prototype.isVector3
			);
		});
	},
};
expose("THREE", () => THREE);

export default THREE;
