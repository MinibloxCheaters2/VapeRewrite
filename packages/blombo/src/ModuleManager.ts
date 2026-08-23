import { ModuleManager, setModuleManager } from "@vape/core/features/modules/api/ModuleManager";

import Fly from "./features/modules/impl/blatant/fly/Fly";
import Phase from "./features/modules/impl/blatant/Phase";
import Speed from "./features/modules/impl/blatant/Speed";
import FilterBypass from "./features/modules/impl/utility/FilterBypass";

type Named = {};

const mm = new ModuleManager<Named>({
	named: {},
	modules: [
		new Speed(),
		new Fly(),
		new Phase(),
		new FilterBypass()
//		new Timer(),
	],
});

setModuleManager(mm);
