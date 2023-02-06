import { LiteContext, LiteNodeDef, registerNode } from "../LiteNode";
import { liteScalar, LiteScalar, LiteValue } from "../LiteValue";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";

const noise = new SimplexNoise()

export class NoiseNode {
	static definition: LiteNodeDef = {
		type: "NoiseNode",
		inputs: {
			position: {
				type: "vector",
				default: [0, 0, 0, 0]
			}
		},
		outputs: {
			value: "scalar"
		},
	}

	compute(
		context: LiteContext,
		input: {
			position: LiteValue
		}
	): {
		value: LiteScalar
	} {
		const pos = input.position.asVector()

		return {
			value: liteScalar(noise.noise4d(
				pos.x,
				pos.y,
				pos.z,
				pos.a,
			)),
		}
	}
}

registerNode(NoiseNode)
