import { math, u128 } from "near-sdk-as";

export const ONE_NEAR = u128.from("1000000000000000000000000");

export function asNEAR(amount: u128): string {
  return u128.div(amount, ONE_NEAR).toString();
}

export function toYocto(amount: number): u128 {
  return u128.mul(ONE_NEAR, u128.from(amount))
}

export function hash(value: string): u32 {
  return math.hash32<string>(value);
}