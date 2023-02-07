import { PValue } from "./PValue";

export type PipelineFn = (input: PValue) => PValue

export function pcombine(
  ...steps: PipelineFn[]
): PipelineFn {
  return value => {
    for (let step of steps) {
      value = step(value)
    }

    return value
  }
}


export function pScalarFn(
  fn: (input: number) => PValue
): PipelineFn {
  return input => fn(input.asScalar().value)
}
