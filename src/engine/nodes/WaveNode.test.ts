import { liteScalar } from "../LiteValue";
import { WaveNode } from "./WaveNode";
import { testUpdateNode } from "../../util/testUpdateNode";

describe("WaveNode", () => {
  it("has normalized defaults", () => {
    const sine = testUpdateNode(new WaveNode()).sine.func

    expect(sine(liteScalar(0)).asScalar()).toBeCloseTo(.5, 10)
    expect(sine(liteScalar(.25)).asScalar()).toBeCloseTo(1, 10)
    expect(sine(liteScalar(.5)).asScalar()).toBeCloseTo(.5, 10)
    expect(sine(liteScalar(.75)).asScalar()).toBeCloseTo(0, 10)
    
  })

  it("can scale the output", () => {
    const sine = testUpdateNode(new WaveNode(), {
      min: liteScalar(10),
      max: liteScalar(20),
    }).sine.func

    expect(sine(liteScalar(0)).asScalar()).toBeCloseTo(15, 10)
    expect(sine(liteScalar(.25)).asScalar()).toBeCloseTo(20, 10)
    expect(sine(liteScalar(.5)).asScalar()).toBeCloseTo(15, 10)
    expect(sine(liteScalar(.75)).asScalar()).toBeCloseTo(10, 10)
  })

  it("can scale the period", () => {
    const sine = testUpdateNode(new WaveNode(), {
      period: liteScalar(100),
    }).sine.func

    expect(sine(liteScalar(0)).asScalar()).toBeCloseTo(.5, 10)
    expect(sine(liteScalar(25)).asScalar()).toBeCloseTo(1, 10)
    expect(sine(liteScalar(50)).asScalar()).toBeCloseTo(.5, 10)
    expect(sine(liteScalar(75)).asScalar()).toBeCloseTo(0, 10)
  })
})


