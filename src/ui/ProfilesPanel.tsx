import { createSignal, For, Show } from "solid-js";
import { render } from "solid-js/web";
import { listConfigs, saveConfig } from "@/features/config/configs";
import getResourceURL from "@/utils/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/names";
import { guiVisible } from "./guiState";
import shadowWrapper from "./shadowWrapper";

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

export const [profilesPanelVisible, setProfilesPanelVisible] =
	createSignal(false);

interface Profile {
	name: string;
	active: boolean;
}

function ProfilesPanel() {
	const [position, setPosition] = createSignal({ x: 240, y: 120 });
	const [dragging, setDragging] = createSignal(false);
	const [dragOffset, setDragOffset] = createSignal({ x: 0, y: 0 });
	const [profiles, setProfiles] = createSignal<Profile[]>([
		{ name: "default", active: true },
		...listConfigs().map((n) => ({ name: n, active: false })),
	]);

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

	const isVisible = () => guiVisible() && profilesPanelVisible();

	const selectProfile = (profileName: string) => {
		setProfiles((prev) =>
			prev.map((p) => ({ ...p, active: p.name === profileName })),
		);
	};

	const [configName, setConfigName] = createSignal("");

	return (
		<Show when={isVisible()}>
			<div
				ref={windowRef}
				style={{
					position: "fixed",
					left: `${position().x}px`,
					top: `${position().y}px`,
					width: "220px",
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
					<img
						src={getResourceURL("profiles")}
						alt=""
						style={{
							width: "16px",
							height: "16px",
							filter: "brightness(0) invert(0.8)",
						}}
					/>
					<span
						style={{
							"margin-left": "8px",
							color: COLORS.text,
							"font-size": "13px",
							flex: "1",
							"font-family": "Arial, sans-serif",
						}}
					>
						Profiles
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
						on:click={() => setProfilesPanelVisible(false)}
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

				{/* Profiles list */}
				<div
					style={{
						"max-height": "400px",
						"overflow-y": "auto",
					}}
					class="clickgui-scrollbar"
				>
					<For each={profiles()}>
						{(profile) => (
							<div
								style={{
									display: "flex",
									"align-items": "center",
									height: "40px",
									padding: "0 12px",
									"background-color": profile.active
										? COLORS.accent
										: COLORS.main,
									cursor: "pointer",
									transition: "background-color 0.16s linear",
								}}
								on:click={() => selectProfile(profile.name)}
								on:pointerenter={(e) => {
									if (!profile.active) {
										e.currentTarget.style.backgroundColor =
											COLORS.mainLight;
									}
								}}
								on:pointerleave={(e) => {
									if (!profile.active) {
										e.currentTarget.style.backgroundColor =
											COLORS.main;
									}
								}}
							>
								<span
									style={{
										color: profile.active
											? "rgb(255, 255, 255)"
											: COLORS.text,
										"font-size": "14px",
										flex: "1",
										"font-family": "Arial, sans-serif",
										"font-weight": profile.active
											? "700"
											: "normal",
									}}
								>
									{profile.name}
								</span>
							</div>
						)}
					</For>
				</div>

				{/* Add profile button */}

				<input
					type="text"
					value={configName()}
					onChange={(e) => setConfigName(e.target.value)}
				/>

				<button
					style={{
						display: "flex",
						"align-items": "center",
						height: "40px",
						padding: "0 12px",
						"background-color": COLORS.main,
						cursor: "pointer",
						transition: "background-color 0.16s linear",
					}}
					type="submit"
					on:click={() => saveConfig(configName())}
					on:pointerenter={(e) => {
						e.currentTarget.style.backgroundColor =
							COLORS.mainLight;
					}}
					on:pointerleave={(e) => {
						e.currentTarget.style.backgroundColor = COLORS.main;
					}}
				>
					<span
						style={{
							color: COLORS.text,
							"font-size": "14px",
							flex: "1",
							"font-family": "Arial, sans-serif",
							"font-weight": "normal",
						}}
					>
						Create
					</span>
				</button>
			</div>
		</Show>
	);
}

export function initProfilesPanel() {
	const container = document.createElement("div");
	container.id = "profiles-panel-container";
	shadowWrapper.wrapper.appendChild(container);

	render(() => <ProfilesPanel />, container);
}
