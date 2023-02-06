import { LiteContext, LiteNodeDef, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { LiteVector } from "../LiteValue";

export class EquidistantAzimuthalProjectionNode {
	static definition: LiteNodeDef = {
		type: "EquidistantAzimuthalProjectionNode",
		inputs: {
			position: {
				type: "vector",
				description: "Input vector",
				default: [0, 0, 0, 0]
			},

			translate: {
				type: "vector",
				description: "Translates the output",
				default: [0, 0, 0, 0]
			},

			scale: {
				type: "vector",
				description: "Scale of the output",
				default: [1, 1, 0, 0]
			}
		},
		outputs: {
			value: "vector"
		},
	}

	compute(
		context: LiteContext,
		input:  NodeInput<typeof EquidistantAzimuthalProjectionNode.definition>
	): NodeOutput<typeof EquidistantAzimuthalProjectionNode.definition> {
		const translateBy = input.translate.asVector()
		const scaleBy = input.scale.asVector()

		const {x,y,z} = input.position.asVector()

		const r = Math.sqrt(x*x + y*y + z*z);
		const theta = Math.acos(z / r);
		const phi = Math.atan2(y, x);

		const projectedX = theta * Math.cos(phi);
		const projectedY = theta * Math.sin(phi);

		return {
			value: new LiteVector(projectedX, projectedY, 0, 0)
				.scale(...scaleBy.asArray())
				.translate(...translateBy.asArray()),
		}
	}
}

registerNode(EquidistantAzimuthalProjectionNode)
