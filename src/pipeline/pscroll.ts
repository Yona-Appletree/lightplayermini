import { PValue } from "./PValue";

export function pScrollVector(periodMs: { x?: number, y?: number, z?: number }): (v: PValue) => PValue {
  return input => input.asVector().translate(
    periodMs.x ? (Date.now() / periodMs.x) : 0,
    periodMs.y ? (Date.now() / periodMs.y) : 0,
    periodMs.z ? (Date.now() / periodMs.z) : 0,
  )
}
