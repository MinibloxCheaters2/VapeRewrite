import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/mapping/names";
import { guiVisible } from "./guiState";
import shadowWrapper from "./shadowWrapper";

export const [settingsPanelVisible, setSettingsPanelVisible] = createSignal(false);

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
				class="vape-panel"
				style={{
					position: "fixed",
					left: `${position().x}px`,
					top: `${position().y}px`,
					width: "300px",
					"background-color": "var(--vape-main)",
					"border-radius": "5px",
					"box-shadow": "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
					"z-index": "10001",
					overflow: "hidden",
					"user-select": "none",
				}}
				on:pointerdown={handlePointerDown}
			>
				{/* Header */}
				<div
					{...{ [dragHandleAttrName]: "" }}
					class="vape-header"
					style={{
						cursor: dragging() ? "grabbing" : "grab",
						"border-bottom": "1px solid var(--vape-divider)",
					}}
				>
					<span
						style={{
							color: "var(--vape-text)",
							"font-size": "13px",
							flex: "1",
							"font-family": "Arial, sans-serif",
						}}
					>
						Settings
					</span>
					<button
						class="vape-close-btn"
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
