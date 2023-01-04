import { ICopiable } from "./interfaces";
import { clamp, lerp } from "./math";

export const COLOR_MAX = 255;
export const COLOR_MIN = 0;

export class Color implements ICopiable {
    mR: number;
    mG: number;
    mB: number;
    mA: number;
    constructor(r: number, g: number, b: number, a: number = COLOR_MAX, 
        isConst: boolean = false) {
            this.set(r, g, b, a);

            if (isConst)
                Object.freeze(this);
        }

    get r() { return this.mR; }
    get g() { return this.mG; }
    get b() { return this.mB; }
    get a() { return this.mA; }

    set(r: number, g: number, b: number, a: number = COLOR_MAX): Color {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a

        return this;
    }

    set r(val: number) {
        this.mR = Math.floor(clamp(val, COLOR_MIN, COLOR_MAX));
    }

    set g(val: number) {
        this.mG = Math.floor(clamp(val, COLOR_MIN, COLOR_MAX));
    }

    set b(val: number) {
        this.mB = Math.floor(clamp(val, COLOR_MIN, COLOR_MAX));
    }

    set a(val: number) {
        this.mA = Math.floor(clamp(val, COLOR_MIN, COLOR_MAX));
    }

    get White() {
        return new Color(255, 255, 255);
    }

    get Red() {
        return new Color(255, 0, 0);
    }

    get Green() {
        return new Color(0, 255, 0);
    }

    get Blue() {
        return new Color(0, 0, 255);
    }

    get Black() {
        return new Color(0, 0, 0);
    }

    toString(): string {
        let aStr = this.a.toString(16);
        while (aStr.length < 2) aStr = '0' + aStr;

        let rStr = this.r.toString(16);
        while (rStr.length < 2) rStr = '0' + rStr;

        let gStr = this.g.toString(16);
        while (gStr.length < 2) gStr = '0' + gStr;

        let bStr = this.b.toString(16);
        while (bStr.length < 2) bStr = '0' + bStr;

        return "#" + rStr + gStr + bStr + aStr;
    }

    lerpTo(target: Color, amt: number) {
        return lerpColors(this, target, amt);
    }

    copy() {
        return new Color(this.r, this.g, this. b, this.a);
    }
}

export function lerpColors(current: Color, target: Color, amt: number): Color {
    return new Color(
        lerp(current.r, target.r, amt),
        lerp(current.g, target.g, amt),
        lerp(current.b, target.b, amt),
        lerp(current.a, target.a, amt)
    );
}
