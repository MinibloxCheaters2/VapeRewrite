import {
	createSignal,
	For,
	Match,
	onCleanup,
	onMount,
	Show,
	Switch,
} from "solid-js";
import type { AnySetting } from "@/features/config/Settings";
import type LegitModule from "@/features/modules/api/LegitModule";
import LegitModuleManager from "@/features/modules/api/LegitModuleManager";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/mapping/names";
import {
	ColorSliderComponent,
	DropdownComponent,
	SliderComponent,
	TextBoxComponent,
	ToggleComponent,
} from "./components";
import {
	legitWindowPosition,
	legitWindowVisible,
	setLegitWindowPosition,
	setLegitWindowVisible,
} from "./guiState";

export function LegitWindow() {
	const [dragging, setDragging] = createSignal(false);
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });

	let windowRef: HTMLDivElement | undefined;

	const handlePointerDown = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest(`[${dragHandleAttrName}]`)) return;

		const rect = windowRef?.getBoundingClientRect();
		if (rect && e.clientY - rect.top < 41) {
			setDragOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
			setDragging(true);
			e.preventDefault();
		}
	};

	const handlePointerMove = (e: PointerEvent) => {
		if (dragging()) {
			setLegitWindowPosition({
				x: e.clientX - dragOffset().x,
				y: e.clientY - dragOffset().y,
			});
		}
	};

	const handlePointerUp = () => {
		setDragging(false);
	};

	onMount(() => {
		document.addEventListener("pointermove", handlePointerMove);
		document.addEventListener("pointerup", handlePointerUp);
	});

	onCleanup(() => {
		document.removeEventListener("pointermove", handlePointerMove);
		document.removeEventListener("pointerup", handlePointerUp);
	});

	const isVisible = () => legitWindowVisible();

	return (
		<Show when={isVisible()}>
			<div
				ref={windowRef}
				class="vape-panel"
				style={{
					position: "fixed",
					left: `${legitWindowPosition().x}px`,
					top: `${legitWindowPosition().y}px`,
					width: "700px",
					height: "389px",
					"z-index": "10002",
				}}
				on:pointerdown={handlePointerDown}
			>
				<div
					{...{ [dragHandleAttrName]: "" }}
					class="vape-header"
					style={{
						cursor: dragging() ? "grabbing" : "grab",
						"border-bottom": "1px solid var(--vape-divider)",
						height: "41px",
					}}
				>
					<img
						src={getResourceURL("legittab")}
						alt=""
						style={{
							width: "16px",
							height: "16px",
							filter: "brightness(0) invert(0.8)",
							"pointer-events": "none",
						}}
					/>
					<span
						style={{
							"margin-left": "8px",
							color: "var(--vape-text)",
							"font-size": "13px",
							flex: "1",
							"pointer-events": "none",
							"font-family": "var(--vape-font)",
						}}
					>
						Legit
					</span>
					<button
						class="vape-close-btn"
						style={{
							width: "40px",
							height: "40px",
						}}
						type="button"
						on:click={() => setLegitWindowVisible(false)}
						on:pointerenter={(e) => {
							e.currentTarget.style.opacity = "1";
						}}
						on:pointerleave={(e) => {
							e.currentTarget.style.opacity = "0.7";
						}}
					>
						<img
							src={getResourceURL("close")}
							alt=""
							style={{
								width: "10px",
								height: "10px",
								filter: "brightness(0.55)",
							}}
						/>
					</button>
				</div>

				<div
					style={{
						"overflow-y": "auto",
						"overflow-x": "hidden",
						height: "340px",
						"scrollbar-width": "thin",
						"scrollbar-color": "rgba(255,255,255,0.25) transparent",
					}}
				>
					<Show
						when={LegitModuleManager.modules.length > 0}
						fallback={
							<div
								style={{
									display: "flex",
									"align-items": "center",
									"justify-content": "center",
									height: "100%",
								}}
							>
								<span
									style={{
										color: "var(--vape-text-darker)",
										"font-size": "13px",
										"font-family": "var(--vape-font)",
									}}
								>
									No legit modules registered
								</span>
							</div>
						}
					>
						<div
							style={{
								display: "grid",
								"grid-template-columns": "repeat(4, 163px)",
								"column-gap": "6px",
								"row-gap": "5px",
								"justify-content": "start",
								padding: "14px",
							}}
						>
							<For each={LegitModuleManager.modules}>
								{(mod) => <LegitModuleCard mod={mod} />}
							</For>
						</div>
					</Show>
				</div>
			</div>
		</Show>
	);
}

function LegitModuleCard(props: { mod: LegitModule }) {
	const [hovered, setHovered] = createSignal(false);
	const [settingsOpen, setSettingsOpen] = createSignal(false);
	const [dotsHovered, setDotsHovered] = createSignal(false);
	const [backHovered, setBackHovered] = createSignal(false);

	const modBg = () => {
		if (props.mod.enabled) return "var(--vape-main-light)";
		if (hovered()) return "var(--vape-main-light)";
		return "var(--vape-main-dark)";
	};

	const titleColor = () =>
		props.mod.enabled ? "var(--vape-text)" : "var(--vape-text-darker)";

	const knobBg = () =>
		props.mod.enabled ? "var(--vape-accent)" : "rgba(255,255,255,0.14)";

	const knobInnerLeft = () => (props.mod.enabled ? "12px" : "2px");

	return (
		<div
			style={{
				width: "163px",
				height: "114px",
				"background-color": modBg(),
				"border-radius": "4px",
				cursor: "pointer",
				position: "relative",
				overflow: "hidden",
				transition: "background-color 0.16s linear",
			}}
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={() => props.mod.toggle()}
			on:contextmenu={(e) => {
				e.preventDefault();
				setSettingsOpen(true);
			}}
		>
			<div
				style={{
					position: "absolute",
					top: "81px",
					left: "16px",
					right: "16px",
					height: "20px",
					color: titleColor(),
					"font-size": "13px",
					"font-family": "var(--vape-font)",
					"text-align": "left",
					"white-space": "nowrap",
					overflow: "hidden",
					"text-overflow": "ellipsis",
					"pointer-events": "none",
					transition: "color 0.16s linear",
				}}
			>
				{props.mod.name}
			</div>

			<div
				style={{
					position: "absolute",
					top: "14px",
					right: "57px",
					width: "22px",
					height: "12px",
					"background-color": knobBg(),
					"border-radius": "6px",
					transition: "background-color 0.16s linear",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: "2px",
						left: knobInnerLeft(),
						width: "8px",
						height: "8px",
						"background-color": "var(--vape-main-dark)",
						"border-radius": "50%",
						transition: "left 0.16s linear",
					}}
				/>
			</div>

			<div
				style={{
					position: "absolute",
					top: "8px",
					right: "27px",
					width: "14px",
					height: "24px",
				}}
				on:pointerenter={() => setDotsHovered(true)}
				on:pointerleave={() => setDotsHovered(false)}
				on:click={(e) => {
					e.stopPropagation();
					setSettingsOpen(true);
				}}
			>
				<img
					src={getResourceURL("dots")}
					alt=""
					style={{
						position: "absolute",
						top: "6px",
						left: "6px",
						width: "2px",
						height: "12px",
						"pointer-events": "none",
						filter: dotsHovered()
							? "brightness(0) invert(0.78)"
							: "brightness(0) invert(0.47)",
						transition: "filter 0.16s linear",
					}}
				/>
			</div>

			<Show when={settingsOpen()}>
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						"background-color": "rgba(0,0,0,0.5)",
						"border-radius": "4px",
						"z-index": 1,
					}}
					on:click={() => setSettingsOpen(false)}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							width: "220px",
							height: "100%",
							"background-color": "var(--vape-main)",
							"border-radius": "0 4px 4px 0",
							display: "flex",
							"flex-direction": "column",
						}}
						on:click={(e) => e.stopPropagation()}
					>
						<div
							style={{
								position: "absolute",
								top: "13px",
								left: "11px",
								width: "16px",
								height: "16px",
								cursor: "pointer",
								"z-index": 2,
							}}
							on:pointerenter={() => setBackHovered(true)}
							on:pointerleave={() => setBackHovered(false)}
							on:click={() => setSettingsOpen(false)}
						>
							<img
								src={getResourceURL("guiback")}
								alt=""
								style={{
									width: "16px",
									height: "16px",
									filter: backHovered()
										? "brightness(0) invert(0.78)"
										: "brightness(0) invert(0.47)",
									transition: "filter 0.16s linear",
									"pointer-events": "none",
								}}
							/>
						</div>

						<div
							style={{
								position: "absolute",
								top: "12px",
								left: "36px",
								right: "8px",
								height: "20px",
								color: "var(--vape-text-dark)",
								"font-size": "13px",
								"font-family": "var(--vape-font)",
								"text-align": "left",
								"white-space": "nowrap",
								overflow: "hidden",
								"text-overflow": "ellipsis",
								"pointer-events": "none",
							}}
						>
							{props.mod.name}
						</div>

						<div
							style={{
								position: "absolute",
								top: "41px",
								left: 0,
								right: 0,
								height: "1px",
								"background-color": "var(--vape-divider)",
							}}
						/>

						<div
							style={{
								position: "absolute",
								top: "41px",
								left: 0,
								right: 0,
								bottom: 0,
								"overflow-y": "auto",
								"overflow-x": "hidden",
								"scrollbar-width": "thin",
								"scrollbar-color":
									"rgba(255,255,255,0.25) transparent",
							}}
						>
							<For each={props.mod.settings}>
								{(setting) => (
									<LegitSettingRenderer setting={setting} />
								)}
							</For>
						</div>
					</div>
				</div>
			</Show>
		</div>
	);
}

function LegitSettingRenderer(props: { setting: AnySetting }) {
	return (
		<Switch>
			<Match when={props.setting.type === "toggle"}>
				{(() => {
					const s =
						props.setting as import("@/features/config/Settings").ToggleSetting;
					return (
						<ToggleComponent
							name={s.name}
							enabled={s.value()}
							onChange={(v) => s.setValue(v)}
						/>
					);
				})()}
			</Match>
			<Match when={props.setting.type === "slider"}>
				{(() => {
					const s =
						props.setting as import("@/features/config/Settings").SliderSetting;
					return (
						<SliderComponent
							name={s.name}
							value={s.value()}
							min={s.min}
							max={s.max}
							step={s.step}
							onChange={(v) => s.setValue(v)}
						/>
					);
				})()}
			</Match>
			<Match when={props.setting.type === "dropdown"}>
				{(() => {
					const s =
						props.setting as import("@/features/config/Settings").DropdownSetting;
					return (
						<DropdownComponent
							name={s.name}
							value={s.value()}
							options={s.options}
							onChange={(v) => s.setValue(v)}
						/>
					);
				})()}
			</Match>
			<Match when={props.setting.type === "textbox"}>
				{(() => {
					const s =
						props.setting as import("@/features/config/Settings").TextBoxSetting;
					return (
						<TextBoxComponent
							name={s.name}
							value={s.value()}
							placeholder={s.placeholder}
							onChange={(v) => s.setValue(v)}
						/>
					);
				})()}
			</Match>
			<Match when={props.setting.type === "colorslider"}>
				{(() => {
					const s =
						props.setting as import("@/features/config/Settings").ColorSliderSetting;
					return (
						<ColorSliderComponent
							name={s.name}
							hue={s.hue()}
							sat={s.sat()}
							value={s.value().v}
							opacity={s.opacity()}
							onChange={(h, sv, v, o) => s.setColor(h, sv, v, o)}
						/>
					);
				})()}
			</Match>
		</Switch>
	);
}
