import { LiteFunction, liteScalar, LiteTypeSlug, LiteValue, LiteVector } from "./LiteValue";
import { isArray } from "../util/isArray";

export interface BaseInputDef {
	readonly type: LiteTypeSlug
	readonly description?: string
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
	} | readonly [number, number, number, number]
}

export type LiteInputDef = ScalarInput | VectorInput | FunctionInput

const defaultCache = new WeakMap<LiteInputDef, LiteValue>()
export function inputDefaultValueFor(input: LiteInputDef): LiteValue {
	const cached = defaultCache.get(input)
	if (cached != null) return cached

	let value: LiteValue
	switch (input.type) {
		case "scalar": {
			value = liteScalar(input.default); break;
			break;
		}
		case "vector": {
			value = isArray(input.default)
				? new LiteVector(input.default[0], input.default[1], input.default[2], input.default[3])
				: new LiteVector(input.default.x, input.default.y, input.default.z, input.default.a)
			break
		}
		case "function": {
			value = new LiteFunction(value => value)
			break
		}
	}

	defaultCache.set(input, value)

	return value
}
