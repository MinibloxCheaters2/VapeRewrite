import {
	createEffect,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { render } from "solid-js/web";
import Category, {
	type CategoryInfo,
	categoryInfoSet,
} from "@/features/modules/api/Category";
import type Mod from "@/features/modules/api/Module";
import ModuleManager, { P } from "@/features/modules/api/ModuleManager";
import {
	ColorSliderComponent,
	DropdownComponent,
	SliderComponent,
	TextBoxComponent,
	ToggleComponent,
} from "./components";
import { guiVisible, isCategoryWindowVisible } from "./guiState";

// Futuristic minimal color palette with transparency
const COLORS = {
	main: "rgba(18, 18, 22, 0.75)",
	mainLight: "rgba(28, 28, 35, 0.8)",
	mainDark: "rgba(12, 12, 16, 0.85)",
	text: "rgba(220, 220, 230, 0.95)",
	textDark: "rgba(160, 160, 180, 0.85)",
	textDarker: "rgba(100, 100, 120, 0.7)",
	accent: "rgba(5, 134, 105, 0.9)",
	accentGlow: "rgba(5, 134, 105, 0.3)",
	hover: "rgba(40, 40, 50, 0.6)",
	divider: "rgba(255, 255, 255, 0.05)",
	dividerDark: "rgba(255, 255, 255, 0.08)",
	glass: "rgba(255, 255, 255, 0.02)",
};

import getResourceURL from "@/utils/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/names";
import shadowWrapper from "./shadowWrapper";

interface CategoryWindowProps {
	category: string;
	info: CategoryInfo;
	position: { x: number; y: number };
}

function CategoryWindow(props: CategoryWindowProps) {
	const [expanded, setExpanded] = createSignal(false);
	const [position, setPosition] = createSignal(props.position);
	const [dragging, setDragging] = createSignal(false);
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });
	const [windowHeight, setWindowHeight] = createSignal(41);
	const [updateTrigger, setUpdateTrigger] = createSignal(0);

	const modules = ModuleManager.findModules(
		P.byCategory(Category[props.category]),
	);

	let windowRef: HTMLDivElement | undefined;
	let contentRef: HTMLDivElement | undefined;

	// Update window height when content changes or modules expand/collapse
	createEffect(() => {
		// Trigger recalculation when updateTrigger changes
		updateTrigger();

		if (expanded() && contentRef) {
			// Use requestAnimationFrame for immediate update
			requestAnimationFrame(() => {
				const height = contentRef.scrollHeight;
				setWindowHeight(41 + height);
			});
		} else {
			setWindowHeight(41);
		}
	});

	// Provide update function to child components
	const triggerHeightUpdate = () => {
		setUpdateTrigger((prev) => prev + 1);
	};

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
			setPosition({
				x: e.clientX - dragOffset().x,
				y: e.clientY - dragOffset().y,
			});
		}
	};

	const handlePointerUp = () => {
		setDragging(false);
	};

	const handleContextMenu = (e: PointerEvent) => {
		e.preventDefault();
		setExpanded(!expanded());
	};

	onMount(() => {
		document.addEventListener("pointermove", handlePointerMove);
		document.addEventListener("pointerup", handlePointerUp);

		// Initial height calculation - use double RAF to ensure DOM is fully rendered
		if (contentRef) {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					const height = contentRef.scrollHeight;
					setWindowHeight(41 + height);
				});
			});
		}
	});

	onCleanup(() => {
		document.removeEventListener("pointermove", handlePointerMove);
		document.removeEventListener("pointerup", handlePointerUp);
	});

	// const contentHeight = () => {
	// 	if (!expanded() || !contentRef) return 0;
	// 	return Math.min(contentRef.scrollHeight, 560);
	// };

	const isVisible = () =>
		guiVisible() && isCategoryWindowVisible(props.category);

	return (
		<Show when={isVisible()}>
			<div
				ref={windowRef}
				style={{
					position: "fixed",
					left: `${position().x}px`,
					top: `${position().y}px`,
					width: "220px",
					height: `${windowHeight()}px`,
					"background-color": COLORS.main,
					"border-radius": "8px",
					"box-shadow":
						"0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
					"z-index": "10000",
					overflow: "hidden",
					"user-select": "none",
					transition: "height 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
					"backdrop-filter": "blur(20px) saturate(180%)",
					border: "1px solid rgba(255, 255, 255, 0.08)",
				}}
				on:pointerdown={handlePointerDown}
				on:contextmenu={handleContextMenu}
			>
				{/* Blur background effect */}
				<div
					style={{
						position: "absolute",
						inset: "0",
						background:
							"linear-gradient(135deg, rgba(5, 134, 105, 0.03) 0%, rgba(0, 0, 0, 0) 100%)",
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
						padding: "0 12px",
						cursor: dragging() ? "grabbing" : "grab",
						"border-bottom": expanded()
							? `1px solid ${COLORS.divider}`
							: "none",
						position: "relative",
						background: expanded() ? COLORS.glass : "transparent",
						transition:
							"background 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
					}}
				>
					<img
						src={props.info.iconURL}
						alt=""
						style={{
							width: "16px",
							height: "16px",
							filter: "brightness(0) invert(0.85) drop-shadow(0 0 4px rgba(5, 134, 105, 0.3))",
							"pointer-events": "none",
						}}
					/>
					<span
						style={{
							"margin-left": "8px",
							color: COLORS.text,
							"font-size": "13px",
							flex: "1",
							"pointer-events": "none",
							"font-family": "Arial, sans-serif",
						}}
					>
						{props.info.data.name}
					</span>
					<button
						style={{
							width: "40px",
							height: "40px",
							background: "none",
							border: "none",
							cursor: "pointer",
							display: "flex",
							"align-items": "center",
							"justify-content": "center",
							transition:
								"all 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
							opacity: "0.6",
							"border-radius": "6px",
						}}
						type="button"
						on:click={() => setExpanded(!expanded())}
						on:pointerenter={(e) => {
							e.currentTarget.style.opacity = "1";
							e.currentTarget.style.background = COLORS.glass;
						}}
						on:pointerleave={(e) => {
							e.currentTarget.style.opacity = "0.6";
							e.currentTarget.style.background = "none";
						}}
					>
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
					</button>
				</div>

				{/* Modules */}
				<Show when={expanded()}>
					<div
						ref={contentRef}
						style={{
							"overflow-y": "visible",
							"overflow-x": "hidden",
						}}
					>
						<For each={modules}>
							{(mod) => (
								<ModuleButton
									mod={mod}
									onExpandChange={triggerHeightUpdate}
								/>
							)}
						</For>
					</div>
				</Show>
			</div>
		</Show>
	);
}

function ModuleButton(props: { mod: Mod; onExpandChange: () => void }) {
	const [hovered, setHovered] = createSignal(false);
	const [expanded, setExpanded] = createSignal(false);
	const [listening, setListening] = createSignal(false);
	const { name, stateAccessor: toggled, bindAccessor: bind } = props.mod;

	const handleContextMenu = (e: PointerEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setExpanded(!expanded());
		// Notify parent to update height immediately
		requestAnimationFrame(() => props.onExpandChange());
	};

	const handleKeyboardEvent = (e: KeyboardEvent) => {
		if (!listening()) return;
		setListening(false);
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
		props.mod.bind = e.key.toLowerCase();
		document.removeEventListener("keydown", handleKeyboardEvent);
	};

	return (
		<div>
			<div
				style={{
					display: "flex",
					"align-items": "center",
					height: "40px",
					padding: "0 12px",
					"background-color": toggled()
						? COLORS.accent
						: hovered() || expanded()
							? COLORS.hover
							: "transparent",
					"border-bottom": toggled()
						? `1px solid ${COLORS.dividerDark}`
						: "none",
					cursor: "pointer",
					position: "relative",
					transition: "all 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
					"box-shadow": toggled()
						? `inset 0 0 20px ${COLORS.accentGlow}`
						: "none",
				}}
				on:pointerenter={() => setHovered(true)}
				on:pointerleave={() => setHovered(false)}
				on:click={() => props.mod.toggle()}
				on:contextmenu={handleContextMenu}
			>
				<span
					style={{
						color: toggled()
							? "rgba(255, 255, 255, 0.98)"
							: hovered() || expanded()
								? COLORS.text
								: COLORS.textDark,
						"font-size": "13px",
						flex: "1",
						"margin-left": "12px",
						transition: "color 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
						"font-family": "Arial, sans-serif",
						"font-weight": toggled() ? "600" : "normal",
						"letter-spacing": "0.3px",
					}}
				>
					{name}
				</span>

				{/* Bind button */}
				<Show when={hovered() || bind() !== "" || expanded()}>
					<div
						style={{
							padding: "4px 8px",
							"min-width": "20px",
							height: "21px",
							display: "flex",
							"align-items": "center",
							"justify-content": "center",
							"background-color": "rgba(255, 255, 255, 0.06)",
							"border-radius": "5px",
							"font-size": "11px",
							color: COLORS.textDarker,
							"margin-right": "8px",
							cursor: "pointer",
							transition:
								"all 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
							"font-family": "Arial, sans-serif",
							border: "1px solid rgba(255, 255, 255, 0.08)",
						}}
						on:pointerenter={(e) => {
							e.currentTarget.style.backgroundColor =
								"rgba(5, 134, 105, 0.15)";
							e.currentTarget.style.borderColor =
								"rgba(5, 134, 105, 0.3)";
						}}
						on:pointerleave={(e) => {
							e.currentTarget.style.backgroundColor =
								"rgba(255, 255, 255, 0.06)";
							e.currentTarget.style.borderColor =
								"rgba(255, 255, 255, 0.08)";
						}}
						on:click={(e) => {
							e.stopImmediatePropagation();
							e.stopPropagation();
							setListening(true);
							document.addEventListener(
								"keydown",
								handleKeyboardEvent,
							);
						}}
					>
						{bind() === "" ? (
							<img
								src={getResourceURL("bind")}
								alt=""
								style={{
									width: "12px",
									height: "12px",
									color: "white",
								}}
							/>
						) : (
							bind().toUpperCase()
						)}
					</div>
				</Show>

				{/* Dots button */}
				<button
					style={{
						width: "25px",
						height: "40px",
						background: "none",
						border: "none",
						cursor: "pointer",
						display: "flex",
						"align-items": "center",
						"justify-content": "center",
						opacity: toggled() ? "0.5" : "0.7",
						transition: "opacity 0.16s linear",
					}}
					type="button"
					on:click={(e) => {
						e.stopPropagation();
						setExpanded(!expanded());
						// Notify parent to update height immediately
						requestAnimationFrame(() => props.onExpandChange());
					}}
					on:pointerenter={(e) => {
						if (!toggled()) {
							e.currentTarget.style.opacity = "1";
						}
					}}
					on:pointerleave={(e) => {
						if (!toggled()) {
							e.currentTarget.style.opacity = "0.7";
						}
					}}
				>
					<img
						src={getResourceURL("dots")}
						alt=""
						style={{
							width: "3px",
							height: "16px",
							filter: toggled()
								? "brightness(0.2)"
								: "brightness(0.4)",
						}}
					/>
				</button>
			</div>

			{/* Module options */}
			<Show when={expanded()}>
				<div
					style={{
						"background-color": COLORS.mainDark,
						"border-top": `1px solid ${COLORS.divider}`,
						"backdrop-filter": "blur(10px)",
					}}
				>
					<ModuleSettings
						mod={props.mod}
						onExpandChange={props.onExpandChange}
					/>
				</div>
			</Show>
		</div>
	);
}

function ModuleSettings(props: { mod: Mod; onExpandChange: () => void }) {
	return (
		<div style={{ "background-color": "transparent" }}>
			<Show
				when={props.mod.settings.length > 0}
				fallback={
					<div style={{ padding: "12px", "text-align": "center" }}>
						<span
							style={{
								color: COLORS.textDarker,
								"font-size": "11px",
								"font-family": "Arial, sans-serif",
							}}
						>
							This module has no settings
						</span>
					</div>
				}
			>
				<For each={props.mod.settings}>
					{(setting) => {
						// Check visibility condition
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
													value={setting.value()}
													options={setting.options}
													onChange={setting.setValue}
													onExpandChange={
														props.onExpandChange
													}
												/>
											);
										case "textbox":
											return (
												<TextBoxComponent
													name={setting.name}
													value={setting.value()}
													placeholder={
														setting.placeholder
													}
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
								})()}
							</Show>
						);
					}}
				</For>
			</Show>
		</div>
	);
}

export function initNewClickGUI() {
	const container = document.createElement("div");
	container.id = "new-clickgui-container";
	shadowWrapper.wrapper.appendChild(container);

	const priority = {
		combat: 2,
		blatant: 3,
		render: 4,
		utility: 5,
		world: 6,
		inventory: 7,
		minigames: 8,
	} as const;

	let catIdx = 0;
	for (const [cat, info] of Object.entries(categoryInfoSet).sort(
		([an], [bn]) => {
			return (priority[an] ?? 99) - (priority[bn] ?? 99);
		},
	)) {
		// Position windows horizontally, starting at x=236 (after main GUI at x=6, width=220)
		const left = 236 + catIdx * 226; // 226 = 220 (width) + 6 (gap)
		const top = 60;

		const categoryContainer = document.createElement("div");
		container.appendChild(categoryContainer);

		render(
			() => (
				<CategoryWindow
					category={cat}
					info={info}
					position={{ x: left, y: top }}
				/>
			),
			categoryContainer,
		);

		catIdx++;
	}
}
