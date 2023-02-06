import {
	LiteContext,
	LiteNodeConnection,
	LiteNodeDef,
	LiteNodeInstance,
	nodeConnectionIdFor,
	NodeRegistration
} from "./LiteNode";
import { LiteVector } from "./LiteValue";

export class NodeScene implements LiteContext {
	nodeMap = new Map<string, SceneNode<any>>()
	nodeConnectionMap = new Map<string, LiteNodeConnection>()

	addNode<TDef extends LiteNodeDef>(
		reg: NodeRegistration<TDef>
	): SceneNode<TDef> {
		const node = new SceneNode<TDef>(
			this,
			this.nextIdFor(reg.definition),
			reg.definition,
			new reg()
		)

		node.instance.init?.(this)

		return node
	}

	connectNodes<TFromDef extends LiteNodeDef, TToDef extends LiteNodeDef>(
		fromNode: SceneNode<TFromDef>,
		fromOutputId: keyof TFromDef["outputs"],

		toNode: SceneNode<TToDef>,
		toInputId: keyof TToDef["inputs"],
	) {
		const connection: LiteNodeConnection = {
			fromNodeId: fromNode.id,
			fromOutputId: String(fromOutputId),
			toNodeId: toNode.id,
			toInputId: String(toInputId),
		}

		this.nodeConnectionMap.set(
			nodeConnectionIdFor(connection),
			connection
		)
	}

	currentTimeMs(): number {
		return Date.now();
	}

	nextIdFor(def: LiteNodeDef): string {
		let num = -1
		let nextId: string

		do {
			num ++
			nextId = def.type + "-" + String(num)
		} while (this.nodeMap.has(nextId))

		return nextId
	}
}

export class SceneNode<TDef extends LiteNodeDef> {
	public uiPos = new LiteVector(0, 0, 0, 0)

	constructor(
		public readonly scene: NodeScene,
		public readonly id: string,
		public readonly def: TDef,
		public readonly instance: LiteNodeInstance<TDef>
	) {}


}

