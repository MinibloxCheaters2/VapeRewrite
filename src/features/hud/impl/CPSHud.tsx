import { createSignal } from "solid-js";
import HudElement from "../api/HudElement";

export default class CPSHud extends HudElement {
	public name = "CPS";

	constructor() {
		super();
		this.id = "cps";
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
	private showBothSetting = this.createToggleSetting(
		"Show Both Buttons",
		true,
	);

	private leftCPSSignal = createSignal(0);
	private rightCPSSignal = createSignal(0);
	private leftClicks: number[] = [];
	private rightClicks: number[] = [];

	public onAdd(): void {
		const handleMouseDown = (e: MouseEvent) => {
			const now = Date.now();
			if (e.button === 0) {
				// Left click
				this.leftClicks.push(now);
			} else if (e.button === 2) {
				// Right click
				this.rightClicks.push(now);
			}
		};

		const updateCPS = () => {
			const now = Date.now();
			const oneSecondAgo = now - 1000;

			// Filter clicks from the last second
			this.leftClicks = this.leftClicks.filter((t) => t > oneSecondAgo);
			this.rightClicks = this.rightClicks.filter((t) => t > oneSecondAgo);

			this.leftCPSSignal[1](this.leftClicks.length);
			this.rightCPSSignal[1](this.rightClicks.length);

			(this as any)._cpsUpdateInterval = setTimeout(updateCPS, 50);
		};

		document.addEventListener("mousedown", handleMouseDown);
		(this as any)._mouseDownHandler = handleMouseDown;
		updateCPS();
	}

	public onRemove(): void {
		if ((this as any)._mouseDownHandler) {
			document.removeEventListener(
				"mousedown",
				(this as any)._mouseDownHandler,
			);
		}
		if ((this as any)._cpsUpdateInterval) {
			clearTimeout((this as any)._cpsUpdateInterval);
		}
	}

	public render() {
		const color = this.textColorSetting.value();
		const textColor = `rgba(${Math.round(color.h * 255)}, ${Math.round(color.s * 255)}, ${Math.round(color.v * 255)}, ${color.o})`;

		const showBoth = this.showBothSetting.value();

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
				{showBoth ? (
					<>
						L: {this.leftCPSSignal[0]()} | R:{" "}
						{this.rightCPSSignal[0]()}
					</>
				) : (
					<>CPS: {this.leftCPSSignal[0]()}</>
				)}
			</div>
		);
	}
}
