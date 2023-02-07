import { liteScalar } from "../LiteValue";
import { WaveNode } from "./WaveNode";
import { testUpdateNode } from "../../util/testUpdateNode";

describe("WaveNode", () => {
  it("has normalized defaults", () => {
    const sine = testUpdateNode(new WaveNode()).sine.func

    expect(sine(liteScalar(0)).asNumber()).toBeCloseTo(.5, 10)
    expect(sine(liteScalar(.25)).asNumber()).toBeCloseTo(1, 10)
    expect(sine(liteScalar(.5)).asNumber()).toBeCloseTo(.5, 10)
    expect(sine(liteScalar(.75)).asNumber()).toBeCloseTo(0, 10)
  })

  it("can scale the output", () => {
    const sine = testUpdateNode(new WaveNode(), {
      min: liteScalar(10),
      max: liteScalar(20),
    }).sine.func

    expect(sine(liteScalar(0)).asNumber()).toBeCloseTo(15, 10)
    expect(sine(liteScalar(.25)).asNumber()).toBeCloseTo(20, 10)
    expect(sine(liteScalar(.5)).asNumber()).toBeCloseTo(15, 10)
    expect(sine(liteScalar(.75)).asNumber()).toBeCloseTo(10, 10)
  })

  it("can scale the period", () => {
    const sine = testUpdateNode(new WaveNode(), {
      period: liteScalar(100),
    }).sine.func

    expect(sine(liteScalar(0)).asNumber()).toBeCloseTo(.5, 10)
    expect(sine(liteScalar(25)).asNumber()).toBeCloseTo(1, 10)
    expect(sine(liteScalar(50)).asNumber()).toBeCloseTo(.5, 10)
    expect(sine(liteScalar(75)).asNumber()).toBeCloseTo(0, 10)
  })
})


