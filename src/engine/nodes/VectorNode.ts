import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { liteVec } from "../LiteValue";

const noise = new SimplexNoise()

export class VectorNode implements LiteNodeInstance<typeof VectorNode.definition> {
  static definition = {
    type: "VectorNode",
    inputs: {
      x: {
        type: "scalar",
        default: 0,
      },
      y: {
        type: "scalar",
        default: 0,
      },
      z: {
        type: "scalar",
        default: 0,
      },
      a: {
        type: "scalar",
        default: 0,
      },

    },
    outputs: {
      result: "vector"
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof VectorNode.definition>
  ): NodeOutput<typeof VectorNode.definition> {
    return {
      result: liteVec(
        inputs.x.asNumber(),
        inputs.y.asNumber(),
        inputs.z.asNumber(),
        inputs.a.asNumber(),
      )
    }
  }
}

registerNode(VectorNode)
