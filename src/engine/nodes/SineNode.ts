import { LiteContext, LiteNodeDef, LiteNodeInstance, NodeInput, registerNode } from "../LiteNode";
import { liteScalar, LiteScalar } from "../LiteValue";

export class SineNode implements LiteNodeInstance<typeof SineNode.definition> {
	static definition: LiteNodeDef = {
		type: "SineNode",
		inputs: {
			value: {
				type: "scalar",
				default: 0
			},

			period: {
				type: "scalar",
				description: "Period of the sine wave",
				default: Math.PI * 2,
				min: 0,
			},

			min: {
				type: "scalar",
				description: "Minimum output value",
				default: 0
			},

			max: {
				type: "scalar",
				description: "Maximum output value",
				default: 1
			}
		},
		outputs: {
			value: "scalar"
		},
	} as const

	compute(
		context: LiteContext,
		input: NodeInput<typeof SineNode.definition>
	): {
		value: LiteScalar
	} {
		const value = input.value.asScalar().value
		const period = input.period.asScalar().value
		const min = input.min.asScalar().value
		const max = input.max.asScalar().value

		return {
			value: liteScalar(min + ((Math.sin(value * ((Math.PI * 2) / period))+1)/2) * (max - min))
		}
	}
}

registerNode(SineNode)
