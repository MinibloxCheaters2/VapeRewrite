import { createSignal, For, Show } from "solid-js";
import { getName, type ModeLike } from "@/features/config/Settings";
import getResourceURL from "@/utils/cachedResourceURL";

const COLORS = {
	main: "rgb(26, 25, 26)",
	mainLight: "rgb(30, 29, 30)",
	mainDark: "rgb(24, 23, 24)",
	text: "rgb(200, 200, 200)",
	textDark: "rgb(150, 150, 150)",
	textDarker: "rgb(100, 100, 100)",
	accent: "rgb(5, 134, 105)",
	hover: "rgb(30, 29, 30)",
	divider: "rgba(255, 255, 255, 0.072)",
	dividerDark: "rgba(48, 48, 48, 0.52)",
};

// Toggle component
export function ToggleComponent(props: {
	name: string;
	enabled: boolean;
	onChange: (value: boolean) => void;
	tooltip?: string;
}) {
	const [hovered, setHovered] = createSignal(false);

	return (
		<div
			style={{
				display: "flex",
				"align-items": "center",
				height: "40px",
				padding: "0 12px",
				"background-color": hovered()
					? COLORS.mainLight
					: COLORS.mainDark,
				cursor: "pointer",
				transition: "background-color 0.16s linear",
			}}
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={() => props.onChange(!props.enabled)}
		>
			<span
				style={{
					color: COLORS.textDark,
					"font-size": "14px",
					flex: "1",
					"font-family": "Arial, sans-serif",
				}}
			>
				{props.name}
			</span>
			<div
				style={{
					width: "32px",
					height: "18px",
					"background-color": props.enabled
						? COLORS.accent
						: "rgba(255, 255, 255, 0.08)",
					"border-radius": "9px",
					position: "relative",
					transition: "background-color 0.16s linear",
				}}
			>
				<div
					style={{
						width: "14px",
						height: "14px",
						"background-color": COLORS.text,
						"border-radius": "50%",
						position: "absolute",
						top: "2px",
						left: props.enabled ? "16px" : "2px",
						transition: "left 0.16s linear",
					}}
				/>
			</div>
		</div>
	);
}

// Slider component
export function SliderComponent(props: {
	name: string;
	value: number;
	min: number;
	max: number;
	onChange: (value: number) => void;
	tooltip?: string;
}) {
	const [dragging, setDragging] = createSignal(false);
	const [hovered, setHovered] = createSignal(false);

	let sliderRef: HTMLDivElement | undefined;

	const handlePointerDown = (e: PointerEvent) => {
		setDragging(true);
		updateValue(e);
	};

	const handlePointerMove = (e: PointerEvent) => {
		if (dragging()) {
			updateValue(e);
		}
	};

	const handlePointerUp = () => {
		setDragging(false);
	};

	const updateValue = (e: PointerEvent) => {
		if (!sliderRef) return;
		const rect = sliderRef.getBoundingClientRect();
		const percent = Math.max(
			0,
			Math.min(1, (e.clientX - rect.left) / rect.width),
		);
		const newValue = props.min + percent * (props.max - props.min);
		props.onChange(Math.round(newValue * 100) / 100);
	};

	document.addEventListener("pointermove", handlePointerMove);
	document.addEventListener("pointerup", handlePointerUp);

	const percentage = () =>
		((props.value - props.min) / (props.max - props.min)) * 100;

	return (
		<div
			style={{
				height: "50px",
				padding: "0 12px",
				"background-color": COLORS.mainDark,
			}}
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
		>
			<div
				style={{
					display: "flex",
					"justify-content": "space-between",
					"align-items": "center",
					height: "30px",
				}}
			>
				<span
					style={{
						color: COLORS.textDark,
						"font-size": "11px",
						"font-family": "Arial, sans-serif",
					}}
				>
					{props.name}
				</span>
				<span
					style={{
						color: COLORS.textDark,
						"font-size": "11px",
						"font-family": "Arial, sans-serif",
					}}
				>
					{props.value}
				</span>
			</div>
			<div
				ref={sliderRef}
				style={{
					position: "relative",
					height: "2px",
					"background-color": "rgba(255, 255, 255, 0.1)",
					cursor: "pointer",
				}}
				on:pointerdown={handlePointerDown}
			>
				<div
					style={{
						position: "absolute",
						left: "0",
						top: "0",
						width: `${Math.max(4, percentage())}%`,
						height: "100%",
						"background-color": COLORS.accent,
					}}
				>
					<div
						style={{
							position: "absolute",
							right: "-12px",
							top: "50%",
							transform: "translateY(-50%)",
							width: "24px",
							height: "4px",
							"background-color": COLORS.mainDark,
							display: "flex",
							"align-items": "center",
							"justify-content": "center",
						}}
					>
						<div
							style={{
								width:
									hovered() || dragging() ? "16px" : "14px",
								height:
									hovered() || dragging() ? "16px" : "14px",
								"background-color": COLORS.text,
								"border-radius": "50%",
								transition:
									"width 0.16s linear, height 0.16s linear",
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// Dropdown component
export function DropdownComponent(props: {
	name: string;
	value: ModeLike;
	options: ModeLike[];
	onChange: (value: ModeLike) => void;
	tooltip?: string;
	onExpandChange?: () => void;
}) {
	const [expanded, setExpanded] = createSignal(false);
	const [hovered, setHovered] = createSignal(false);

	const toggleExpanded = () => {
		setExpanded(!expanded());
		// Notify parent to update height
		if (props.onExpandChange) {
			requestAnimationFrame(() => props.onExpandChange?.());
		}
	};

	return (
		<div style={{ "background-color": COLORS.mainDark }}>
			<div
				style={{
					display: "flex",
					"align-items": "center",
					height: "40px",
					padding: "0 12px",
					"background-color": hovered()
						? COLORS.mainLight
						: COLORS.mainDark,
					cursor: "pointer",
					transition: "background-color 0.16s linear",
				}}
				on:pointerenter={() => setHovered(true)}
				on:pointerleave={() => setHovered(false)}
				on:click={toggleExpanded}
			>
				<span
					style={{
						color: COLORS.textDark,
						"font-size": "14px",
						flex: "1",
						"font-family": "Arial, sans-serif",
					}}
				>
					{props.name}
				</span>
				<span
					style={{
						color: COLORS.textDarker,
						"font-size": "14px",
						"margin-right": "8px",
						"font-family": "Arial, sans-serif",
					}}
				>
					{getName(props.value)}
				</span>
				<img
					src={getResourceURL("contract")}
					alt=""
					style={{
						width: "9px",
						height: "4px",
						filter: "brightness(0.55)",
						transform: expanded()
							? "rotate(0deg)"
							: "rotate(180deg)",
						transition: "transform 0.16s linear",
					}}
				/>
			</div>
			<Show when={expanded()}>
				<div style={{ "background-color": "rgb(22, 21, 22)" }}>
					<For each={props.options}>
						{(option) => (
							<div
								style={{
									height: "32px",
									padding: "0 24px",
									display: "flex",
									"align-items": "center",
									cursor: "pointer",
									"background-color":
										option === props.value
											? "rgba(255, 255, 255, 0.05)"
											: "transparent",
									transition: "background-color 0.16s linear",
								}}
								on:click={() => {
									props.onChange(option);
									setExpanded(false);
									// Notify parent to update height after closing
									if (props.onExpandChange) {
										requestAnimationFrame(() =>
											props.onExpandChange?.(),
										);
									}
								}}
								on:pointerenter={(e) => {
									if (option !== props.value) {
										e.currentTarget.style.backgroundColor =
											"rgba(255, 255, 255, 0.03)";
									}
								}}
								on:pointerleave={(e) => {
									if (option !== props.value) {
										e.currentTarget.style.backgroundColor =
											"transparent";
									}
								}}
							>
								<span
									style={{
										color:
											option === props.value
												? COLORS.text
												: COLORS.textDark,
										"font-size": "13px",
										"font-family": "Arial, sans-serif",
									}}
								>
									{getName(option)}
								</span>
							</div>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}

// TextBox component
export function TextBoxComponent(props: {
	name: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	tooltip?: string;
}) {
	const [focused, setFocused] = createSignal(false);

	return (
		<div
			style={{
				height: "50px",
				padding: "0 12px",
				"background-color": COLORS.mainDark,
				display: "flex",
				"flex-direction": "column",
				"justify-content": "center",
			}}
		>
			<span
				style={{
					color: COLORS.textDark,
					"font-size": "11px",
					"margin-bottom": "6px",
					"font-family": "Arial, sans-serif",
				}}
			>
				{props.name}
			</span>
			<input
				type="text"
				value={props.value}
				placeholder={props.placeholder}
				style={{
					width: "100%",
					height: "24px",
					padding: "0 8px",
					"background-color": focused()
						? COLORS.mainLight
						: "rgba(255, 255, 255, 0.05)",
					border: "none",
					"border-radius": "4px",
					color: COLORS.text,
					"font-size": "13px",
					"font-family": "Arial, sans-serif",
					outline: "none",
					transition: "background-color 0.16s linear",
				}}
				on:input={(e) => props.onChange(e.currentTarget.value)}
				on:focus={() => setFocused(true)}
				on:blur={() => setFocused(false)}
			/>
		</div>
	);
}

// ColorSlider component
export function ColorSliderComponent(props: {
	name: string;
	hue: number;
	sat: number;
	value: number;
	opacity: number;
	onChange: (h: number, s: number, v: number, o: number) => void;
	tooltip?: string;
}) {
	const [expanded, setExpanded] = createSignal(false);
	const [draggingHue, setDraggingHue] = createSignal(false);
	const [draggingSV, setDraggingSV] = createSignal(false);
	const [draggingOpacity, setDraggingOpacity] = createSignal(false);

	let hueSliderRef: HTMLDivElement | undefined;
	let svPickerRef: HTMLDivElement | undefined;
	let opacitySliderRef: HTMLDivElement | undefined;

	const color = () => {
		const h = props.hue;
		const s = props.sat;
		const v = props.value;
		const c = v * s;
		const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
		const m = v - c;
		let r = 0,
			g = 0,
			b = 0;

		if (h < 1 / 6) {
			r = c;
			g = x;
		} else if (h < 2 / 6) {
			r = x;
			g = c;
		} else if (h < 3 / 6) {
			g = c;
			b = x;
		} else if (h < 4 / 6) {
			g = x;
			b = c;
		} else if (h < 5 / 6) {
			r = x;
			b = c;
		} else {
			r = c;
			b = x;
		}

		return `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`;
	};

	const hueColor = (h: number) => {
		const c = 1;
		const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
		let r = 0,
			g = 0,
			b = 0;

		if (h < 1 / 6) {
			r = c;
			g = x;
		} else if (h < 2 / 6) {
			r = x;
			g = c;
		} else if (h < 3 / 6) {
			g = c;
			b = x;
		} else if (h < 4 / 6) {
			g = x;
			b = c;
		} else if (h < 5 / 6) {
			r = x;
			b = c;
		} else {
			r = c;
			b = x;
		}

		return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
	};

	const updateHue = (e: PointerEvent) => {
		if (!hueSliderRef) return;
		const rect = hueSliderRef.getBoundingClientRect();
		const percent = Math.max(
			0,
			Math.min(1, (e.clientX - rect.left) / rect.width),
		);
		props.onChange(percent, props.sat, props.value, props.opacity);
	};

	const updateSV = (e: PointerEvent) => {
		if (!svPickerRef) return;
		const rect = svPickerRef.getBoundingClientRect();
		const s = Math.max(
			0,
			Math.min(1, (e.clientX - rect.left) / rect.width),
		);
		const v = Math.max(
			0,
			Math.min(1, 1 - (e.clientY - rect.top) / rect.height),
		);
		props.onChange(props.hue, s, v, props.opacity);
	};

	const updateOpacity = (e: PointerEvent) => {
		if (!opacitySliderRef) return;
		const rect = opacitySliderRef.getBoundingClientRect();
		const percent = Math.max(
			0,
			Math.min(1, (e.clientX - rect.left) / rect.width),
		);
		props.onChange(props.hue, props.sat, props.value, percent);
	};

	const handlePointerMove = (e: PointerEvent) => {
		if (draggingHue()) updateHue(e);
		if (draggingSV()) updateSV(e);
		if (draggingOpacity()) updateOpacity(e);
	};

	const handlePointerUp = () => {
		setDraggingHue(false);
		setDraggingSV(false);
		setDraggingOpacity(false);
	};

	document.addEventListener("pointermove", handlePointerMove);
	document.addEventListener("pointerup", handlePointerUp);

	return (
		<div style={{ "background-color": COLORS.mainDark }}>
			<div
				style={{
					display: "flex",
					"align-items": "center",
					height: "50px",
					padding: "0 12px",
					cursor: "pointer",
				}}
				on:click={() => setExpanded(!expanded())}
			>
				<span
					style={{
						color: COLORS.textDark,
						"font-size": "11px",
						"font-family": "Arial, sans-serif",
					}}
				>
					{props.name}
				</span>
				<div style={{ flex: "1" }} />
				<div
					style={{
						width: "24px",
						height: "24px",
						"background-color": color(),
						opacity: props.opacity,
						"border-radius": "4px",
						border: "1px solid rgba(255, 255, 255, 0.2)",
						cursor: "pointer",
					}}
				/>
			</div>
			<Show when={expanded()}>
				<div style={{ padding: "12px" }}>
					{/* Saturation/Value Picker */}
					<div
						ref={svPickerRef}
						style={{
							width: "100%",
							height: "120px",
							position: "relative",
							"border-radius": "4px",
							background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, ${hueColor(props.hue)})`,
							cursor: "crosshair",
							"margin-bottom": "12px",
						}}
						on:pointerdown={(e) => {
							setDraggingSV(true);
							updateSV(e);
						}}
					>
						{/* Picker indicator */}
						<div
							style={{
								position: "absolute",
								left: `${props.sat * 100}%`,
								top: `${(1 - props.value) * 100}%`,
								width: "12px",
								height: "12px",
								border: "2px solid white",
								"border-radius": "50%",
								transform: "translate(-50%, -50%)",
								"box-shadow": "0 0 4px rgba(0, 0, 0, 0.5)",
								"pointer-events": "none",
							}}
						/>
					</div>

					{/* Hue Slider */}
					<div style={{ "margin-bottom": "8px" }}>
						<span
							style={{
								color: COLORS.textDark,
								"font-size": "10px",
								"font-family": "Arial, sans-serif",
								display: "block",
								"margin-bottom": "4px",
							}}
						>
							Hue
						</span>
						<div
							ref={hueSliderRef}
							style={{
								position: "relative",
								height: "12px",
								"border-radius": "6px",
								background:
									"linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
								cursor: "pointer",
							}}
							on:pointerdown={(e) => {
								setDraggingHue(true);
								updateHue(e);
							}}
						>
							<div
								style={{
									position: "absolute",
									left: `${props.hue * 100}%`,
									top: "50%",
									width: "16px",
									height: "16px",
									"background-color": "white",
									border: "2px solid rgba(0, 0, 0, 0.3)",
									"border-radius": "50%",
									transform: "translate(-50%, -50%)",
									"box-shadow": "0 0 4px rgba(0, 0, 0, 0.3)",
									"pointer-events": "none",
								}}
							/>
						</div>
					</div>

					{/* Opacity Slider */}
					<div>
						<span
							style={{
								color: COLORS.textDark,
								"font-size": "10px",
								"font-family": "Arial, sans-serif",
								display: "block",
								"margin-bottom": "4px",
							}}
						>
							Opacity
						</span>
						<div
							ref={opacitySliderRef}
							style={{
								position: "relative",
								height: "12px",
								"border-radius": "6px",
								background: `linear-gradient(to right, transparent, ${color()})`,
								"background-image": `linear-gradient(to right, transparent, ${color()}), repeating-linear-gradient(45deg, #ccc 0, #ccc 2px, #fff 2px, #fff 4px)`,
								cursor: "pointer",
							}}
							on:pointerdown={(e) => {
								setDraggingOpacity(true);
								updateOpacity(e);
							}}
						>
							<div
								style={{
									position: "absolute",
									left: `${props.opacity * 100}%`,
									top: "50%",
									width: "16px",
									height: "16px",
									"background-color": "white",
									border: "2px solid rgba(0, 0, 0, 0.3)",
									"border-radius": "50%",
									transform: "translate(-50%, -50%)",
									"box-shadow": "0 0 4px rgba(0, 0, 0, 0.3)",
									"pointer-events": "none",
								}}
							/>
						</div>
					</div>
				</div>
			</Show>
		</div>
	);
}
