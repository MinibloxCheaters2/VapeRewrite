import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { S2CPacket } from "@/features/sdk/types/packetTypes";
import { s2c } from "@/utils/packetRefs";
import { getRandomArbitrary } from "@/utils/random";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class ChestStealer extends Mod {
	public name = "ChestStealer";
	public category = Category.UTILITY;

	private delaySetting = this.createSliderSetting(
		"Delay (ms)",
		100,
		0,
		500,
		10,
	);
	private randomDelayToggleSetting = this.createToggleSetting(
		"Random Delay",
		true,
	);
	private maxRandomDelaySetting = this.createSliderSetting(
		"Max Random (ms)",
		150,
		0,
		500,
		10,
		() => this.randomDelayToggleSetting.value(),
	);
	private autoCloseSetting = this.createToggleSetting("Auto Close", true);
	private closeEmptySetting = this.createToggleSetting(
		"Close When Empty",
		true,
		() => this.autoCloseSetting.value(),
	);
	private blacklistSetting = this.createTextBoxSetting(
		"Blacklist Items (comma separated)",
		"",
	);
	private notifySetting = this.createToggleSetting("Notify", true);

	private lastClickTime = 0;
	private currentWindowId: number | null = null;
	private stolenItems = 0;

	get delay() {
		return this.delaySetting.value();
	}

	get randomDelay() {
		return this.randomDelayToggleSetting.value();
	}

	get maxRandomDelay() {
		return this.maxRandomDelaySetting.value();
	}

	get autoClose() {
		return this.autoCloseSetting.value();
	}

	get closeWhenEmpty() {
		return this.closeEmptySetting.value();
	}

	get blacklist() {
		return this.blacklistSetting
			.value()
			.split(",")
			.map((s) => s.trim().toLowerCase())
			.filter((s) => s.length > 0);
	}

	get notify() {
		return this.notifySetting.value();
	}

	private getDelay(): number {
		const base = this.delay;
		if (this.randomDelay) {
			return base + getRandomArbitrary(0, this.maxRandomDelay);
		}
		return base;
	}

	private isBlacklisted(itemName: string): boolean {
		const name = itemName.toLowerCase();
		return this.blacklist.some(
			(item) => name.includes(item) || item.includes(name),
		);
	}

	protected onEnable(): void {
		this.currentWindowId = null;
		this.lastClickTime = 0;
		this.stolenItems = 0;
	}

	protected onDisable(): void {
		if (this.autoClose && this.currentWindowId !== null) {
			this.closeContainer();
		}
		this.currentWindowId = null;
	}

	private closeContainer(): void {
		const { player } = Refs;
		if (!player) return;

		player.closeScreen?.();
	}

	private clickSlot(slotId: number): void {
		const { playerController } = Refs;
		if (!playerController || this.currentWindowId === null) return;

		playerController.windowClick(
			this.currentWindowId,
			slotId,
			0,
			0,
			Refs.player,
		);
	}

	@Subscribe("receivePacket")
	private onPacket({ data: packet }: CancelableWrapper<S2CPacket>) {
		if (packet instanceof s2c("CPacketOpenWindow")) {
			this.currentWindowId = packet.windowId;
			this.lastClickTime = Date.now();
			this.stolenItems = 0;

			if (this.notify) {
				Refs.chat.addChat({
					text: "[ChestStealer] Opened chest",
					color: "green",
				});
			}
		}

		if (packet instanceof s2c("CPacketCloseWindow")) {
			if (this.currentWindowId === packet.windowId) {
				if (this.notify && this.stolenItems > 0) {
					Refs.chat.addChat({
						text: `[ChestStealer] Stole ${this.stolenItems} items`,
						color: "yellow",
					});
				}
				this.currentWindowId = null;
			}
		}
	}

	@Subscribe("gameTick")
	public onTick() {
		const { playerController, player } = Refs;
		if (!playerController || this.currentWindowId === null) {
			return;
		}

		const now = Date.now();

		if (now - this.lastClickTime < this.getDelay()) {
			return;
		}

		const container = player.openContainer;
		if (!container) {
			this.currentWindowId = null;
			return;
		}

		const slots = container.inventorySlots || [];
		const playerInventoryStart = slots.length - 36;

		let foundItem = false;

		for (let i = 0; i < playerInventoryStart; i++) {
			const slot = slots[i];
			if (!slot) continue;

			const stack = slot.getStack?.();
			if (!stack || !stack.getItem) continue;

			const itemName = stack.getItem().name || "unknown";

			if (!this.isBlacklisted(itemName)) {
				this.clickSlot(i);
				this.lastClickTime = now;
				this.stolenItems++;
				foundItem = true;
				break;
			}
		}

		if (!foundItem && this.autoClose && this.closeWhenEmpty) {
			this.closeContainer();
			this.currentWindowId = null;
		}
	}

	public getTag(): string {
		return `${this.delay}ms`;
	}
}
