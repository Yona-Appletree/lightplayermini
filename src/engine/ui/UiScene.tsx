import { LiteScene } from "../LiteScene";
import { UiNode } from "./UiNode";
import { useEffect, useState } from "react";

export function UiScene(props: {
  scene: LiteScene
}) {
  const {scene} = props
  const [, setFrameId] = useState(() => scene.currentFrameId)

  useEffect(() => {
    let running = true;

    const update = () => {
      setFrameId(scene.currentFrameId)
      scene.nextFrame()

      if (running) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)

    return () => {
      running = false
    }
  })

  return <div>
    {
      props.scene.allNodes().map(it => <UiNode node={it}></UiNode>)
    }
  </div>
}
