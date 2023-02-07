import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { LiteFunction, liteScalar } from "../LiteValue";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";

const noise = new SimplexNoise()

export class NoiseNode implements LiteNodeInstance<typeof NoiseNode.definition> {
  static definition = {
    type: "NoiseNode",
    inputs: {
      translate: {
        type: "vector",
        default: [],
      },
      scale: {
        type: "vector",
        default: [1,1,1,1],
      }
    },
    outputs: {
      noise4: "function"
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof NoiseNode.definition>
  ): NodeOutput<typeof NoiseNode.definition> {
    const scaleBy = inputs.scale.asVector()
    const translateBy = inputs.translate.asVector()

    return {
      noise4: new LiteFunction(value => {
        const pos = value.asVector().scale(...scaleBy.elements).translate(...translateBy.elements)
        return liteScalar(noise.noise4d(
          pos.x,
          pos.y,
          pos.z,
          pos.a,
        ))
      }),
    }
  }
}

registerNode(NoiseNode)
