// HUD and rendering utilities extracted from Impact

export declare class HUD3D {
	swingArm(): void;
	updateHeldItem(): void;
	renderItemInFirstPerson(partialTicks: number): void;
}

export declare const hud3D: HUD3D;

export declare class TextureManager {
	vapeTexture: any;
	glintTexture: any;
	loadTextures(): Promise<void>;
	loadVape(): Promise<void>;
	loadSpritesheet(): Promise<void>;
	loader: any;
}

export declare const textureManager: TextureManager;
