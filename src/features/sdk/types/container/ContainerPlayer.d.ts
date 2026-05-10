import type { EntityPlayer } from "../entity";
import type { InventoryPlayer } from "../inventory";
import type { ItemStack } from "../items";
import { Container } from "./Container";

export class ContainerPlayer extends Container {
	readonly isLocalWorld: boolean;
	readonly thePlayer: EntityPlayer;
	constructor(
		playerInventory: InventoryPlayer,
		isLocalWorld: boolean,
		thePlayer: EntityPlayer,
	);
	canInteractWith(_player: EntityPlayer): boolean;
	transferStackInSlot(plr: EntityPlayer, index: number): ItemStack | null;
}
