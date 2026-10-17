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
import Disabler from "./features/modules/impl/blatant/Disabler";
import { AutoBow } from "./features/modules/impl/blatant/AutoBow";
import ServerCrasher from "./features/modules/impl/utility/ServerCrasher";
import GodMode from "./features/modules/impl/utility/Godmode";
import M8M6Chat from "./features/modules/impl/utility/M8M6Chat";
import Respawn from "./features/modules/impl/utility/Respawn";
import AutoWin from "./features/modules/impl/utility/AutoWin";

create(
	new Speed(),
	KillAura.INSTANCE,
	new AutoReport(),
	new Fly(),
	new NoClip(),
	new FilterBypass(),
	new AdBypass(),
	new AutoBow,
	new BowAimbot(),
	new ArrowPhase(),
	new ArrowCooldown(),
	DetectionDebugger.INSTANCE,
	new M8M6Chat,
	new Disabler(),
	new GodMode,
	new Respawn,
	new AutoWin,
	new ServerCrasher
	// new Timer(),
);
