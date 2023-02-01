import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { PScalar, PValue } from "./PValue";

type PipelineFunction = (input: PValue, next: PipelineFunction) => PValue

const noise = new SimplexNoise()

export function pnoise(input: PValue): PScalar {
	const v = input.asVector()
	return new PScalar(noise.noise3d(v.x, v.y, v.z))
}


