import type {
	AllBlocks,
	AnyPacket,
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
	Message,
	PlayerController,
	PlayerControllerMP,
} from "@wq2/miniblox-sdk";
import type { PerspectiveCamera } from "three";
import { expose } from "@/exposed";
import { scriptEl } from "@/hooks/gameScript";
import initOrR from "../helpers/initOrR";
import remapObj from "../helpers/remapProxy";
import { getInheritanceTree, type HasProto } from "../helpers/tree";
import mappings from "../mapping/mappings";

export async function importMiniblox() {
	return await import(scriptEl.src);
}

let miniblox: object;

importMiniblox().then((t) => {
	miniblox = t;
	expose("MinibloxRaw", () => t);
});

let vals: unknown[] | undefined;
function values() {
	return initOrR(vals, () => Object.values(miniblox));
}

function findObject<T>(filter: <X>(clazz: unknown) => clazz is X) {
	return values().find(filter) as T | undefined;
}

function _findObjectByCode<T>(codeFilter: (code: string) => boolean) {
	return values().find(
		(x) => typeof x === "function" && codeFilter(x.toString()),
	) as T | undefined;
}

function filterObject(filter: <X>(clazz: unknown) => clazz is X) {
	return values().filter(filter);
}

function _filterObjectByCode<T>(codeFilter: (code: string) => boolean) {
	return values().filter(
		(x) => typeof x === "function" && codeFilter(x.toString()),
	) as T[];
}

let _game: Game | undefined;
let _Game: typeof Game | undefined;
let _world: ClientWorld | undefined;
let _player: ClientEntityPlayer | undefined;
let _chat: Chat | undefined;
let _BlockPos: typeof BlockPos | undefined;
let _EnumFacing: typeof EnumFacing | undefined;
let _Enchantments: typeof Enchantments | undefined;
let _hud3D: Hud3D | undefined;
let _EntityLivingBase: typeof EntityLivingBase | undefined;
let _playerController: PlayerController | undefined;
let _Blocks: AllBlocks | undefined;
let _Materials: typeof Materials | undefined;
let _Items: typeof Items | undefined;
let _ItemSword: typeof ItemSword | undefined;
let _ItemArmor: typeof ItemArmor | undefined;
let _ItemStack: typeof ItemStack | undefined;
let _ItemBow: typeof ItemBow | undefined;
let _ItemBlock: typeof ItemBlock | undefined;

let _packets: AnyPacket[] | undefined;
let CSocket: typeof ClientSocket | undefined;
let _playerControllerMP: PlayerControllerMP | undefined;
let _Message: typeof Message | undefined;
export interface Runtime {
	util: {
		setEnumType(): void;
		initPartial(a: object | undefined, b: object): void;
		equals(a: object, b: object): boolean;
	};
	syntax: string;
}
let _proto2: object | undefined;
let _proto3: object | undefined;

// search for exposed globals: `globalThis\.\w+ = `
// note: you could also search for window, but there's a bunch of false positives for stuff like onbeforeunload

/** gets a message class from either miniblox.packets or a function that returns SPacketUpdateInventory */
function getReferenceMsg() {
	function method1() {
		return Miniblox.packets?.filter?.((x) => x != null)?.[0];
	}
	function method2() {
		return Miniblox.player.inventory.sendInventoryToServer();
	}
	return method1() ?? method2();
}
function getMsgRuntime(msg: Message<object>) {
	return (
		msg.constructor as (typeof msg)["constructor"] & { runtime: object }
	).runtime;
}

const Miniblox = {
	/** note: not all packets are here, only the ones vector exports. */
	get packets() {
		return initOrR(
			_packets,
			() =>
				filterObject(
					(x) => typeof x === "function" && "typeName" in x,
				) as Message<object>[] | undefined,
		);
	},
	get proto2() {
		return initOrR(_proto2, () =>
			getMsgRuntime(Miniblox.player.inventory.sendInventoryToServer()),
		);
	},
	get proto3() {
		return initOrR(_proto3, () => {
			const packets = Miniblox.packets;
			if (!packets) return;
			return packets
				.filter((x) => x !== undefined && x != null)
				.map((x) => getMsgRuntime({ constructor: x }))
				.find(
					(x) =>
						(x as typeof x & { syntax: string })?.syntax ===
						"proto3",
				);
		});
	},
	get Message() {
		return initOrR(_Message, () => {
			const msg = getReferenceMsg();
			return msg ? Object.getPrototypeOf(msg) : undefined;
		});
	},
	get ClientSocket() {
		return initOrR(
			CSocket,
			() =>
				findObject(
					(x) =>
						// raw classes are "functions" (because their constructors are)
						typeof x === "function" &&
						"sendPacket" in x &&
						"socket" in x &&
						"disconnectMessage" in x &&
						"netSim" in x &&
						"serverBaseUrl" in x &&
						"setUrl" in x,
				) as typeof ClientSocket,
		);
	},
	get playerControllerMP() {
		return initOrR(
			_playerControllerMP,
			() =>
				remapObj(findObject(
					(x) =>
						x != null &&
						typeof x === "object" &&
						"lastSentSlot" in x &&
						"isHittingBlock" in x &&
						"sendEnchantPacket" in x &&
						"sendRenamePacket" in x,
				) as PlayerControllerMP, mappings.playerControllerMP),
		);
	},

	get Items(): typeof Items {
		return initOrR(
			_Items,
			() =>
				(unsafeWindow as typeof unsafeWindow & { Items: typeof Items })
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
					unsafeWindow as typeof unsafeWindow & {
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
		return initOrR(_Enchantments, () =>
			findObject(
				(x) =>
					x != null &&
					typeof x === "function" &&
					"protection" in x &&
					"fireProtection" in x &&
					"featherFalling" in x &&
					"init" in x,
			),
		);
	},

	get Blocks(): AllBlocks {
		return initOrR(
			_Blocks,
			() =>
				(unsafeWindow as typeof unsafeWindow & { Blocks: AllBlocks })
					.Blocks,
		);
	},

	get Materials() {
		return initOrR(_Materials, () =>
			findObject(
				(x) =>
					typeof x === "function" &&
					"redstoneLight" in x &&
					"air" in x &&
					"leaves" in x,
			),
		);
	},
	get ItemBlock() {
		return initOrR(_ItemBlock, () => Miniblox.Blocks.stone.constructor);
	},
	get hud3D() {
		/*
		var hud3D = new class extends er {
    item = new er;
    fireGroup = new er;
    suffocationGroup = new ur;
    lastSuffocationBlock;
    mesh = new ur;
    tesr;
    rightArm;
    armSkin;
    armSkinReady = !1;
    leftArm;
    lastPunch = 0;
    rightArmPunch = new aI([aMe, oMe, sMe, cMe],this);
    itemPunch = new aI([zje, Bje, Vje],this);
    eat = new aI([lMe, uMe],this);
    sword = [new aI([Hje, Uje, Wje],this), new aI([Gje, Kje, qje],this)];
    swordVariation = 0;
    shovel = new aI([Jje, Yje, Xje],this);
    axe = new aI([Zje, Qje, $je, eMe],this);
    cancelAnimation = !1;
    currentActiveItem;
    prevCast = !1;
    prevCharge = null;
    prevCompassFrame = -1;
    prevClockFrame = -1;
    swingLength = bT(0);
    constructor() {
        super(),
        gameScene.camera.add(this), // <<< this, we can detect the fields that only exist in this class and then put it here as a reference
        gameScene.camera.add(this.fireGroup),
        gameScene.camera.add(this.suffocationGroup),
        this.add(this.item)
    }
*/
		return initOrR(_hud3D, () => {
			const { gameScene } = this.game;
			const camera = gameScene.camera as PerspectiveCamera; // could use destructuring, but I need this cast
			const hud3D = camera.children.find((c) => {
				return (
					"item" in c &&
					"fireGroup" in c &&
					"eat" in c &&
					"swingArm" in c &&
					"leftPunch" in c
				);
			}) as unknown as Hud3D;
			return hud3D;
		});
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
			(Array.from(
				getInheritanceTree(Miniblox.player as unknown as HasProto),
			).find((x) => {
				const ctor = (x as unknown as EntityLivingBase & { constructor: typeof EntityLivingBase }).constructor;
				return Object.getOwnPropertyNames(ctor).includes("sprintingSpeedBoostModifier");
			}))?.constructor as typeof EntityLivingBase | undefined,
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
			function method1() {
				return findObject(
					(x) =>
						typeof x === "object" &&
						"gameScene" in x &&
						"GameSceneClass" in x &&
						"player" in x &&
						"world" in x,
				) as Game;
			}
			function method2() {
				const elem = document.querySelector("#react");
				const fiber = elem && Object.values(elem)[0];
				if (!fiber?.updateQueue?.baseState?.element?.props?.game)
					throw new Error("React not mounted!");
				return fiber.updateQueue.baseState.element.props.game as Game;
			}
			return method1() ?? method2();
		});
	},

	get Game() {
		return initOrR(_Game, () => {
			return Miniblox.game.constructor as typeof Game;
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
