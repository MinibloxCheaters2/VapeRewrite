import { Container } from "./Container";

export class ContainerPlayer extends Container {
	constructor(h, isLocalWorld, thePlayer) {
		super();
		I(this, "isLocalWorld");
		I(this, "thePlayer");
		this.isLocalWorld = isLocalWorld;
		this.thePlayer = thePlayer;
		for (let y = 0; y < 4; ++y) {
			this.addSlotToContainer(
				new SlotArmor(h, h.getSizeInventory() - 1 - y, 8, 8 + y * 18),
			);
		}
		for (let y = 0; y < 3; ++y) {
			for (let x = 0; x < 9; ++x) {
				this.addSlotToContainer(
					new Slot(h, x + (y + 1) * 9, 8 + x * 18, 84 + y * 18),
				);
			}
		}
		for (let y = 0; y < 9; ++y) {
			this.addSlotToContainer(new Slot(h, y, 8 + y * 18, 142));
		}
	}
	canInteractWith(_h) {
		return true;
	}
	transferStackInSlot(h, p) {
		let g = null;
		const y = this.inventorySlots[p];
		if (y?.getHasStack()) {
			const x = y.getStack();
			g = x.clone();
			const S = x.getItem();
			if (p >= 0 && p < 4) {
				if (!this.mergeItemStack(x, 4, 40, false)) {
					return null;
				}
			} else if (
				S instanceof ItemArmor &&
				!this.inventorySlots[3 - S.armorType].getHasStack()
			) {
				const b = 3 - S.armorType;
				if (!this.mergeItemStack(x, b, b + 1, false)) {
					return null;
				}
			} else if (p >= 4 && p < 31) {
				if (!this.mergeItemStack(x, 31, 40, false)) {
					return null;
				}
			} else if (p >= 31 && p < 40) {
				if (!this.mergeItemStack(x, 4, 31, false)) {
					return null;
				}
			} else if (!this.mergeItemStack(x, 4, 40, false)) {
				return null;
			}
			if (x.stackSize === 0) {
				y.putStack(null);
			} else {
				y.onSlotChanged();
			}
			if (x.stackSize === g.stackSize) {
				return null;
			}
			y.onPickupFromSlot(h, x);
		}
		return g;
	}
}
