import { type ParentProps } from "solid-js";
import type Mod from "../../features/module/api/Module";
import { ACCENT_COLOR } from "../colors";
import getResourceURL from "@/utils/cachedResourceURL";

export default function Module({ mod }: ParentProps<{ mod: Mod }>) {
	const { name, stateAccessor: toggled } = mod;
	const bind = undefined; // TODO: bind system

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

				{bind !== undefined ? (
					<p aria-details={`${name} is bound to ${bind}`}>
						{bind}
					</p>
				) : undefined}
			</button>
			{bind === undefined ? (
				<button
					style={{
						background: "none",
						border: "none",
						cursor: "pointer",
						"margin-left": "auto",
					}}
					type="button"
				>
					<img
							loading="lazy"
						src={getResourceURL("bind")}
						alt="Click to bind"
					/>
				</button>
			) : undefined}
		</div>
	);
}
