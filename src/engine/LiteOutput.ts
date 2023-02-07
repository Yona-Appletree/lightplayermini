import { LiteValueSlug } from "./LiteValue";

export type LiteOutputDef = {
  type: LiteValueSlug
  description?: string
} | LiteValueSlug
