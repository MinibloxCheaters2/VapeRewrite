import { createSignal } from "solid-js";
import type HudElement from "./HudElement";

class HudManager {
	private hudElements: HudElement[] = [];
	private hudElementsSignal = createSignal<HudElement[]>([]);
	private selectedHudSignal = createSignal<HudElement | null>(null);

	public get hudElementsAccessor() {
		return this.hudElementsSignal[0];
	}

	public get selectedHudAccessor() {
		return this.selectedHudSignal[0];
	}

	public get selectedHud() {
		return this.selectedHudSignal[0]();
	}

	public set selectedHud(hud: HudElement | null) {
		this.selectedHudSignal[1](hud);
	}

	/**
	 * Register a HUD element type (for the add menu)
	 */
	public registerHudType(hudClass: new () => HudElement): void {
		// Store for later instantiation
		if (!this.hudTypes.find((h) => h.name === hudClass.name)) {
			this.hudTypes.push(hudClass);
		}
	}

	private hudTypes: Array<new () => HudElement> = [];

	public getHudTypes(): Array<new () => HudElement> {
		return this.hudTypes;
	}

	/**
	 * Add a HUD element instance
	 */
	public addHudElement(hud: HudElement): void {
		// Generate unique ID if duplicate
		let uniqueId = hud.id;
		let counter = 1;
		while (this.hudElements.find((h) => h.id === uniqueId)) {
			uniqueId = `${hud.id}_${counter}`;
			counter++;
		}
		hud.id = uniqueId;

		this.hudElements.push(hud);
		this.hudElementsSignal[1]([...this.hudElements]);
		hud.onAdd();
	}

	/**
	 * Remove a HUD element
	 */
	public removeHudElement(hud: HudElement): void {
		const index = this.hudElements.indexOf(hud);
		if (index !== -1) {
			this.hudElements.splice(index, 1);
			this.hudElementsSignal[1]([...this.hudElements]);
			hud.onRemove();
			if (this.selectedHud === hud) {
				this.selectedHud = null;
			}
		}
	}

	/**
	 * Get all HUD elements
	 */
	public getHudElements(): HudElement[] {
		return this.hudElements;
	}

	/**
	 * Find a HUD element by ID
	 */
	public findHudById(id: string): HudElement | undefined {
		return this.hudElements.find((h) => h.id === id);
	}
}

export default new HudManager();
