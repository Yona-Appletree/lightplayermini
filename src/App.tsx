import React, { useState } from 'react';
import './App.css';
import { LiteScene } from "./engine/LiteScene";
import { TimeNode } from "./engine/nodes/TimeNode";
import { NoiseNode } from "./engine/nodes/NoiseNode";
import { UiScene } from "./engine/ui/UiScene";
import { WaveNode } from "./engine/nodes/WaveNode";
import { liteScalar } from "./engine/LiteValue";
import { CallNode } from "./engine/nodes/CallNode";
import { CanvasDebugNode } from "./engine/nodes/CanvasDebugNode";

function App() {
  // <ThreeCanvas width={800} height={800}></ThreeCanvas>

  const [scene, setScene] = useState(() => {
    const scene = new LiteScene(() => Date.now())

    const noiseNode = scene.addNode(NoiseNode, {
      scale: scene.addNode(CallNode, {
        argument: scene.addNode(TimeNode).outputs.frameStartMs,
        func: scene.addNode(WaveNode, {
          period: liteScalar(12000),
          min: liteScalar(.2),
          max: liteScalar(1.7),
        }).outputs.sine
      }).outputs.result,

      translate: scene.addNode(TimeNode, { scale: liteScalar(.001) }).outputs.frameStartMs
    })

    const canvasNode = scene.addNode(CanvasDebugNode, {
      func: noiseNode.outputs.noise4
    })

    return scene
  })

  return (
    <div className="App">
      <UiScene scene={scene}></UiScene>
    </div>
  );
}

export default App;
