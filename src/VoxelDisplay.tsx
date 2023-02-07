import * as React from "react";
import { createRef } from "react";

import {
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { Fluid3d } from "./fluid/fluid3d";
import { PRgbColor } from "./pipeline/PValue";


export interface ThreeCanvasProps {
  width: number;
  height: number;
}

// 30x30 pixel inside of a 120x120 and then those written from the top-left going left-to-right
// top-to-bottom

const ThreeCanvas: React.FC<ThreeCanvasProps> = (props) => {
  const {width, height} = props;

  let divRef = createRef<HTMLDivElement>();

  React.useEffect(() => {
    const pixelCount = 0;

    const ledColors = new Uint32Array(pixelCount)
    const ledPositions = new Int32Array(pixelCount * 3)

    // Set up the scene
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, width / height, 0.1, 10000);
    const renderer = new WebGLRenderer();
    renderer.setSize(width, height);
    divRef.current?.appendChild(renderer.domElement);


    const voxelSize = 2;
    const voxelSpacing = 3;
    const gridSize = {x: 16, y: 16, z: 32}//{x: 30, y: 30, z: 60};

    const geometry = new BoxGeometry(voxelSize / 2, voxelSize / 2, voxelSize / 2);

    const voxels: MeshBasicMaterial[][][] = [];

    const group = new Group();
    scene.add(group);

    for (let x = 0; x < gridSize.x; x++) {
      voxels[x] = [];
      for (let y = 0; y < gridSize.y; y++) {
        voxels[x][y] = [];
        for (let z = 0; z < gridSize.z; z++) {
          const color = new Color().setHSL(0, 0.5, 0.5);
          const material = new MeshBasicMaterial({
            color: color,
            //blending: AdditiveBlending
          });
          material.transparent = true
          material.depthWrite = false
          const mesh = new Mesh(geometry, material);
          mesh.position.set(
            (x - gridSize.x / 2 + (y % 2) / 2) * voxelSpacing,
            (y - gridSize.y / 2) * voxelSpacing,
            (z - gridSize.z / 2 + (x % 2) / 2) * voxelSpacing,
          );

          group.add(mesh);

          voxels[x][y][z] = material;
        }
      }
    }

    camera.position.y = gridSize.x * voxelSpacing * 2;
    camera.lookAt(0, 0, 0)

    let isRunning = true;

    const noise = new SimplexNoise()

    const fluidR = Fluid3d(gridSize)
    const fluidG = Fluid3d(gridSize)
    const fluidB = Fluid3d(gridSize)

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

    // Animate the rotation
    const render = () => {
      requestAnimationFrame(render);

      // for (let x = 0; x < gridSize.x; x++) {
      // 	for (let y = 0; y < gridSize.y; y++) {
      // 		for (let z = 0; z < gridSize.z; z++) {
      // 			const value = noise.noise4d(x / 20, y / 20, z / 20, (Date.now() / 5000) % 5000);
      // 			const value2 = noise.noise4d(x / 30, y / 30, z / 30, 5000 + (Date.now() / 3000) % 3000);
      // 			voxels[x][y][z].color = new Color().setHSL(value, 0.5, value2 / 2);
      // 		}
      // 	}
      // }

      for (let x = 0; x < gridSize.x; x++) {
        for (let y = 0; y < gridSize.y; y++) {
          for (let z = 0; z < gridSize.z; z++) {
            const i = fluidR.IX(x, y, z)

            const rgb = new PRgbColor(
              fluidR.dens[i],
              fluidG.dens[i],
              fluidB.dens[i],
            )

            const hsv = rgb.asHsv()

            const newRgb = hsv.withValue(1.0).asRgb()

            voxels[x][y][z].color.setRGB(newRgb.r, newRgb.g, newRgb.b)
            voxels[x][y][z].opacity = hsv.v
          }
        }
      }

      fluidR.fade_out(0.05)
      fluidG.fade_out(0.05)
      fluidB.fade_out(0.05)

      // emitColor(
      // 	{
      // 		x: .5,
      // 		y: .5,
      // 		z: .5
      // 	},
      // 	new Vector3(0,0,1).applyMatrix4(
      // 		new Matrix4().makeRotationY(
      // 			Date.now() / 5000
      // 		)
      // 	).multiplyScalar(.5),
      // 	new Color().setHSL(
      // 		Date.now() / 10000,
      // 		.5,
      // 		.5
      // 	),
      // 	100 * Math.cos(Date.now() / 100)/2 + .5
      // )


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

      group.rotation.z = Date.now() / 10000

      //tetrahedron.rotation.x += 0.01;
      renderer.render(scene, camera);
    };
    render();

    const controls = new OrbitControls(camera, renderer.domElement);

    return () => {
      isRunning = false;
    }
  }, [width, height]);

  return <div ref={divRef} style={{width, height}}/>;
};

export default ThreeCanvas;
