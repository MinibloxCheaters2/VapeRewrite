import BaseHudElement from "./BaseHudElement";

export interface HudPosition {
	x: number;
	y: number;
}

export default abstract class CanvasHudElement extends BaseHudElement {
	/**
	 * Render the HUD element content
	 */
	public abstract render(canvas: HTMLCanvasElement): void;
}
