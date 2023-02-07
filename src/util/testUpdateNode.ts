import { LiteNodeContext, LiteNodeDef, LiteNodeInstance, NodeInput, NodeOutput } from "../engine/LiteNode";
import { nodeDefDefaultInputValues } from "../engine/LiteInput";

export function testUpdateNode<TDef extends LiteNodeDef>(
  node: LiteNodeInstance<TDef>,
  inputs: Partial<NodeInput<TDef>> = {},
  context: LiteNodeContext = {
    frameStartMs: 0
  }
): NodeOutput<TDef> {
  const def = (node as any).constructor.definition as TDef

  return node.update(
    context,
    {
      ...nodeDefDefaultInputValues(def),
      ...inputs
    }
  )
}
