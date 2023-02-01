import { PScalar, PValue } from "./PValue";
import { PipelineFn } from "./pipeline";

export function pcos(v: PValue): PScalar {
	return new PScalar(Math.cos(v.asScalar().value * Math.PI * 2))
}

export function psin(v: PValue): PScalar {
	return new PScalar(Math.sin(v.asScalar().value * Math.PI * 2))
}
