import {
	LiteNodeContext,
	LiteNodeDef,
	LiteNodeInstance,
	LiteOutputRef,
	NodeOutput,
	NodeRegistration
} from "./LiteNode";
import { LiteValue, LiteVector } from "./LiteValue";
import { inputDefaultValueFor } from "./LiteInput";

export class NodeScene {
	private nodeMap = new Map<string, SceneNode<any>>()

	public currentFrameId = 0
	public lastFrameMs: number
	public currentFrameMs: number

	constructor(
		private readonly timeProvider: (frameId: number) => number
	) {
		this.lastFrameMs = timeProvider(0)
		this.currentFrameMs = timeProvider(0)
	}

	addNode<TDef extends LiteNodeDef>(
		reg: NodeRegistration<TDef>
	): SceneNode<TDef> {
		const node = new SceneNode<TDef>(
			this,
			this.nextIdFor(reg.definition),
			reg.definition,
			new reg()
		)

		this.nodeMap.set(node.id, node)

		return node
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

	requireNode(nodeId: string): SceneNode<any> {
		const node = this.nodeMap.get(nodeId)
		if (! node) throw new Error("Invalid node id" + nodeId)

		return node
	}

	nextFrame() {
		this.currentFrameId ++
		this.lastFrameMs = this.currentFrameMs
		this.currentFrameMs = this.timeProvider(this.currentFrameId)
	}
}

export class SceneNode<TDef extends LiteNodeDef> implements LiteNodeContext<TDef> {
	public uiPos = new LiteVector(0, 0, 0, 0)
	private lastUpdateFrameId: number | null = null
	private currentOutputValues: NodeOutput<TDef> | null = null

	public readonly inputConnections: Partial<Record<keyof TDef["inputs"], LiteOutputRef>> = {}

	public readonly inputConstants: Partial<Record<keyof TDef["inputs"], LiteValue>> = {}

	private inputFrameCache: Partial<Record<keyof TDef["inputs"], LiteValue>> = {}

	public readonly inputValues = (() => {
		const _this = this;

		return new Proxy({}, {
			get(target: {}, p: string | symbol, receiver: any): any {
				if (typeof p === 'string') {
					return _this.inputValue(p)
				}
			}
		})
	})() as Readonly<Record<keyof TDef["inputs"], LiteValue>>

	public readonly outputValues = (() => {
		const _this = this;

		return new Proxy({}, {
			get(target: {}, p: string | symbol): any {
				if (typeof p === 'string') {
					return _this.outputValue(p)
				}
			}
		})
	})() as Readonly<Record<keyof TDef["outputs"], LiteValue>>

	constructor(
		public readonly scene: NodeScene,
		public readonly id: string,
		public readonly def: TDef,
		public readonly instance: LiteNodeInstance<TDef>
	) {}

	connectTo<TOtherDef extends LiteNodeDef>(
		outputName: keyof TDef["outputs"],
		toNode: SceneNode<TOtherDef>,
		toInput: keyof TOtherDef["inputs"]
	) {
		toNode.inputConnections[toInput] = {
			nodeId: this.id,
			outputName: String(outputName)
		}
	}

	frameStartMs(): number {
		return this.scene.currentFrameMs
	}

	private inputValue(name: keyof TDef["inputs"]): LiteValue {
		if (name in this.inputFrameCache) return this.inputFrameCache[name]!

		let value: LiteValue | null = null

		const connection = this.inputConnections[name]
		if (connection != null) {
			value = this.scene.requireNode(connection.nodeId)
				.outputValue(connection.outputName)
		}

		if (! value) {
			value = this.inputConstants[name] ?? null
		}

		if (! value) {
			value = inputDefaultValueFor(this.def.inputs[name])
		}

		this.inputFrameCache[name] = value
		return value
	}

	private ensureOutputs(): NodeOutput<TDef> {
		if (this.lastUpdateFrameId != this.scene.currentFrameId || this.currentOutputValues == null) {
			if (this.lastUpdateFrameId === null) {
				this.instance.init?.(this)
			}

			this.inputFrameCache = {}
			this.currentOutputValues = this.instance.update(this, this.inputValues)
			this.lastUpdateFrameId = this.scene.currentFrameId
		}

		return this.currentOutputValues
	}

	private outputValue(name: keyof TDef["outputs"]): LiteValue {
		const value = this.ensureOutputs()[name]

		if (! value) {
			throw new Error(`Output ${String(name)} wasn't provided by ${this.debugIdString}`)
		}

		return value
	}

	get debugIdString() {
		return `${this.def.type}(id=${this.id})`
	}
}

