import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { render } from "solid-js/web";
import { REAL_CLIENT_NAME } from "@/Client";
import ModuleManager from "@/features/modules/api/ModuleManager";
import getResourceURL from "@/utils/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/names";
import { guiVisible } from "./guiState";
import shadowWrapper from "./shadowWrapper";

// Color palette matching ClickGUI
const COLORS = {
	main: "rgb(26, 25, 26)",
	text: "rgb(200, 200, 200)",
};

function hsvToRgb(h: number, s: number, v: number, o = 1): string {
	const i = Math.floor(h * 6);
	const f = h * 6 - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);

	let r: number;
	let g: number;
	let b: number;

	switch (i % 6) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
		case 1:
			r = q;
			g = v;
			b = p;
			break;
		case 2:
			r = p;
			g = v;
			b = t;
			break;
		case 3:
			r = p;
			g = q;
			b = v;
			break;
		case 4:
			r = t;
			g = p;
			b = v;
			break;
		case 5:
			r = v;
			g = p;
			b = q;
			break;
		default:
			r = 0;
			g = 0;
			b = 0;
	}

	return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${o})`;
}

function TextGUIPanel() {
	const textGUIModule = ModuleManager.textGUI;
	const [position, setPosition] = createSignal({ x: 6, y: 6 });
	const [dragging, setDragging] = createSignal(false);
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });
	const [rainbowOffset, setRainbowOffset] = createSignal(0);

	let windowRef: HTMLDivElement | undefined;

	// Rainbow animation - slower speed
	onMount(() => {
		const interval = setInterval(() => {
			setRainbowOffset((prev) => (prev + 0.002) % 1);
		}, 16);

		onCleanup(() => clearInterval(interval));
	});

	const modules = ModuleManager.modules.map((a) => ({
		name: a.name,
		tag: a.tagAccessor,
		enabled: a.stateAccessor,
	}));

	// Get all enabled modules sorted by name length (longest first)
	const sortedModules = () => {
		return modules
			.filter((a) => a.enabled())
			.sort((a, b) => {
				const aLen =
					a.name.length + (a.tag() ? a.tag()?.length + 3 : 0);
				const bLen =
					b.name.length + (b.tag() ? b.tag()?.length + 3 : 0);
				return bLen - aLen;
			});
	};

	// Determine if position is on right side of screen
	const isRightSide = () => position().x > window.innerWidth / 2;

	// Get rainbow color for index
	const getRainbowColor = (index: number) => {
		if (!textGUIModule.rainbow) {
			return hsvToRgb(
				textGUIModule.textColor.h,
				textGUIModule.textColor.s,
				textGUIModule.textColor.v,
				textGUIModule.textColor.o,
			);
		}
		const hue = (rainbowOffset() + index * 0.05) % 1;
		return hsvToRgb(hue, 1, 1, textGUIModule.textColor.o);
	};

	const handlePointerDown = (e: PointerEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest(`[${dragHandleAttrName}]`)) return;

		const rect = windowRef?.getBoundingClientRect();
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

	return (
		<Show when={textGUIModule.stateAccessor()}>
			<div
				ref={windowRef}
				style={{
					position: "fixed",
					left: `${position().x}px`,
					top: `${position().y}px`,
					"z-index": "10000",
					"user-select": "none",
					"pointer-events": "auto",
				}}
				on:pointerdown={handlePointerDown}
			>
				{/* Header - only visible when GUI is open */}
				<Show when={guiVisible()}>
					<div
						style={{
							width: "220px",
							"background-color": COLORS.main,
							"border-radius": "5px",
							"box-shadow":
								"0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
							overflow: "hidden",
							"backdrop-filter": "blur(10px)",
							"margin-bottom": "8px",
							position: "relative",
						}}
					>
						{/* Header */}
						<div
							{...{ [dragHandleAttrName]: "" }}
							style={{
								display: "flex",
								"align-items": "center",
								height: "41px",
								padding: "0 12px",
								cursor: dragging() ? "grabbing" : "grab",
								position: "relative",
							}}
						>
							<span
								style={{
									color: COLORS.text,
									"font-size": "13px",
									"pointer-events": "none",
									"font-family": "Arial, sans-serif",
								}}
							>
								TextGUI
							</span>
						</div>
					</div>
				</Show>

				{/* TextGUI Display */}
				<div
					{...{ [dragHandleAttrName]: "" }}
					style={{
						"font-family": textGUIModule.fontFamily,
						cursor: dragging() ? "grabbing" : "grab",
					}}
				>
					{/* Logo */}
					<div
						style={{
							display: "flex",
							"align-items": "center",
							"justify-content": isRightSide()
								? "flex-end"
								: "flex-start",
							"margin-bottom": "4px",
							gap: "2px",
						}}
					>
						<img
							src={getResourceURL("textvape")}
							alt={REAL_CLIENT_NAME}
							style={{
								height: `${textGUIModule.fontSize + 4}px`,
								filter: textGUIModule.rainbow
									? `drop-shadow(0 0 8px ${getRainbowColor(0)}) drop-shadow(2px 2px 2px ${hsvToRgb(
											textGUIModule.shadowColor.h,
											textGUIModule.shadowColor.s,
											textGUIModule.shadowColor.v,
											textGUIModule.shadowColor.o,
										)})`
									: `drop-shadow(2px 2px 2px ${hsvToRgb(
											textGUIModule.shadowColor.h,
											textGUIModule.shadowColor.s,
											textGUIModule.shadowColor.v,
											textGUIModule.shadowColor.o,
										)})`,
							}}
						/>
						<img
							src={getResourceURL("textv4")}
							alt="V4"
							style={{
								height: `${textGUIModule.fontSize + 2}px`,
								filter: textGUIModule.rainbow
									? `drop-shadow(0 0 8px ${getRainbowColor(1)}) drop-shadow(2px 2px 2px ${hsvToRgb(
											textGUIModule.shadowColor.h,
											textGUIModule.shadowColor.s,
											textGUIModule.shadowColor.v,
											textGUIModule.shadowColor.o,
										)})`
									: `drop-shadow(2px 2px 2px ${hsvToRgb(
											textGUIModule.shadowColor.h,
											textGUIModule.shadowColor.s,
											textGUIModule.shadowColor.v,
											textGUIModule.shadowColor.o,
										)})`,
							}}
						/>
					</div>

					{/* Module list */}
					<div
						style={{
							display: "flex",
							"flex-direction": "column",
							"align-items": isRightSide()
								? "flex-end"
								: "flex-start",
							gap: "1px",
						}}
					>
						<For each={sortedModules()}>
							{(module, index) => (
								<div
									style={{
										color: getRainbowColor(index()),
										"font-size": `${textGUIModule.fontSize}px`,
										"text-shadow": `2px 2px 2px ${hsvToRgb(
											textGUIModule.shadowColor.h,
											textGUIModule.shadowColor.s,
											textGUIModule.shadowColor.v,
											textGUIModule.shadowColor.o,
										)}`,
										"font-weight": "600",
										"letter-spacing": "0.3px",
										padding: "1px 4px",
										"font-family": textGUIModule.fontFamily,
									}}
								>
									{module.name}
									{module.tag() ? ` [${module.tag()}]` : ""}
								</div>
							)}
						</For>
					</div>
				</div>
			</div>
		</Show>
	);
}

export function initTextGUI() {
	const container = document.createElement("div");
	container.id = "textgui-container";
	shadowWrapper.wrapper.appendChild(container);

	render(() => <TextGUIPanel />, container);
}
