import { ModuleManager, setModuleManager } from "@vape/core/features/modules/api/ModuleManager";

import Fly from "./features/modules/impl/blatant/fly/Fly";
import Speed from "./features/modules/impl/blatant/Speed";
import FilterBypass from "./features/modules/impl/utility/FilterBypass";
import DetectionDebugger from "./features/modules/impl/utility/DetectionDebugger";
import NoClip from "./features/modules/impl/blatant/NoClip";
import KillAura from "./features/modules/impl/blatant/KillAura";
import AutoReport from "./features/modules/impl/utility/AutoReport";
import AdBypass from "./features/modules/impl/utility/AdBypass";
import { BowAimbot } from "./features/modules/impl/blatant/BowAimbot";
import ArrowCooldown from "./features/modules/impl/combat/ArrowCooldown";

type Named = {};

const mm = new ModuleManager<Named>({
	named: {},
	modules: [
		new Speed(),
		new KillAura,
		new AutoReport,
		new Fly(),
		new NoClip(),
		new FilterBypass(),
		new AdBypass,
		new BowAimbot,
		new ArrowCooldown,
		DetectionDebugger.INSTANCE
		// new Timer(),
	],
});

setModuleManager(mm);
