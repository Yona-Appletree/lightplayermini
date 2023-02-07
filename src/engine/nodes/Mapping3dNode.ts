import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { LiteArray, LiteValue } from "../LiteValue";

export class Mapping3dNode implements LiteNodeInstance<typeof Mapping3dNode.definition> {
  static definition = {
    type: "Mapping3dNode",
    description: "Maps points in 3d space to a 1-dimensional array",
    inputs: {
      ledLocations: {
        type: "array",
        description: "Mapping of 3d points (x,y,z) to 1-dimensional points"
      },

      colorFn: {
        type: "function",
        description: "Function providing colors for LEDs",
      },
    },
    outputs: {
      ledValues: "array"
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof Mapping3dNode.definition>
  ): NodeOutput<typeof Mapping3dNode.definition> {
    const ledLocations = inputs.ledLocations.asArray().value
    const colorFn = inputs.colorFn.asFunction().func

    const ledValues: LiteValue[] = []
    for (let i = 0; i < ledLocations.length; i++) {
      const locValue = ledLocations[i];
      const locVector = locValue.asVector()

      ledValues[i] = colorFn(
        locVector.withA(0)
      )
    }

    return {
      ledValues: new LiteArray(ledValues)
    }
  }
}

registerNode(Mapping3dNode)
