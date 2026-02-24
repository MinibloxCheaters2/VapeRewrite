import type { EntityPlayer } from "./entity";

export declare class Team {
	color: string;
	members: EntityPlayer[];
	friendlyFire: boolean;
	prefix: string;
	name: string;
	displayName?: string;
	constructor(name: string, displayName?: string);
	isEqual(other: Team): boolean;
	getName(): this["name"];
	getDisplayName(): this["displayName"] extends undefined
		? this["name"]
		: this["displayName"];
	setDisplayName(displayName?: string): void;
	setPrefix(prefix: string): void;
	addMember(member: EntityPlayer): void;
	removeMember(member: EntityPlayer): void;
	empty(): void;
	setColor(color: string): void;
	setFriendlyFire(friendlyFire: boolean): void;
	canAttack(otherTeam: Team): boolean;
}
