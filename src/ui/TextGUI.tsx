import { For } from "solid-js";
import { render } from "solid-js/web";
import { REAL_CLIENT_NAME } from "@/Client";
import ModuleManager from "@/features/modules/api/ModuleManager";
import getResourceURL from "@/utils/cachedResourceURL";
import shadowWrapper from "./shadowWrapper";

const COLORS = {
	text: "rgb(200, 200, 200)",
	shadow: "rgba(0, 0, 0, 0.8)",
};

function TextGUI() {
	const modules = ModuleManager.modules.map((a) => ({
		name: a.name,
		enabled: a.stateAccessor,
	}));

	return (
		<div
			style={{
				position: "fixed",
				top: "6px",
				right: "6px",
				"z-index": "9999",
				"font-family": "Arial, sans-serif",
				"user-select": "none",
				"pointer-events": "auto",
			}}
		>
			{/* Logo */}
			<div
				style={{
					display: "flex",
					"align-items": "center",
					"justify-content": "flex-end",
					"margin-bottom": "4px",
					gap: "2px",
				}}
			>
				<img
					src={getResourceURL("textvape")}
					alt={REAL_CLIENT_NAME}
					style={{
						height: "18px",
						filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.8))",
					}}
				/>
				<img
					src={getResourceURL("textv4")}
					alt="V4"
					style={{
						height: "16px",
						filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.8))",
					}}
				/>
			</div>

			{/* Module list */}
			<div
				style={{
					display: "flex",
					"flex-direction": "column",
					"align-items": "flex-end",
					gap: "1px",
				}}
			>
				<For each={modules.filter((a) => a.enabled())}>
					{(module) => (
						<div
							style={{
								color: COLORS.text,
								"font-size": "14px",
								"text-shadow": `2px 2px 2px ${COLORS.shadow}`,
								"font-weight": "600",
								"letter-spacing": "0.3px",
								cursor: "pointer",
								transition: "opacity 0.16s linear",
								padding: "1px 4px",
							}}
							on:click={() => {
								const mod = ModuleManager.modules[module.name];
								if (mod) mod.toggle();
							}}
							on:pointerenter={(e) => {
								e.currentTarget.style.opacity = "0.7";
							}}
							on:pointerleave={(e) => {
								e.currentTarget.style.opacity = "1";
							}}
						>
							{module.name}
						</div>
					)}
				</For>
			</div>
		</div>
	);
}

export function initTextGUI() {
	const container = document.createElement("div");
	container.id = "textgui-container";
	shadowWrapper.wrapper.appendChild(container);

	render(() => <TextGUI />, container);
}
