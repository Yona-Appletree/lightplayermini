import * as React from "react";
import { createRef } from "react";

import { Color, Vector3 } from "three";
import { Fluid3d } from "./fluid/fluid3d";


export interface ThreeCanvasProps {
}

// 30x30 pixel inside of a 120x120 and then those written from the top-left going left-to-right
// top-to-bottom

const ThreeCanvas: React.FC<ThreeCanvasProps> = (props) => {
  let divRef = createRef<HTMLDivElement>();

  React.useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 600

    canvas.onclick = () => divRef.current?.requestFullscreen()

    divRef.current?.appendChild(canvas);

    const context = canvas.getContext("2d") !

    const gridSize = {x: 30, y: 30, z: 60};
    const fluidSize = {x: 15, y: 15, z: 30}

    const fluidR = Fluid3d(fluidSize)
    const fluidG = Fluid3d(fluidSize)
    const fluidB = Fluid3d(fluidSize)

    function emitColor(
      pos: { x: number, y: number, z: number },
      dir: { x: number, y: number, z: number },
      color: { r: number, g: number, b: number },
      power = 100
    ) {
      fluidR.put_fluid(pos, dir, color.r * power)
      fluidG.put_fluid(pos, dir, color.g * power)
      fluidB.put_fluid(pos, dir, color.b * power)
    }

    let isRunning = true;

    const sliceBuffer = context.createImageData(gridSize.y, gridSize.z)


    const sliceOrder: Array<{ row: number, col: number }> = [];

    sliceOrder[1] = {row: 2, col: 2}
    sliceOrder[2] = {row: 2, col: 0}

    sliceOrder[3] = {row: 1, col: 6}
    sliceOrder[4] = {row: 1, col: 4}
    sliceOrder[5] = {row: 1, col: 2}
    sliceOrder[6] = {row: 1, col: 0}

    sliceOrder[7] = {row: 0, col: 6}
    sliceOrder[8] = {row: 0, col: 4}
    sliceOrder[9] = {row: 0, col: 2}
    sliceOrder[10] = {row: 0, col: 0}

    sliceOrder[11] = {row: 2, col: 3}
    sliceOrder[12] = {row: 2, col: 1}

    sliceOrder[13] = {row: 1, col: 6}
    sliceOrder[14] = {row: 1, col: 5}
    sliceOrder[15] = {row: 1, col: 3}
    sliceOrder[16] = {row: 1, col: 1}

    sliceOrder[17] = {row: 0, col: 7}
    sliceOrder[18] = {row: 0, col: 5}
    sliceOrder[19] = {row: 0, col: 3}
    sliceOrder[20] = {row: 0, col: 1}


    sliceOrder[21] = {row: 4, col: 6}
    sliceOrder[22] = {row: 4, col: 4}
    sliceOrder[23] = {row: 4, col: 2}
    sliceOrder[24] = {row: 4, col: 0}

    sliceOrder[25] = {row: 3, col: 6}
    sliceOrder[26] = {row: 3, col: 4}
    sliceOrder[27] = {row: 3, col: 2}
    sliceOrder[28] = {row: 3, col: 0}

    function drawSlice(
      fluidX: number
    ) {
      let p = 0
      for (let z = 0; z < gridSize.z; z++) {
        for (let y = 0; y < gridSize.y; y++, p++) {
          const ix = fluidR.IX(fluidX / 2, y / 2, z / 2)
          sliceBuffer.data[p * 4 + 0] = fluidR.dens[ix] * 255
          sliceBuffer.data[p * 4 + 1] = fluidG.dens[ix] * 255
          sliceBuffer.data[p * 4 + 2] = fluidB.dens[ix] * 255
          sliceBuffer.data[p * 4 + 3] = 255
        }
      }

      const row = sliceOrder[fluidX - 1]?.row
      const col = sliceOrder[fluidX - 1]?.col

      if (row == null) return

      context.putImageData(sliceBuffer, col * 30, row * 60)
    }

    function debugSlice(
      fluidX: number
    ) {
      const row = sliceOrder[fluidX + 1]?.row
      const col = sliceOrder[fluidX + 1]?.col

      if (row == null) return

      context.fillStyle = "#040404"
      context.fillRect(col * 30, row * 60, 30, 60)
      context.fillStyle = "red"
      context.font = "20px Arial"
      context.fillText(fluidX.toString(), col * 30 + 4, row * 60 + 20, 30)
    }

    // Animate the rotation
    const render = () => {
      requestAnimationFrame(render);

      context.clearRect(0, 0, 1000, 1000)

      debugSlice(Math.floor(Date.now() / 1000) % 28)

      //for (let x=0; x<gridSize.x; x++)
      //	drawSlice(x)

      fluidR.fade_out(0.05)
      fluidG.fade_out(0.05)
      fluidB.fade_out(0.05)

      emitColor(
        new Vector3(
          .5 + Math.cos(Date.now() / 1000) / 10,
          .5 + Math.sin(Date.now() / 1000) / 10,
          .1
        ),
        new Vector3(0, 0, 1),
        new Color().setHSL(
          Date.now() / 2500,
          1,
          .5
        ),
        50 + 50 * (Math.cos(Date.now() / 7000) / 2 + .5)
      )

      emitColor(
        new Vector3(
          .5 + Math.cos(Date.now() / 3000) / 10,
          .5 + Math.sin(Date.now() / 3000) / 10,
          .9
        ),
        new Vector3(0, 0, -1),
        new Color().setHSL(
          Date.now() / 5000,
          1,
          .5
        ),
        50 + 50 * (Math.cos(Date.now() / 5000) / 2 + .5)
      )

      fluidR.step_sim()
      fluidG.step_sim()
      fluidB.step_sim()
    };
    render();

    return () => {
      isRunning = false;
    }
  }, []);

  return <div ref={divRef} style={{
    width: 800,
    height: 600,
    background: 'black',
    position: 'absolute',
    top: 0,
    left: 0
  }}/>;
};

export default ThreeCanvas;
