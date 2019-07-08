export type easing = (
  time: number,
  begin: number,
  change: number,
  duration: number
) => number;

export const linear: easing = (t: number, b: number, c: number, d: number) =>
  (c * t) / d + b;

export const easeInQuad: easing = (
  t: number,
  b: number,
  c: number,
  d: number
) => c * (t /= d) * t + b;

export const easeOutQuad: easing = (
  t: number,
  b: number,
  c: number,
  d: number
) => -c * (t /= d) * (t - 2) + b;

export const easeInOutSine: easing = (
  t: number,
  b: number,
  c: number,
  d: number
) => (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;

export const easeOutElastic: easing = (t, b, c, d) => {
  let s = 1.70158;
  let p = 0;
  let a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else s = (p / (2 * Math.PI)) * Math.asin(c / a);
  return (
    a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
    c +
    b
  );
};

export const easeBackIn: easing = (t, b, c, d) => {
  const s = 1.70158;
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
};

export const easeInOutBack: easing = (t, b, c, d) => {
  let s = 1.70158;
  if ((t /= d / 2) < 1)
    return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
};
