import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { liteScalar } from "../LiteValue";

export class IntegrationTriggerNode implements LiteNodeInstance<typeof IntegrationTriggerNode.definition> {
  static definition = {
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

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof IntegrationTriggerNode.definition>
  ): NodeOutput<typeof IntegrationTriggerNode.definition> {
    this.sum += inputs.value.asScalar()

    if (this.lastComputeMs != null) {
      const durationMs = context.frameStartMs - this.lastComputeMs
      this.sum -= (durationMs / 1000) * inputs.decayRate.asScalar()
    }

    this.lastComputeMs = context.frameStartMs

    if (this.sum < 0) this.sum = 0

    const inputTriggerValue = inputs.triggerValue.asScalar()
    if (this.sum > inputTriggerValue) {
      this.sum -= inputTriggerValue
      this.lastTriggerMs = context.frameStartMs
    }

    return {
      lastTriggerMs: liteScalar(this.lastTriggerMs)
    }
  }
}

registerNode(IntegrationTriggerNode)
