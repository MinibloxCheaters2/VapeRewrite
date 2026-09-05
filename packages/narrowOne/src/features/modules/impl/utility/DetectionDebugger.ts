/**
 * This game does detections by sending code from the server to the client.
 * The client runs the code via `new Function` and returns the result.
 * We intercept eval (just to fully cover everything I guess) & new Function.
 * We could probably abuse `new Function` to get extra variables,
 * but I think we have enough stuff already.
 * @module
 */

import { ready } from "@/hooks/gameHook";
import { main, thing } from "@/hooks/mainHook";
import Refs from "@/utils/Refs";
import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import { showNotification } from "@vape/core/ui/notifications";
import createProxy from "@vape/core/utils/helpers/proxy";

const w = (unsafeWindow ?? window) as typeof window;

const [origEval, origFunction] = [w.eval, w.Function];
// because Violentmonkey is gay and doesn't preserve the ACTUAL console.log
const origLog = window.console.log;

interface CodeLog {
	type: "function" | "eval";
	it: string | Function;
	args?: unknown[];
	output: unknown;
}

const logs: CodeLog[] = [];

export default class DetectionDebugger extends Mod {
	name = "DetectionDebugger";
	static readonly INSTANCE = new DetectionDebugger();
	category = Category.UTILITY;
	protected onDisable(): void {
		try {
		const clipboard = JSON.stringify(logs);
		navigator.clipboard
			.writeText(clipboard)
			.then(() => {
				showNotification(
					"DetectionDebugger",
					"Copied all detection logs to clipboard",
					"info",
					0.5e3,
				);
				origLog("Detection logs:", logs);
			})
			.catch((e) => {
				showNotification(
					"DetectionDebugger",
					`Failed to copy to clipboard, logged to console instead. Error: ${e}`,
					"alert",
					0.5e3,
				);
				origLog("Detection logs:", logs);
			});
		} catch (e) {
			showNotification(
				"DetectionDebugger",
				`Failed to serialize to logs, logged to console instead. Error: ${e}`,
				"alert",
				0.5e3,
			);
			origLog("Detection logs:", logs);
		}
	}
	logFunctionCall(f: Function, args: unknown[], output: unknown) {
		const log = {
			type: "function",
			it: f,
			args,
			output,
		} as const;
		logs.push(log);
		origLog("[DetectionDebugger] function:", log);
	}
	protected onEnable(): void {
		ready.then(() => {
			Refs.player.__proto__.report = createProxy(Refs.player.__proto__.report, {
				apply(target, thisArg, argArray: [reason: number, n: number]) {
					if (!thisArg.hasOwnership) return Reflect.apply(target, thisArg, argArray);
					origLog("[DetectionDebugger] client-sided ac:", thisArg, argArray);
					const [reason, n] = argArray;
					showNotification(
						"DetectionDebugger",
						`Flagged client-sided ac: ${reason} (${n})`,
						"alert"
					);
					return Reflect.apply(target, thisArg, argArray);
				},
			});
		});
		[w.eval, w.Function] = [
			createProxy(origEval, {
				apply(target, thisArg, argArray) {
					const r = Reflect.apply(target, thisArg, argArray);
					const log = {
						type: "eval",
						it: argArray[0],
						output: r,
					} as const;
					logs.push(log);
					origLog("[DetectionDebugger] eval:", log);
					return r;
				},
			}),
			createProxy(origFunction, {
				construct: (target, argArray, newTarget) => {
					const r = Reflect.construct(target, argArray, newTarget);
					return createProxy(r, {
						apply: (target, thisArg, argArray) => {
							const a = Reflect.apply(target, thisArg, argArray);
							if (!main && argArray.length === 1) {
								thing(argArray[0], true);
							}
							this.logFunctionCall(r, argArray, a);
							return a;
						},
					});
				},
			}),
		];
	}
}
