import { createEffect, createSignal } from "solid-js";

interface GlobalSettings {
	notificationsEnabled: boolean;
	toggleAlertEnabled: boolean;
	teamsByServerEnabled: boolean;
	rainbowMode: string;
	rainbowSpeed: number;
	rainbowUpdateRate: number;
	guiThemeRainbow: boolean;
	blurBackground: boolean;
	guiBindIndicator: boolean;
	showTooltips: boolean;
	showLegitMode: boolean;
	scaleValue: number;
	useTeamColor: boolean;
	multiKeybinding: boolean;
	friendsList: string[];
	friendsEnabled: string[];
	recolorVisuals: boolean;
	useFriends: boolean;
	friendsColorHue: number;
	friendsColorSat: number;
	friendsColorVal: number;
	targetsList: string[];
	targetsEnabled: string[];
	targetPlayersEnabled: boolean;
	targetNPCsEnabled: boolean;
	showHealth: boolean;
	injureMode: boolean;
}

const SETTINGS_KEY = "vapeSettings";

const DEFAULTS: GlobalSettings = {
	notificationsEnabled: true,
	toggleAlertEnabled: true,
	teamsByServerEnabled: true,
	rainbowMode: "Normal",
	rainbowSpeed: 1,
	rainbowUpdateRate: 60,
	guiThemeRainbow: false,
	blurBackground: true,
	guiBindIndicator: true,
	showTooltips: true,
	showLegitMode: true,
	scaleValue: 1,
	useTeamColor: false,
	multiKeybinding: false,
	friendsList: [],
	friendsEnabled: [],
	recolorVisuals: true,
	useFriends: true,
	friendsColorHue: 1,
	friendsColorSat: 1,
	friendsColorVal: 1,
	targetsList: [],
	targetsEnabled: [],
	targetPlayersEnabled: true,
	targetNPCsEnabled: false,
	showHealth: false,
	injureMode: false,
};

function readSettings(): GlobalSettings {
	try {
		const raw = GM_getValue<string>(SETTINGS_KEY, "");
		return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<GlobalSettings>) } : { ...DEFAULTS };
	} catch {
		return { ...DEFAULTS };
	}
}

const initial = readSettings();

export const [notificationsEnabled, setNotificationsEnabled] = createSignal(
	initial.notificationsEnabled,
);
export const [toggleAlertEnabled, setToggleAlertEnabled] = createSignal(initial.toggleAlertEnabled);
export const [teamsByServerEnabled, setTeamsByServerEnabled] = createSignal(
	initial.teamsByServerEnabled,
);

export const [rainbowMode, setRainbowMode] = createSignal(initial.rainbowMode);
export const [rainbowSpeed, setRainbowSpeed] = createSignal(initial.rainbowSpeed);
export const [rainbowUpdateRate, setRainbowUpdateRate] = createSignal(initial.rainbowUpdateRate);

export const [guiThemeRainbow, setGuiThemeRainbow] = createSignal(initial.guiThemeRainbow);
export const [blurBackground, setBlurBackground] = createSignal(initial.blurBackground);
export const [guiBindIndicator, setGuiBindIndicator] = createSignal(initial.guiBindIndicator);
export const [showTooltips, setShowTooltips] = createSignal(initial.showTooltips);
export const [showLegitMode, setShowLegitMode] = createSignal(initial.showLegitMode);
export const [scaleValue, setScaleValue] = createSignal(initial.scaleValue);
export const [useTeamColor, setUseTeamColor] = createSignal(initial.useTeamColor);
export const [multiKeybinding, setMultiKeybinding] = createSignal(initial.multiKeybinding);

export const [friendsList, setFriendsList] = createSignal(initial.friendsList);
export const [friendsEnabled, setFriendsEnabled] = createSignal(initial.friendsEnabled);
export const [recolorVisuals, setRecolorVisuals] = createSignal(initial.recolorVisuals);
export const [useFriends, setUseFriends] = createSignal(initial.useFriends);
export const [friendsColorHue, setFriendsColorHue] = createSignal(initial.friendsColorHue);
export const [friendsColorSat, setFriendsColorSat] = createSignal(initial.friendsColorSat);
export const [friendsColorVal, setFriendsColorVal] = createSignal(initial.friendsColorVal);

export const [targetsList, setTargetsList] = createSignal(initial.targetsList);
export const [targetsEnabled, setTargetsEnabled] = createSignal(initial.targetsEnabled);
export const [targetPlayersEnabled, setTargetPlayersEnabled] = createSignal(
	initial.targetPlayersEnabled,
);
export const [targetNPCsEnabled, setTargetNPCsEnabled] = createSignal(initial.targetNPCsEnabled);
export const [showHealth, setShowHealth] = createSignal(initial.showHealth);
export const [injureMode, setInjureMode] = createSignal(initial.injureMode);

createEffect(() => {
	GM_setValue(
		SETTINGS_KEY,
		JSON.stringify({
			notificationsEnabled: notificationsEnabled(),
			toggleAlertEnabled: toggleAlertEnabled(),
			teamsByServerEnabled: teamsByServerEnabled(),
			rainbowMode: rainbowMode(),
			rainbowSpeed: rainbowSpeed(),
			rainbowUpdateRate: rainbowUpdateRate(),
			guiThemeRainbow: guiThemeRainbow(),
			blurBackground: blurBackground(),
			guiBindIndicator: guiBindIndicator(),
			showTooltips: showTooltips(),
			showLegitMode: showLegitMode(),
			scaleValue: scaleValue(),
			useTeamColor: useTeamColor(),
			multiKeybinding: multiKeybinding(),
			friendsList: friendsList(),
			friendsEnabled: friendsEnabled(),
			recolorVisuals: recolorVisuals(),
			useFriends: useFriends(),
			friendsColorHue: friendsColorHue(),
			friendsColorSat: friendsColorSat(),
			friendsColorVal: friendsColorVal(),
			targetsList: targetsList(),
			targetsEnabled: targetsEnabled(),
			targetPlayersEnabled: targetPlayersEnabled(),
			targetNPCsEnabled: targetNPCsEnabled(),
			showHealth: showHealth(),
			injureMode: injureMode(),
		}),
	);
});
