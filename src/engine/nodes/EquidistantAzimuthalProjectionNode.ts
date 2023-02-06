import { LiteNodeContext, LiteNodeDef, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { LiteFunction, LiteVector } from "../LiteValue";

export class EquidistantAzimuthalProjectionNode {
	static definition: LiteNodeDef = {
		type: "EquidistantAzimuthalProjectionNode",
		inputs: {
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
			project: "function"
		},
	}

	update(
		context: LiteNodeContext<typeof EquidistantAzimuthalProjectionNode.definition>,
		inputs: NodeInput<typeof EquidistantAzimuthalProjectionNode.definition>
	): NodeOutput<typeof EquidistantAzimuthalProjectionNode.definition> {
		const translateBy = inputs.translate.asVector()
		const scaleBy = inputs.scale.asVector()

		return {
			project: new LiteFunction(value => {
				const {x,y,z} = value.asVector().asVector()

				const r = Math.sqrt(x*x + y*y + z*z);
				const theta = Math.acos(z / r);
				const phi = Math.atan2(y, x);

				const projectedX = theta * Math.cos(phi);
				const projectedY = theta * Math.sin(phi);

				return new LiteVector(projectedX, projectedY, 0, 0)
					.scale(...scaleBy.asArray())
					.translate(...translateBy.asArray())
			})
		}
	}
}

registerNode(EquidistantAzimuthalProjectionNode)
