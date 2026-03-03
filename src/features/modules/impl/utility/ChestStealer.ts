import { Subscribe } from "@/event/api/Bus";
import type CancelableWrapper from "@/event/api/CancelableWrapper";
import type { S2CPacket } from "@/features/sdk/types/packetTypes";
import SlotActionType from "@/features/sdk/types/slotActionType";
import { s2c } from "@/utils/packetRefs";
import { getRandomArbitrary } from "@/utils/random";
import Refs from "@/utils/refs";
import Category from "../../api/Category";
import Mod from "../../api/Module";
import { dynamicIsland } from "../../DynamicIsland";

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
		false,
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
	private initialItemCount = 0;
	private showChestCloseIsland = false;

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
			SlotActionType.PICKUP_RIGHT,
			Refs.player,
		);
	}

	@Subscribe("receivePacket")
	private onPacket({ data: packet }: CancelableWrapper<S2CPacket>) {
		if (packet instanceof s2c("CPacketOpenWindow")) {
			this.currentWindowId = packet.windowId;
			this.lastClickTime = Date.now();
			this.stolenItems = 0;
			this.initialItemCount = 0;
			this.showChestCloseIsland = true;

			// Count initial items
			setTimeout(() => {
				const { player } = Refs;
				if (!player) return;
				const container = player.openContainer;
				if (!container) return;

				const slots = container.inventorySlots;
				const playerInventoryStart = slots.length - 36;

				for (let i = 0; i < playerInventoryStart; i++) {
					const slot = slots[i];
					if (!slot) continue;
					const stack = slot.getStack?.();
					if (!stack || !stack.getItem) continue;
					const itemName = stack.getItem().name || "unknown";
					if (!this.isBlacklisted(itemName)) {
						this.initialItemCount++;
					}
				}

				// Show chest opened on Dynamic Island
				try {
					console.log(
						"ChestStealer showing chest opened, items:",
						this.initialItemCount,
					);
					if (dynamicIsland) {
						dynamicIsland.show({
							duration: 2000,
							width: 300,
							height: 70,
							elements: [
								{
									type: "text",
									content: "Chest Opened",
									x: 0,
									y: -15,
									color: "#ffd700",
									size: 15,
									bold: true,
								},
								{
									type: "text",
									content: `${this.initialItemCount} items found`,
									x: 0,
									y: 12,
									color: "#fff",
									size: 12,
								},
							],
						});
					}
				} catch (_e) {
					// Dynamic Island not available
				}
			}, 50);

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

				// Show closed message if not already shown
				try {
					if (dynamicIsland && this.showChestCloseIsland) {
						dynamicIsland.show({
							duration: 1000,
							width: 260,
							height: 50,
							elements: [
								{
									type: "text",
									content: "✓ Chest Closed",
									x: 0,
									y: 0,
									color: "#0FB3A0",
									size: 14,
									bold: true,
								},
							],
						});
						this.showChestCloseIsland = false;
					}
				} catch (_e) {
					// Dynamic Island not available
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

		const slots = container.inventorySlots;
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

				// Show progress on Dynamic Island
				try {
					console.log(
						"ChestStealer showing progress:",
						this.stolenItems,
						"/",
						this.initialItemCount,
					);
					if (dynamicIsland && this.initialItemCount > 0) {
						const remaining =
							this.initialItemCount - this.stolenItems;
						const progress =
							this.initialItemCount > 0
								? this.stolenItems / this.initialItemCount
								: 0;
						const speed = (1000 / this.delay).toFixed(1);

						dynamicIsland.show({
							duration: 0,
							width: 320,
							height: 85,
							elements: [
								{
									type: "text",
									content: "ChestSteal",
									x: 0,
									y: -25,
									color: "#fff",
									size: 15,
									bold: true,
								},
								{
									type: "progress",
									value: progress,
									x: 0,
									y: -8,
									width: 280,
									height: 8,
									color: "#ffd700",
									rounded: true,
								},
								{
									type: "text",
									content:
										this.stolenItems +
										" / " +
										this.initialItemCount,
									x: -110,
									y: 10,
									color: "#ffd700",
									size: 12,
									bold: true,
								},
								{
									type: "text",
									content: `${remaining} left`,
									x: 40,
									y: 10,
									color: "#888",
									size: 11,
								},
								{
									type: "text",
									content: `${speed} items/s`,
									x: 0,
									y: 28,
									color: "#0FB3A0",
									size: 10,
								},
							],
						});
					}
				} catch (_e) {
					// Dynamic Island not available
				}

				break;
			}
		}

		if (!foundItem && this.autoClose && this.closeWhenEmpty) {
			// Show completion on Dynamic Island
			try {
				if (dynamicIsland && this.stolenItems > 0) {
					dynamicIsland.show({
						duration: 500,
						width: 260,
						height: 50,
						elements: [
							{
								type: "text",
								content: "✓ Chest Closed",
								x: 0,
								y: 0,
								color: "#0FB3A0",
								size: 14,
								bold: true,
							},
						],
					});
				}
			} catch (_e) {
				// Dynamic Island not available
			}

			this.closeContainer();
			this.currentWindowId = null;
		}
	}

	public getTag(): string {
		return `${this.delay}ms`;
	}
}
