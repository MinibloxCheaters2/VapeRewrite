import { create } from "@vape/core/features/modules/api/ModuleManager";

import ArrowPhase from "./features/modules/impl/blatant/ArrowPhase";
import { BowAimbot } from "./features/modules/impl/blatant/BowAimbot";
import Fly from "./features/modules/impl/blatant/fly/Fly";
import KillAura from "./features/modules/impl/blatant/KillAura";
import NoClip from "./features/modules/impl/blatant/NoClip";
import Speed from "./features/modules/impl/blatant/Speed";
import ArrowCooldown from "./features/modules/impl/combat/ArrowCooldown";
import AdBypass from "./features/modules/impl/utility/AdBypass";
import AutoReport from "./features/modules/impl/utility/AutoReport";
import DetectionDebugger from "./features/modules/impl/utility/DetectionDebugger";
import FilterBypass from "./features/modules/impl/utility/FilterBypass";
import AntiCheatBypass from "./features/modules/impl/blatant/AntiCheatBypass";

create(
	new Speed(),
	new KillAura(),
	new AutoReport(),
	new Fly(),
	new NoClip(),
	new FilterBypass(),
	new AdBypass(),
	new BowAimbot(),
	new ArrowPhase(),
	new ArrowCooldown(),
	DetectionDebugger.INSTANCE,
	new AntiCheatBypass(),
	// new Timer(),
);
