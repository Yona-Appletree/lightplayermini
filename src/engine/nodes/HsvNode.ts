import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { liteHsv } from "../LiteValue";

const noise = new SimplexNoise()

export class VectorNode implements LiteNodeInstance<typeof VectorNode.definition> {
  static definition = {
    type: "VectorNode",
    inputs: {
      h: {
        type: "scalar",
        default: 0,
      },
      s: {
        type: "scalar",
        default: 1.0,
      },
      v: {
        type: "scalar",
        default: 1.0,
      },
    },
    outputs: {
      result: "hsv"
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof VectorNode.definition>
  ): NodeOutput<typeof VectorNode.definition> {
    return {
      result: liteHsv(
        inputs.h.asScalar(),
        inputs.s.asScalar(),
        inputs.v.asScalar(),
      )
    }
  }
}

registerNode(VectorNode)
