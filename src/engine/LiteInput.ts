import { LiteTypeSlug } from "./LiteValue";

export interface BaseInputDef {
	type: LiteTypeSlug
	description?: string
}

export interface ScalarInput extends BaseInputDef {
	type: "scalar"
	default: number
	min?: number
	max?: number
}


export interface VectorInput extends BaseInputDef {
	type: "vector"
	default: {
		x: number
		y: number
		z: number
		a: number
	} | [number, number, number, number]
}

export type LiteInputDef = ScalarInput | VectorInput
