import { createSignal, For, Show } from "solid-js";
import { render } from "solid-js/web";
import { listConfigs, loadConfig, saveConfig } from "@/features/config/configs";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import { dragHandleAttrName } from "@/utils/mapping/names";
import { guiVisible } from "./guiState";
import shadowWrapper from "./shadowWrapper";

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
		saveConfig(configName());
		setProfiles((prev) =>
			prev.map((p) => ({ ...p, active: p.name === profileName })),
		);
		loadConfig(profileName);
	};

	const [configName, setConfigName] = createSignal("");

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
					"background-color": "var(--vape-main)",
					"z-index": "10001",
				}}
				on:pointerdown={handlePointerDown}
			>
				{/* Blur background */}
				<div class="vape-blur-bg" />

				{/* Header */}
				<div
					{...{ [dragHandleAttrName]: "" }}
					class="vape-header"
					style={{
						cursor: dragging() ? "grabbing" : "grab",
						"border-bottom": `1px solid var(--vape-divider)`,
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
							color: "var(--vape-text)",
							"font-size": "13px",
							flex: "1",
							"font-family": "Arial, sans-serif",
						}}
					>
						Profiles
					</span>
					<button
						class="vape-close-btn"
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
								class="vape-btn-row"
								style={{
									padding: "0 12px",
									"background-color": profile.active
										? "var(--vape-accent)"
										: "var(--vape-main)",
								}}
								on:click={() => selectProfile(profile.name)}
								on:pointerenter={(e) => {
									if (!profile.active) {
										e.currentTarget.style.backgroundColor =
											"var(--vape-main-light)";
									}
								}}
								on:pointerleave={(e) => {
									if (!profile.active) {
										e.currentTarget.style.backgroundColor =
											"var(--vape-main)";
									}
								}}
							>
								<span
									style={{
										color: profile.active
											? "rgb(255, 255, 255)"
											: "var(--vape-text)",
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
					class="vape-btn-row"
					style={{
						padding: "0 12px",
						"background-color": "var(--vape-main)",
					}}
					type="submit"
					on:click={() => saveConfig(configName())}
					on:pointerenter={(e) => {
						e.currentTarget.style.backgroundColor =
							"var(--vape-main-light)";
					}}
					on:pointerleave={(e) => {
						e.currentTarget.style.backgroundColor =
							"var(--vape-main)";
					}}
				>
					<span
						style={{
							color: "var(--vape-text)",
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
