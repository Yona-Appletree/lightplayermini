import { LiteFunction, liteScalar, LiteValue, LiteValueSlug, LiteVector } from "./LiteValue";
import { isArray } from "../util/isArray";
import { LiteNodeDef, NodeInput } from "./LiteNode";

export interface BaseInputDef {
  readonly type: LiteValueSlug
  readonly description?: string
}
export interface AnyInput extends BaseInputDef {
  readonly type: "any"
}

export interface ScalarInput extends BaseInputDef {
  readonly type: "scalar"
  readonly default: number
  readonly min?: number
  readonly max?: number
}

export interface FunctionInput extends BaseInputDef {
  readonly type: "function"
}

export interface VectorInput extends BaseInputDef {
  readonly type: "vector"
  readonly default: {
    readonly x: number
    readonly y: number
    readonly z: number
    readonly a: number
  } | readonly [number?, number?, number?, number?]
}


export interface ArrayInput extends BaseInputDef {
  readonly type: "array"
}

export type LiteInputDef = AnyInput | ScalarInput | VectorInput | FunctionInput | ArrayInput

const defaultCache = new WeakMap<LiteInputDef, LiteValue>()

export function inputDefDefaultValue(input: LiteInputDef): LiteValue {
  const cached = defaultCache.get(input)
  if (cached != null) return cached

  let value: LiteValue
  switch (input.type) {
    case "any": {
      value = liteScalar(0);
      break;
    }
    case "scalar": {
      value = liteScalar(input.default);
      break;
    }
    case "vector": {
      value = isArray(input.default)
        ? new LiteVector(input.default[0] ?? 0, input.default[1] ?? 0, input.default[2] ?? 0, input.default[3] ?? 0)
        : new LiteVector(input.default.x, input.default.y, input.default.z, input.default.a)
      break
    }
    case "function": {
      value = new LiteFunction(value => value)
      break
    }
    case "array": {
      value = new LiteFunction(value => value)
      break
    }
  }

  defaultCache.set(input, value)

  return value
}

export function nodeDefDefaultInputValues<TDef extends LiteNodeDef>(
  def: TDef
): NodeInput<TDef> {
  const defaultValues: Record<string, LiteValue> = {}

  for (const [name, inputDef] of Object.entries(def.inputs)) {
    defaultValues[name] = inputDefDefaultValue(inputDef)
  }

  return defaultValues as NodeInput<TDef>
}
