/**
 * a bunch of methods that are exposed in the store.
 * @module
 */

import Bus from "../Bus";
import CancelableWrapper from "../event/api/CancelableWrapper";
import type ClientEvents from "../event/api/Events";
import ModuleManager from "../features/module/api/ModuleManager";
import dispatcher from "../features/commands/api/CommandDispatcher";
import { MATCHED_DUMPS } from "./replacement";

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
	run<A, R>(fn: (evalInScript: <ER>(code: string) => ER, ...args: A[]) => R, ...args: A[]): R;
}

export default {
	newCancelableWrapper<T>(data: T): CancelableWrapper<T> {
		return new CancelableWrapper(data);
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
	get dump() {
		return MATCHED_DUMPS;
	},
	async getFeedback(command: string): Promise<string> {
		const parseResults = await dispatcher.parse(command, null);
		const suggestions = await dispatcher.getCompletionSuggestions(parseResults);
		if (suggestions.getList().length > 0) {
			const s = suggestions.getList()[0];
			return command + " >> S " + s.getText() + " (" + s.getRange().getStart() + ", " + s.getRange().getEnd() + ")";
		}
		if (parseResults.getErrors().size > 0) {
			return command + " >> " + parseResults.getErrors().values().next().value.message;
		}
		const usage = await dispatcher.getAllUsage(parseResults.getContext().getRootNode(), null, false);
		if (usage.length > 0) {
			return command + " >> U " + usage[0];
		}
		return command;
	},

	get commandManager() {
		return dispatcher;
	}
};
