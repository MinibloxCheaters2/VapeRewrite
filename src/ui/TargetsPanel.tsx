import { createSignal, Show } from "solid-js";
import { render } from "solid-js/web";
import getResourceURL from "@/utils/helpers/cachedResourceURL";
import CategoryListPanel from "./CategoryListPanel";
import { ToggleComponent } from "./components";
import {
	injureMode,
	setInjureMode,
	setShowHealth,
	setTargetNPCsEnabled,
	setTargetPlayersEnabled,
	setTargetsEnabled,
	setTargetsList,
	showHealth,
	targetNPCsEnabled,
	targetPlayersEnabled,
	targetsEnabled,
	targetsList,
} from "./globalSettings";
import {
	guiVisible,
	setTargetsPanelVisible,
	targetsPanelVisible,
} from "./guiState";
import shadowWrapper from "./shadowWrapper";

function TargetSubButton(props: {
	label: string;
	icon: string;
	iconSize?: [number, number];
	enabled: boolean;
	onClick: () => void;
}) {
	const [hovered, setHovered] = createSignal(false);

	return (
		<div
			style={{
				width: "98px",
				height: "31px",
				"background-color": props.enabled
					? "var(--vape-accent)"
					: hovered()
						? "var(--vape-main-light)"
						: "rgba(255,255,255,0.05)",
				"border-radius": "var(--vape-radius)",
				cursor: "pointer",
				position: "relative",
			}}
			on:pointerenter={() => setHovered(true)}
			on:pointerleave={() => setHovered(false)}
			on:click={props.onClick}
		>
			{/* Inner background (lighter when not enabled) */}
			<div
				style={{
					position: "absolute",
					inset: "1px",
					"background-color": props.enabled
						? "var(--vape-accent)"
						: "var(--vape-main)",
					"border-radius": "var(--vape-radius)",
				}}
			/>
			{/* Icon */}
			<img
				src={props.icon}
				alt=""
				style={{
					position: "absolute",
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
					width: `${props.iconSize?.[0] || 15}px`,
					height: `${props.iconSize?.[1] || 16}px`,
					filter: props.enabled
						? "brightness(0) invert(1)"
						: hovered()
							? "brightness(0) invert(0.8)"
							: "brightness(0) invert(0.37)",
					"pointer-events": "none",
				}}
			/>
		</div>
	);
}

function TargetsPanelContent() {
	const addItem = (val: string) => {
		setTargetsList((prev) => [...prev, val]);
		setTargetsEnabled((prev) => [...prev, val]);
	};

	const removeItem = (val: string) => {
		setTargetsList((prev) => prev.filter((n) => n !== val));
		setTargetsEnabled((prev) => prev.filter((n) => n !== val));
	};

	const toggleItem = (val: string) => {
		setTargetsEnabled((prev) =>
			prev.includes(val) ? prev.filter((n) => n !== val) : [...prev, val],
		);
	};

	const isVisible = () => guiVisible() && targetsPanelVisible();

	return (
		<Show when={isVisible()}>
			<CategoryListPanel
				name="Targets"
				iconURL={getResourceURL("friendstab")}
				iconSize={[17, 16]}
				placeholder="Roblox username"
				accentColor="rgb(5, 134, 105)"
				initialPosition={{ x: 260, y: 60 }}
				visible={isVisible()}
				setVisible={setTargetsPanelVisible}
				items={targetsList}
				enabledItems={targetsEnabled}
				addItem={addItem}
				removeItem={removeItem}
				toggleItem={toggleItem}
			>
				{/* Target sub-buttons row (Players / NPCs) */}
				<div
					style={{
						display: "flex",
						gap: "8px",
						padding: "8px 10px",
						"justify-content": "center",
					}}
				>
					<TargetSubButton
						label="Players"
						icon={getResourceURL("targetplayers2")}
						enabled={targetPlayersEnabled()}
						onClick={() =>
							setTargetPlayersEnabled(!targetPlayersEnabled())
						}
					/>
					<TargetSubButton
						label="NPCs"
						icon={getResourceURL("targetnpc2")}
						iconSize={[9, 12]}
						enabled={targetNPCsEnabled()}
						onClick={() =>
							setTargetNPCsEnabled(!targetNPCsEnabled())
						}
					/>
				</div>
				<ToggleComponent
					name="Target players"
					enabled={targetPlayersEnabled()}
					onChange={setTargetPlayersEnabled}
				/>
				<ToggleComponent
					name="Target NPCs"
					enabled={targetNPCsEnabled()}
					onChange={setTargetNPCsEnabled}
				/>
				<ToggleComponent
					name="Show health"
					enabled={showHealth()}
					onChange={setShowHealth}
				/>
				<ToggleComponent
					name="Injure mode"
					enabled={injureMode()}
					onChange={setInjureMode}
				/>
			</CategoryListPanel>
		</Show>
	);
}

export function initTargetsPanel() {
	const container = document.createElement("div");
	container.id = "targets-panel-container";
	shadowWrapper.wrapper.appendChild(container);
	render(() => <TargetsPanelContent />, container);
}
