import type { Group, Loader, Mesh, Texture, TextureLoader } from "three";
import { Block } from "./blocks";

export interface AnimationKeyframe {
	duration: number;
	position: Vector3;
	rotation: Quaternion;
}

export declare class AnimationLerp {
	private totalDuration;
	private keyframes;
	private target;
	private cumulativeTimes;
	constructor(keyframes: AnimationKeyframe[], target: Object3D);
	update(deltaTime: number): void;
}

export declare class Hud3D extends Group {
	item: Group;
	fireGroup: Group;
	suffocationGroup: Mesh;
	lastSuffocationBlock: Block | null;
	mesh: Mesh;
	tesr: Mesh;
	rightArm: Mesh;
	leftArm: Mesh;
	lastPunch: number;
	rightArmPunch: AnimationLerp;
	itemPunch: AnimationLerp;
	eat: AnimationLerp;
	sword: AnimationLerp;
	swordVariation: number;
	shovel: AnimationLerp;
	axe: AnimationLerp;
	cancelAnimation: boolean;
	currentActiveItem: ItemStack | null;
	prevCharge: number;
	swingLength: {
		value: number;
	};
	constructor();
	getSpriteMesh(spriteName: string): Mesh;
	/**
	 * @param name the name of the sprite (i.e. `fire_0`)
	 * @param mesh the mesh
	 * @param [idx=0] index. `Math.floor(Date.now() / 25 % 32)` for the fire animation
	 */
	updateSpriteUV(name: string, mesh: Mesh, idx?: number): void;
	initFireMesh(): void;
	initSuffocationMesh(): void;
	updateFireGraphics(): void;
	updateSuffocationGraphics(): void;
	swingArm(): void;
	updateArmAnimation(): void;
	/** it's only `true` when `ClientEntityPlayer`#`init` is called. otherwise it's not passed. */
	update(clientEntityPlayerInit?: boolean): void;
}

export declare class Font {
	isFont: true;
	type: "Font";
	constructor(public data: unknown);
	generateShapes(u, h = 100): unknown[];
}

export declare class FontLoader extends Loader<Font> {
	load(
		url: string,
		callback: (font: Font) => void,
		onProgress: (event: ProgressEvent<EventTarget>) => void,
		onError: (err: unknown) => void,
	): void;
	parse(data): Font;
}

export declare class TextureManager {
	loadTextures(): Promise<void>;
	loadSpritesheet(): Promise<void>;
	loader: TextureLoader;
	fontLoader: FontLoader;
	miniblox_font: Font;
	old_miniblox_font: Font;
	atlas;
	materialWorld;
	materialTransparentWorld;
	material;
	materialEnchanted;
	materialTransparent;
	entityMaterials: object;
	entityUVSize: object;
	spritesheetPixels;
	particles: object;
	glintTexture: Texture;
	skinManager: SkinManager;
	/** **IMPORTANT**: USE DUMPS */
	gltfManager: GLTFManager;
}
