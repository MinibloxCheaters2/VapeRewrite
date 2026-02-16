import type { Loader, Texture, TextureLoader } from "three";

export declare class HUD3D {
	swingArm(): void;
	updateHeldItem(): void;
	renderItemInFirstPerson(partialTicks: number): void;
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
	loader: unknown;
}
