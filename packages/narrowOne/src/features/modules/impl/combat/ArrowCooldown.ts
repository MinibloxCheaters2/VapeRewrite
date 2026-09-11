import Category from "@vape/core/features/modules/api/Category";
import Mod from "@vape/core/features/modules/api/Module";
import createProxy from "@vape/core/utils/helpers/proxy";

import { ready } from "@/hooks/gameHook";
import game from "@/utils/refs/game";

let hooked: boolean;

const origMethods = {
	getLoadSpeed: undefined,
	getCooldownActive: undefined,
	getFireUpCooldownActive: undefined,
	getShootArrowInterval: undefined,
	getArrowReadyMs: undefined,
	getArrowVisibleMs: undefined,
};

export default class ArrowCooldown extends Mod {
	name = "ArrowCooldown";
	category = Category.COMBAT;

	protected onEnable(): void {
		ready.then(() => {
			hooked = true;
			const p = Object.getPrototypeOf(game.player.bowWeapon);
			if (typeof p.getLoadSpeed === "function") {
				origMethods.getLoadSpeed = p.getLoadSpeed;
				p.getLoadSpeed = createProxy(origMethods.getLoadSpeed, {
					apply(target, ta, argArray: [max: number, min: number]) {
						return argArray[0];
					},
				});
			}

			if (typeof p.getArrowReadyMs === "function") {
				origMethods.getArrowReadyMs = p.getArrowReadyMs;

				p.getArrowReadyMs = createProxy(origMethods.getArrowReadyMs, {
					apply(/*target, thisArg, argArray*/) {
						return 0;
					},
				});
			}
			if (typeof p.getArrowVisibleMs === "function") {
				origMethods.getArrowVisibleMs = p.getArrowVisibleMs;

				p.getArrowVisibleMs = createProxy(origMethods.getArrowVisibleMs, {
					apply(/*target, thisArg, argArray*/) {
						return 0;
					},
				});
			}

			if ("loadAmount01" in p) {
				p.loadAmount01 = Infinity;
			}

			if ("fireAmount01" in p) {
				p.fireAmount01 = Infinity;
			}

			if (typeof p.getFireUpCooldownActive === "function") {
				origMethods.getFireUpCooldownActive = p.getFireUpCooldownActive;
				p.getFireUpCooldownActive = createProxy(origMethods.getFireUpCooldownActive, {
					apply(/*target, thisArg, argArray*/) {
						console.log("[ArrowCooldown] FUCA", new Error().stack);
						return false;
					},
				});
			}

			if (typeof p.getShootArrowInterval === "function") {
				origMethods.getShootArrowInterval = p.getShootArrowInterval;

				p.getShootArrowInterval = createProxy(origMethods.getShootArrowInterval, {
					apply(/*target, thisArg, argArray*/) {
						return 0;
					},
				})
			}
			if (typeof p.getCooldownActive === "function") {
				origMethods.getCooldownActive = p.getCooldownActive;
				p.getCooldownActive = createProxy(origMethods.getCooldownActive, {
					apply(/*target, thisArg, argArray*/) {
						game.player.serverArrowCreated();
						this.loadAmount01 = Infinity;
						this.fireAmount01 = Infinity;
						return false;
					},
				});
			}
		});
	}
	protected onDisable(): void {
		if (!hooked) return;
		hooked = false;
		const p = Object.getPrototypeOf(game.player.bowWeapon);
		for (const [name, method] of Object.entries(origMethods)) {
			if (typeof p[name] === "function" && method !== undefined) {
				p[name] = method;
			}
		}
	}
}
