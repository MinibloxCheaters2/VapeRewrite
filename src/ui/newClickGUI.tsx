import {
	createEffect,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import Category, { type CategoryInfo } from "@/features/modules/api/Category";
import type Mod from "@/features/modules/api/Module";
import ModuleManager, { P } from "@/features/modules/api/ModuleManager";
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
	categoryWindowPositions,
	guiVisible,
	isCategoryWindowVisible,
	setCategoryWindowPosition,
} from "./guiState";
import { SubmoduleComponent } from "./SubmoduleComponent";

interface CategoryWindowProps {
	category: string;
	info: CategoryInfo;
}

export function CategoryWindow(props: CategoryWindowProps) {
	const [expanded, setExpanded] = createSignal(false);
	const [dragging, setDragging] = createSignal(false);

	const position = () =>
		categoryWindowPositions()[props.category] ?? { x: 6, y: 60 };
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });
	const [windowHeight, setWindowHeight] = createSignal(41);
	const [updateTrigger, setUpdateTrigger] = createSignal(0);

	const modules = ModuleManager.findModules(
		P.byCategory(Category[props.category.toUpperCase()]),
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
			setCategoryWindowPosition(
				props.category,
				e.clientX - dragOffset().x,
				e.clientY - dragOffset().y,
			);
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
				class="vape-panel"
				style={{
					position: "fixed",
					left: `${position().x}px`,
					top: `${position().y}px`,
					width: "220px",
					height: `${windowHeight()}px`,
					"background-color": "var(--vape-main)",
					"z-index": "10002",
					transition: "height 0.16s linear",
				}}
				on:pointerdown={handlePointerDown}
				on:contextmenu={handleContextMenu}
			>
				{/* Header */}
				<div
					{...{ [dragHandleAttrName]: "" }}
					class="vape-header"
					style={{
						cursor: dragging() ? "grabbing" : "grab",
						"border-bottom": expanded()
							? `1px solid var(--vape-divider)`
							: "none",
						position: "relative",
					}}
				>
					<img
						src={props.info.iconURL}
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
							"font-family": "Arial, sans-serif",
						}}
					>
						{props.info.data.name}
					</span>
					<button
						class="vape-close-btn"
						style={{
							width: "40px",
							height: "40px",
						}}
						type="button"
						on:click={() => setExpanded(!expanded())}
						on:pointerenter={(e) => {
							e.currentTarget.style.opacity = "1";
						}}
						on:pointerleave={(e) => {
							e.currentTarget.style.opacity = "0.7";
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
				class="vape-row"
				style={{
					"background-color": toggled()
						? "var(--vape-accent)"
						: hovered() || expanded()
							? "var(--vape-main-light)"
							: "var(--vape-main)",
					"border-bottom": toggled()
						? `1px solid var(--vape-divider-dark)`
						: "none",
					position: "relative",
				}}
				on:pointerenter={() => setHovered(true)}
				on:pointerleave={() => setHovered(false)}
				on:click={() => props.mod.toggle()}
				on:contextmenu={handleContextMenu}
			>
				<span
					style={{
						color: toggled()
							? "rgb(255, 255, 255)"
							: hovered() || expanded()
								? "var(--vape-text)"
								: "var(--vape-text-dark)",
						"font-size": "14px",
						flex: "1",
						"margin-left": "12px",
						transition: "color 0.16s linear",
						"font-family": "Arial, sans-serif",
						"font-weight": toggled() ? "700" : "normal",
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
							"background-color": "rgba(255, 255, 255, 0.08)",
							"border-radius": "4px",
							"font-size": "12px",
							color: "var(--vape-text-darker)",
							"margin-right": "8px",
							cursor: "pointer",
							transition: "background-color 0.16s linear",
							"font-family": "Arial, sans-serif",
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
					class="vape-icon-btn"
					style={{
						opacity: toggled() ? "0.5" : "0.7",
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
						"background-color": "var(--vape-main-dark)",
						"border-top": `1px solid var(--vape-divider)`,
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
		<div style={{ "background-color": "var(--vape-main-dark)" }}>
			<Show
				when={props.mod.settings.length > 0}
				fallback={
					<div style={{ padding: "12px", "text-align": "center" }}>
						<span
							style={{
								color: "var(--vape-text-darker)",
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
										case "submodule":
											return (
												<SubmoduleComponent
													name={setting.name}
													value={setting.value()}
													submodules={
														setting.submodules
													}
													onChange={setting.setValue}
													onExpandChange={
														props.onExpandChange
													}
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
	// Category windows are now rendered within MainGUI.tsx
}
