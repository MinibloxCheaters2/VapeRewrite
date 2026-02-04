// Options and settings extracted from Impact

// biome-ignore lint/complexity/noStaticOnlyClass: they're typings :sob:
export declare class Options {
	static streamerMode: { value: boolean };
	static renderDistance: { value: number };
	static fov: { value: number };
	static sensitivity: { value: number };
	static invertMouse: { value: boolean };
	static showFPS: { value: boolean };
	static showCoordinates: { value: boolean };
	static showBiome: { value: boolean };
	static showPing: { value: boolean };
	static showServerIP: { value: boolean };
	static chatScale: { value: number };
	static chatOpacity: { value: number };
	static chatWidth: { value: number };
	static chatHeightFocused: { value: number };
	static chatHeightUnfocused: { value: number };
	static mipmapLevels: { value: number };
	static anisotropicFiltering: { value: number };
	static viewBobbing: { value: boolean };
	static guiScale: { value: number };
	static attackIndicator: { value: number };
	static enableVsync: { value: boolean };
	static entityShadows: { value: boolean };
	static mainHand: { value: string };
	static autoJump: { value: boolean };
	static reset(): void;
	static resetVideo(): void;
	static resetControls(): void;
}

export declare const Options$1: typeof Options;
