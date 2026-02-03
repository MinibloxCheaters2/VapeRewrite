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

// Color palette matching Lua design
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
				const height = Math.min(contentRef.scrollHeight, 560); // 601 - 41 = 560
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
					"border-radius": "5px",
					"box-shadow":
						"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
					"z-index": "10000",
					overflow: "hidden",
					"user-select": "none",
					transition: "height 0.16s linear",
					"backdrop-filter": "blur(10px)",
				}}
				on:pointerdown={handlePointerDown}
				on:contextmenu={handleContextMenu}
			>
				{/* Blur background effect */}
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
						height: "41px",
						padding: "0 12px",
						cursor: dragging() ? "grabbing" : "grab",
						"border-bottom": expanded()
							? `1px solid ${COLORS.divider}`
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
							transition: "opacity 0.16s linear",
							opacity: "0.7",
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
							"max-height": "560px",
							"overflow-y": "auto",
							"overflow-x": "hidden",
						}}
						class="clickgui-scrollbar"
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
							? COLORS.mainLight
							: COLORS.main,
					"border-bottom": toggled()
						? `1px solid ${COLORS.dividerDark}`
						: "none",
					cursor: "pointer",
					position: "relative",
					transition: "background-color 0.16s linear",
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
								? COLORS.text
								: COLORS.textDark,
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
							color: COLORS.textDarker,
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
		<div style={{ "background-color": COLORS.mainDark }}>
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
										onExpandChange={props.onExpandChange}
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
										value={setting.value()}
										opacity={setting.opacity()}
										onChange={setting.setColor}
									/>
								);
							default:
								return null;
						}
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
