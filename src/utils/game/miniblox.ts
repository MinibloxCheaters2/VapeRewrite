import { scriptEl } from "@/hooks/gameScript";
import { expose } from "@/exposed";
import initOrR from "../helpers/initOrR";
import { AnyPacket } from "@wq2/miniblox-sdk";

export async function importMiniblox() {
	return await import(scriptEl.src);
}

let miniblox: object;

importMiniblox().then((t) => {
	miniblox = t;
	expose("MinibloxRaw", () => t);
});

function findObject(filter: (clazz: NewableFunction) => boolean) {
	return Object.values(miniblox).find(filter);
}

function findObjectByCode(codeFilter: (code: string) => boolean) {
	return Object.values(miniblox).find((x) => codeFilter(x.toString()));
}

function filterObject(filter: (clazz: NewableFunction) => boolean) {
	return Object.values(miniblox).filter(filter);
}

function filterObjectByCode(codeFilter: (code: string) => boolean) {
	return Object.values(miniblox).filter((x) => codeFilter(x.toString()));
}

const packets: AnyPacket[] | undefined = undefined;
const Miniblox = {
	/** note: not all packets are here, only the ones vector exports. */
	get packets() {
		return initOrR(
			packets,
			() =>
				filterObject(
					(x) => typeof x === "function" && "typeName" in x,
				) as AnyPacket[] | undefined,
		);
	},
};
expose("Miniblox", () => Miniblox);

export default Miniblox;
