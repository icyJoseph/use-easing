import React from "react";
import { act } from "react-dom/test-utils";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import useEasing from "../index";
import { easeInQuad } from "../easings"; // the default easing

// Test helper to simulate ticks on requestAnimationFrame
function* generateFrames(): Generator<number, number, number> {
  let _init = 0;
  while (true) {
    const step = yield _init; // yield _init and reads next(step)
    _init += step || 16; // if step is undefined, step by 16
  }
}

interface CounterProps {
  start: number;
  end: number;
  duration: number;
}

const Counter = ({ start, end, duration }: CounterProps) => {
  const { value } = useEasing<number>({
    start,
    end,
    duration
  });
  return <div data-testid="value">{value}</div>;
};

const frame = generateFrames();
jest.useFakeTimers();
jest.spyOn(window, "requestAnimationFrame").mockImplementation((fn) => {
  let timer = setTimeout(() => fn(frame.next().value), 16);
  // requestAnimationFrame expects a number as return type id
  return (timer as unknown) as number;
});

describe("useEasing with basic config and stable 60fps", () => {
  // over 1 second, countUp from 0 to 100, using easeInQuad
  const basicProps: CounterProps = { start: 0, end: 100, duration: 1 };
  const { getByTestId } = render(<Counter {...basicProps} />);

  it("starts at the specified value", () => {
    const startingFrame = getByTestId("value");
    const startingFrameValue = startingFrame && startingFrame.textContent;
    expect(startingFrameValue).toEqual(`${basicProps.start}`);
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it("after one frame the value is close to the expected value", () => {
    const expectedFrameValue = easeInQuad(
      16,
      basicProps.start,
      basicProps.end - basicProps.start,
      basicProps.duration * 1000
    );

    act(() => {
      jest.runTimersToTime(16);
    });

    const firstFrame = getByTestId("value");
    const firstFrameValue = firstFrame && firstFrame.textContent;
    expect(firstFrameValue).toEqual(`${expectedFrameValue}`);
  });

  it("after half the duration time has gone by **", () => {
    const expectedMidValue = easeInQuad(
      496 + 16,
      basicProps.start,
      basicProps.end - basicProps.start,
      basicProps.duration * 1000
    );

    act(() => {
      jest.runTimersToTime(496); // account for **
    });

    const midFrame = getByTestId("value");
    const midFrameValue = midFrame && midFrame.textContent;
    expect(midFrameValue).toEqual(`${expectedMidValue}`);
  });

  it("eventually reaches the target value", () => {
    act(() => {
      jest.runTimersToTime(basicProps.duration * 1000); // account for **
    });

    const finalFrame = getByTestId("value");
    const finalFrameValue = finalFrame && finalFrame.textContent;
    expect(finalFrameValue).toEqual(`${basicProps.end}`);
  });
});
