import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutSine,
  easeOutElastic,
  easeBackIn,
  easeInOutBack
} from "../easings";

const easings = [
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutSine,
  easeOutElastic,
  easeBackIn,
  easeInOutBack
];

describe("all easings", () => {
  // t: current time in ms
  // b: start
  // c: change
  // d: duration in ms
  const [b, c, d] = [0, 1, 10];
  const timePoints = Array.from({ length: 10 }, (_, t) => [t, b, c, d]);
  const results = timePoints.map(([w, x, y, z]) =>
    easings.map(easing => easing(w, x, y, z))
  );
  it("start and end at the same point after the same time", () => {
    const [startPoints] = results;
    const [endPoints] = results.slice(-1);
    expect(startPoints.every(point => point === b));
    expect(endPoints.every(point => point === c));
  });

  it("matches known behavior", () => {
    expect(results).toMatchSnapshot();
  });
});
