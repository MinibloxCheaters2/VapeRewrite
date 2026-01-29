import { type ParentProps } from "solid-js";
import type Mod from "../../features/module/api/Module";
import { ACCENT_COLOR } from "../colors";

export default function Module({ mod }: ParentProps<{ mod: Mod }>) {
	const { name, stateSignal } = mod;
	const [toggled, setToggled] = stateSignal;
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
				}}
				type="button"
				on:click={() => {
					setToggled(mod.enabled);
				}}
			>
				<div style={{ color: "white" }}>{name}</div>

				{bind !== undefined ? (
					<p
						style={{ "margin-left": "auto" }}
						aria-details={`${name} is bound to ${bind}`}
					>
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
					}}
					type="button"
				>
					<img
						style={{ "margin-left": "auto" }}
						src={GM_getResourceURL("bind")}
						loading="lazy"
						alt="Click to bind"
					/>
				</button>
			) : undefined}
		</div>
	);
}
