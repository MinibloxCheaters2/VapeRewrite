// ── Bus ──────────────────────────────────────────────────────────────
export { default as Bus, setBusInstance, getBusInstance } from "./Bus";

// ── Client ───────────────────────────────────────────────────────────
export { COMMAND_PREFIX, INJECT_DATE, REAL_CLIENT_NAME, clientName } from "./Client";

// ── Debug ────────────────────────────────────────────────────────────
export {
	CHECK_UNMATCHED_DUMPS,
	LOG_REMAPPING,
	EXPOSE_SYMBOLS,
	LOG_EXPOSE_NAME,
} from "./debugControls";

// ── Expose ───────────────────────────────────────────────────────────
export { expose } from "./exposed";

// ── Event ────────────────────────────────────────────────────────────
export { default as EventBus, Priority, Subscribe, SubscribeAsync } from "./event/Bus";
export { default as Cancelable } from "./event/Cancelable";
export { default as CancelableWrapper } from "./event/CancelableWrapper";

// ── Modules API ──────────────────────────────────────────────────────
export { ModuleManager, setModuleManager, P } from "./features/modules/api/ModuleManager";
export { default as Mod } from "./features/modules/api/Module";
export { Category, CategoryInfo, categoryInfoSet } from "./features/modules/api/Category";
export type { CategoryData } from "./features/modules/api/Category";
export { default as LegitModule } from "./features/modules/api/LegitModule";
export { default as LegitModuleManager } from "./features/modules/api/LegitModuleManager";

// ── Config ───────────────────────────────────────────────────────────
export { default as Configurable } from "./features/config/Configurable";
export type {
	BaseSetting,
	ToggleSetting,
	SliderSetting,
	DropdownSetting,
	TextBoxSetting,
	ColorSliderSetting,
	ColorSettingValue,
	SubmoduleSetting,
	SubmoduleItem,
	ModeLike,
	AnySetting,
} from "./features/config/Settings";

// ── Commands ─────────────────────────────────────────────────────────
export { default as CommandDispatcher } from "./features/commands/api/CommandDispatcher";

// ── Utils ────────────────────────────────────────────────────────────
export { siteKey } from "./utils/siteKey";
