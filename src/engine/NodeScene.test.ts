import { describe, expect, it } from "@jest/globals";
import { NodeScene } from "./NodeScene";
import { LiteNodeContext, NodeInput, NodeOutput } from "./LiteNode";
import { liteScalar, LiteScalar, LiteVector } from "./LiteValue";

describe("SceneNode", () => {
	it("supports basic function", () => {
		const scene = new NodeScene(frameId => frameId * 100)

		const node1 = scene.addNode(TestNode)
		const node2 = scene.addNode(TestNode)

		expect(node1.inputValues.scalar).toEqual(new LiteScalar(TestNode.definition.inputs.scalar.default))
		expect(node1.inputValues.vector).toEqual(new LiteVector(... TestNode.definition.inputs.vector.default))

		// Test basic connections
		node1.connectTo('scalar', node2, 'scalar')
		scene.nextFrame()

		node1.inputConstants.scalar = liteScalar(10)
		expect(node2.outputValues.scalar).toEqual(liteScalar(10))

		// Values shouldn't update between frames
		node1.inputConstants.scalar = liteScalar(20)
		expect(node2.outputValues.scalar).toEqual(liteScalar(10))

		// But on the next frame they should
		scene.nextFrame()
		expect(node2.outputValues.scalar).toEqual(liteScalar(20))
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
				default: [1,2,3,4]
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
		context: LiteNodeContext<typeof TestNode.definition>,
		inputs: NodeInput<typeof TestNode.definition>,
	): NodeOutput<typeof TestNode.definition> {
		return {
			scalar: inputs.scalar,
			vector: inputs.vector,
			function: inputs.function
		}
	}
}
