import { createSignal, For, Show } from "solid-js";
import {
	type AnySetting,
	getName,
	type ModeLike,
	type SubmoduleItem,
} from "@/features/config/Settings";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import {
	ColorSliderComponent,
	DropdownComponent,
	SliderComponent,
	TextBoxComponent,
	ToggleComponent,
} from "./components";

const COLORS = {
	main: "rgb(26, 25, 26)",
	mainLight: "rgb(30, 29, 30)",
	mainDark: "rgb(24, 23, 24)",
	text: "rgb(200, 200, 200)",
	textDark: "rgb(150, 150, 150)",
	textDarker: "rgb(100, 100, 100)",
	accent: "rgb(5, 134, 105)",
};

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

	const currentSub = () =>
		props.submodules.find((s) => s.name === props.value);

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
					transition: "background-color 0.16s linear",
				}}
				on:pointerenter={() => setHovered(true)}
				on:pointerleave={() => setHovered(false)}
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

				{/* Mode selector (no arrow — users infer it's clickable) */}
				<div style={{ position: "relative", "margin-right": "4px" }}>
					<div
						style={{
							padding: "4px 8px",
							cursor: "pointer",
							"background-color": "rgba(255, 255, 255, 0.08)",
							"border-radius": "4px",
							transition: "background-color 0.16s linear",
						}}
						on:pointerenter={(e) => {
							e.currentTarget.style.backgroundColor =
								"rgba(255, 255, 255, 0.12)";
						}}
						on:pointerleave={(e) => {
							e.currentTarget.style.backgroundColor =
								"rgba(255, 255, 255, 0.08)";
						}}
						on:click={(e) => {
							e.stopPropagation();
							setShowModeList(!showModeList());
						}}
					>
						<span
							style={{
								color: COLORS.textDarker,
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
								"background-color": COLORS.main,
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
												sub.name === props.value
													? COLORS.accent
													: "transparent",
											color:
												sub.name === props.value
													? COLORS.text
													: COLORS.textDark,
											"font-size": "12px",
											"font-family": "Arial, sans-serif",
											transition:
												"background-color 0.16s linear",
										}}
										on:click={(e) => {
											e.stopPropagation();
											props.onChange(sub.name);
											setShowModeList(false);
										}}
										on:pointerenter={(e) => {
											if (sub.name !== props.value) {
												e.currentTarget.style.backgroundColor =
													COLORS.mainLight;
											}
										}}
										on:pointerleave={(e) => {
											if (sub.name !== props.value) {
												e.currentTarget.style.backgroundColor =
													"transparent";
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
							transform: settingsExpanded()
								? "rotate(0deg)"
								: "rotate(180deg)",
							transition: "transform 0.16s linear",
						}}
					/>
				</div>
			</div>

			<Show when={settingsExpanded() && currentSub()?.settings.length}>
				<div style={{ "background-color": "rgb(22, 21, 22)" }}>
					<For each={currentSub()?.settings ?? []}>
						{(setting) => (
							<Show
								when={
									setting.visible ? setting.visible() : true
								}
							>
								{renderSetting(setting, props.onExpandChange)}
							</Show>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
