// HUD and rendering utilities extracted from Impact

export declare class HUD3D {
	swingArm(): void;
	updateHeldItem(): void;
	renderItemInFirstPerson(partialTicks: number): void;
}

export declare class TextureManager {
	loadTextures(): Promise<void>;
	loadSpritesheet(): Promise<void>;
	loader: any;
}
