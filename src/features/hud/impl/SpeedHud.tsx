import { createSignal } from "solid-js";
import Refs from "@/utils/helpers/refs";
import HudElement from "../api/JSXHudElement";

export default class SpeedHud extends HudElement {
	public name = "Speed";

	constructor() {
		super();
		this.id = "speed";
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
	private speedSignal = createSignal(0);
	#updateFrame: number;
	#lastPos: { x: number; z: number } | null = null;
	#lastTime = 0;

	public onAdd(): void {
		const update = () => {
			try {
				const player = Refs.player;
				if (player) {
					const now = performance.now();
					const dt = (now - this.#lastTime) / 1000;
					const pos = player.position;

					if (this.#lastPos && dt > 0) {
						const dx = pos.x - this.#lastPos.x;
						const dz = pos.z - this.#lastPos.z;
						const dist = Math.sqrt(dx * dx + dz * dz);
						const speed = (dist / dt) * 20;
						this.speedSignal[1](Math.round(speed * 10) / 10);
					}

					this.#lastPos = { x: pos.x, z: pos.z };
					this.#lastTime = now;
				}
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

		return (
			<div
				style={{
					"font-family": "Arial, sans-serif",
					"font-size": `${this.fontSizeSetting.value()}px`,
					color: textColor,
					"font-weight": "600",
					"text-shadow": "2px 2px 4px rgba(0, 0, 0, 0.8)",
				}}
			>
				Speed: {this.speedSignal[0]()} bps
			</div>
		);
	}
}
