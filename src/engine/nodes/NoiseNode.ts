import { LiteNodeContext, LiteNodeDef, NodeOutput, registerNode } from "../LiteNode";
import { LiteFunction, liteScalar, LiteScalar, LiteValue } from "../LiteValue";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";

const noise = new SimplexNoise()

export class NoiseNode {
	static definition: LiteNodeDef = {
		type: "NoiseNode",
		inputs: {},
		outputs: {
			noise4: "function"
		},
	}

	update(
		context: LiteNodeContext<typeof NoiseNode.definition>
	): NodeOutput<typeof NoiseNode.definition> {
		return {
			noise4: new LiteFunction(value => {
				const pos = value.asVector()
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
