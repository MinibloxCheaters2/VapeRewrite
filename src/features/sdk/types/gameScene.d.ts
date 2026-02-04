import type { AxesHelper, Group, PerspectiveCamera, Scene } from "three";
import type { Game } from "./game";

export declare class GameScene {
	game: Game;
	readonly camera = new PerspectiveCamera(
		85,
		window.innerWidth / window.innerHeight,
		0.01,
		1e7,
	);
	readonly scene = new Scene();
	readonly axesHelper = new AxesHelper(0.01);
	readonly entityMeshes = new Group();
	readonly chunkMeshes = new Group();
	readonly ambientMeshes = new Group();
	readonly leaderboardMeshes = new Group();
	readonly sun = new Sun(this);
	readonly stars = new Stars(this, this.sun);
	readonly sky = new Sky(this, this.sun);
	readonly fog = new Fog(this);
	readonly clouds = new Clouds(this);
	tileEntityRenderer: TileEntityRenderer;
	effectRenderer: EffectRenderer;
	constructor(game: Game);
	updateCameraZoom(): void;
	update(): void;
	clear(): void;
}
