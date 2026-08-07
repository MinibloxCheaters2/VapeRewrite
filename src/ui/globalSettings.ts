import { createSignal } from "solid-js";

export const [notificationsEnabled, setNotificationsEnabled] = createSignal(true);
export const [toggleAlertEnabled, setToggleAlertEnabled] = createSignal(true);

export const [teamsByServerEnabled, setTeamsByServerEnabled] = createSignal(true);

export const [rainbowMode, setRainbowMode] = createSignal("Normal");
export const [rainbowSpeed, setRainbowSpeed] = createSignal(1);
export const [rainbowUpdateRate, setRainbowUpdateRate] = createSignal(60);

export const [guiThemeRainbow, setGuiThemeRainbow] = createSignal(false);
export const [blurBackground, setBlurBackground] = createSignal(true);
export const [guiBindIndicator, setGuiBindIndicator] = createSignal(true);
export const [showTooltips, setShowTooltips] = createSignal(true);
export const [showLegitMode, setShowLegitMode] = createSignal(true);
export const [scaleValue, setScaleValue] = createSignal(1);
export const [useTeamColor, setUseTeamColor] = createSignal(false);
export const [multiKeybinding, setMultiKeybinding] = createSignal(false);

export const [friendsList, setFriendsList] = createSignal<string[]>([]);
export const [friendsEnabled, setFriendsEnabled] = createSignal<string[]>([]);
export const [recolorVisuals, setRecolorVisuals] = createSignal(true);
export const [useFriends, setUseFriends] = createSignal(true);
export const [friendsColorHue, setFriendsColorHue] = createSignal(1);
export const [friendsColorSat, setFriendsColorSat] = createSignal(1);
export const [friendsColorVal, setFriendsColorVal] = createSignal(1);

export const [targetsList, setTargetsList] = createSignal<string[]>([]);
export const [targetsEnabled, setTargetsEnabled] = createSignal<string[]>([]);
export const [targetPlayersEnabled, setTargetPlayersEnabled] = createSignal(true);
export const [targetNPCsEnabled, setTargetNPCsEnabled] = createSignal(false);
export const [showHealth, setShowHealth] = createSignal(false);
export const [injureMode, setInjureMode] = createSignal(false);
