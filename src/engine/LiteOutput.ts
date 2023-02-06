import { LiteTypeSlug } from "./LiteValue";

export type LiteOutputDef = {
	type: LiteTypeSlug
	description?: string
} | LiteTypeSlug
