import { BlockPos } from "./blockpos";
import { Entity } from "./entity";
import { PBItemStack } from "./packets";

declare class PlayerController {
    prevBlock: undefined;
    lastBreakSoundPlay: number;
    key: {
        leftClick: number;
    };
    rightClick: boolean;
    objectMouseOver: RayTraceResult;
    rightClickDelayTimer: number;
    currBreakingLocation: any;
    reset(): void;
    getBlockReachDistance(): 5 | 4.5;
    leftClick(u: boolean): void;
    middleClick(u: boolean): void;
    rightClickMouse(): void;
    onPlayerRightClick(u: any, h: any, p: any, g: any, y: any, x: any): any;
    sendUseItem(u: any, h: any, p: any): boolean;
    windowClick(u: any, h: any, p: any, g: any, y: any): any;
    onStoppedUsingItem(u: any): void;
    select(): void;
    punch(): boolean | undefined;
    attackEntity(u: Entity): void;
    interactWithEntitySendPacket(u: any, h: any): boolean;
    findHotbarSlotForPickBlock(u: PBItemStack): number;
    getTargetedBlockCoords(): BlockPos;
    getTargetedBlockState(): BlockState;
    getScreenLookVector(): unknown;
    updateMouseOver(): void;
    pickBlock(): void;
    mine(u?: unknown): void;
    dropItem(u?: boolean): void;
    update(): void;
    render(): void;
}
