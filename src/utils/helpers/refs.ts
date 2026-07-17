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
	PBVector3,
	PlayerController,
	PlayerControllerMP,
} from "@wq2/miniblox-sdk";
import type { BoxGeometry, Mesh, Vector3 } from "three";
import mappings from "../mapping/mappings";
import remapObj from "./remapProxy";
import { getInheritanceTree, HasProto } from "./tree";

// search for exposed globals: `globalThis\.\w+ = `
// note: you could also search for window, but there's a bunch of false positives for stuff like onbeforeunload

// biome-ignore lint/complexity/noStaticOnlyClass: job
class Refs {
	// all of these variables are just for caching.
	static #game: Game;
	static #world?: ClientWorld;
	static #player: ClientEntityPlayer;
	static #chat: Chat;
	static #PBVector3: typeof PBVector3;
	static #BlockPos: typeof BlockPos;
	static #EnumFacing: typeof EnumFacing;
	// TODO: ts like really annoying so uh maybe a better solution?
	static #EntityLivingBase: typeof EntityLivingBase;
	// for PlayerController, use `game.controller`
	static #playerController: PlayerController;
	static #playerControllerMP: PlayerControllerMP;
	static #Materials: typeof Materials;
	// static #Items: typeof Items;
	static #ItemBlock: typeof ItemBlock;
	static #ItemSword: typeof ItemSword;
	static #ItemStack: typeof ItemStack;
	static #ItemBow: typeof ItemBow;
	static #hud3D: Hud3D;
	static #Blocks: AllBlocks;
	static #ItemArmor: typeof ItemArmor;
	static #Items: typeof Items;
	static #Enchantments: typeof Enchantments;

	static #initOrR<T>(field: T, initializer: () => Awaited<T>) {
		field ??= initializer();
		return field;
	}

	static get Items(): typeof Items {
		return Refs.#initOrR(
			Refs.#Items,
			() =>
				(globalThis as typeof globalThis & { Items: typeof Items })
					.Items,
		);
	}

	static get ItemSword(): typeof ItemSword {
		return Refs.#initOrR(
			Refs.#ItemSword,
			() => Refs.Items.iron_sword.constructor as typeof ItemSword,
		);
	}
	static get ItemArmor(): typeof ItemArmor {
		return Refs.#initOrR(
			Refs.#ItemArmor,
			() => Refs.Items.iron_boots.constructor as typeof ItemArmor,
		);
	}

	static get ItemStack(): typeof ItemStack {
		return Refs.#initOrR(
			Refs.#ItemStack,
			() =>
				(
					globalThis as typeof globalThis & {
						ItemStack: typeof ItemStack;
					}
				).ItemStack,
		);
	}

	static get ItemBow(): typeof ItemBow {
		return Refs.#initOrR(
			Refs.#ItemBow,
			() => Refs.Items.bow.constructor as typeof ItemBow,
		);
	}

	static get Enchantments(): typeof Enchantments {
		throw new Error(
			"TODO: get Enchantements object, note that Enchantment is exposed and has a list for those",
		);
		/*return Refs.#initOrR(Refs.#Enchantments, () =>
			Interop.run((e) => e<typeof Enchantments>("Enchantments")),
		);*/
	}

	static get Blocks(): AllBlocks {
		return Refs.#initOrR(
			Refs.#Blocks,
			() =>
				(globalThis as typeof globalThis & { Blocks: AllBlocks })
					.Blocks,
		);
	}

	static get Materials() {
		return undefined;
		/*return Refs.#initOrR(Refs.#Materials, () =>
			Interop.run((e) => e<typeof Materials>("Materials")),
		);*/
	}
	static get ItemBlock() {
		return Refs.#initOrR(
			Refs.#ItemBlock,
			() => Refs.Blocks.stone.constructor,
		);
	}
	static get hud3D() {
		// TODO: get hud3D object?
		throw new Error("TODO: get hud3D object");
		//return Refs.#initOrR(Refs.#hud3D, () => Refs.game);
	}

	/**
	 * Just `game.controller` with the remap proxy applied
	 */
	static get playerController() {
		return Refs.#initOrR(Refs.#playerController, () =>
			remapObj(Refs.game.controller, mappings.playerController),
		);
	}

	static get playerControllerMP() {
		return Refs.#initOrR(Refs.#playerControllerMP, () =>
			remapObj(
				Interop.run((e) => e<PlayerControllerMP>("playerControllerMP")),
				mappings.playerControllerMP,
			),
		);
	}

	static get BlockPos() {
		return Refs.#initOrR(Refs.#BlockPos, () =>
			Interop.run((e) => e<typeof BlockPos>("BlockPos")),
		);
	}

	static get EnumFacing() {
		return Refs.#initOrR(Refs.#EnumFacing, () =>
			Interop.run((e) => e<typeof EnumFacing>("EnumFacing")),
		);
	}

	static get EntityLivingBase() {
		return Refs.#initOrR(Refs.#EntityLivingBase, () =>
			Array.from(
				getInheritanceTree(Refs.player as unknown as HasProto),
			).find((x) => {
				return (
					"sprintingSpeedBoostModifier" in x &&
					"nextEntityID" in x &&
					typeof x === "number"
				);
			}),
		);
	}

	static get PBVector3() {
		return Refs.#initOrR(Refs.#PBVector3, () =>
			Interop.run((e) => e<typeof PBVector3>("PBVector3")),
		);
	}

	/**
	 * Prefer using some of the getters in here instead of from this game object,
	 * since some of them have a remapper proxy added, which automatically remaps non-obfuscated symbol names to their dumped version,
	 * which you would have to do manually by indexing dumps and casting to `as "originalName"` so you get the typings.
	 * | `game.` version      | `Refs` version        | Auto remapping |
	 * |----------------------|-----------------------|----------------:|
	 * | Refs.game.player     | Refs.player           | ✅              |
	 * | Refs.game.world      | Refs.world            | ✅              |
	 * | Refs.game.controller | Refs.playerController | ✅              |
	 * | Refs.game.chat       | Refs.chat             | Not needed      |
	 */
	static get game() {
		return Refs.#initOrR(Refs.#game, () => {
			const elem = document.querySelector("#react")!;
			return Object.values(elem)[0].updateQueue.baseState.element.props
				.game as Game;
		});
	}

	static get ClientSocket() {
		// TODO: get client socket object
		return undefined;
		/*return Refs.#initOrR(Refs.#clientSocket, () =>
			Interop.run((e) => e("ClientSocket")),
		);*/
	}

	/** Refs.game.world with a remap proxy applied */
	static get world() {
		return Refs.#initOrR(Refs.#world, () =>
			remapObj(Refs.game.world, mappings.world),
		);
	}

	/** Convenience reference to Refs.game.chat */
	static get chat() {
		return Refs.#initOrR(Refs.#chat, () => Refs.game.chat);
	}

	/** Refs.game.player with a remap proxy applied */
	static get player() {
		return Refs.#initOrR(Refs.#player, () =>
			remapObj(Refs.game.player, mappings.ClientEntityPlayer),
		);
	}
}

export default Refs;
