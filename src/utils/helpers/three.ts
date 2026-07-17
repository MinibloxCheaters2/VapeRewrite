import { gameScript } from "@/hooks/gameScript";

const THREE_IMPORT_REGEX = / from "(\.\/three-\w+\.js)";/g;

export function getThreeImport(): string | undefined {
	const m = gameScript.match(THREE_IMPORT_REGEX);
	const v = m?.[1];
	if (!v) return;
	return v.replace("./", "./assets/");
}

export async function importThreeJS() {
	const url = getThreeImport();
	if (url === undefined) return;
	return await import(url);
}

let THREE: object;

importThreeJS().then((three) => {
	THREE = three;
});

function findObject(filter: (clazz: NewableFunction) => boolean) {
	return Object.values(THREE).find(filter);
}

function filterObjects(filter: (clazz: NewableFunction) => boolean) {
	return Object.values(THREE).filter(filter);
}

function findObjectByCode(codeFilter: (code: string) => boolean) {
	return Object.values(THREE).filter((x) => codeFilter(x.toString()));
}

function findObjectByType(type: string) {
	return findObjectByCode((x) => x.includes(`this.type=\`${type}\``));
}

const ThreeRefs = {
	get BoxGeometry() {
		return findObjectByType("BoxGeometry");
	},

	get Mesh() {
		return findObjectByType("Mesh");
	},

	get Vec3() {
		return findObject((x) => x.prototype.isVector3);
	},
};

export default ThreeRefs;
