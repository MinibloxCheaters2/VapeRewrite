declare enum GameModeId {
  SURVIVAL,
  CREATIVE,
  ADVENTURE,
  SPECTATOR,
}

declare class Abilities {
  invulnerable: boolean;
  mayFly: boolean;
  flying: boolean;
  creative: boolean;
  mayEdit: boolean;
  flySpeed: number;
  walkSpeed: number;
  writeCapabilitiesToNBT(nbt: unknown): void;
  readCapabilitiesFromNBT(nbt: unknown): void;
  getFlySpeed(): number;
  setFlySpeed(flySpeed: number): void;
  getWalkSpeed(): number;
  setPlayerWalkSpeed(walkSpeed: number): void;
}

export class GameMode {
  static SURVIVAL: GameMode;
  static CREATIVE: GameMode;
  static ADVENTURE: GameMode;
  static SPECTATOR: GameMode;
  static ID_TO_GAMEMODE_MAP: Record<string, GameMode>;
  id: GameModeId;
  constructor(u: GameModeId);
  static updatePlayerAbilities(u: Abilities, h: GameMode): void;
  updatePlayerAbilities(u: Abilities): void;
  isBlockPlacingRestricted(): boolean;
  isCreative(): boolean;
  isSurvival(): boolean;
  isSpectator(): boolean;
  static fromId(u: string): GameMode | undefined;
  toId(): this["id"];
}
