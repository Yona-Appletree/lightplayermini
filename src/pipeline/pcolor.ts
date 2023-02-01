import { PHsvColor, PValue } from "./PValue";

export function phue(v: PValue): PHsvColor {
	return new PHsvColor(
		v.asScalar().value,
		1.0,
		1.0
	)
}
