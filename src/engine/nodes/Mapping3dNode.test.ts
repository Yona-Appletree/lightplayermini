import { testUpdateNode } from "../../util/testUpdateNode";
import { Mapping3dNode } from "./Mapping3dNode";
import { liteArray, liteFn, liteScalar, liteVec } from "../LiteValue";

test("Mapping3dNode", () => {
  const result = testUpdateNode(new Mapping3dNode(), {
    ledLocations: liteArray(
      liteVec(0, 0, 0),
      liteVec(1, 0, 0),
    ),
    colorFn: liteFn(
      input => input.asVector().x === 0 ? liteScalar(1) : liteScalar(2)
    )
  })

  expect(result.ledValues.value).toEqual([
    liteScalar(1),
    liteScalar(2),
  ])
})
