import { create } from "@vape/core/features/modules/api/ModuleManager";

import Fly from "./features/modules/impl/blatant/fly/Fly";
import Phase from "./features/modules/impl/blatant/Phase";
import Speed from "./features/modules/impl/blatant/Speed";

create(
	new Speed(),
	new Fly(),
	new Phase(),
);
