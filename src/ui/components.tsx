import { createSignal, For, Show } from "solid-js";
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
		<button
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
			type="button"
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
		</button>
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
	value: string;
	options: string[];
	onChange: (value: string) => void;
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
					{props.value}
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
									{option}
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
	const [expanded, _setExpanded] = createSignal(false);
	const [rainbow, setRainbow] = createSignal(false);

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

	return (
		<div style={{ "background-color": COLORS.mainDark }}>
			<div
				style={{
					display: "flex",
					"align-items": "center",
					height: "50px",
					padding: "0 12px",
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
				<div style={{ flex: "1" }} />
				<button
					style={{
						width: "12px",
						height: "12px",
						"margin-right": "8px",
						background: "none",
						border: "none",
						cursor: "pointer",
						padding: "0",
					}}
					type="button"
					on:click={() => setRainbow(!rainbow())}
				>
					<img
						src={getResourceURL("rainbow_1")}
						alt=""
						style={{
							width: "12px",
							height: "12px",
							filter: rainbow() ? "none" : "brightness(0.4)",
						}}
					/>
				</button>
				<div
					style={{
						width: "12px",
						height: "12px",
						"background-color": color(),
						opacity: props.opacity,
						"border-radius": "2px",
						border: "1px solid rgba(255, 255, 255, 0.1)",
					}}
				/>
			</div>
			<Show when={expanded()}>
				<div style={{ padding: "0 12px 12px" }}>
					{/* Hue, Saturation, Value, Opacity sliders would go here */}
					<div
						style={{
							"text-align": "center",
							color: COLORS.textDarker,
							"font-size": "11px",
							padding: "12px",
						}}
					>
						Color picker coming soon...
					</div>
				</div>
			</Show>
		</div>
	);
}
