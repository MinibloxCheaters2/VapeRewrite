import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { render } from "solid-js/web";
import { REAL_CLIENT_NAME } from "@/Client";
import type HudElement from "@/features/hud/api/BaseHudElement";
import HudManager from "@/features/hud/api/HudManager";
import { Category, CategoryInfo } from "@/features/modules/api/Category";
import type Mod from "@/features/modules/api/Module";
import ModuleManager from "@/features/modules/api/ModuleManager";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/mapping/names";
import {
	DropdownComponent,
	SliderComponent,
	ToggleComponent,
} from "./components";
import {
	guiVisible,
	isCategoryWindowVisible,
	toggleCategoryWindow,
} from "./guiState";
import { CategoryWindow } from "./newClickGUI";
import { setProfilesPanelVisible } from "./ProfilesPanel";
import shadowWrapper from "./shadowWrapper";

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
};

function MainGUI() {
	const [position, setPosition] = createSignal({ x: 6, y: 60 });
	const [dragging, setDragging] = createSignal(false);
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });

	let windowRef: HTMLDivElement | undefined;

	const handlePointerDown = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest(`[${dragHandleAttrName}]`)) return;

		const rect = windowRef?.getBoundingClientRect();
		if (rect && e.clientY - rect.top < 40) {
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
			setPosition({
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

	const categoryEntries = Object.keys(Category)
		.filter((k) => Number.isNaN(Number(k)))
		.map((k) => ({
			key: k.toLowerCase(),
			info: CategoryInfo.for(Category[k as keyof typeof Category]),
		}));

	const hudTypes = HudManager.getHudTypes();
	const [overlaysOpen, setOverlaysOpen] = createSignal(false);
	const [overlayHovered, setOverlayHovered] = createSignal(false);

	const [searchVisible, setSearchVisible] = createSignal(false);
	const [searchText, setSearchText] = createSignal("");

	// Settings state
	const [showSettings, setShowSettings] = createSignal(false);
	const [settingsMain, setSettingsMain] = createSignal(true);
	const [activeSettingsCategory, setActiveSettingsCategory] =
		createSignal("");
	const [multiKeybinding, setMultiKeybinding] = createSignal(false);
	const [teamsByServer, setTeamsByServer] = createSignal("Auto");
	const [useTeamColor, setUseTeamColor] = createSignal(false);
	const [blurBackground, setBlurBackground] = createSignal(true);
	const [guiBindIndicator, setGuiBindIndicator] = createSignal(true);
	const [showTooltips, setShowTooltips] = createSignal(true);
	const [showLegitMode, setShowLegitMode] = createSignal(false);
	const [scaleValue, setScaleValue] = createSignal(1);
	const [guiThemeRainbow, setGuiThemeRainbow] = createSignal(false);
	const [rainbowMode, setRainbowMode] = createSignal("Normal");
	const [rainbowSpeed, setRainbowSpeed] = createSignal(1);
	const [rainbowUpdateRate, setRainbowUpdateRate] = createSignal(60);
	const [notifications, setNotifications] = createSignal(true);
	const [toggleAlert, setToggleAlert] = createSignal(false);

	const openSettingsCategory = (name: string) => {
		setActiveSettingsCategory(name);
		setSettingsMain(false);
	};
	const closeSettingsCategory = () => {
		setSettingsMain(true);
		setActiveSettingsCategory("");
	};
	const closeSettings = () => {
		setShowSettings(false);
		setSettingsMain(true);
		setActiveSettingsCategory("");
	};

	const toggleHud = (hudClass: new () => HudElement) => {
		const name = new hudClass().name;
		const element = HudManager.getHudElements().find(
			(h) => h.name === name,
		);
		if (element) {
			HudManager.removeHudElement(element);
		} else {
			HudManager.addHudElement(new hudClass());
		}
	};

	return (
		<Show when={guiVisible()}>
			{/* Background blur overlay */}
			<div
				style={{
					position: "fixed",
					inset: "0",
					"backdrop-filter": "blur(8px)",
					"background-color": "rgba(0, 0, 0, 0.3)",
					"z-index": "9999",
					"pointer-events": "none",
				}}
			/>

			<div
				ref={windowRef}
				style={{
					position: "fixed",
					left: `${position().x}px`,
					top: `${position().y}px`,
					width: "220px",
					"background-color": COLORS.mainDark,
					"border-radius": "5px",
					"box-shadow":
						"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
					"z-index": "10001",
					overflow: "hidden",
					"user-select": "none",
					"backdrop-filter": "blur(10px)",
				}}
				on:pointerdown={handlePointerDown}
			>
				{/* Blur background */}
				<div
					style={{
						position: "absolute",
						inset: "-48px -48px",
						"backdrop-filter": "blur(24px)",
						"background-size": "cover",
						opacity: "0.3",
						"pointer-events": "none",
						"z-index": "-1",
					}}
				/>

				{/* Header */}
				<div
					{...{ [dragHandleAttrName]: "" }}
					style={{
						display: "flex",
						"align-items": "center",
						height: "40px",
						padding: "0 11px",
						cursor: dragging() ? "grabbing" : "grab",
					}}
				>
					<Show
						when={!showSettings()}
						fallback={
							<Show
								when={settingsMain()}
								fallback={
									<>
										<button
											style={{
												background: "none",
												border: "none",
												cursor: "pointer",
												padding: "0",
												display: "flex",
												"align-items": "center",
											}}
											type="button"
											on:click={closeSettingsCategory}
										>
											<img
												src={getResourceURL("guiback")}
												alt="Back"
												style={{
													width: "14px",
													height: "12px",
													filter: "brightness(0) invert(0.7)",
												}}
											/>
										</button>
										<span
											style={{
												color: COLORS.text,
												"font-size": "14px",
												"font-family":
													"Arial, sans-serif",
												"margin-left": "10px",
												flex: "1",
											}}
										>
											{activeSettingsCategory()}
										</span>
										<button
											style={{
												background: "none",
												border: "none",
												cursor: "pointer",
												padding: "0",
												display: "flex",
												"align-items": "center",
											}}
											type="button"
											on:click={closeSettings}
										>
											<img
												src={getResourceURL("close")}
												alt="Close"
												style={{
													width: "10px",
													height: "10px",
												}}
											/>
										</button>
									</>
								}
							>
								<button
									style={{
										background: "none",
										border: "none",
										cursor: "pointer",
										padding: "0",
										display: "flex",
										"align-items": "center",
									}}
									type="button"
									on:click={closeSettings}
								>
									<img
										src={getResourceURL("guiback")}
										alt="Back"
										style={{
											width: "14px",
											height: "12px",
											filter: "brightness(0) invert(0.7)",
										}}
									/>
								</button>
								<span
									style={{
										color: COLORS.text,
										"font-size": "14px",
										"font-family": "Arial, sans-serif",
										"margin-left": "10px",
										flex: "1",
									}}
								>
									Settings
								</span>
								<button
									style={{
										background: "none",
										border: "none",
										cursor: "pointer",
										padding: "0",
										display: "flex",
										"align-items": "center",
									}}
									type="button"
									on:click={closeSettings}
								>
									<img
										src={getResourceURL("close")}
										alt="Close"
										style={{
											width: "10px",
											height: "10px",
										}}
									/>
								</button>
							</Show>
						}
					>
						<img
							src={getResourceURL("guivape")}
							alt={REAL_CLIENT_NAME}
							style={{
								height: "18px",
								filter: "brightness(0) invert(1)",
								"pointer-events": "none",
							}}
						/>
						<img
							src={getResourceURL("guiv4")}
							alt="v4"
							style={{
								height: "16px",
								"margin-left": "2px",
								"pointer-events": "none",
							}}
						/>
					</Show>
				</div>

				{/* Settings button (only in main view) */}
				<Show when={!showSettings()}>
					<button
						style={{
							position: "absolute",
							top: "0",
							right: "0",
							width: "40px",
							height: "40px",
							background: "none",
							border: "none",
							cursor: "pointer",
						}}
						type="button"
						on:click={() => setShowSettings(true)}
					>
						<img
							src={getResourceURL("guisettings")}
							alt="Settings"
							style={{
								position: "absolute",
								left: "15px",
								top: "12px",
								width: "14px",
								height: "14px",
								filter: "brightness(0.435)",
							}}
						/>
					</button>
				</Show>

				<Show when={!showSettings()}>
					{/* Divider */}
					<div
						style={{
							height: "1px",
							"background-color": COLORS.divider,
						}}
					/>

					{/* Categories */}
					<div
						style={{
							padding: "4px 0",
						}}
					>
						<For each={categoryEntries}>
							{(entry) => (
								<CategoryButton
									category={entry.key}
									info={entry.info}
								/>
							)}
						</For>
					</div>

					{/* Misc divider */}
					<div
						style={{
							height: "27px",
							position: "relative",
							padding: "0 13px",
						}}
					>
						<span
							style={{
								color: COLORS.textDarker,
								"font-size": "9px",
								"font-family": "Arial, sans-serif",
								"font-weight": "600",
								"letter-spacing": "0.5px",
								"line-height": "27px",
							}}
						>
							{"\u200A".repeat(10)}MISC
						</span>
						<div
							style={{
								position: "absolute",
								bottom: "0",
								left: "0",
								right: "0",
								height: "1px",
								"background-color": COLORS.divider,
							}}
						/>
					</div>

					{/* Misc items */}
					<div
						style={{
							padding: "4px 0",
						}}
					>
						<MiscItem label="Friends" />
						<MiscItem
							label="Profiles"
							subText="default"
							onClick={() => setProfilesPanelVisible(true)}
						/>
						<MiscItem label="Targets" />
					</div>

					{/* Bottom bar */}
					<div
						style={{
							position: "relative",
							height: "36px",
							"background-color": COLORS.main,
						}}
					>
						<div
							style={{
								position: "absolute",
								top: "0",
								left: "0",
								right: "0",
								height: "1px",
								"background-color": COLORS.divider,
							}}
						/>
						<button
							style={{
								position: "absolute",
								right: "5px",
								top: "7px",
								width: "24px",
								height: "24px",
								background: overlayHovered()
									? "rgba(255,255,255,0.06)"
									: "transparent",
								border: "none",
								"border-radius": "50%",
								cursor: "pointer",
								display: "flex",
								"align-items": "center",
								"justify-content": "center",
								transition: "background-color 0.16s linear",
							}}
							type="button"
							on:click={() => setOverlaysOpen(true)}
							on:pointerenter={() => setOverlayHovered(true)}
							on:pointerleave={() => setOverlayHovered(false)}
						>
							<img
								src={getResourceURL("overlaysicon")}
								alt="Overlays"
								style={{
									width: "16px",
									height: "16px",
								}}
							/>
						</button>
					</div>

					{/* Overlays shadow + popup */}
					<div
						style={{
							position: "absolute",
							inset: "0",
							overflow: "hidden",
							"z-index": "10",
							"pointer-events": overlaysOpen() ? "auto" : "none",
						}}
					>
						<div
							style={{
								position: "absolute",
								inset: "0",
								"background-color": "rgba(0, 0, 0, 0.5)",
								opacity: overlaysOpen() ? 1 : 0,
								transition: "opacity 0.2s linear",
								cursor: "pointer",
							}}
							on:click={() => setOverlaysOpen(false)}
						/>
						<div
							style={{
								position: "absolute",
								bottom: "0",
								left: "0",
								right: "0",
								"background-color": COLORS.main,
								"border-radius": "5px",
								transform: overlaysOpen()
									? "translateY(0)"
									: "translateY(100%)",
								transition: "transform 0.2s linear",
							}}
						>
							<div
								style={{
									display: "flex",
									"align-items": "center",
									height: "38px",
									padding: "0 7px 0 10px",
								}}
							>
								<img
									src={getResourceURL("overlay-tab")}
									alt=""
									style={{
										width: "14px",
										height: "12px",
										filter: "brightness(0) invert(0.78)",
									}}
								/>
								<span
									style={{
										"margin-left": "12px",
										color: COLORS.text,
										"font-size": "15px",
										"font-family": "Arial, sans-serif",
										flex: "1",
									}}
								>
									Overlays
								</span>
								<button
									style={{
										width: "24px",
										height: "24px",
										background: "none",
										border: "none",
										cursor: "pointer",
										display: "flex",
										"align-items": "center",
										"justify-content": "center",
										opacity: "0.7",
										transition: "opacity 0.16s linear",
									}}
									type="button"
									on:click={() => setOverlaysOpen(false)}
									on:pointerenter={(e) => {
										e.currentTarget.style.opacity = "1";
									}}
									on:pointerleave={(e) => {
										e.currentTarget.style.opacity = "0.7";
									}}
								>
									<img
										src={getResourceURL("close")}
										alt="Close"
										style={{
											width: "10px",
											height: "10px",
										}}
									/>
								</button>
							</div>
							<div
								style={{
									height: "1px",
									"background-color": COLORS.divider,
								}}
							/>
							<For each={hudTypes}>
								{(hudClass) => {
									const name = new hudClass().name;
									const [toggleHovered, setToggleHovered] =
										createSignal(false);
									const isOn = () =>
										HudManager.hudElementsAccessor().some(
											(h) => h.name === name,
										);
									return (
										<button
											style={{
												width: "100%",
												height: "40px",
												background: "transparent",
												border: "none",
												cursor: "pointer",
												display: "flex",
												"align-items": "center",
												padding: "0 10px 0 36px",
												transition:
													"background-color 0.16s linear",
											}}
											type="button"
											on:click={() => {
												toggleHud(hudClass);
											}}
											on:pointerenter={() =>
												setToggleHovered(true)
											}
											on:pointerleave={() =>
												setToggleHovered(false)
											}
										>
											<span
												style={{
													color: COLORS.text,
													"font-size": "14px",
													"font-family":
														"Arial, sans-serif",
													flex: "1",
													"text-align": "left",
												}}
											>
												{name}
											</span>
											<div
												style={{
													position: "relative",
													width: "22px",
													height: "12px",
													"background-color": isOn()
														? COLORS.accent
														: toggleHovered()
															? "rgb(111, 110, 111)"
															: "rgb(58, 57, 58)",
													"border-radius": "6px",
													transition:
														"background-color 0.16s linear",
													"flex-shrink": "0",
												}}
											>
												<div
													style={{
														position: "absolute",
														top: "2px",
														left: isOn()
															? "12px"
															: "2px",
														width: "8px",
														height: "8px",
														"background-color":
															COLORS.main,
														"border-radius": "50%",
														transition:
															"left 0.16s linear",
													}}
												/>
											</div>
										</button>
									);
								}}
							</For>
						</div>
					</div>
				</Show>

				{/* Settings view */}
				<Show when={showSettings()}>
					<div
						style={{
							height: "1px",
							"background-color": COLORS.divider,
						}}
					/>
					<div
						style={{
							"max-height": "480px",
							"overflow-y": "auto",
						}}
					>
						<Show
							when={settingsMain()}
							fallback={
								<>
									<Show
										when={
											activeSettingsCategory() ===
											"General"
										}
									>
										<ToggleComponent
											name="Enable Multi-Keybinding"
											enabled={multiKeybinding()}
											onChange={setMultiKeybinding}
										/>
										<ActionButton
											label="Self Destruct"
											onClick={() => {}}
										/>
										<ActionButton
											label="Re-inject"
											disabled
										/>
									</Show>
									<Show
										when={
											activeSettingsCategory() ===
											"Modules"
										}
									>
										<DropdownComponent
											name="Teams by server"
											value={teamsByServer()}
											options={[
												"Auto",
												"Hypixel",
												"Minemen",
											]}
											onChange={(v) =>
												setTeamsByServer(v as string)
											}
										/>
										<ToggleComponent
											name="Use team color"
											enabled={useTeamColor()}
											onChange={setUseTeamColor}
										/>
									</Show>
									<Show
										when={
											activeSettingsCategory() === "GUI"
										}
									>
										<ToggleComponent
											name="Blur background"
											enabled={blurBackground()}
											onChange={setBlurBackground}
										/>
										<ToggleComponent
											name="GUI bind indicator"
											enabled={guiBindIndicator()}
											onChange={setGuiBindIndicator}
										/>
										<ToggleComponent
											name="Show tooltips"
											enabled={showTooltips()}
											onChange={setShowTooltips}
										/>
										<ToggleComponent
											name="Show legit mode"
											enabled={showLegitMode()}
											onChange={setShowLegitMode}
										/>
										<div
											style={{
												display: "flex",
												"align-items": "center",
												height: "40px",
												padding: "0 12px",
												"background-color":
													COLORS.mainDark,
											}}
										>
											<span
												style={{
													color: COLORS.textDarker,
													"font-size": "14px",
													"font-family":
														"Arial, sans-serif",
												}}
											>
												Auto-rescale
											</span>
											<div style={{ flex: "1" }} />
											<span
												style={{
													color: COLORS.textDarker,
													"font-size": "11px",
													"font-family":
														"Arial, sans-serif",
													opacity: "0.5",
												}}
											>
												N/A
											</span>
										</div>
										<SliderComponent
											name="Scale"
											value={scaleValue()}
											min={1}
											max={3}
											step={0.1}
											onChange={setScaleValue}
										/>
										<DropdownComponent
											name="Rainbow Mode"
											value={rainbowMode()}
											options={[
												"Normal",
												"Gradient",
												"Retro",
											]}
											onChange={(v) =>
												setRainbowMode(v as string)
											}
										/>
										<SliderComponent
											name="Rainbow Speed"
											value={rainbowSpeed()}
											min={1}
											max={10}
											step={1}
											onChange={setRainbowSpeed}
										/>
										<SliderComponent
											name="Rainbow update rate"
											value={rainbowUpdateRate()}
											min={30}
											max={120}
											step={1}
											onChange={setRainbowUpdateRate}
										/>
										<ActionButton
											label="Reset GUI positions"
											onClick={() => {}}
										/>
										<ActionButton
											label="Sort GUI"
											onClick={() => {}}
										/>
									</Show>
									<Show
										when={
											activeSettingsCategory() ===
											"Notifications"
										}
									>
										<ToggleComponent
											name="Notifications"
											enabled={notifications()}
											onChange={setNotifications}
										/>
										<ToggleComponent
											name="Toggle alert"
											enabled={toggleAlert()}
											onChange={setToggleAlert}
										/>
									</Show>
								</>
							}
						>
							<SettingsCategoryButton
								title="General"
								onClick={() => openSettingsCategory("General")}
							/>
							<SettingsCategoryButton
								title="Modules"
								onClick={() => openSettingsCategory("Modules")}
							/>
							<SettingsCategoryButton
								title="GUI"
								onClick={() => openSettingsCategory("GUI")}
							/>
							<SettingsCategoryButton
								title="Notifications"
								onClick={() =>
									openSettingsCategory("Notifications")
								}
							/>
							<div
								style={{
									height: "1px",
									"background-color": COLORS.divider,
									margin: "8px 0",
								}}
							/>
							<div
								style={{
									display: "flex",
									"align-items": "center",
									height: "40px",
									padding: "0 12px",
								}}
							>
								<span
									style={{
										color: COLORS.text,
										"font-size": "14px",
										"font-family": "Arial, sans-serif",
										flex: "1",
									}}
								>
									GUI Theme
								</span>
								<button
									style={{
										width: "24px",
										height: "24px",
										"border-radius": "4px",
										border: "1px solid rgba(255,255,255,0.2)",
										"background-color": COLORS.accent,
										cursor: "pointer",
									}}
									type="button"
									title="Accent color"
								/>
							</div>
							<ToggleComponent
								name="Rainbow"
								enabled={guiThemeRainbow()}
								onChange={setGuiThemeRainbow}
							/>
							<div
								style={{
									display: "flex",
									"align-items": "center",
									height: "40px",
									padding: "0 12px",
								}}
							>
								<span
									style={{
										color: COLORS.textDark,
										"font-size": "14px",
										"font-family": "Arial, sans-serif",
										flex: "1",
									}}
								>
									Rebind GUI
								</span>
								<button
									style={{
										width: "20px",
										height: "21px",
										"background-color":
											"rgba(255,255,255,0.08)",
										border: "none",
										"border-radius": "4px",
										cursor: "pointer",
										display: "flex",
										"align-items": "center",
										"justify-content": "center",
									}}
									type="button"
									title="Change keybind"
								>
									<img
										src={getResourceURL("bind")}
										alt="Bind"
										style={{
											width: "12px",
											height: "12px",
											filter: "brightness(0.55)",
										}}
									/>
								</button>
							</div>
						</Show>
					</div>
				</Show>
			</div>

			{/* Category overlay windows */}
			<For each={categoryEntries}>
				{(entry) => (
					<Show when={isCategoryWindowVisible(entry.key)}>
						<CategoryWindow
							category={entry.key}
							info={entry.info}
						/>
					</Show>
				)}
			</For>

			{/* Search panel */}
			<div
				style={{
					position: "fixed",
					top: "13px",
					left: "50%",
					transform: "translateX(-50%)",
					width: "220px",
					"max-height": "437px",
					"background-color": COLORS.mainDark,
					"border-radius": "5px",
					"box-shadow":
						"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
					"z-index": "10002",
					overflow: "hidden",
					"backdrop-filter": "blur(10px)",
				}}
			>
				<div
					style={{
						position: "absolute",
						inset: "-48px -48px",
						"backdrop-filter": "blur(24px)",
						opacity: "0.3",
						"pointer-events": "none",
						"z-index": "-1",
					}}
				/>
				<div
					style={{
						display: "flex",
						"align-items": "center",
						height: "37px",
						padding: "0 8px",
					}}
				>
					<button
						style={{
							width: "29px",
							height: "16px",
							background: "none",
							border: "none",
							cursor: "pointer",
							padding: "0",
						}}
						type="button"
						title="Legit mode"
					>
						<img
							src={getResourceURL("legit")}
							alt="Legit"
							style={{
								width: "29px",
								height: "16px",
							}}
						/>
					</button>
					<div
						style={{
							width: "2px",
							height: "12px",
							"background-color": "rgba(255,255,255,0.14)",
							"margin-left": "6px",
							"flex-shrink": "0",
						}}
					/>
					<input
						type="text"
						value={searchText()}
						on:input={(e) => setSearchText(e.currentTarget.value)}
						placeholder=""
						style={{
							flex: "1",
							"min-width": "0",
							height: "37px",
							"box-sizing": "border-box",
							background: "none",
							border: "none",
							outline: "none",
							color: COLORS.text,
							"font-size": "12px",
							"font-family": "Arial, sans-serif",
							padding: "0 8px",
						}}
					/>
				</div>
				<Show when={searchText() !== ""}>
					<div
						style={{
							height: "1px",
							"background-color": "rgba(255,255,255,0.072)",
						}}
					/>
					<div
						style={{
							"max-height": "398px",
							"overflow-y": "auto",
						}}
					>
						<For
							each={ModuleManager.modules.filter((m) =>
								m.name
									.toLowerCase()
									.includes(searchText().toLowerCase()),
							)}
						>
							{(mod) => <SearchResultItem mod={mod} />}
						</For>
					</div>
				</Show>
			</div>
		</Show>
	);
}

function SearchResultItem(props: { mod: Mod }) {
	const [hovered, setHovered] = createSignal(false);

	return (
		<button
			style={{
				width: "100%",
				height: "32px",
				background: hovered() ? COLORS.mainLight : "transparent",
				border: "none",
				cursor: "pointer",
				display: "flex",
				"align-items": "center",
				padding: "0 11px",
				transition: "background-color 0.16s linear",
			}}
			type="button"
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={() => props.mod.toggle()}
			on:contextmenu={(e: PointerEvent) => {
				e.preventDefault();
				toggleCategoryWindow(
					Category[props.mod.category]?.toLowerCase(),
				);
			}}
		>
			<span
				style={{
					color: props.mod.stateAccessor()
						? COLORS.text
						: COLORS.textDark,
					"font-size": "13px",
					"font-family": "Arial, sans-serif",
					flex: "1",
					"text-align": "left",
					transition: "color 0.16s linear",
				}}
			>
				{props.mod.name}
			</span>
			<Show when={props.mod.tagAccessor()}>
				<span
					style={{
						color: COLORS.textDarker,
						"font-size": "11px",
						"margin-right": "8px",
					}}
				>
					{props.mod.tagAccessor()}
				</span>
			</Show>
			<div
				style={{
					width: "8px",
					height: "8px",
					"border-radius": "50%",
					"background-color": props.mod.stateAccessor()
						? COLORS.accent
						: COLORS.textDarker,
					transition: "background-color 0.16s linear",
					"flex-shrink": "0",
				}}
			/>
		</button>
	);
}

function CategoryButton(props: { category: string; info: CategoryInfo }) {
	const [hovered, setHovered] = createSignal(false);

	const expanded = () => isCategoryWindowVisible(props.category);

	const handleContextMenu = (e: PointerEvent) => {
		e.preventDefault();
		toggleCategoryWindow(props.category);
	};

	return (
		<button
			style={{
				width: "100%",
				height: "40px",
				background: hovered() ? COLORS.mainLight : COLORS.main,
				border: "none",
				cursor: "pointer",
				display: "flex",
				"align-items": "center",
				padding: "0 13px",
				transition: "background-color 0.16s linear",
				position: "relative",
			}}
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={() => toggleCategoryWindow(props.category)}
			on:contextmenu={handleContextMenu}
			type="button"
		>
			<img src={props.info.iconURL} alt={props.category} />
			<span
				style={{
					"margin-left": "12px",
					color: expanded()
						? COLORS.accent
						: hovered()
							? COLORS.text
							: COLORS.textDark,
					"font-size": "14px",
					"font-family": "Arial, sans-serif",
					flex: "1",
					"text-align": "left",
					transition: "color 0.16s linear",
				}}
			>
				{props.info.data.name}
			</span>
			<img
				src={getResourceURL("expand-right")}
				alt=""
				style={{
					width: "4px",
					height: "8px",
					transform: expanded() ? "translateX(6px)" : "translateX(0)",
					transition: "transform 0.16s linear",
				}}
			/>
		</button>
	);
}

function MiscItem(props: {
	label: string;
	subText?: string;
	onClick?: () => void;
}) {
	const [hovered, setHovered] = createSignal(false);

	return (
		<button
			style={{
				width: "100%",
				height: "40px",
				background: hovered() ? COLORS.mainLight : COLORS.main,
				border: "none",
				cursor: "pointer",
				display: "flex",
				"align-items": "center",
				padding: "0 13px",
				transition: "background-color 0.16s linear",
			}}
			type="button"
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={() => props.onClick?.()}
		>
			<span
				style={{
					color: hovered() ? COLORS.text : COLORS.textDark,
					"font-size": "14px",
					"font-family": "Arial, sans-serif",
					"text-align": "left",
					transition: "color 0.16s linear",
				}}
			>
				{props.label}
			</span>
			<div style={{ flex: "1" }} />
			<Show when={props.subText}>
				<span
					style={{
						color: COLORS.textDarker,
						"font-size": "11px",
						"font-family": "Arial, sans-serif",
					}}
				>
					{props.subText}
				</span>
			</Show>
		</button>
	);
}

function ActionButton(props: {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
}) {
	const [hovered, setHovered] = createSignal(false);

	return (
		<div
			style={{
				display: "flex",
				"justify-content": "center",
				padding: "4px 10px",
				opacity: props.disabled ? "0.4" : "1",
				"pointer-events": props.disabled ? "none" : "auto",
			}}
		>
			<button
				style={{
					width: "200px",
					height: "31px",
					background: hovered()
						? "rgba(255,255,255,0.0875)"
						: "rgba(255,255,255,0.05)",
					border: "none",
					"border-radius": "4px",
					cursor: "pointer",
					display: "flex",
					"align-items": "center",
					"justify-content": "center",
					"box-sizing": "border-box",
					padding: "2px 10px",
					transition: "background-color 0.16s linear",
				}}
				type="button"
				on:pointerenter={() => setHovered(true)}
				on:pointerleave={() => setHovered(false)}
				on:click={() => props.onClick?.()}
			>
				<span
					style={{
						color: COLORS.text,
						"font-size": "12px",
						"font-family": "Arial, sans-serif",
						"border-radius": "4px",
						"text-align": "center",
						flex: "1",
						width: "100%",
					}}
				>
					{props.label}
				</span>
			</button>
		</div>
	);
}

function SettingsCategoryButton(props: {
	title: string;
	onClick: () => void;
	subText?: string;
}) {
	const [hovered, setHovered] = createSignal(false);

	return (
		<button
			style={{
				width: "100%",
				height: "40px",
				background: hovered() ? COLORS.mainLight : "transparent",
				border: "none",
				cursor: "pointer",
				display: "flex",
				"align-items": "center",
				padding: "0 12px",
				transition: "background-color 0.16s linear",
			}}
			type="button"
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={props.onClick}
		>
			<span
				style={{
					color: COLORS.text,
					"font-size": "14px",
					"font-family": "Arial, sans-serif",
					flex: "1",
					"text-align": "left",
				}}
			>
				{props.title}
			</span>
			<Show when={props.subText}>
				<span
					style={{
						color: COLORS.textDarker,
						"font-size": "11px",
						"font-family": "Arial, sans-serif",
						"margin-right": "8px",
					}}
				>
					{props.subText}
				</span>
			</Show>
			<img
				src={getResourceURL("expand-right")}
				alt=""
				style={{
					width: "4px",
					height: "8px",
					filter: "brightness(0.55)",
				}}
			/>
		</button>
	);
}

export function initMainGUI() {
	const container = document.createElement("div");
	container.id = "main-gui-container";
	shadowWrapper.wrapper.appendChild(container);

	render(() => <MainGUI />, container);
}
