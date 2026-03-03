import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";
import getResourceURL from "@/utils/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/names";
import { guiVisible } from "./guiState";
import shadowWrapper from "./shadowWrapper";

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
	glass: "rgba(255, 255, 255, 0.02)",
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
					"border-radius": "8px",
					"box-shadow":
						"0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
					"z-index": "10001",
					overflow: "hidden",
					"user-select": "none",
					"backdrop-filter": "blur(20px) saturate(180%)",
					border: "1px solid rgba(255, 255, 255, 0.08)",
				}}
				on:pointerdown={handlePointerDown}
			>
				{/* Gradient background */}
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
						"border-bottom": `1px solid ${COLORS.divider}`,
						background: COLORS.glass,
					}}
				>
					<span
						style={{
							color: COLORS.text,
							"font-size": "13px",
							flex: "1",
							"font-family": "Arial, sans-serif",
							"letter-spacing": "0.3px",
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
							opacity: "0.6",
							transition:
								"all 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
							"border-radius": "4px",
						}}
						type="button"
						on:click={() => setSettingsPanelVisible(false)}
						on:pointerenter={(e) => {
							e.currentTarget.style.opacity = "1";
							e.currentTarget.style.background = COLORS.hover;
						}}
						on:pointerleave={(e) => {
							e.currentTarget.style.opacity = "0.6";
							e.currentTarget.style.background = "none";
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
				></div>
			</div>
		</Show>
	);
}

export function initSettingsPanel() {
	const container = document.createElement("div");
	container.id = "settings-panel-container";
	shadowWrapper.wrapper.appendChild(container);

	render(() => <SettingsPanel />, container);
}
