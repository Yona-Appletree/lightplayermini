export type LiteTypeSlug =
	| "scalar"
	| "vector"
	| "rgb"
	| "hsv"


export abstract class LiteValue {
	abstract readonly type: LiteTypeSlug

	abstract asScalar(): LiteScalar
	abstract asVector(): LiteVector
	abstract asRgb(): LiteRgbColor
	abstract asHsv(): LiteHsvColor

	asNumber(): number {
		return this.asScalar().value
	}
}

export function liteScalar(
	value: number
): LiteScalar {
	return new LiteScalar(value)
}

export class LiteScalar extends LiteValue {
	override readonly type = 'scalar'

	constructor(
		public readonly value: number
	) {
		super();
	}

	override asHsv(args?: { h?: number, s?: number }): LiteHsvColor {
		return new LiteHsvColor(args?.h ?? 0, args?.s ?? 0, this.value);
	}

	override asRgb(args?: { r?: number, g?: number, b?: number }): LiteRgbColor {
		return new LiteRgbColor(args?.r ?? this.value, args?.g ?? this.value, args?.b ?? this.value);
	}

	override asScalar(): LiteScalar {
		return this;
	}

	override asVector(): LiteVector {
		return new LiteVector(this.value, this.value, this.value, this.value);
	}
}

export class LiteVector extends LiteValue {
	override readonly type = 'vector'

	constructor(
		public readonly x: number,
		public readonly y: number,
		public readonly z: number,
		public readonly a: number,
	) {
		super();
	}

	get length() {
		return Math.sqrt(this.x**2 + this.y**2 + this.z**2 + this.z**2);
	}

	override asHsv(): LiteHsvColor {
		return new LiteHsvColor(this.x, this.y, this.z);
	}

	override asRgb(): LiteRgbColor {
		return new LiteRgbColor(this.x, this.y, this.z);
	}

	override asScalar(): LiteScalar {
		return new LiteScalar(this.length)
	}

	override asVector(): LiteVector {
		return this;
	}

	translate(x: number, y: number, z: number, a: number) {
		return new LiteVector(this.x + x, this.y + y, this.z + z, this.a + a)
	}

	scale(x: number, y: number, z: number, a: number) {
		return new LiteVector(this.x * x, this.y * y, this.z * z, this.a * a)
	}

	asArray(): [number, number, number, number] {
		return [ this.x, this.y, this.z, this.a ]
	}

	static from(p: { x: number, y: number, z: number, a: number }) {
		return new LiteVector(p.x, p.y, p.z, p.a);
	}

	normalize() {
		const len = this.length
		return new LiteVector(
			this.x / len,
			this.y / len,
			this.z / len,
				this.z / len
		);
	}

	scaleBy(amount: number) {
		return new LiteVector(this.x * amount, this.y * amount, this.z * amount, this.a * amount);
	}
}

export class LiteRgbColor extends LiteValue  {
	override readonly type = 'rgb'

	constructor(
		public readonly r: number,
		public readonly g: number,
		public readonly b: number,
	) {
		super();
	}

	get brightness() {
		return (this.r + this.g + this.b) / 3;
	}

	override asHsv(): LiteHsvColor {
		let {r, g, b} = this
		let h: number, s: number, v: number;
		const min = Math.min(r, g, b);
		const max = Math.max(r, g, b);
		v = max;
		const delta = max - min;
		if (max === 0) {
			s = 0;
		} else {
			s = delta / max;
		}
		if (delta === 0) {
			h = 0;
		} else if (r === max) {
			h = (g - b) / delta;
		} else if (g === max) {
			h = 2 + (b - r) / delta;
		} else {
			h = 4 + (r - g) / delta;
		}
		h/=6;
		if (h < 0) {
			h += 1;
		}
		return new LiteHsvColor(h, s, v)
	}

	override asRgb(): LiteRgbColor {
		return this;
	}

	override asScalar(): LiteScalar {
		return new LiteScalar(this.brightness)
	}

	override asVector(): LiteVector {
		return new LiteVector(this.r, this.g, this.b, 0);
	}
}

export class LiteHsvColor extends LiteValue  {
	override readonly type = 'hsv'

	constructor(
		public readonly h: number,
		public readonly s: number,
		public readonly v: number,
	) {
		super();
	}

	override asHsv(): LiteHsvColor {
		return this
	}

	override asRgb(): LiteRgbColor {
		let {h, s, v} = this

		h = h % 1
		if (h < 0) h++

		let r: number, g: number, b: number;
		const i = Math.floor(h * 6);
		const f = h * 6 - i;
		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}
		return new LiteRgbColor(r!, g!, b!)
	}

	override asScalar(): LiteScalar {
		return new LiteScalar(this.v)
	}

	override asVector(): LiteVector {
		return this.asRgb().asVector()
	}

	withValue(value: number) {
		return new LiteHsvColor(this.h, this.s, value)
	}
}
