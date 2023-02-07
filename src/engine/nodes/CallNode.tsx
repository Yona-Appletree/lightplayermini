import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";

const noise = new SimplexNoise()

export class CallNode implements LiteNodeInstance<typeof CallNode.definition> {
  static definition = {
    type: "CallNode",
    inputs: {
      func: {
        type: "function",
      },
      argument: {
        type: "any",
      }
    },
    outputs: {
      result: "any"
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof CallNode.definition>
  ): NodeOutput<typeof CallNode.definition> {
    const func = inputs.func.asFunction().func
    const input = inputs.argument

    return {
      result: func(input)
    }
  }
}

registerNode(CallNode)
