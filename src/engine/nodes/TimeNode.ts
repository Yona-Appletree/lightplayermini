import { LiteNodeContext, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { liteScalar } from "../LiteValue";

export class TimeNode {
  static definition = {
    type: "TimeNode",
    inputs: {
      scale: {
        type: "scalar",
        default: 1.0
      }
    },
    outputs: {
      frameStartMs: "scalar"
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof TimeNode.definition>
  ): NodeOutput<typeof TimeNode.definition> {
    const scale = inputs.scale.asNumber()

    return {
      frameStartMs: liteScalar(context.frameStartMs * scale),
    }
  }
}

registerNode(TimeNode)
