/**
 * This game does detections by sending code from the server to the client.
 * The client runs the code via `new Function` and returns the result.
 * We intercept eval (just to fully cover everything I guess) & new Function.
 * We could probably abuse `new Function` to get extra variables,
 * but I think we have enough stuff already.
 * @module
 */

import { Category } from "@vape-rewrite/core";
import { Mod } from "@vape-rewrite/core";
import { showNotification } from "@vape-rewrite/ui-api";
import { createProxy } from "@vape-rewrite/core";
import { Logger } from "@vape-rewrite/core";
// mainHook also hooks `Function`,
// we want to call its proxy in case it initializes before us.
import { origFunction as realOrigFunction } from "@/hooks/mainHook";

import { main, thing } from "@/hooks/mainHook";
import game, { anyReady } from "@/utils/refs/game";

const w = (unsafeWindow ?? window) as typeof window;

const [origEval, origFunction] = [w.eval, w.Function];
const logger = new Logger("DetectionDebugger");

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
		if (!main) [w.eval, w.Function] = [origEval, realOrigFunction];
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
				})
				.catch((e) => {
					showNotification(
						"DetectionDebugger",
						`Failed to copy to clipboard, logged to console instead. Error: ${e}`,
						"alert",
						0.5e3,
					);
				});
		} catch (e) {
			showNotification(
				"DetectionDebugger",
				`Failed to serialize to logs, logged to console instead. Error: ${e}`,
				"alert",
				0.5e3,
			);
		} finally {
			logger.info("Detection logs:", logs);
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
		logger.info("function:", log);
	}
	protected onEnable(): void {
		anyReady.then(() => {
			game.player.__proto__.report = createProxy(game.player.__proto__.report, {
				apply(target, thisArg, argArray: [reason: number, n: number]) {
					if (!thisArg.hasOwnership) return Reflect.apply(target, thisArg, argArray);
					logger.warn("client-sided ac:", thisArg, argArray, new Error().stack);
					const [reason, n] = argArray;
					showNotification(
						"DetectionDebugger",
						`Flagged client-sided ac: ${reason} (${n})`,
						"alert",
					);
					// return Reflect.apply(target, thisArg, argArray);
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
					logger.warn("eval:", log);
					return r;
				},
			}),
			createProxy(realOrigFunction, {
				construct: (target, argArray, newTarget) => {
					const r = Reflect.construct(target, argArray, newTarget);
					return createProxy(r, {
						apply: (target, thisArg, argArray) => {
							const a = Reflect.apply(target, thisArg, argArray);
							if (!main && argArray.length === 1) {
								thing(argArray[0], true);
							}
							// target is a proxy somehow..?
							this.logFunctionCall(r, argArray, a);
							return a;
						},
					});
				},
			}),
		];
	}
}
