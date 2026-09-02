import { ModuleManager, setModuleManager } from "@vape/core/features/modules/api/ModuleManager";

import Fly from "./features/modules/impl/blatant/fly";
import InfiniteAura from "./features/modules/impl/blatant/InfiniteAura";
import KillAura from "./features/modules/impl/blatant/KillAura";
import NoSlow from "./features/modules/impl/blatant/NoSlow";
import Phase from "./features/modules/impl/blatant/Phase";
import Speed from "./features/modules/impl/blatant/Speed";
import AutoClicker from "./features/modules/impl/combat/AutoClicker";
import KeepSprint from "./features/modules/impl/combat/KeepSprint";
import Velocity from "./features/modules/impl/combat/Velocity";
import WTap from "./features/modules/impl/combat/WTap";
import InventoryMove from "./features/modules/impl/utility/InventoryMove";
import Test from "./features/modules/impl/utility/Test";
import NoFall from "./features/modules/impl/world/NoFall";
import Timer from "./features/modules/impl/world/Timer";

type Named = {};

const mm = new ModuleManager<Named>({
	named: {},
	modules: [
		new Speed(),
		new Fly(),
		new KillAura(),
		new InfiniteAura(),
		new NoSlow(),
		new Phase(),
		new Timer(),
		new AutoClicker(),
		new Velocity(),
		new WTap(),
		new NoFall(),
		new Test(),
		new KeepSprint(),
		new InventoryMove(),
	],
});

setModuleManager(mm);
