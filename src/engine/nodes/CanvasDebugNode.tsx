import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { SceneNode } from "../LiteScene";
import { createRef, useEffect } from "react";
import { liteVec } from "../LiteValue";
import { mapLinear } from "three/src/math/MathUtils";

export class CanvasDebugNode implements LiteNodeInstance<typeof CanvasDebugNode.definition> {
  static definition = {
    type: "CanvasDebugNode",
    inputs: {
      func: {
        type: "function",
      },
      minX: {
        type: "scalar",
        default: -1
      },
      maxX: {
        type: "scalar",
        default: 1
      },
      minY: {
        type: "scalar",
        default: -1
      },
      maxY: {
        type: "scalar",
        default: 1
      },
    },
    outputs: {
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof CanvasDebugNode.definition>
  ): NodeOutput<typeof CanvasDebugNode.definition> {
    return {}
  }

  customUi(sceneNode: SceneNode<typeof CanvasDebugNode.definition>): JSX.Element {
    return <CanvasDebugNodeUi sceneNode={sceneNode}></CanvasDebugNodeUi>
  }
}

registerNode(CanvasDebugNode)

export function CanvasDebugNodeUi(
  props: {
    sceneNode: SceneNode<typeof CanvasDebugNode.definition>
  }
) {
  const {sceneNode} = props
  const canvasRef = createRef<HTMLCanvasElement>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (! canvas) return

    const ctx = canvas.getContext('2d')
    if (! ctx) return

    const {width, height} = canvas

    const minX = sceneNode.inputValues.minX.asScalar()
    const minY = sceneNode.inputValues.minY.asScalar()
    const maxX = sceneNode.inputValues.maxX.asScalar()
    const maxY = sceneNode.inputValues.maxY.asScalar()
    const func = sceneNode.inputValues.func.asFunction().func

    const imageData = ctx.createImageData(width, height )
    for (let y=0, i=0; y<height; y++) {
      for (let x = 0; x < width; x++, i+=4) {
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = func(liteVec(
          mapLinear(x, 0, width, minX, maxX),
          mapLinear(y, 0, height, minY, maxY),
          0,
          0
        )).asScalar() * 255
        imageData.data[i+3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
  })

  return <canvas ref={canvasRef}></canvas>
}
