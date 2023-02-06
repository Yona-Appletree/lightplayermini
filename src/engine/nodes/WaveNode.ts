import { LiteNodeContext, LiteNodeDef, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { LiteFunction, liteScalar } from "../LiteValue";

export class WaveNode implements LiteNodeInstance<typeof WaveNode.definition> {
	static definition: LiteNodeDef = {
		type: "WaveNode",
		inputs: {
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
			sine: "function"
		},
	} as const

	update(
		context: LiteNodeContext<typeof WaveNode.definition>,
		inputs: NodeInput<typeof WaveNode.definition>
	): NodeOutput<typeof WaveNode.definition> {
		const period = inputs.period.asScalar().value
		const min = inputs.min.asScalar().value
		const max = inputs.max.asScalar().value

		return {
			sine: new LiteFunction(
				value => liteScalar(min + ((Math.sin(value.asNumber() * ((Math.PI * 2) / period))+1)/2) * (max - min))
			)
		}
	}
}

registerNode(WaveNode)
