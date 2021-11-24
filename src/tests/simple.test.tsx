import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import useEasing from "../index";
import { easeInQuad } from "../easings"; // the default easing

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

jest.useFakeTimers();

describe("useEasing with basic config and stable 60fps", () => {
  // over 1 second, countUp from 0 to 100, using easeInQuad
  const basicProps: CounterProps = { start: 0, end: 100, duration: 1 };
  render(<Counter {...basicProps} />);

  it("starts at the specified value", () => {
    const startingFrame = screen.getByTestId("value");
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
      jest.advanceTimersByTime(16);
    });

    const firstFrame = screen.getByTestId("value");
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
      jest.advanceTimersByTime(496); // account for **
    });

    const midFrame = screen.getByTestId("value");
    const midFrameValue = midFrame && midFrame.textContent;
    expect(midFrameValue).toEqual(`${expectedMidValue}`);
  });

  it("eventually reaches the target value", () => {
    act(() => {
      jest.advanceTimersByTime(basicProps.duration * 1000); // account for **
    });

    const finalFrame = screen.getByTestId("value");
    const finalFrameValue = finalFrame && finalFrame.textContent;
    expect(finalFrameValue).toEqual(`${basicProps.end}`);
  });
});
