import game, { ready as mReady } from "@/utils/refs/game";
import createProxy from "@vape/core/utils/helpers/proxy";

let resolveFn: () => void;
export const ready = new Promise<void>((res) => {
	resolveFn = res;
});

let orig;
export default function hookOnJoin() {
	orig = game.main.gameManager.joinedGameId;
	game.main.gameManager.joinedGameId = createProxy(orig, {
		apply(target, thisArg, argArray) {
			const r = Reflect.apply(target, thisArg, argArray);
			setTimeout(resolveFn, 1e3);
			return r;
		},
	});
}

mReady.then(hookOnJoin);
