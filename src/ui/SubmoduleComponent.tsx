import { createSignal, For, Show } from "solid-js";
import type { AnySetting, SubmoduleItem } from "@/features/config/Settings";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import {
	ColorSliderComponent,
	DropdownComponent,
	SliderComponent,
	TextBoxComponent,
	ToggleComponent,
} from "./components";

function renderSetting(setting: AnySetting, onExpandChange?: () => void) {
	switch (setting.type) {
		case "toggle":
			return (
				<ToggleComponent
					name={setting.name}
					enabled={setting.value()}
					onChange={setting.setValue}
				/>
			);
		case "slider":
			return (
				<SliderComponent
					name={setting.name}
					value={setting.value()}
					min={setting.min}
					max={setting.max}
					step={setting.step}
					onChange={setting.setValue}
					unit={setting.unit}
				/>
			);
		case "dropdown":
			return (
				<DropdownComponent
					name={setting.name}
					value={setting.value()}
					options={setting.options}
					onChange={setting.setValue}
					onExpandChange={onExpandChange}
				/>
			);
		case "textbox":
			return (
				<TextBoxComponent
					name={setting.name}
					value={setting.value()}
					placeholder={setting.placeholder}
					onChange={setting.setValue}
				/>
			);
		case "colorslider":
			return (
				<ColorSliderComponent
					name={setting.name}
					hue={setting.hue()}
					sat={setting.sat()}
					value={setting.value().v}
					opacity={setting.opacity()}
					onChange={setting.setColor}
				/>
			);
		default:
			return null;
	}
}

export function SubmoduleComponent(props: {
	name: string;
	value: string;
	submodules: SubmoduleItem[];
	onChange: (value: string) => void;
	onExpandChange?: () => void;
}) {
	const [settingsExpanded, setSettingsExpanded] = createSignal(false);
	const [showModeList, setShowModeList] = createSignal(false);
	const [hovered, setHovered] = createSignal(false);

	const toggleSettings = () => {
		setSettingsExpanded(!settingsExpanded());
		if (props.onExpandChange) {
			requestAnimationFrame(() => props.onExpandChange?.());
		}
	};

	const currentSub = () => props.submodules.find((s) => s.name === props.value);

	return (
		<div style={{ "background-color": "var(--vape-main-dark)" }}>
			<div
				class="vape-row"
				style={{
					"background-color": hovered() ? "var(--vape-main-light)" : "var(--vape-main-dark)",
				}}
				on:pointerenter={() => setHovered(true)}
				on:pointerleave={() => setHovered(false)}
			>
				<span
					style={{
						color: "var(--vape-text-dark)",
						"font-size": "14px",
						flex: "1",
						"font-family": "Arial, sans-serif",
					}}
				>
					{props.name}
				</span>

				<div style={{ position: "relative", "margin-right": "4px" }}>
					<div
						class="vape-chip"
						on:pointerenter={(e) => {
							e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
						}}
						on:pointerleave={(e) => {
							e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
						}}
						on:click={(e) => {
							e.stopPropagation();
							setShowModeList(!showModeList());
						}}
					>
						<span
							style={{
								color: "var(--vape-text-darker)",
								"font-size": "12px",
								"font-family": "Arial, sans-serif",
							}}
						>
							{props.value}
						</span>
					</div>

					<Show when={showModeList()}>
						<div
							style={{
								position: "absolute",
								top: "100%",
								right: "0",
								"background-color": "var(--vape-main)",
								"border-radius": "4px",
								"z-index": "100",
								overflow: "hidden",
								"box-shadow": "0 4px 12px rgba(0, 0, 0, 0.4)",
							}}
						>
							<For each={props.submodules}>
								{(sub) => (
									<div
										style={{
											padding: "8px 16px",
											cursor: "pointer",
											"white-space": "nowrap",
											"background-color":
												sub.name === props.value ? "var(--vape-accent)" : "transparent",
											color:
												sub.name === props.value ? "var(--vape-text)" : "var(--vape-text-dark)",
											"font-size": "12px",
											"font-family": "Arial, sans-serif",
											transition: "background-color 0.16s linear",
										}}
										on:click={(e) => {
											e.stopPropagation();
											props.onChange(sub.name);
											setShowModeList(false);
										}}
										on:pointerenter={(e) => {
											if (sub.name !== props.value) {
												e.currentTarget.style.backgroundColor = "var(--vape-main-light)";
											}
										}}
										on:pointerleave={(e) => {
											if (sub.name !== props.value) {
												e.currentTarget.style.backgroundColor = "transparent";
											}
										}}
									>
										{sub.name}
									</div>
								)}
							</For>
						</div>
					</Show>
				</div>

				{/* Settings expand arrow */}
				<div
					style={{
						width: "25px",
						height: "40px",
						display: "flex",
						"align-items": "center",
						"justify-content": "center",
						cursor: "pointer",
						opacity: hovered() || settingsExpanded() ? "1" : "0.7",
						transition: "opacity 0.16s linear",
					}}
					on:click={(e) => {
						e.stopPropagation();
						toggleSettings();
					}}
					on:pointerenter={(e) => {
						e.currentTarget.style.opacity = "1";
					}}
					on:pointerleave={(e) => {
						if (!settingsExpanded()) {
							e.currentTarget.style.opacity = "0.7";
						}
					}}
				>
					<img
						src={getResourceURL("contract")}
						alt=""
						style={{
							width: "9px",
							height: "4px",
							filter: "brightness(0.55)",
							transform: settingsExpanded() ? "rotate(0deg)" : "rotate(180deg)",
							transition: "transform 0.16s linear",
						}}
					/>
				</div>
			</div>

			<Show when={settingsExpanded() && currentSub()?.settings.length}>
				<div style={{ "background-color": "rgb(22, 21, 22)" }}>
					<For each={currentSub()?.settings ?? []}>
						{(setting) => (
							<Show when={setting.visible ? setting.visible() : true}>
								{renderSetting(setting, props.onExpandChange)}
							</Show>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
