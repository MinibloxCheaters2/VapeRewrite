import type { Block, BlockPos } from "@wq2/miniblox-sdk";
import { Subscribe } from "@/event/Bus";
import { type BlockHandler, blockHandlers, handleInRange, withBlock } from "@/utils";
import Miniblox from "@/utils/refs/miniblox";
import Category from "../../api/Category";
import Mod from "../../api/Module";

export default class Breaker extends Mod {
	name = "Breaker";
	category = Category.MINIGAMES;
	#rangeSetting = this.createSliderSetting("Range", 4, 1, 4, 0.1);
	#breakEggsSetting = this.createToggleSetting("Eggs", true);
	// #breakBedsSetting = this.createToggleSetting("Beds", false);

	static #ATTEMPT_DELAY = 500;

	#attempts = new Map<string, number>();

	get #range() {
		return this.#rangeSetting.value();
	}

	get #breakEggs() {
		return this.#breakEggsSetting.value();
	}

	#couldBreakAnything() {
		return this.#breakEggs;
	}

	#attemptKey(pos: BlockPos): string {
		return `${pos.x},${pos.y},${pos.z}`;
	}

	#canAttempt(pos: BlockPos): boolean {
		const until = this.#attempts.get(this.#attemptKey(pos));
		return until === undefined || until <= Date.now();
	}

	@Subscribe("connect")
	private onConnect() {
		this.#attempts.clear();
	}

	protected override onEnable(): void {
		this.#attempts.clear();
	}

	static #eggStateId: number | undefined;

	static #getEggStateId(): number | undefined {
		if (this.#eggStateId !== undefined) return this.#eggStateId;
		const egg = Miniblox.Blocks.dragon_egg;
		for (const [state, id] of Miniblox.Blocks.blockStateToId) {
			if (state.getBlock() === egg) {
				this.#eggStateId = id;
				return id;
			}
		}
		return undefined;
	}

	#shouldBreakBlockPos(pos: BlockPos): boolean {
		const { world } = Miniblox;
		if (world === undefined) return false;
		const eggStateId = Breaker.#getEggStateId();
		if (eggStateId === undefined) return false;
		return Miniblox.Blocks.blockStateToId.get(world.getBlockState(pos)) === eggStateId;
	}

	#handlerForBlock(block: Block): BlockHandler {
		// TODO(Breaker): no one would want to really use breaker outside of EggWars,
		//  but we should add a sort of packet mine for this.
		return block === Miniblox.Blocks.dragon_egg
			? blockHandlers.rightClick
			: blockHandlers.breakBlock;
	}

	@Subscribe("playerTick")
	private onTick() {
		if (!this.#couldBreakAnything()) {
			this.toggleSilently();
			Miniblox.chat.addChat({
				text: "this goobener has breaker on but made it break NOTHING. Screw your module, I'm disabling it.",
			});
			return;
		}
		handleInRange(
			this.#range,
			(pos) => this.#canAttempt(pos) && this.#shouldBreakBlockPos(pos),
			(pos) => {
				this.#attempts.set(this.#attemptKey(pos), Date.now() + Breaker.#ATTEMPT_DELAY);
				withBlock(this.#handlerForBlock)(pos);
			},
		);
	}
}
