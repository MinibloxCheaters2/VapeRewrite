import type { ParentProps } from "solid-js";
import getResourceURL from "@/utils/cachedResourceURL";
import type Mod from "../../features/modules/api/Module";
import { ACCENT_COLOR } from "../colors";

const NO_BIND = "";

export default function Module({ mod }: ParentProps<{ mod: Mod }>) {
	const { name, stateAccessor: toggled, bindAccessor: bind } = mod;

	return (
		<div
			style={{
				display: "flex",
				"align-items": "center",
				gap: "0.5rem",
				padding: "0.5rem 0.75rem",
				"background-color": toggled() ? ACCENT_COLOR : "#120707ff",
			}}
		>
			<button
				style={{
					background: "none",
					border: "none",
					cursor: "pointer",
					display: "flex",
					"align-items": "center",
					flex: "1",
				}}
				type="button"
				on:click={() => {
					mod.toggle();
				}}
			>
				<div style={{ color: "white" }}>{name}</div>
			</button>
			<button
				style={{
					background: "none",
					border: "none",
					cursor: "pointer",
					"margin-left": "auto",
				}}
				type="button"
			>
				{bind() === NO_BIND ? (
					<img
						loading="lazy"
						src={getResourceURL("bind")}
						alt="Click to bind"
					/>
				) : (
					<p>
						{bind().toUpperCase()}
					</p>
				)}
			</button>
		</div>
	);
}
