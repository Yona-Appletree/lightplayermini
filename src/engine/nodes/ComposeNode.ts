import { LiteNodeContext, LiteNodeInstance, NodeInput, NodeOutput, registerNode } from "../LiteNode";
import { LiteFunction } from "../LiteValue";

export class ComposeNode implements LiteNodeInstance<typeof ComposeNode.definition> {
  static definition = {
    type: "ComposeNode",
    inputs: {
      fn1: {
        type: "function",
        description: "Outermost function",
      },

      fn2: {
        type: "function",
        description: "Function 2",
      },

      fn3: {
        type: "function",
        description: "Innermost function",
      },
    },
    outputs: {
      composed: "function"
    },
  } as const

  update(
    context: LiteNodeContext,
    inputs: NodeInput<typeof ComposeNode.definition>
  ): NodeOutput<typeof ComposeNode.definition> {
    const fn1 = inputs.fn1.asFunction().func
    const fn2 = inputs.fn2.asFunction().func
    const fn3 = inputs.fn3.asFunction().func

    return {
      composed: new LiteFunction(
        value => fn1(fn2(fn3(value)))
      )
    }
  }
}

registerNode(ComposeNode)
