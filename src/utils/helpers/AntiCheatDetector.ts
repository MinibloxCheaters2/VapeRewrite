/**
 * An always-running class that listens to packets to figure out what the server of the AntiCheat is.
 * @module
 */

import Bus from "@/Bus";
import { Subscribe } from "@/event/Bus";
import { Logger } from "../logging/Logger";
import { c2s, s2c } from "../network/packetRefs";
import Refs from "./refs";

export enum DetectedAC {
	/** Not detected yet. */
	UNKNOWN,
	/**
	 * The new, server-authoritative anticheat.
	 * You'll find this usually on gamemodes with PvP (i.e. Bridge Duels, EggWars, SkyWars, OITQ, KitPvP, and Classic PvP)
	 */
	NEW,
	/**
	 * The old and gold (...to cheat on) AntiCheat, you can Fly and Speed on there infinitely and even disable its movement checks...
	 * You'll usually find this in player worlds and gamemodes without PvP (i.e. Murder Mystery, Hide and Seek, etc.)
	 */
	OLD,
}

const LOGGER = new Logger("AntiCheat Detector");

export default new (class AntiCheatDetector {
	verdict = DetectedAC.UNKNOWN;
	#firstInput = -1;
	constructor() {
		Bus.registerSubscriber(this);
	}
	@Subscribe("connect")
	private resetState() {
		LOGGER.info("Setting initial unknown state");
		this.verdict = DetectedAC.UNKNOWN;
		this.#firstInput = -1;
		// better performance this way
		Bus.onceB("sendPacket", ({ data }) => {
			if (
				this.#firstInput === -1 &&
				data instanceof c2s("SPacketPlayerInput") &&
				!(
					(
						Refs.player.abilities.isFlying ||
						Refs.player.mode.isSpectator()
					) /* ||
					Refs.player.mode.isCreative()*/
				)
			) {
				LOGGER.info("Captured 1st input");
				this.#firstInput = Date.now();
				return true;
			}
			return false;
		});
		Bus.onceB("receivePacket", ({ data }) => {
			if (this.verdict === DetectedAC.UNKNOWN) {
				if (data instanceof s2c("CPacketPlayerReconciliation")) {
					LOGGER.info(
						"New AC-only packet detected, verdict is new AC",
					);
					// only the new ac sends this
					this.verdict = DetectedAC.NEW;
					return true;
				} else if (
					this.#firstInput !== -1 &&
					Date.now() - this.#firstInput >= 0.5e3
				) {
					LOGGER.info(
						"No reconciliation packet for 0.5 seconds, assuming old AC.",
					);
					this.verdict = DetectedAC.OLD; // assume old AC if we don't get a reconciliation packet after 0.5 seconds
					return true;
				}
			} else {
				return true;
			}
			return false;
		});
	}
})();
