import { PValue, PVector } from "./PValue";

export function pEquidistantAzimuthalProjection(point: PValue): PVector {
	const {x,y,z} = point.asVector()

	const r = Math.sqrt(x*x + y*y + z*z);
	const theta = Math.acos(z / r);
	const phi = Math.atan2(y, x);

	const projectedX = theta * Math.cos(phi);
	const projectedY = theta * Math.sin(phi);

	return new PVector(projectedX, projectedY, 0)
}
