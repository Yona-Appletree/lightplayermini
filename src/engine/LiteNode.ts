import { LiteInputDef } from "./LiteInput";
import { LiteTypeSlugMap, LiteValue, LiteValueSlug } from "./LiteValue";
import { LiteOutputDef } from "./LiteOutput";
import { SceneNode } from "./LiteScene";

const nodeRegistrationMap = new Map<string, NodeRegistration<any>>()

export function registerNode<TDef extends LiteNodeDef>(
  registration: NodeRegistration<TDef>
) {
  nodeRegistrationMap.set(
    registration.definition.type,
    registration
  )
}

export interface NodeRegistration<TDef extends LiteNodeDef> {
  definition: TDef

  new(): LiteNodeInstance<TDef>
}

export interface LiteNodeContext {
  frameStartMs: number;
}

export interface LiteNodeDef {
  readonly type: string,
  readonly description?: string,
  readonly inputs: Readonly<Record<string, LiteInputDef>>,
  readonly outputs: Readonly<Record<string, LiteOutputDef>>,
}

export interface LiteNodeInstance<TDef extends LiteNodeDef> {
  TDef?: TDef

  init?(context: LiteNodeContext): void

  update(
    context: LiteNodeContext,
    inputs: NodeInput<TDef>
  ): NodeOutput<TDef>

  customUi?(
    context: SceneNode<TDef>
  ): JSX.Element
}

export interface LiteOutputRef {
  nodeId: string;
  outputName: string;
}

export function nodeConnectionIdFor(nodeId: string, inputName: string) {
  return nodeId + "$" + inputName
}

export type NodeInput<TDef extends LiteNodeDef> = Record<keyof TDef['inputs'], LiteValue>
export type NodeOutput<TDef extends LiteNodeDef> = {
  [P in keyof TDef['outputs']]: TDef['outputs'][P] extends LiteValueSlug
    ? LiteTypeSlugMap[TDef['outputs'][P]]
    : TDef['outputs'][P] extends { type: LiteValueSlug }
      ? LiteTypeSlugMap[TDef['outputs'][P]['type']]
      : never
}
