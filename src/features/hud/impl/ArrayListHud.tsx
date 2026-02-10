import { createSignal, For } from "solid-js";
import { REAL_CLIENT_NAME } from "@/Client";
import ModuleManager from "@/features/modules/api/ModuleManager";
import getResourceURL from "@/utils/cachedResourceURL";
import HudElement from "../api/HudElement";

function hsvToRgb(h: number, s: number, v: number, o = 1): string {
	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	let r: number;
	let g: number;
	let b: number;

	switch (i % 6) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		case 5:
			r = v;
			g = p;
			b = q;
			break;
		default:
			r = 0;
			g = 0;
			b = 0;
	}

	return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${o})`;
}

export default class ArrayListHud extends HudElement {
	public name = "ArrayList";

	constructor() {
		super();
		this.id = "arraylist";
	}

	private fontSizeSetting = this.createSliderSetting(
		"Font Size",
		14,
		8,
		32,
		1,
	);
	private fontFamilySetting = this.createDropdownSetting(
		"Font",
		["Arial", "Verdana", "Courier New", "Georgia", "Times New Roman"],
		"Arial",
	);
	private alignmentSetting = this.createDropdownSetting(
		"Alignment",
		["Auto", "Left", "Right"],
		"Auto",
	);
	private rainbowSetting = this.createToggleSetting("Rainbow", false);
	private textColorSetting = this.createColorSliderSetting("Text Color", {
		h: 0,
		s: 0,
		v: 0.78,
		o: 1,
	});
	private shadowColorSetting = this.createColorSliderSetting("Shadow Color", {
		h: 0,
		s: 0,
		v: 0,
		o: 0.8,
	});
	private showLogoSetting = this.createToggleSetting("Show Logo", true);

	private rainbowOffsetSignal = createSignal(0);
	#rainbowInterval: number;

	public onAdd(): void {
		// Start rainbow animation
		const interval = setInterval(() => {
			this.rainbowOffsetSignal[1](
				(this.rainbowOffsetSignal[0]() + 0.002) % 1,
			);
		}, 16);

		// Store interval for cleanup
		this.#rainbowInterval = interval;
	}

	public onRemove(): void {
		// Clean up interval
		if ((this as any)._rainbowInterval) {
			clearInterval((this as any)._rainbowInterval);
		}
	}

	private getRainbowColor(index: number): string {
		if (!this.rainbowSetting.value()) {
			return hsvToRgb(
				this.textColorSetting.value().h,
				this.textColorSetting.value().s,
				this.textColorSetting.value().v,
				this.textColorSetting.value().o,
			);
		}
		const hue = (this.rainbowOffsetSignal[0]() + index * 0.05) % 1;
		return hsvToRgb(hue, 1, 1, this.textColorSetting.value().o);
	}

	private getShadowColor(): string {
		return hsvToRgb(
			this.shadowColorSetting.value().h,
			this.shadowColorSetting.value().s,
			this.shadowColorSetting.value().v,
			this.shadowColorSetting.value().o,
		);
	}

	public render() {
		const modules = ModuleManager.modules.map((a) => ({
			name: a.name,
			tag: a.tagAccessor,
			enabled: a.stateAccessor,
		}));

		const sortedModules = () => {
			return modules
				.filter((a) => a.enabled())
				.sort((a, b) => {
					const aLen =
						a.name.length + (a.tag() ? a.tag()?.length + 3 : 0);
					const bLen =
						b.name.length + (b.tag() ? b.tag()?.length + 3 : 0);
					return bLen - aLen;
				});
		};

		const isRightSide = () => {
			const alignment = this.alignmentSetting.value();
			if (alignment === "Left") return false;
			if (alignment === "Right") return true;
			// Auto: based on position
			return this.position.x > window.innerWidth / 2;
		};

		return (
			<div
				style={{
					"font-family": this.fontFamilySetting.value(),
				}}
			>
				{/* Logo */}
				{this.showLogoSetting.value() && (
					<div
						style={{
							display: "flex",
							"align-items": "center",
							"justify-content": isRightSide()
								? "flex-end"
								: "flex-start",
							"margin-bottom": "4px",
							gap: "2px",
						}}
					>
						<img
							src={getResourceURL("textvape")}
							alt={REAL_CLIENT_NAME}
							style={{
								height: `${this.fontSizeSetting.value() + 4}px`,
								filter: this.rainbowSetting.value()
									? `drop-shadow(0 0 8px ${this.getRainbowColor(0)}) drop-shadow(2px 2px 2px ${this.getShadowColor()})`
									: `drop-shadow(2px 2px 2px ${this.getShadowColor()})`,
							}}
						/>
						<img
							src={getResourceURL("textv4")}
							alt="V4"
							style={{
								height: `${this.fontSizeSetting.value() + 2}px`,
								filter: this.rainbowSetting.value()
									? `drop-shadow(0 0 8px ${this.getRainbowColor(1)}) drop-shadow(2px 2px 2px ${this.getShadowColor()})`
									: `drop-shadow(2px 2px 2px ${this.getShadowColor()})`,
							}}
						/>
					</div>
				)}

				{/* Module list */}
				<div
					style={{
						display: "flex",
						"flex-direction": "column",
						"align-items": isRightSide()
							? "flex-end"
							: "flex-start",
						gap: "1px",
					}}
				>
					<For each={sortedModules()}>
						{(module, index) => (
							<div
								style={{
									color: this.getRainbowColor(index()),
									"font-size": `${this.fontSizeSetting.value()}px`,
									"text-shadow": `2px 2px 2px ${this.getShadowColor()}`,
									"font-weight": "600",
									"letter-spacing": "0.3px",
									padding: "1px 4px",
									"font-family":
										this.fontFamilySetting.value(),
								}}
							>
								{module.name}
								{module.tag() ? ` [${module.tag()}]` : ""}
							</div>
						)}
					</For>
				</div>
			</div>
		);
	}
}
