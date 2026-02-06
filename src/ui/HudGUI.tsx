import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { render } from "solid-js/web";
import type HudElement from "@/features/hud/api/HudElement";
import HudManager from "@/features/hud/api/HudManager";
import { getName } from "@/features/modules/api/Module";
import ModuleManager from "@/features/modules/api/ModuleManager";
import { dragHandleAttrName } from "@/utils/names";
import {
	ColorSliderComponent,
	DropdownComponent,
	SliderComponent,
	ToggleComponent,
} from "./components";
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

// HUD Manager Panel (horizontal bar at bottom)
function HudManagerPanel() {
	const [position, setPosition] = createSignal({
		x: window.innerWidth / 2 - 150,
		y: window.innerHeight - 100,
	});
	const [dragging, setDragging] = createSignal(false);
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });
	const [showAddMenu, setShowAddMenu] = createSignal(false);
	const [showSettings, setShowSettings] = createSignal(false);

	let panelRef: HTMLDivElement | undefined;

	const handlePointerDown = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest(`[${dragHandleAttrName}]`)) return;

		const rect = panelRef?.getBoundingClientRect();
		if (rect) {
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

	const selectedHud = HudManager.selectedHudAccessor;

	const handleAddHud = (hudClass: new () => HudElement) => {
		const hud = new hudClass();
		HudManager.addHudElement(hud);
		setShowAddMenu(false);
	};

	const handleDeleteHud = () => {
		const hud = selectedHud();
		if (hud) {
			HudManager.removeHudElement(hud);
		}
	};

	const handleClose = () => {
		ModuleManager.hudManager.toggle();
	};

	return (
		<Show when={ModuleManager.hudManager.stateAccessor()}>
			{/* Background blur overlay */}
			<div
				style={{
					position: "fixed",
					inset: "0",
					"backdrop-filter": "blur(8px)",
					"background-color": "rgba(0, 0, 0, 0.3)",
					"z-index": "9998",
					"pointer-events": "none",
				}}
			/>

			<div
				ref={panelRef}
				style={{
					position: "fixed",
					left: `${position().x}px`,
					top: `${position().y}px`,
					"background-color": COLORS.main,
					"border-radius": "8px",
					"box-shadow":
						"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
					"z-index": "10002",
					overflow: "visible",
					"user-select": "none",
					"backdrop-filter": "blur(10px)",
					padding: "8px",
					display: "flex",
					gap: "8px",
					"align-items": "center",
				}}
				on:pointerdown={handlePointerDown}
			>
				{/* Drag handle */}
				<div
					{...{ [dragHandleAttrName]: "" }}
					style={{
						width: "20px",
						height: "32px",
						display: "flex",
						"align-items": "center",
						"justify-content": "center",
						cursor: dragging() ? "grabbing" : "grab",
						opacity: "0.5",
					}}
				>
					<div
						style={{
							width: "3px",
							height: "16px",
							"background-color": COLORS.textDark,
							"border-radius": "2px",
						}}
					/>
				</div>

				{/* Add button */}
				<button
					style={{
						width: "32px",
						height: "32px",
						"background-color": COLORS.accent,
						border: "none",
						"border-radius": "6px",
						cursor: "pointer",
						display: "flex",
						"align-items": "center",
						"justify-content": "center",
						color: "white",
						"font-size": "20px",
						"font-weight": "bold",
						transition: "opacity 0.16s linear",
					}}
					type="button"
					on:click={() => setShowAddMenu(!showAddMenu())}
					on:pointerenter={(e) => {
						e.currentTarget.style.opacity = "0.8";
					}}
					on:pointerleave={(e) => {
						e.currentTarget.style.opacity = "1";
					}}
				>
					+
				</button>

				{/* Settings button (only when HUD selected) */}
				<button
					style={{
						width: "32px",
						height: "32px",
						"background-color": COLORS.mainLight,
						border: "none",
						"border-radius": "6px",
						cursor: selectedHud() ? "pointer" : "not-allowed",
						display: "flex",
						"align-items": "center",
						"justify-content": "center",
						transition: "background-color 0.16s linear",
						opacity: selectedHud() ? "1" : "0.3",
					}}
					type="button"
					disabled={!selectedHud()}
					on:click={() =>
						selectedHud() && setShowSettings(!showSettings())
					}
					on:pointerenter={(e) => {
						if (selectedHud()) {
							e.currentTarget.style.backgroundColor =
								COLORS.hover;
						}
					}}
					on:pointerleave={(e) => {
						if (selectedHud()) {
							e.currentTarget.style.backgroundColor =
								COLORS.mainLight;
						}
					}}
				>
					<span
						style={{
							color: COLORS.text,
							"font-size": "16px",
						}}
					>
						⚙
					</span>
				</button>

				{/* Delete button (only when HUD selected) */}
				<button
					style={{
						width: "32px",
						height: "32px",
						"background-color": "rgb(180, 50, 50)",
						border: "none",
						"border-radius": "6px",
						cursor: selectedHud() ? "pointer" : "not-allowed",
						display: "flex",
						"align-items": "center",
						"justify-content": "center",
						color: "white",
						"font-size": "18px",
						transition: "opacity 0.16s linear",
						opacity: selectedHud() ? "1" : "0.3",
					}}
					type="button"
					disabled={!selectedHud()}
					on:click={() => selectedHud() && handleDeleteHud()}
					on:pointerenter={(e) => {
						if (selectedHud()) {
							e.currentTarget.style.opacity = "0.8";
						}
					}}
					on:pointerleave={(e) => {
						if (selectedHud()) {
							e.currentTarget.style.opacity = "1";
						}
					}}
				>
					×
				</button>

				{/* Close button */}
				<button
					style={{
						width: "32px",
						height: "32px",
						"background-color": COLORS.mainLight,
						border: "none",
						"border-radius": "6px",
						cursor: "pointer",
						display: "flex",
						"align-items": "center",
						"justify-content": "center",
						transition: "background-color 0.16s linear",
						"margin-left": "8px",
					}}
					type="button"
					on:click={handleClose}
					on:pointerenter={(e) => {
						e.currentTarget.style.backgroundColor = COLORS.hover;
					}}
					on:pointerleave={(e) => {
						e.currentTarget.style.backgroundColor =
							COLORS.mainLight;
					}}
				>
					<span
						style={{
							color: COLORS.text,
							"font-size": "18px",
							"font-weight": "bold",
						}}
					>
						×
					</span>
				</button>

				{/* Add menu popup */}
				<Show when={showAddMenu()}>
					<div
						style={{
							position: "absolute",
							bottom: "48px",
							left: "40px",
							"background-color": COLORS.mainDark,
							"border-radius": "6px",
							"box-shadow":
								"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
							padding: "4px",
							"min-width": "150px",
							"max-height": "300px",
							"overflow-y": "auto",
						}}
						class="clickgui-scrollbar"
					>
						<For each={HudManager.getHudTypes()}>
							{(hudClass) => {
								const instance = new hudClass();
								return (
									<button
										style={{
											width: "100%",
											height: "32px",
											"background-color": "transparent",
											border: "none",
											cursor: "pointer",
											display: "flex",
											"align-items": "center",
											padding: "0 12px",
											color: COLORS.text,
											"font-size": "13px",
											"font-family": "Arial, sans-serif",
											"border-radius": "4px",
											transition:
												"background-color 0.16s linear",
										}}
										type="button"
										on:click={() => handleAddHud(hudClass)}
										on:pointerenter={(e) => {
											e.currentTarget.style.backgroundColor =
												COLORS.mainLight;
										}}
										on:pointerleave={(e) => {
											e.currentTarget.style.backgroundColor =
												"transparent";
										}}
									>
										{instance.name}
									</button>
								);
							}}
						</For>
					</div>
				</Show>

				{/* Settings popup */}
				<Show when={showSettings() && selectedHud()}>
					<div
						style={{
							position: "absolute",
							bottom: "48px",
							left: "80px",
							"background-color": COLORS.mainDark,
							"border-radius": "6px",
							"box-shadow":
								"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
							padding: "8px 0",
							"min-width": "220px",
							"max-height": "400px",
							"overflow-y": "auto",
						}}
						class="clickgui-scrollbar"
					>
						<div
							style={{
								padding: "0 12px 8px 12px",
								"border-bottom": `1px solid ${COLORS.divider}`,
								"margin-bottom": "4px",
							}}
						>
							<span
								style={{
									color: COLORS.text,
									"font-size": "13px",
									"font-family": "Arial, sans-serif",
									"font-weight": "600",
								}}
							>
								{selectedHud()?.name} Settings
							</span>
						</div>
						<HudSettings hud={selectedHud()!} />
					</div>
				</Show>
			</div>
		</Show>
	);
}

function HudSettings(props: { hud: HudElement }) {
	return (
		<div>
			<Show
				when={props.hud.settings.length > 0}
				fallback={
					<div style={{ padding: "12px", "text-align": "center" }}>
						<span
							style={{
								color: COLORS.textDarker,
								"font-size": "11px",
								"font-family": "Arial, sans-serif",
							}}
						>
							No settings available
						</span>
					</div>
				}
			>
				<For each={props.hud.settings}>
					{(setting) => {
						const isVisible = () => {
							if (setting.visible) {
								return setting.visible();
							}
							return true;
						};

						return (
							<Show when={isVisible()}>
								{(() => {
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
													onChange={setting.setValue}
												/>
											);
										case "dropdown":
											return (
												<DropdownComponent
													name={setting.name}
													value={getName(
														setting.value(),
													)}
													options={setting.options.map(
														getName,
													)}
													onChange={(val) => {
														const option =
															setting.options.find(
																(o) =>
																	getName(
																		o,
																	) === val,
															);
														if (option)
															setting.setValue(
																option,
															);
													}}
													onExpandChange={() => {}}
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
								})()}
							</Show>
						);
					}}
				</For>
			</Show>
		</div>
	);
}

// HUD Element Renderer
function HudElementRenderer(props: { hud: HudElement }) {
	const [dragging, setDragging] = createSignal(false);
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });

	let elementRef: HTMLDivElement | undefined;

	const handlePointerDown = (e: PointerEvent) => {
		if (!ModuleManager.hudManager.enabled) return;

		const rect = elementRef?.getBoundingClientRect();
		if (rect) {
			setDragOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
			setDragging(true);
			HudManager.selectedHud = props.hud;
			e.preventDefault();
			e.stopPropagation();
		}
	};

	const handlePointerMove = (e: PointerEvent) => {
		if (dragging()) {
			props.hud.position = {
				x: e.clientX - dragOffset().x,
				y: e.clientY - dragOffset().y,
			};
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

	const isSelected = () => HudManager.selectedHud === props.hud;
	const hudManagerActive = ModuleManager.hudManager.stateAccessor;

	return (
		<Show when={props.hud.visibleAccessor()}>
			<div
				ref={elementRef}
				style={{
					position: "fixed",
					left: `${props.hud.positionAccessor().x}px`,
					top: `${props.hud.positionAccessor().y}px`,
					"z-index": "9999",
					"user-select": "none",
					cursor: hudManagerActive()
						? dragging()
							? "grabbing"
							: "grab"
						: "default",
					outline:
						isSelected() && hudManagerActive()
							? `2px solid ${COLORS.accent}`
							: "none",
					"outline-offset": "2px",
				}}
				on:pointerdown={handlePointerDown}
			>
				{props.hud.render()}
			</div>
		</Show>
	);
}

// Main HUD container
function HudContainer() {
	const hudElements = HudManager.hudElementsAccessor;

	return (
		<>
			<For each={hudElements()}>
				{(hud) => <HudElementRenderer hud={hud} />}
			</For>
			<HudManagerPanel />
		</>
	);
}

export function initHudGUI() {
	const container = document.createElement("div");
	container.id = "hud-gui-container";
	shadowWrapper.wrapper.appendChild(container);

	render(() => <HudContainer />, container);
}
