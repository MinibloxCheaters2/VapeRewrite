import Category, {
	type CategoryInfo,
} from "../../features/module/api/Category";
import ModuleManager, { P } from "../../features/module/api/ModuleManager";
import Module from "./Module";
import Spacer from "./Spacer";

export default function CategoryUI(category: string, info: CategoryInfo) {
	const mods = ModuleManager.findModules(P.byCategory(Category[category]));
	return (
		<div>
			<div
				style={{
					display: "flex",
					"align-items": "center",
					gap: "0.5rem",
					padding: "0.5rem 0.75rem",
				}}
			>
				<img
					src={info.iconURL}
					alt={`${info.data.name} icon`}
					loading="lazy"
				/>
				<div>{info.data.name}</div>
			</div>
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
			</div>
		</div>
	);
}
