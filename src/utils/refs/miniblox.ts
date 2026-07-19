import { scriptEl } from "@/hooks/gameScript";
import { expose } from "@/exposed";
import initOrR from "../helpers/initOrR";
import { AnyPacket, ClientSocket, PlayerControllerMP } from "@wq2/miniblox-sdk";

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
let CSocket: typeof ClientSocket | undefined = undefined;
let playerControllerMP: PlayerControllerMP | undefined = undefined;

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
	get ClientSocket() {
		return initOrR(CSocket, () =>
			findObject(
				(x) =>
					// classes are "functions"
					typeof x === "function" &&
					"sendPacket" in x &&
					"socket" in x &&
					"disconnectMessage" in x &&
					"netSim" in x &&
					"serverBaseUrl" in x &&
					"setUrl" in x,
			),
		);
	},
	get playerControllerMP() {
		return initOrR(playerControllerMP, () =>
			findObject(
				(x) =>
					typeof x === "object" &&
					"lastSentSlot" in x &&
					"isHittingBlock" in x &&
					"sendEnchantPacket" in x &&
					"sendRenamePacket" in x,
			),
		);
	},
};
expose("Miniblox", () => Miniblox);

export default Miniblox;
