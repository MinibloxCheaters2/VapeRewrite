import { createSignal } from "solid-js";
import Miniblox from "@/utils/refs/miniblox";
import HudElement from "../api/JSXHudElement";

interface TargetInfo {
	name: string;
	health: number;
	maxHealth: number;
	distance: number;
}

export default class TargetHud extends HudElement {
	public name = "Target Info";

	constructor() {
		super();
		this.id = "target";
	}

	private fontSizeSetting = this.createSliderSetting(
		"Font Size",
		14,
		8,
		32,
		1,
	);
	private textColorSetting = this.createColorSliderSetting("Text Color", {
		h: 0,
		s: 0,
		v: 1,
		o: 1,
	});
	private targetSignal = createSignal<TargetInfo | null>(null);
	#updateFrame = 0;

	public onAdd(): void {
		const update = () => {
			try {
				const { EntityLivingBase, world, player } = Miniblox;
				if (!EntityLivingBase || !world || !player) return;

				let closest: TargetInfo | null = null;

				for (const entity of world.entities.values()) {
					if (
						entity instanceof EntityLivingBase &&
						entity.id !== player.id
					) {
						const dist = player.getDistanceSqToEntity(entity);
						if (dist <= 12) {
							const health = entity.getHealth?.() ?? 0;
							const maxHealth = entity.getMaxHealth?.() ?? 20;
							const name = entity.getName?.() ?? entity.id;

							if (!closest || dist < closest.distance) {
								closest = {
									name,
									health: Math.round(health * 10) / 10,
									maxHealth: Math.round(maxHealth * 10) / 10,
									distance: Math.round(dist * 10) / 10,
								};
							}
						}
					}
				}

				this.targetSignal[1](closest);
			} catch {}
			this.#updateFrame = requestAnimationFrame(update);
		};
		update();
	}

	public onRemove(): void {
		if (this.#updateFrame) cancelAnimationFrame(this.#updateFrame);
	}

	public render() {
		const color = this.textColorSetting.value();
		const textColor = `rgba(${Math.round(color.h * 255)}, ${Math.round(color.s * 255)}, ${Math.round(color.v * 255)}, ${color.o})`;
		const target = this.targetSignal[0]();

		if (!target) return null;

		const healthPct =
			target.maxHealth > 0 ? target.health / target.maxHealth : 0;
		const healthBarColor =
			healthPct > 0.5
				? "#4CAF50"
				: healthPct > 0.25
					? "#FF9800"
					: "#f44336";

		return (
			<div
				class="vape-hud-text vape-hud-panel"
				style={{
					"--hud-font-size": `${this.fontSizeSetting.value()}px`,
					"--hud-color": textColor,
				}}
			>
				<div style={{ "margin-bottom": "4px" }}>{target.name}</div>
				<div class="vape-hud-info-row">
					<div class="vape-health-bar-track">
						<div
							class="vape-health-bar-fill"
							style={{
								"--health-pct": `${Math.max(0, Math.min(100, healthPct * 100))}%`,
								"--health-color": healthBarColor,
							}}
						/>
					</div>
					<span class="vape-hud-text-sm">
						{target.health}/{target.maxHealth}
					</span>
				</div>
				<div class="vape-hud-text-sm vape-hud-dim">
					Distance: {target.distance}
				</div>
			</div>
		);
	}
}
