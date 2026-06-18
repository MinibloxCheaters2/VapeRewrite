import { createSignal } from "solid-js";
import Refs from "@/utils/helpers/refs";
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
	#updateFrame: number;

	public onAdd(): void {
		const update = () => {
			try {
				const player = Refs.player;
				const { EntityLivingBase, world } = Refs;
				if (!world || !player) return;

				let closest: TargetInfo | null = null;

				for (const entity of world.entities.values()) {
					if (
						entity instanceof EntityLivingBase &&
						entity.id !== player.id
					) {
						const dist = player.getDistanceToEntity(entity);
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
				style={{
					"font-family": "Arial, sans-serif",
					"font-size": `${this.fontSizeSetting.value()}px`,
					color: textColor,
					"font-weight": "600",
					"text-shadow": "2px 2px 4px rgba(0, 0, 0, 0.8)",
					"background-color": "rgba(0, 0, 0, 0.5)",
					"border-radius": "6px",
					padding: "8px 12px",
					"min-width": "160px",
				}}
			>
				<div style={{ "margin-bottom": "4px" }}>{target.name}</div>
				<div
					style={{
						display: "flex",
						"align-items": "center",
						gap: "8px",
						"margin-bottom": "4px",
					}}
				>
					<div
						style={{
							flex: "1",
							height: "6px",
							"background-color": "rgba(255, 255, 255, 0.2)",
							"border-radius": "3px",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								width: `${Math.max(0, Math.min(100, healthPct * 100))}%`,
								height: "100%",
								"background-color": healthBarColor,
								"border-radius": "3px",
								transition: "width 0.2s ease",
							}}
						/>
					</div>
					<span
						style={{
							"font-size": `${this.fontSizeSetting.value() - 2}px`,
						}}
					>
						{target.health}/{target.maxHealth}
					</span>
				</div>
				<div
					style={{
						"font-size": `${this.fontSizeSetting.value() - 2}px`,
						opacity: "0.8",
					}}
				>
					Distance: {target.distance}
				</div>
			</div>
		);
	}
}
