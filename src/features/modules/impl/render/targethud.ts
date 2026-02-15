import { Subscribe } from "@/event/api/Bus";
import Refs from "@/utils/refs";
import { findTargets } from "@/utils/target";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class TargetHUD extends Mod {
	public name = "TargetHUD";
	public category = Category.RENDER;

	private rangeSetting = this.createSliderSetting("Range", 20, 5, 50, 1);
	private positionSetting = this.createDropdownSetting("Position", [
		"Top Center",
		"Top Left",
		"Top Right",
	]);
	private showArmorSetting = this.createToggleSetting("Show Armor", true);
	private showDistanceSetting = this.createToggleSetting("Show Distance", true);
	private scaleSetting = this.createSliderSetting("Scale", 1.0, 0.5, 2.0, 0.1);

	private currentTarget: any = null;

	get range() {
		return this.rangeSetting.value();
	}

	get position() {
		return this.positionSetting.value();
	}

	get showArmor() {
		return this.showArmorSetting.value();
	}

	get showDistance() {
		return this.showDistanceSetting.value();
	}

	get scale() {
		return this.scaleSetting.value();
	}

	private getClosestTarget() {
		const targets = findTargets(this.range);
		if (targets.length === 0) return null;

		const { player } = Refs;
		if (!player) return null;

		return targets.reduce((closest, current) => {
			const closestDist = player.getDistanceSqToEntity(closest);
			const currentDist = player.getDistanceSqToEntity(current);
			return currentDist < closestDist ? current : closest;
		});
	}

	private getArmorMaterial(armorName: string): string {
		const name = armorName.toLowerCase();

		if (name.includes("infernium")) return "Infernium";
		if (name.includes("emerald")) return "Emerald";
		if (name.includes("diamond")) return "Diamond";
		if (name.includes("gold")) return "Gold";
		if (name.includes("iron")) return "Iron";
		if (name.includes("wooden") || name.includes("wood")) return "Wooden";

		return "Unknown";
	}

	private getArmorColor(material: string): string {
		switch (material) {
			case "Infernium":
				return "#FF4444";
			case "Emerald":
				return "#00FF00";
			case "Diamond":
				return "#00FFFF";
			case "Gold":
				return "#FFFF00";
			case "Iron":
				return "#AAAAAA";
			case "Wooden":
				return "#8B4513";
			default:
				return "#FFFFFF";
		}
	}

	private getHealthColor(health: number): string {
		if (health > 15) return "#00FF00";
		if (health > 10) return "#FFFF00";
		if (health > 5) return "#FFA500";
		return "#FF0000";
	}

	private renderTargetHUD(): void {
		const { hud3D } = Refs;
		if (!hud3D) return;

		const target = this.getClosestTarget();
		if (!target) {
			this.currentTarget = null;
			return;
		}

		this.currentTarget = target;

		const position = this.position;
		let x = window.innerWidth / 2;
		const y = 20;

		if (position === "Top Left") x = 20;
		if (position === "Top Right") x = window.innerWidth - 220;

		const scale = this.scale;
		const fontSize = Math.floor(16 * scale);
		const smallFontSize = Math.floor(12 * scale);

		const name = target.name || "Unknown";
		const health = target.health || 0;

		hud3D.drawText?.(name, x, y, "#FFFFFF", fontSize, true);

		const healthColor = this.getHealthColor(health);
		hud3D.drawText?.(
			`Health: ${health.toFixed(1)}/20`,
			x,
			y + 20 * scale,
			healthColor,
			smallFontSize,
		);

		if (this.showDistance) {
			const { player } = Refs;
			if (player) {
				const dist = player.getDistanceToEntity(target);
				hud3D.drawText?.(
					`Distance: ${dist.toFixed(1)}`,
					x,
					y + 35 * scale,
					"#AAAAAA",
					smallFontSize,
				);
			}
		}

		if (this.showArmor) {
			const armor = target.inventory?.armorInventory || [];
			const pieces = ["Helmet", "Chestplate", "Leggings", "Boots"];
			let armorY = this.showDistance ? 50 * scale : 35 * scale;

			for (let i = 3; i >= 0; i--) {
				const item = armor[i];
				const pieceName = pieces[3 - i];

				let armorText = pieceName;

				if (item && item.getItem) {
					const material = this.getArmorMaterial(item.getItem().name || "");
					const color = this.getArmorColor(material);

					armorText = `${pieceName}: ${material}`;
					hud3D.drawText?.(armorText, x, y + armorY, color, smallFontSize);
				} else {
					hud3D.drawText?.(armorText, x, y + armorY, "#555555", smallFontSize);
				}

				armorY += 15 * scale;
			}
		}
	}

	@Subscribe("tick")
	public onTick() {
		if (this.enabled) {
			this.renderTargetHUD();
		}
	}
}
