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

export interface LiteContext {
	currentTimeMs(): number;
}

export interface LiteNodeDef {
	type: string,
	description?: string,
	inputs: Record<string, LiteInputDef>,
	outputs: Record<string, LiteOutputDef>,
}

export interface LiteNodeInstance<TDef extends LiteNodeDef> {
	init?(context: LiteContext): void
	compute(
		context: LiteContext,
		inputs: NodeInput<TDef>
	): NodeOutput<TDef>
}

export interface LiteNodeConnection {
	fromNodeId: string;
	fromOutputId: string;

	toNodeId: string;
	toInputId: string;
}

export function nodeConnectionIdFor(connection: LiteNodeConnection) {
	return [
		connection.fromNodeId,
		connection.fromOutputId,
		connection.toNodeId,
		connection.toInputId,
	].join(",")
}

export type NodeInput<TDef extends LiteNodeDef> = Record<keyof TDef['inputs'], LiteValue>
export type NodeOutput<TDef extends LiteNodeDef> = Record<keyof TDef['outputs'], LiteValue>
