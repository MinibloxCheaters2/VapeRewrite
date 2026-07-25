import {
	type Accessor,
	createEffect,
	createSignal,
	For,
	type JSX,
	onMount,
	type Setter,
	Show,
} from "solid-js";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/mapping/names";

export interface CategoryListPanelProps {
	/** Panel title displayed in the header */
	name: string;
	/** Resource URL for the header icon */
	iconURL: string;
	/** Icon size [width, height] */
	iconSize?: [number, number];
	/** Placeholder text for the add-item input */
	placeholder?: string;
	/** Accent color used for dots and add button */
	accentColor?: string;
	/** Initial position {x, y} */
	initialPosition?: { x: number; y: number };
	/** Current visibility signal */
	visible: boolean;
	/** Setter to toggle visibility */
	setVisible: Setter<boolean>;
	/** Items currently in the list */
	items: Accessor<string[]>;
	/** Items that are "enabled" (checked) */
	enabledItems: Accessor<string[]>;
	/** Add an item to the list */
	addItem: (val: string) => void;
	/** Remove an item from the list */
	removeItem: (val: string) => void;
	/** Toggle enabled state of an item */
	toggleItem: (val: string) => void;
	/** Settings slot rendered below the list */
	children?: JSX.Element;
}

/**
 * Reusable CategoryListPanel matching Lua's CreateCategoryList.
 * Draggable, expandable, with item list, add input, and a settings gear toggle.
 */
export default function CategoryListPanel(props: CategoryListPanelProps) {
	const accent = () => props.accentColor || "rgb(5, 134, 105)";

	const [position, setPosition] = createSignal(
		props.initialPosition || { x: 240, y: 46 },
	);
	const [dragging, setDragging] = createSignal(false);
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });
	const [expanded, setExpanded] = createSignal(false);
	const [showSettings, setShowSettings] = createSignal(false);
	const [addText, setAddText] = createSignal("");
	const [addHovered, setAddHovered] = createSignal(false);
	const [arrowHovered, setArrowHovered] = createSignal(false);
	const [settingsHovered, setSettingsHovered] = createSignal(false);

	let windowRef: HTMLDivElement | undefined;
	let contentRef: HTMLDivElement | undefined;
	let childrenTwoRef: HTMLDivElement | undefined;
	const [windowHeight, setWindowHeight] = createSignal(45);

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

	onMount(() => {
		document.addEventListener("pointermove", handlePointerMove);
		document.addEventListener("pointerup", handlePointerUp);
	});

	const isVisible = () => props.visible;

	// Update height when content changes
	const updateHeight = () => {
		if (!expanded() || !contentRef) return;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const contentH = contentRef?.scrollHeight || 0;
				const total = 45 + contentH;
				setWindowHeight(Math.min(total, 611));
			});
		});
	};

	createEffect(() => {
		// react to these so height updates
		expanded();
		showSettings();
		props.items();
		props.children;
		updateHeight();
	});

	const handleAdd = () => {
		const val = addText().trim();
		if (val && !props.items().includes(val)) {
			props.addItem(val);
			setAddText("");
		}
	};

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
					height: `${expanded() ? windowHeight() : 45}px`,
					"background-color": "var(--vape-main)",
					"z-index": "10002",
					transition: "height 0.16s linear",
				}}
				on:pointerdown={handlePointerDown}
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
						src={props.iconURL}
						alt=""
						style={{
							width: `${props.iconSize?.[0] || 17}px`,
							height: `${props.iconSize?.[1] || 16}px`,
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
						{props.name}
					</span>

					{/* Settings gear */}
					<button
						class="vape-close-btn"
						style={{
							width: "24px",
							height: "24px",
							"border-radius": "50%",
							background: settingsHovered()
								? "rgba(255,255,255,0.06)"
								: "transparent",
						}}
						type="button"
						on:click={(e) => {
							e.stopPropagation();
							setShowSettings(!showSettings());
							updateHeight();
						}}
						on:pointerenter={() => setSettingsHovered(true)}
						on:pointerleave={() => setSettingsHovered(false)}
					>
						<img
							src={getResourceURL("customsettings")}
							alt=""
							style={{
								width: "14px",
								height: "14px",
								filter:
									settingsHovered() || showSettings()
										? "brightness(0) invert(0.8)"
										: "brightness(0) invert(0.37)",
							}}
						/>
					</button>

					{/* Arrow expand/collapse */}
					<button
						class="vape-close-btn"
						style={{
							width: "40px",
							height: "40px",
						}}
						type="button"
						on:click={() => {
							setExpanded(!expanded());
							updateHeight();
						}}
						on:pointerenter={() => setArrowHovered(true)}
						on:pointerleave={() => setArrowHovered(false)}
					>
						<img
							src={getResourceURL("contract")}
							alt=""
							style={{
								width: "9px",
								height: "4px",
								filter: arrowHovered()
									? "brightness(0) invert(0.87)"
									: "brightness(0) invert(0.47)",
								transform: expanded()
									? "rotate(0deg)"
									: "rotate(180deg)",
								transition: "transform 0.16s linear",
							}}
						/>
					</button>
				</div>

				{/* Children (scrollable item list + add input) */}
				<Show when={expanded()}>
					<div
						ref={contentRef}
						class="clickgui-scrollbar"
						style={{
							"overflow-y": "auto",
							"overflow-x": "hidden",
							"max-height": "560px",
						}}
					>
						{/* Item list */}
						<For each={props.items()}>
							{(item) => {
								const isItemEnabled = () =>
									props.enabledItems().includes(item);
								const [itemHovered, setItemHovered] =
									createSignal(false);
								const [dotHovered, setDotHovered] =
									createSignal(false);

								return (
									<div
										style={{
											width: "200px",
											height: "32px",
											"background-color": itemHovered()
												? "var(--vape-main-light)"
												: "var(--vape-main)",
											"border-radius":
												"var(--vape-radius)",
											position: "relative",
											cursor: "pointer",
											"margin-left": "10px",
											"margin-top": "3px",
										}}
										on:pointerenter={() =>
											setItemHovered(true)
										}
										on:pointerleave={() =>
											setItemHovered(false)
										}
										on:click={() => props.toggleItem(item)}
									>
										{/* Dot */}
										<div
											style={{
												width: "10px",
												height: "11px",
												position: "absolute",
												left: "10px",
												top: "12px",
												"background-color":
													isItemEnabled()
														? accent()
														: itemHovered()
															? "rgba(255,255,255,0.22)"
															: "rgba(255,255,255,0.072)",
												"border-radius": "50%",
											}}
										>
											<div
												style={{
													width: "8px",
													height: "9px",
													position: "absolute",
													left: "1px",
													top: "1px",
													"background-color":
														isItemEnabled()
															? accent()
															: "var(--vape-main)",
													"border-radius": "50%",
												}}
											/>
										</div>

										{/* Title */}
										<span
											style={{
												position: "absolute",
												left: "30px",
												top: "0",
												width: "140px",
												height: "100%",
												"line-height": "32px",
												color: "var(--vape-text)",
												"font-size": "15px",
												"font-family":
													"Arial, sans-serif",
												"text-align": "left",
												"white-space": "nowrap",
												overflow: "hidden",
												"text-overflow": "ellipsis",
												"pointer-events": "none",
											}}
										>
											{item}
										</span>

										{/* Close/remove button */}
										<button
											style={{
												position: "absolute",
												right: "7px",
												top: "8px",
												width: "16px",
												height: "16px",
												"background-color": dotHovered()
													? "rgba(255,255,255,0.4)"
													: "rgba(255,255,255,0.2)",
												"border-radius": "50%",
												border: "none",
												cursor: "pointer",
												display: "flex",
												"align-items": "center",
												"justify-content": "center",
												padding: "0",
											}}
											type="button"
											on:pointerenter={() =>
												setDotHovered(true)
											}
											on:pointerleave={() =>
												setDotHovered(false)
											}
											on:click={(e) => {
												e.stopPropagation();
												props.removeItem(item);
											}}
										>
											<img
												src={getResourceURL(
													"closemini",
												)}
												alt=""
												style={{
													width: "7px",
													height: "7px",
													filter: "brightness(0) invert(0.8)",
													opacity: dotHovered()
														? "0.7"
														: "0.5",
												}}
											/>
										</button>
									</div>
								);
							}}
						</For>

						{/* Add input area */}
						<div
							style={{
								width: "200px",
								height: "31px",
								"background-color": addHovered()
									? "var(--vape-main-light)"
									: "rgba(255,255,255,0.072)",
								"border-radius": "var(--vape-radius)",
								position: "relative",
								"margin-left": "10px",
								"margin-top": "3px",
								"margin-bottom": "6px",
							}}
							on:pointerenter={() => setAddHovered(true)}
							on:pointerleave={() => setAddHovered(false)}
						>
							<input
								type="text"
								value={addText()}
								placeholder={
									props.placeholder || "Add entry..."
								}
								style={{
									width: "165px",
									height: "100%",
									"background-color": addHovered()
										? "rgba(255,255,255,0.14)"
										: "var(--vape-main)",
									color: "white",
									"font-size": "15px",
									"font-family": "Arial, sans-serif",
									border: "none",
									"border-radius": "var(--vape-radius)",
									padding: "0 10px",
									outline: "none",
								}}
								on:input={(e) =>
									setAddText(e.currentTarget.value)
								}
								on:keydown={(e) => {
									if (e.key === "Enter") handleAdd();
								}}
							/>
							<button
								style={{
									position: "absolute",
									right: "8px",
									top: "8px",
									width: "16px",
									height: "16px",
									background: "transparent",
									border: "none",
									cursor: "pointer",
									padding: "0",
								}}
								type="button"
								on:click={handleAdd}
							>
								<img
									src={getResourceURL("add")}
									alt=""
									style={{
										width: "16px",
										height: "16px",
										filter: `brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(95%) contrast(85%)`,
										opacity: addText() ? "0.7" : "0.3",
									}}
								/>
							</button>
						</div>

						{/* Settings children slot */}
						<Show when={showSettings()}>
							<div
								ref={childrenTwoRef}
								style={{
									"background-color": "var(--vape-main-dark)",
								}}
							>
								{props.children}
							</div>
						</Show>
					</div>
				</Show>
			</div>
		</Show>
	);
}
