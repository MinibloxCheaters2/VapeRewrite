import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { render } from "solid-js/web";
import { REAL_CLIENT_NAME } from "@/Client";
import {
	type CategoryInfo,
	categoryInfoSet,
} from "@/features/modules/api/Category";
import getResourceURL from "@/utils/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/names";
import {
	guiVisible,
	isCategoryWindowVisible,
	toggleCategoryWindow,
} from "./guiState";
import { setProfilesPanelVisible } from "./ProfilesPanel";
import { setSettingsPanelVisible } from "./SettingsPanel";
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

	const categories = Object.entries(categoryInfoSet);

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
						padding: "0 11px",
						cursor: dragging() ? "grabbing" : "grab",
						background: COLORS.glass,
					}}
				>
					<img
						src={getResourceURL("guivape")}
						alt={REAL_CLIENT_NAME}
						style={{
							height: "18px",
							filter: "brightness(0) invert(1) drop-shadow(0 0 4px rgba(5, 134, 105, 0.3))",
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
							filter: "drop-shadow(0 0 4px rgba(5, 134, 105, 0.3))",
						}}
					/>
					<div style={{ flex: "1" }} />
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
							opacity: "0.6",
							transition:
								"all 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
							"border-radius": "6px",
						}}
						type="button"
						on:click={() => setSettingsPanelVisible(true)}
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
							src={getResourceURL("guisettings")}
							alt="Settings"
							style={{
								width: "14px",
								height: "14px",
							}}
						/>
					</button>
				</div>

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
					<For each={categories}>
						{([cat, info]) => (
							<CategoryButton category={cat} info={info} />
						)}
					</For>
				</div>

				{/* Bottom bar with profiles */}
				<div
					style={{
						height: "36px",
						"border-top": `1px solid ${COLORS.divider}`,
						display: "flex",
						"align-items": "center",
						"justify-content": "flex-end",
						padding: "0 7px",
						background: COLORS.glass,
					}}
				>
					<button
						style={{
							width: "20px",
							height: "20px",
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
						on:click={() => setProfilesPanelVisible(true)}
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
							src={getResourceURL("overlay-tab")}
							alt="Overlays"
							style={{
								width: "20px",
								height: "20px",
								transform: "rotate(-90deg)",
							}}
						/>
					</button>
				</div>
			</div>
		</Show>
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
				background: hovered() ? COLORS.hover : "transparent",
				border: "none",
				cursor: "pointer",
				display: "flex",
				"align-items": "center",
				padding: "0 13px",
				transition: "all 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
				position: "relative",
			}}
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={() => toggleCategoryWindow(props.category)}
			on:contextmenu={handleContextMenu}
			type="button"
		>
			<img
				src={props.info.iconURL}
				alt={props.category}
				style={{
					filter: expanded()
						? "brightness(0) invert(0.85) drop-shadow(0 0 4px rgba(5, 134, 105, 0.5))"
						: "brightness(0) invert(0.7)",
				}}
			/>
			<span
				style={{
					"margin-left": "12px",
					color: expanded()
						? COLORS.accent
						: hovered()
							? COLORS.text
							: COLORS.textDark,
					"font-size": "13px",
					"font-family": "Arial, sans-serif",
					flex: "1",
					"text-align": "left",
					transition: "color 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
					"letter-spacing": "0.3px",
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
					transition: "transform 0.16s cubic-bezier(0.4, 0, 0.2, 1)",
					opacity: expanded() ? "1" : "0.5",
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
