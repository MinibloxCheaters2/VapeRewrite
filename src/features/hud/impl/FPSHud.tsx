import { createSignal } from "solid-js";
import Refs from "@/utils/refs";
import HudElement from "../api/HudElement";

export default class FPSHud extends HudElement {
	public name = "FPS";
	#fpsAnimationFrame: number;

	constructor() {
		super();
		this.id = "fps";
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

	private fpsSignal = createSignal(0);
	private lastFrameTime = performance.now();
	private frameCount = 0;
	private fpsUpdateInterval = 500; // Update every 500ms

	public onAdd(): void {
		const updateFPS = () => {
			this.frameCount++;
			const now = performance.now();
			const elapsed = now - this.lastFrameTime;

			if (elapsed >= this.fpsUpdateInterval) {
				const fps = Refs.game.resourceMonitor.filteredFPS;
				this.fpsSignal[1](fps);
				this.frameCount = 0;
				this.lastFrameTime = now;
			}

			this.#fpsAnimationFrame = requestAnimationFrame(updateFPS);
		};

		updateFPS();
	}

	public onRemove(): void {
		if (this.#fpsAnimationFrame) {
			cancelAnimationFrame(this.#fpsAnimationFrame);
		}
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
				FPS: {this.fpsSignal[0]()}
			</div>
		);
	}
}
