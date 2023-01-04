// Linearly interpolates between two numbers
export function lerp(n: number, target: number, amt: number): number {
    return (target - n) * amt + n;
}

// Inclusively clamps n between two numbers
export function clamp(n: number, min: number, max: number) {
    return Math.max(Math.min(n, max), min);
}