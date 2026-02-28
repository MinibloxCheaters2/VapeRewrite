import { MATCHED_DUMPS } from "@/hooks/replacement";
import GExposed from "../../exposedO";

let fn: (k: string) => boolean;
let isKeyDown = (k: string): boolean => {
	if (fn !== undefined) isKeyDown = fn;
	fn = GExposed.store.run((e) =>
		e<(k: string) => boolean>(MATCHED_DUMPS.keyPressedPlayer),
	);
	return fn(k);
};

export default isKeyDown;
