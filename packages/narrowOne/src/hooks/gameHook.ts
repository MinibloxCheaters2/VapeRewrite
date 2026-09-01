import { expose } from "@vape/core/exposed";

export let game;
export default function hook() {
	const orig = Array.from;
	Array.from = new Proxy(orig, {
		apply(target, thisArg, argArray) {
			const [obj] = argArray;
			if (obj?.next && obj?.next()?.value?.game) {
				game = obj.next().value.game;
				expose("game", () => game);
				Array.from = orig;
			}
			return Reflect.apply(target, thisArg, argArray);
		},
	});
}
hook();
