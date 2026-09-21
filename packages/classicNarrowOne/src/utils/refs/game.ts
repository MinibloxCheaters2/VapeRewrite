import { expose } from "@vape/core/exposed";

function getImport() {
	return performance.getEntriesByType("resource").find((x) => {
		const { name } = x;
		return name.startsWith("https://classic.narrow.one/js.js?v=");
	})?.name;
}

// oxlint-disable-next-line no-unassigned-vars
let main: any;
export const ready = new Promise<any>((res) => {
	const retry = () => {
		const i = getImport();
		if (i === undefined) return setTimeout(retry, 1);
		import(i).then(({ default: m }) => {
			main = m;
			res(m);
		});
	};
	setTimeout(retry, 1);
});

// `getMyPlayers` exists, but it's a generator function, and I'm not using that...
function getMyPlayer(instance) {
	for (const plr of instance.players.values()) {
		if (plr.hasOwnership) return plr;
	}
}

const game = {
	get main() {
		return main;
	},
	get instance() {
		return main?.gameManager?.currentGame;
	},
	get player() {
		const inst = game.instance;
		if (!inst) return;
		return getMyPlayer(inst);
	}
};

expose("game", () => game);

export default game;
