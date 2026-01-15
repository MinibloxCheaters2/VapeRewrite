import { EnumFacing } from "./facing";
import { Plane } from "./plane";

declare class Axis {
  name: string;
  index: number;
  plane: Plane;

  static readonly X: Axis;
  static readonly Y: Axis;
  static readonly Z: Axis;
  static readonly VALUES: Axis[];


  constructor(name: string, plane: Plane, index: number);
  equals(other: Axis): boolean;
  notEquals(other: Axis): boolean;
  inverseCrossProduct(): [EnumFacing, EnumFacing];
  static byName(name: string): Axis;
  toJSON(): this["name"];
  isVertical(): boolean;
  isHorizontal(): boolean;
  getPlane(): this["plane"];
}

declare class AxisDirection {
  static POSITIVE: AxisDirection;
  static NEGATIVE: AxisDirection;

  description: string;
  offset: number;

  constructor(offset: number, description: string);
  
}
