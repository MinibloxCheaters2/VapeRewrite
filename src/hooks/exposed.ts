/**
 * a bunch of methods that are exposed in the store.
 * @module
 */

import dispatcher from "@/features/commands/api/CommandDispatcher";
import ModuleManager from "@/features/modules/api/ModuleManager";
import RotationManager from "@/utils/aiming/rotate";
import Bus from "../Bus";
import CancelableWrapper from "../event/api/CancelableWrapper";
import type ClientEvents from "../event/api/Events";
import ChatHook from "./ChatHook";
import { MATCHED_DUMPS } from "./replacement";
import Cancelable from "@/event/api/Cancelable";

/** functions exposed by patches that modify the game script */
export interface ExposedFromGame {
	/**
	 * runs a function with an extra `evalInScript` parameter
	 * @example You want to get the game object or anything inside the script,
	 * but you can't outside of it because it's not exposed in i.e. the `window` object:
	 * ```ts
	 * const ret = StoreInterop.store.fgExposed.run(evl => {
	 *  // technically you could get this without the "eval" via looking for it
	 *  // in `reactObject.updateQueue.baseState.element.props.game`, (wang told me about this method and ballcrack uses it)
	 *  // but you can't grab classes like i.e. `ClientSocket` since they aren't exposed.
	 *  const game = evl("game");
	 * });
	 * ```
	 */
	run<A, R>(
		fn: (evalInScript: <ER>(code: string) => ER, ...args: A[]) => R,
		...args: A[]
	): R;
}

export default {
	newCancelableWrapper<T>(data: T): CancelableWrapper<T> {
		return new CancelableWrapper(data);
	},
	newCancelable(): Cancelable {
		return new Cancelable();
	},
	emitEvent<E extends keyof ClientEvents>(
		event: E,
		...payload: ClientEvents[E] extends void ? [] : [ClientEvents[E]]
	) {
		Bus.emit(event, ...payload);
	},
	get moduleManager() {
		return ModuleManager;
	},
	get RotationManager() {
		return RotationManager;
	},

	get dump() {
		return MATCHED_DUMPS;
	},

	get ChatHook() {
		return ChatHook;
	},

	get commandManager() {
		return dispatcher;
	},
};
