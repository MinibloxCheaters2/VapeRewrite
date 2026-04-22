import type { JSX } from "solid-js";
import BaseHudElement from "./BaseHudElement";

export interface HudPosition {
	x: number;
	y: number;
}

export default abstract class HudElement extends BaseHudElement {
	/**
	 * Render the HUD element content
	 * @returns JSX element to render
	 */
	public abstract render(): JSX.Element;
}
