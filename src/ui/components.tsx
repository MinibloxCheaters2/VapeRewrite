import { createSignal, For, Show } from "solid-js";
import { getName, type ModeLike } from "@/features/config/Settings";
import getResourceURL from "@/utils/helpers/cachedResourceURL";

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
			class="vape-row"
			style={{
				"--row-bg": hovered()
					? "var(--vape-main-light)"
					: "var(--vape-main-dark)",
			}}
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={() => props.onChange(!props.enabled)}
		>
			<span class="vape-label">{props.name}</span>
			<div
				class="vape-toggle-track"
				style={{
					"--toggle-bg": props.enabled
						? "var(--vape-accent)"
						: "rgba(255, 255, 255, 0.08)",
				}}
			>
				<div
					class="vape-toggle-knob"
					style={{
						"--toggle-knob-left": props.enabled ? "16px" : "2px",
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
	unit?: string;
	step?: number;
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
			class="vape-setting-row"
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
		>
			<div class="vape-slider-row">
				<span class="vape-label-sm">{props.name}</span>
				<input
					type="number"
					class="vape-slider-input"
					value={props.value}
					alt={props.tooltip}
					onChange={(e) => props.onChange(e.target.valueAsNumber)}
				/>
				<Show when={props.unit}>
					{(unit) => (
						<span class="vape-label-sm">{unit()}</span>
					)}
				</Show>
			</div>
			<div
				ref={sliderRef}
				class="vape-slider-wrap"
				on:pointerdown={handlePointerDown}
			>
				<div
					class="vape-slider-fill"
					style={{ width: `${Math.max(4, percentage())}%` }}
				>
					<div
						style={{
							position: "absolute",
							right: "-12px",
							top: "50%",
							transform: "translateY(-50%)",
							width: "24px",
							height: "4px",
							"background-color": "var(--vape-main-dark)",
							display: "flex",
							"align-items": "center",
							"justify-content": "center",
						}}
					>
						<div
							class="vape-slider-thumb"
							style={{
								"--thumb-size":
									hovered() || dragging() ? "16px" : "14px",
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
		if (props.onExpandChange) {
			requestAnimationFrame(() => props.onExpandChange?.());
		}
	};

	return (
		<div style={{ "background-color": "var(--vape-main-dark)" }}>
			<div
				class="vape-row"
				style={{
					"--row-bg": hovered()
						? "var(--vape-main-light)"
						: "var(--vape-main-dark)",
				}}
				on:pointerenter={() => setHovered(true)}
				on:pointerleave={() => setHovered(false)}
				on:click={toggleExpanded}
			>
				<span class="vape-label">{props.name}</span>
				<span class="vape-value">{getName(props.value)}</span>
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
				<div class="vape-dropdown-list">
					<For each={props.options}>
						{(option) => (
							<div
								class="vape-dropdown-item"
								style={{
									"--item-bg":
										option === props.value
											? "rgba(255, 255, 255, 0.05)"
											: "transparent",
								}}
								on:click={() => {
									props.onChange(option);
									setExpanded(false);
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
									class="vape-dropdown-text"
									style={{
										"--item-color":
											option === props.value
												? "var(--vape-text)"
												: "var(--vape-text-dark)",
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
		<div class="vape-setting-col">
			<span
				class="vape-label-sm"
				style={{ "margin-bottom": "6px" }}
			>
				{props.name}
			</span>
			<input
				type="text"
				class="vape-text-input"
				value={props.value}
				placeholder={props.placeholder}
				style={{
					"--input-bg": focused()
						? "var(--vape-main-light)"
						: "rgba(255, 255, 255, 0.05)",
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
		<div style={{ "background-color": "var(--vape-main-dark)" }}>
			<div
				class="vape-color-header"
				on:click={() => setExpanded(!expanded())}
			>
				<span class="vape-label-sm">{props.name}</span>
				<div style={{ flex: "1" }} />
				<div
					class="vape-color-swatch"
					style={{
						"--swatch-color": color(),
						"--swatch-opacity": props.opacity,
					}}
				/>
			</div>
			<Show when={expanded()}>
				<div style={{ padding: "12px" }}>
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

					<div style={{ "margin-bottom": "8px" }}>
						<span class="vape-section-label">Hue</span>
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

					<div>
						<span class="vape-section-label">Opacity</span>
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
