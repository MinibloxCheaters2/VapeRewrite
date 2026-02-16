// GameMode and Abilities extracted from Impact

export declare class GameMode {
	static readonly SURVIVAL: GameMode;
	static readonly CREATIVE: GameMode;
	static readonly ADVENTURE: GameMode;
	static readonly SPECTATOR: GameMode;

	static fromId(id: string | number): GameMode;
	static fromName(name: string): GameMode;

	getId(): number;
	getName(): string;
	isSurvivalOrAdventure(): boolean;
	isCreative(): boolean;
	isSurvival(): boolean;
	isAdventure(): boolean;
	isSpectator(): boolean;
}

export class Abilities {
	disableDamage: boolean;
	isFlying: boolean;
	allowFlying: boolean;
	isCreativeMode: boolean;
	allowEdit: boolean;
	flySpeed: number;
	walkSpeed: number;

	getFlySpeed(): number;
	setFlySpeed(speed: number): void;
	getWalkSpeed(): number;
	setPlayerWalkSpeed(speed: number): void;
}
