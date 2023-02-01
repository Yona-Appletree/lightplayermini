import * as React from "react";
import { createRef } from "react";

import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js"

import {
	AdditiveBlending,
	Color,
	CylinderGeometry,
	Group,
	Matrix4,
	Mesh,
	MeshBasicMaterial,
	MeshPhongMaterial,
	PerspectiveCamera,
	PointLight,
	Scene,
	Vector3,
	WebGLRenderer
} from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { dandelionHeadStlBase64 } from "./data/dandelion-head.stl";
import { base64ToArrayBuffer } from "./util/base64ToArrayBuffer";
import { dandelionPappusData } from "./data/dandelion-pappus-data";
import { degToRad } from "three/src/math/MathUtils.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { pcombine } from "./pipeline/pipeline";
import { pnoise } from "./pipeline/pnoise";
import { PHsvColor, PVector } from "./pipeline/PValue";
import { pScrollVector } from "./pipeline/pscroll";

export interface ThreeCanvasProps {
	width: number;
	height: number;
}

const colorFn = pcombine(
	it => it.asVector().normalize(),
	//pEquidistantAzimuthalProjection,
	it => it.asVector().scaleBy(.25),
	pScrollVector({z: 2000}),
	value => {
		const noise1 = pnoise(value)
		const noise2 = pnoise(value.asVector().scaleBy(2))

		return new PHsvColor(noise1.value, 1.0, .4 + noise2.value)
	}
)

const ThreeCanvas: React.FC<ThreeCanvasProps> = (props) => {
	const {width, height} = props;

	let divRef = createRef<HTMLDivElement>();

	React.useEffect(() => {
		const pixelCount = 0;

		const ledColors = new Uint32Array(pixelCount)
		const ledPositions = new Int32Array(pixelCount * 3)

		// Set up the scene
		const scene = new Scene();
		const camera = new PerspectiveCamera(75, width/height, 0.1, 10000);
		const renderer = new WebGLRenderer();
		renderer.setSize(width, height);
		divRef.current?.appendChild(renderer.domElement);

		const material = new MeshPhongMaterial();

		// Create the pappuses

		const headGroup = new Group()

		const beakGeometry = new CylinderGeometry(2.5, 2.5, 1)
			.rotateX(degToRad(-90))
			.translate(0, 0, .5)

		const pappusMeshes = dandelionPappusData.pappuses.map((pappusData, index) => {
			const pappusMesh = new Mesh(beakGeometry, new MeshBasicMaterial({
				color: new Color(.1, 0, 0),
				blending: AdditiveBlending
			}))
			pappusMesh.applyMatrix4(new Matrix4().makeScale(1, 1, pappusData.sphereDist))
			pappusMesh.translateZ(dandelionPappusData.overallZOffset)
					.rotateZ(degToRad(pappusData.zDeg))
					.rotateY(degToRad(pappusData.yDeg))
					.translateX(dandelionPappusData.pappusSphereRadius)
					.rotateX(degToRad(90))
					.rotateY(degToRad(90))
					.translateZ(pappusData.z)

			return pappusMesh;
		})

		headGroup.add(... pappusMeshes);

		// Create the tetrahedron
		const geometry = BufferGeometryUtils.mergeVertices(new STLLoader().parse(base64ToArrayBuffer(dandelionHeadStlBase64)), 2)//new TetrahedronGeometry(2);
		geometry.computeVertexNormals()

		const headMesh = new Mesh(geometry, material);
		headGroup.add(headMesh);

		scene.add(headGroup)

		// Create the lights
		const redLight = new PointLight(0xf0d0a0, .4, 10000);
		redLight.position.set(1000, -500, 500);
		scene.add(redLight);

		const greenLight = new PointLight(0xf0d0a0, .4, 10000);
		greenLight.position.set(-1000, -500, 500);
		scene.add(greenLight);

		const blueLight = new PointLight(0xf0d0a0, .4, 10000);
		blueLight.position.set(0, -500, 500);
		scene.add(blueLight);

		camera.position.x = 0;
		camera.position.z = 0;
		camera.position.y = -500;

		camera.lookAt(0, 0, 0);

		let isRunning = true;

		// Animate the rotation
		const render = () => {
			requestAnimationFrame(render);
			//tetrahedron.rotation.x += 0.01;
			headGroup.rotation.z += 0.001;
			renderer.render(scene, camera);

			pappusMeshes.forEach(p => {
				const point = new Vector3(0, 0, 0).applyMatrix4(p.matrix)
				const color = colorFn(PVector.from(point)).asRgb()
				p.material.color = new Color(color.r, color.g, color.b)
			})
		};
		render();

		const controls = new OrbitControls( camera, renderer.domElement );

		return () => {
			isRunning = false;
		}
	}, [width, height]);

	return <div ref={divRef} style={{width, height}}/>;
};

export default ThreeCanvas;
