import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";
import getResourceURL from "@/utils/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/names";
import { guiVisible } from "./guiState";

const COLORS = {
	main: "rgb(26, 25, 26)",
	mainLight: "rgb(30, 29, 30)",
	mainDark: "rgb(24, 23, 24)",
	text: "rgb(200, 200, 200)",
	textDark: "rgb(150, 150, 150)",
	textDarker: "rgb(100, 100, 100)",
	accent: "rgb(5, 134, 105)",
	divider: "rgba(255, 255, 255, 0.072)",
};

export const [settingsPanelVisible, setSettingsPanelVisible] =
	createSignal(false);

function SettingsPanel() {
	const [position, setPosition] = createSignal({ x: 240, y: 60 });
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

	document.addEventListener("pointermove", handlePointerMove);
	document.addEventListener("pointerup", handlePointerUp);

	const isVisible = () => guiVisible() && settingsPanelVisible();

	return (
		<Show when={isVisible()}>
			<div
				ref={windowRef}
				style={{
					position: "fixed",
					left: `${position().x}px`,
					top: `${position().y}px`,
					width: "300px",
					"background-color": COLORS.main,
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
						padding: "0 12px",
						cursor: dragging() ? "grabbing" : "grab",
						"border-bottom": `1px solid ${COLORS.divider}`,
					}}
				>
					<span
						style={{
							color: COLORS.text,
							"font-size": "13px",
							flex: "1",
							"font-family": "Arial, sans-serif",
						}}
					>
						Settings
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
						on:click={() => setSettingsPanelVisible(false)}
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

				{/* Content */}
				<div
					style={{
						padding: "16px",
						"max-height": "500px",
						"overflow-y": "auto",
					}}
					class="clickgui-scrollbar"
				>
					<div
						style={{
							"text-align": "center",
							color: COLORS.textDark,
							"font-size": "12px",
							padding: "20px",
							"font-family": "Arial, sans-serif",
						}}
					>
						Settings panel coming soon...
						<br />
						<br />
						GUI Color, Scale, Rainbow Mode, etc.
					</div>
				</div>
			</div>
		</Show>
	);
}

export function initSettingsPanel() {
	const container = document.createElement("div");
	container.id = "settings-panel-container";
	document.body.appendChild(container);

	render(() => <SettingsPanel />, container);
}
