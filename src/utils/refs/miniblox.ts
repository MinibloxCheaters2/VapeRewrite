import type {
	AllBlocks,
	BlockPos,
	Chat,
	ClientEntityPlayer,
	ClientSocket,
	ClientWorld,
	Enchantments,
	EntityLivingBase,
	EnumFacing,
	Game,
	Hud3D,
	ItemArmor,
	ItemBlock,
	ItemBow,
	ItemStack,
	ItemSword,
	Items,
	Materials,
	PlayerController,
	PlayerControllerMP,
	AnyPacket,
	Message,
	SPacketPlayerInput,
} from "@wq2/miniblox-sdk";
import { scriptEl } from "@/hooks/gameScript";
import { expose } from "@/exposed";
import initOrR from "../helpers/initOrR";
import mappings from "../mapping/mappings";
import remapObj from "../helpers/remapProxy";
import { getInheritanceTree, HasProto } from "../helpers/tree";
import PacketRefs from "../network/packetRefs";

export async function importMiniblox() {
	return await import(scriptEl.src);
}

let miniblox: object;

importMiniblox().then((t) => {
	miniblox = t;
	expose("MinibloxRaw", () => t);
});

function findObject(filter: (clazz: NewableFunction) => boolean) {
	return Object.values(miniblox).find(filter);
}

function findObjectByCode(codeFilter: (code: string) => boolean) {
	return Object.values(miniblox).find((x) => codeFilter(x.toString()));
}

function filterObject(filter: (clazz: NewableFunction) => boolean) {
	return Object.values(miniblox).filter(filter);
}

function filterObjectByCode(codeFilter: (code: string) => boolean) {
	return Object.values(miniblox).filter((x) => codeFilter(x.toString()));
}

let _game: Game | undefined;
let _world: ClientWorld | undefined;
let _player: ClientEntityPlayer | undefined;
let _chat: Chat | undefined;
let _BlockPos: typeof BlockPos | undefined;
let _EnumFacing: typeof EnumFacing | undefined;
let _EntityLivingBase: typeof EntityLivingBase | undefined;
let _playerController: PlayerController | undefined;
let _Blocks: AllBlocks | undefined;
let _Items: typeof Items | undefined;
let _ItemSword: typeof ItemSword | undefined;
let _ItemArmor: typeof ItemArmor | undefined;
let _ItemStack: typeof ItemStack | undefined;
let _ItemBow: typeof ItemBow | undefined;
let _ItemBlock: typeof ItemBlock | undefined;

let _packets: AnyPacket[] | undefined = undefined;
let CSocket: typeof ClientSocket | undefined = undefined;
let _playerControllerMP: PlayerControllerMP | undefined = undefined;

// search for exposed globals: `globalThis\.\w+ = `
// note: you could also search for window, but there's a bunch of false positives for stuff like onbeforeunload

const Miniblox = {
	/** note: not all packets are here, only the ones vector exports. */
	get packets() {
		return initOrR(
			_packets,
			() =>
				filterObject(
					(x) => typeof x === "function" && "typeName" in x,
				) as Message<{}>[] | undefined,
		);
	},
	get ClientSocket() {
		return initOrR(CSocket, () =>
			findObject(
				(x) =>
					// classes are "functions"
					typeof x === "function" &&
					"sendPacket" in x &&
					"socket" in x &&
					"disconnectMessage" in x &&
					"netSim" in x &&
					"serverBaseUrl" in x &&
					"setUrl" in x,
			),
		);
	},
	get playerControllerMP() {
		return initOrR(_playerControllerMP, () =>
			findObject(
				(x) =>
					typeof x === "object" &&
					"lastSentSlot" in x &&
					"isHittingBlock" in x &&
					"sendEnchantPacket" in x &&
					"sendRenamePacket" in x,
			),
		);
	},

	get Items(): typeof Items {
		return initOrR(
			_Items,
			() =>
				(globalThis as typeof globalThis & { Items: typeof Items })
					.Items,
		);
	},

	get ItemSword(): typeof ItemSword {
		return initOrR(
			_ItemSword,
			() => Miniblox.Items.iron_sword.constructor as typeof ItemSword,
		);
	},
	get ItemArmor(): typeof ItemArmor {
		return initOrR(
			_ItemArmor,
			() => Miniblox.Items.iron_boots.constructor as typeof ItemArmor,
		);
	},

	get ItemStack(): typeof ItemStack {
		return initOrR(
			_ItemStack,
			() =>
				(
					globalThis as typeof globalThis & {
						ItemStack: typeof ItemStack;
					}
				).ItemStack,
		);
	},

	get ItemBow(): typeof ItemBow {
		return initOrR(
			_ItemBow,
			() => Miniblox.Items.bow.constructor as typeof ItemBow,
		);
	},

	get Enchantments(): typeof Enchantments {
		throw new Error(
			"TODO: get Enchantements object, note that Enchantment is exposed and has a list for those",
		);
	},

	get Blocks(): AllBlocks {
		return initOrR(
			_Blocks,
			() =>
				(globalThis as typeof globalThis & { Blocks: AllBlocks })
					.Blocks,
		);
	},

	get Materials() {
		return undefined;
	},
	get ItemBlock() {
		return initOrR(_ItemBlock, () => Miniblox.Blocks.stone.constructor);
	},
	get hud3D() {
		// TODO: get hud3D object?
		throw new Error("TODO: get hud3D object");
	},

	/**
	 * Just `game.controller` with the remap proxy applied
	 */
	get playerController() {
		return initOrR(_playerController, () =>
			remapObj(Miniblox.game.controller, mappings.playerController),
		);
	},

	get BlockPos() {
		return initOrR(_BlockPos, () =>
			findObject((x) => typeof x === "function" && "ORIGIN" in x),
		);
	},

	get EnumFacing() {
		return initOrR(_EnumFacing, () => {
			//getHorizontalDirection returns the same object and isn't remapped
			/*Object.entries(elb.prototype).find(([k, x]) => {

				//(getHorizontalFacing)() {
    			//	return (EnumFacing).getHorizontal(Math.floor(this.yaw * 180 / Math.PI * 4 / 360 + .5) & 3)
        		//}
				if (typeof x === "function" && (x as Function).toString().includes(".getHorizontal(Math.floor(this.yaw*180")) {
					this.player.getHorizontalFacing();
				}
			});*/
			const ef = this.player.getHorizontalDirection();
			return ef.constructor as typeof EnumFacing;
		});
	},

	get EntityLivingBase() {
		return initOrR(_EntityLivingBase, () =>
			Array.from(
				getInheritanceTree(Miniblox.player as unknown as HasProto),
			).find((x) => {
				return (
					"sprintingSpeedBoostModifier" in x &&
					"nextEntityID" in x &&
					typeof x === "number"
				);
			}),
		);
	},

	/**
	 * Prefer using some of the getters in here instead of from this game object,
	 * since some of them have a remapper proxy added, which automatically remaps non-obfuscated symbol names to their dumped version,
	 * which you would have to do manually by indexing dumps and casting to `as "originalName"` so you get the typings.
	 * | `game.` version          | `Miniblox` version        | Auto remapping |
	 * |--------------------------|---------------------------|----------------:|
	 * | Miniblox.game.player     | Miniblox.player           | ✅              |
	 * | Miniblox.game.world      | Miniblox.world            | ✅              |
	 * | Miniblox.game.controller | Miniblox.playerController | ✅              |
	 * | Miniblox.game.chat       | Miniblox.chat             | Not needed      |
	 */
	get game() {
		return initOrR(_game, () => {
			const elem = document.querySelector("#react");
			const fiber = elem && Object.values(elem)[0];
			if (!fiber?.updateQueue?.baseState?.element?.props?.game)
				throw new Error("React not mounted!");
			return fiber.updateQueue.baseState.element.props.game as Game;
		});
	},

	/** Miniblox.game.world with a remap proxy applied */
	get world() {
		return initOrR(_world, () =>
			remapObj(Miniblox.game.world, mappings.world),
		);
	},

	/** Convenience reference to Miniblox.game.chat */
	get chat() {
		return initOrR(_chat, () => Miniblox.game.chat);
	},

	/** Miniblox.game.player with a remap proxy applied */
	get player() {
		return initOrR(_player, () =>
			remapObj(Miniblox.game.player, mappings.ClientEntityPlayer),
		);
	},
};
expose("Miniblox", () => Miniblox);

export default Miniblox;
