import { dragHandleAttrName } from "@/utils/names";
import Category, {
	type CategoryInfo,
} from "@/features/module/api/Category";
import ModuleManager, { P } from "@/features/module/api/ModuleManager";
import Module from "./Module";
import Spacer from "./Spacer";
import { createSignal } from "solid-js";
import getResourceURL from "@/utils/cachedResourceURL";

const CONTRACT = getResourceURL("contract");
const EXPAND = getResourceURL("expand");

export default function CategoryUI(category: string, info: CategoryInfo) {
	const mods = ModuleManager.findModules(P.byCategory(Category[category]));
	const [expanded, setExpanded] = createSignal(true);

	return (
		<div>
			<div {...{ [dragHandleAttrName]: "" }}
				style={{
					display: "flex",
					"align-items": "center",
					gap: "0.5rem",
					padding: "0.5rem 0.75rem",
				}}
				on:click={() => {
					setExpanded(!expanded());
				}}
			>
				<img
					src={info.iconURL}
					alt={`${info.data.name} icon`}
					loading="lazy"
				/>
				<div>{info.data.name}</div>
				<img
					src={expanded() ? EXPAND : CONTRACT}
					alt={`${expanded() ? `Expand ${category}` : `Contract ${category}`}`}
					loading="lazy"
				/>
			</div>
			{expanded() ?
				<div>
					{mods.map((m, i) => {
						return (
							<div>
								<Module mod={m}></Module>
								{i >=
									ModuleManager.modules.length - 1 ? undefined : (
									<Spacer size={"4px"}></Spacer>
								)}
							</div>
						);
					})}
				</div> : undefined}
		</div>
	);
}
