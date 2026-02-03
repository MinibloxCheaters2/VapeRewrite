import type { AxesHelper, Group, PerspectiveCamera, Scene } from "three";
import type { Game } from "./game";

export declare class GameScene {
	game: Game;
	camera = new PerspectiveCamera(85,window.innerWidth / window.innerHeight,.01,1e7);
	scene = new Scene;
	axesHelper = new AxesHelper(.01);
	entityMeshes = new Group;
	chunkMeshes = new Group;
	ambientMeshes = new Group;
	leaderboardMeshes = new Group;
	sun = new Sun(this);
	stars = new Stars(this, this.sun);
	sky = new Sky(this, this.sun);
	fog = new Fog(this);
	clouds = new Clouds(this);
	tileEntityRenderer: TileEntityRenderer;
	effectRenderer: EffectRenderer;
    constructor(game: Game);
    updateCameraZoom(): void;
    update(): void;
    clear(): void;
}
