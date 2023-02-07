import { expect } from "@jest/globals";
import { LiteScene } from "./LiteScene";
import { LiteNodeContext, NodeInput, NodeOutput } from "./LiteNode";
import { LiteScalar, liteScalar, liteVec, LiteVector } from "./LiteValue";
import { TimeNode } from "./nodes/TimeNode";
import { WaveNode } from "./nodes/WaveNode";
import { CallNode } from "./nodes/CallNode";
import { NoiseNode } from "./nodes/NoiseNode";
import { CanvasDebugNode } from "./nodes/CanvasDebugNode";

describe("LiteScene", () => {
  it("sanity test", () => {
    const scene = new LiteScene(frameId => frameId * 100)

    const node1 = scene.addNode(TestNode)
    const node2 = scene.addNode(TestNode)

    expect(node1.inputValues.scalar).toEqual(new LiteScalar(TestNode.definition.inputs.scalar.default))
    expect(node1.inputValues.vector).toEqual(new LiteVector(...TestNode.definition.inputs.vector.default))

    // Test basic connections
    node1.connectTo('scalar', node2, 'scalar')
    scene.nextFrame()

    node1.inputConstants.scalar = liteScalar(10)
    expect(node2.outputs.scalar.value).toEqual(liteScalar(10))

    // Values shouldn't update between frames
    node1.inputConstants.scalar = liteScalar(20)
    expect(node2.outputs.scalar.value).toEqual(liteScalar(10))

    // But on the next frame they should
    scene.nextFrame()
    expect(node2.outputs.scalar.value).toEqual(liteScalar(20))
  })

  it("should handle function assignment", () => {
    const scene = new LiteScene(frameId => frameId * 1000)

    const timeNode = scene.addNode(TimeNode)
    const sineNode = scene.addNode(WaveNode, {
      period: liteScalar(20000),
      min: liteScalar(0),
      max: liteScalar(1),
    })

    const callNode = scene.addNode(CallNode, {
      argument: timeNode.outputs.frameStartMs,
      func: sineNode.outputs.sine
    })
    const noiseNode = scene.addNode(NoiseNode, {
      scale: callNode.outputs.result
    })

    const canvasNode = scene.addNode(CanvasDebugNode, {
      func: noiseNode.outputs.noise4
    })

    const value1 = canvasNode.inputValues.func.asFunction().func(liteVec(.5, .5)).asScalar()
    scene.nextFrame()
    const value2 = canvasNode.inputValues.func.asFunction().func(liteVec(.5, .5)).asScalar()

    expect(value1).not.toEqual(value2)

  })
})

export class TestNode {
  static definition = {
    type: "TestNode",
    inputs: {
      scalar: {
        type: "scalar",
        default: 1
      },
      vector: {
        type: "vector",
        default: [1, 2, 3, 4]
      },
      function: {
        type: "function",
      }
    },
    outputs: {
      scalar: "scalar",
      vector: "vector",
      function: "function"
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof TestNode.definition>,
  ): NodeOutput<typeof TestNode.definition> {
    return {
      scalar: liteScalar(inputs.scalar.asScalar()),
      vector: inputs.vector.asVector(),
      function: inputs.function.asFunction()
    }
  }
}
