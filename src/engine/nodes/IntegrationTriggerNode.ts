import { LiteContext, LiteNodeDef, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { liteScalar, LiteScalar } from "../LiteValue";

export class IntegrationTriggerNode implements LiteNodeInstance<typeof IntegrationTriggerNode.definition> {
	static definition: LiteNodeDef = {
		type: "IntegrationTriggerNode",
		inputs: {
			value: {
				type: "scalar",
				default: 0
			},

			decayRate: {
				type: "scalar",
				description: "Rate of decay for this node, in units/second",
				default: 1,
				min: 0,
			},

			triggerValue: {
				type: "scalar",
				description: "Value at which point this node should trigger",
				default: 0
			},
		},
		outputs: {
			lastTriggerMs: {
				type: "scalar",
				description: "Last time this node triggered"
			}
		},
	} as const

	private sum = 0

	private lastTriggerMs = NaN

	private lastComputeMs: number | null = null

	compute(
		context: LiteContext,
		input: NodeInput<typeof IntegrationTriggerNode.definition>
	): NodeOutput<typeof IntegrationTriggerNode.definition> {
		this.sum += input.value.asNumber()

		if (this.lastComputeMs != null) {
			const durationMs = context.currentTimeMs() - this.lastComputeMs
			this.sum -= (durationMs/1000) * input.decayRate.asNumber()
		}

		this.lastComputeMs = context.currentTimeMs()

		if (this.sum < 0) this.sum = 0

		const inputTriggerValue = input.triggerValue.asNumber()
		if (this.sum > inputTriggerValue) {
			this.sum -= inputTriggerValue
			this.lastTriggerMs = context.currentTimeMs()
		}

		return {
			lastTriggerMs: liteScalar(this.lastTriggerMs)
		}
	}
}

registerNode(IntegrationTriggerNode)
