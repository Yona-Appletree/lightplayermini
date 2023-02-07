export abstract class PValue {
  abstract asScalar(): PScalar

  abstract asVector(): PVector

  abstract asRgb(): PRgbColor

  abstract asHsv(): PHsvColor
}

export class PScalar extends PValue {
  static of(value: number) {
    return new PScalar(value)
  }

  constructor(
    public readonly value: number
  ) {
    super();
  }

  override asHsv(args?: { h?: number, s?: number }): PHsvColor {
    return new PHsvColor(args?.h ?? 0, args?.s ?? 0, this.value);
  }

  override asRgb(args?: { r?: number, g?: number, b?: number }): PRgbColor {
    return new PRgbColor(args?.r ?? this.value, args?.g ?? this.value, args?.b ?? this.value);
  }

  override asScalar(): PScalar {
    return this;
  }

  override asVector(args?: { x?: number, y?: number, z?: number }): PVector {
    return new PVector(args?.x ?? this.value, args?.y ?? this.value, args?.z ?? this.value);
  }
}

export class PVector extends PValue {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
  ) {
    super();
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  override asHsv(): PHsvColor {
    return new PHsvColor(this.x, this.y, this.z);
  }

  override asRgb(): PRgbColor {
    return new PRgbColor(this.x, this.y, this.z);
  }

  override asScalar(): PScalar {
    return new PScalar(this.length)
  }

  override asVector(): PVector {
    return this;
  }

  translate(x: number, y: number, z: number) {
    return new PVector(this.x + x, this.y + y, this.z + z)
  }

  static from(p: { x: number, y: number, z: number }) {
    return new PVector(p.x, p.y, p.z);
  }

  normalize() {
    const len = this.length
    return new PVector(
      this.x / len,
      this.y / len,
      this.z / len,
    );
  }

  scaleBy(amount: number) {
    return new PVector(this.x * amount, this.y * amount, this.z * amount);
  }
}

export class PRgbColor extends PValue {
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

  override asHsv(): PHsvColor {
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
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return new PHsvColor(h, s, v)
  }

  override asRgb(): PRgbColor {
    return this;
  }

  override asScalar(): PScalar {
    return new PScalar(this.brightness)
  }

  override asVector(): PVector {
    return new PVector(this.r, this.g, this.b);
  }
}

export class PHsvColor extends PValue {
  constructor(
    public readonly h: number,
    public readonly s: number,
    public readonly v: number,
  ) {
    super();
  }

  override asHsv(): PHsvColor {
    return this
  }

  override asRgb(): PRgbColor {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      case 0:
        r = v, g = t, b = p;
        break;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      case 1:
        r = q, g = v, b = p;
        break;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      case 2:
        r = p, g = v, b = t;
        break;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      case 3:
        r = p, g = q, b = v;
        break;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      case 4:
        r = t, g = p, b = v;
        break;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      case 5:
        r = v, g = p, b = q;
        break;
    }
    return new PRgbColor(r!, g!, b!)
  }

  override asScalar(): PScalar {
    return new PScalar(this.v)
  }

  override asVector(): PVector {
    return this.asRgb().asVector()
  }

  withValue(value: number) {
    return new PHsvColor(this.h, this.s, value)
  }
}
