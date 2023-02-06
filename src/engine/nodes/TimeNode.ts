import { LiteContext, registerNode } from "../LiteNode";
import { liteScalar, LiteScalar } from "../LiteValue";

export class TimeMsNode {
	static definition = {
		type: "timeMs",
		inputs: {},
		outputs: {
			value: "scalar"
		},
	} as const

	compute(
		context: LiteContext,
		input: {}
	): {
		value: LiteScalar
	} {
		return {
			value: liteScalar(context.currentTimeMs()),
		}
	}
}

registerNode(TimeMsNode)
