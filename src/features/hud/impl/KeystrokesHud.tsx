import { createSignal } from "solid-js";
import HudElement from "../api/HudElement";

export default class KeystrokesHud extends HudElement {
	public name = "Keystrokes";

	constructor() {
		super();
		this.id = "keystrokes";
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
	private bgColorSetting = this.createColorSliderSetting("Background Color", {
		h: 0,
		s: 0,
		v: 0,
		o: 0.5,
	});
	private pressedColorSetting = this.createColorSliderSetting(
		"Pressed Color",
		{
			h: 0.33,
			s: 0.7,
			v: 0.7,
			o: 0.8,
		},
	);
	private showSpaceSetting = this.createToggleSetting("Show Space", true);
	private showMouseSetting = this.createToggleSetting("Show Mouse", true);

	private keysPressed = createSignal<Set<string>>(new Set());

	public onAdd(): void {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			this.keysPressed[1]((prev) => new Set(prev).add(key));
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			this.keysPressed[1]((prev) => {
				const newSet = new Set(prev);
				newSet.delete(key);
				return newSet;
			});
		};

		const handleMouseDown = (e: MouseEvent) => {
			const key = e.button === 0 ? "lmb" : e.button === 2 ? "rmb" : null;
			if (key) {
				this.keysPressed[1]((prev) => new Set(prev).add(key));
			}
		};

		const handleMouseUp = (e: MouseEvent) => {
			const key = e.button === 0 ? "lmb" : e.button === 2 ? "rmb" : null;
			if (key) {
				this.keysPressed[1]((prev) => {
					const newSet = new Set(prev);
					newSet.delete(key);
					return newSet;
				});
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("mouseup", handleMouseUp);

		(this as any)._keyDownHandler = handleKeyDown;
		(this as any)._keyUpHandler = handleKeyUp;
		(this as any)._mouseDownHandler = handleMouseDown;
		(this as any)._mouseUpHandler = handleMouseUp;
	}

	public onRemove(): void {
		if ((this as any)._keyDownHandler) {
			document.removeEventListener(
				"keydown",
				(this as any)._keyDownHandler,
			);
		}
		if ((this as any)._keyUpHandler) {
			document.removeEventListener("keyup", (this as any)._keyUpHandler);
		}
		if ((this as any)._mouseDownHandler) {
			document.removeEventListener(
				"mousedown",
				(this as any)._mouseDownHandler,
			);
		}
		if ((this as any)._mouseUpHandler) {
			document.removeEventListener(
				"mouseup",
				(this as any)._mouseUpHandler,
			);
		}
	}

	private isPressed(key: string): boolean {
		return this.keysPressed[0]().has(key);
	}

	private renderKey(key: string, label: string, width = 40, height = 40) {
		const pressed = this.isPressed(key);
		const textColor = this.textColorSetting.value();
		const bgColor = this.bgColorSetting.value();
		const pressedColor = this.pressedColorSetting.value();

		const bg = pressed ? pressedColor : bgColor;

		return (
			<div
				style={{
					width: `${width}px`,
					height: `${height}px`,
					display: "flex",
					"align-items": "center",
					"justify-content": "center",
					"background-color": `rgba(${Math.round(bg.h * 255)}, ${Math.round(bg.s * 255)}, ${Math.round(bg.v * 255)}, ${bg.o})`,
					border: "1px solid rgba(255, 255, 255, 0.2)",
					"border-radius": "4px",
					"font-family": "Arial, sans-serif",
					"font-size": `${this.fontSizeSetting.value()}px`,
					color: `rgba(${Math.round(textColor.h * 255)}, ${Math.round(textColor.s * 255)}, ${Math.round(textColor.v * 255)}, ${textColor.o})`,
					"font-weight": "600",
					"text-shadow": "1px 1px 2px rgba(0, 0, 0, 0.8)",
					transition: "background-color 0.05s ease",
				}}
			>
				{label}
			</div>
		);
	}

	public render() {
		return (
			<div
				style={{
					display: "flex",
					"flex-direction": "column",
					gap: "4px",
				}}
			>
				{/* WASD Keys */}
				<div
					style={{
						display: "flex",
						"justify-content": "center",
					}}
				>
					{this.renderKey("w", "W")}
				</div>
				<div
					style={{
						display: "flex",
						gap: "4px",
					}}
				>
					{this.renderKey("a", "A")}
					{this.renderKey("s", "S")}
					{this.renderKey("d", "D")}
				</div>

				{/* Space */}
				{this.showSpaceSetting.value() && (
					<div
						style={{
							display: "flex",
							"justify-content": "center",
						}}
					>
						{this.renderKey(" ", "━━━", 128, 40)}
					</div>
				)}

				{/* Mouse Buttons */}
				{this.showMouseSetting.value() && (
					<div
						style={{
							display: "flex",
							gap: "4px",
							"justify-content": "center",
						}}
					>
						{this.renderKey("lmb", "LMB", 62)}
						{this.renderKey("rmb", "RMB", 62)}
					</div>
				)}
			</div>
		);
	}
}
