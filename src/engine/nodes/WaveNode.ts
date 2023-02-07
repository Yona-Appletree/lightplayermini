import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { LiteFunction, liteScalar } from "../LiteValue";

export class WaveNode implements LiteNodeInstance<typeof WaveNode.definition> {
  static definition = {
    type: "WaveNode",
    inputs: {
      period: {
        type: "scalar",
        description: "Period of the sine wave",
        default: 1,
        min: 0,
      },

      min: {
        type: "scalar",
        description: "Minimum output value",
        default: 0
      },

      max: {
        type: "scalar",
        description: "Maximum output value",
        default: 1
      },

      offset: {
        type: "scalar",
        description: "Offset the input value by the given amount",
        default: 0
      }
    },
    outputs: {
      sine: "function",
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof WaveNode.definition>
  ): NodeOutput<typeof WaveNode.definition> {
    const period = inputs.period.asScalar()
    const min = inputs.min.asScalar()
    const max = inputs.max.asScalar()
    const offset = inputs.offset.asScalar()

    const sineFn = new LiteFunction(
      value => liteScalar(min + ((Math.sin((value.asScalar() + offset) * ((Math.PI * 2) / period)) + 1) / 2) * (max - min))
    )

    return {
      sine: sineFn,
    }
  }
}

registerNode(WaveNode)
