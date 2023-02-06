import { LiteNodeContext, NodeOutput, registerNode } from "../LiteNode";
import { liteScalar } from "../LiteValue";

export class TimeNode {
	static definition = {
		type: "TimeNode",
		inputs: {},
		outputs: {
			frameStartMs: "scalar"
		},
	} as const

	update(
		context: LiteNodeContext<typeof TimeNode.definition>
	): NodeOutput<typeof TimeNode.definition> {
		return {
			frameStartMs: liteScalar(context.frameStartMs()),
		}
	}
}

registerNode(TimeNode)
