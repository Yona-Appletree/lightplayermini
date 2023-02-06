import { LiteInputDef } from "./LiteInput";
import { LiteValue } from "./LiteValue";
import { LiteOutputDef } from "./LiteOutput";

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

export interface LiteNodeContext<TDef extends LiteNodeDef> {
	frameStartMs(): number;
}

export interface LiteNodeDef {
	readonly type: string,
	readonly description?: string,
	readonly inputs: Readonly<Record<string, LiteInputDef>>,
	readonly outputs: Readonly<Record<string, LiteOutputDef>>,
}

export interface LiteNodeInstance<TDef extends LiteNodeDef> {
	TDef?: TDef

	init?(context: LiteNodeContext<TDef>): void
	update(
		context: LiteNodeContext<TDef>,
		inputs: NodeInput<TDef>
	): NodeOutput<TDef>
}

export interface LiteOutputRef {
	nodeId: string;
	outputName: string;
}

export function nodeConnectionIdFor(nodeId: string, inputName: string) {
	return nodeId + "$" + inputName
}

export type NodeInput<TDef extends LiteNodeDef> = Record<keyof TDef['inputs'], LiteValue>
export type NodeOutput<TDef extends LiteNodeDef> = Record<keyof TDef['outputs'], LiteValue>
