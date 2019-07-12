import React from "react";
import { act } from "react-dom/test-utils";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import useCountUp from "../index";
import { easeInQuad } from "../easings"; // the default easing

// Test helper to simulate ticks on requestAnimationFrame
function* generateFrames() {
  let _init = 0;
  while (true) {
    const step = yield _init; // yield _init and reads next(step)
    _init += step || 16; // if step is undefined, step by 16
  }
}

const onStart = jest.fn();
const onEnd = jest.fn();
const onPaused = jest.fn();
const onCleanUp = jest.fn();
const formatFn = jest.fn(x => Math.floor(x));

interface StartStopProps {
  start: number;
  end: number;
  duration: number;
}

interface ContainerProps {
  children: React.ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  const [mount, setMount] = React.useState(true);

  return mount ? (
    <div>
      <button data-testid="unmount" onClick={() => setMount(x => !x)}>
        unMount
      </button>
      {children}
    </div>
  ) : null;
};

const StartStop = ({ start, end, duration }: StartStopProps) => {
  const { count, setTrigger } = useCountUp<number>({
    start,
    end,
    duration,
    autoStart: false,
    formatFn,
    onStart,
    onEnd,
    onPaused,
    onCleanUp
  });
  return (
    <div>
      <div data-testid="count">{count}</div>
      <button data-testid="start" onClick={() => setTrigger(true)}>
        start
      </button>
      <button data-testid="stop" onClick={() => setTrigger(false)}>
        stop
      </button>
    </div>
  );
};

const frame = generateFrames();
jest.useFakeTimers();
jest
  .spyOn(window, "requestAnimationFrame")
  .mockImplementation(fn => setTimeout(() => fn(frame.next().value), 16));

describe("useCountUp with basic config and stable 60fps", () => {
  // over 1 second, countUp from 0 to 100, using easeInQuad
  const basicProps: StartStopProps = { start: 0, end: 100, duration: 1 };
  const { getByTestId } = render(
    <Container>
      <StartStop {...basicProps} />
    </Container>
  );

  it("starts at the specified value", () => {
    const startingFrame = getByTestId("count");
    const startingFrameValue = startingFrame && startingFrame.textContent;
    expect(startingFrameValue).toEqual(`${basicProps.start}`);
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it("after one frame the value is still at the start", () => {
    act(() => {
      jest.runTimersToTime(16);
    });

    const firstFrame = getByTestId("count");
    const firstFrameValue = firstFrame && firstFrame.textContent;
    expect(firstFrameValue).toEqual(`${basicProps.start}`);
  });

  it("starts when clicking start button", () => {
    const startButton = getByTestId("start");

    act(() => {
      fireEvent.click(startButton);
    });

    const expectedMidValue = easeInQuad(
      480,
      basicProps.start,
      basicProps.end - basicProps.start,
      basicProps.duration * 1000
    );

    act(() => {
      jest.runTimersToTime(496); // account for **
    });

    const midFrame = getByTestId("count");
    const midFrameValue = midFrame && midFrame.textContent;
    expect(midFrameValue).toEqual(`${Math.floor(expectedMidValue)}`);
  });

  it("can be paused", () => {
    const stopButton = getByTestId("stop");

    act(() => {
      fireEvent.click(stopButton); // we are now paused!
    });

    // if there was something going on it will finish
    act(() => {
      jest.runOnlyPendingTimers();
    });

    const beforePausingFrame = getByTestId("count");
    const beforePausingFrameValue =
      beforePausingFrame && beforePausingFrame.textContent;

    act(() => {
      jest.runTimersToTime(496); // should have no effect
    });

    const pausingFrame = getByTestId("count");
    const pausingFrameValue = pausingFrame && pausingFrame.textContent;
    expect(pausingFrameValue).toEqual(beforePausingFrameValue);
  });

  it("eventually reaches the target value", () => {
    const startButton = getByTestId("start");

    fireEvent.click(startButton);

    act(() => {
      jest.runTimersToTime(basicProps.duration * 1000 + 16 + 16); //
    });

    const finalFrame = getByTestId("count");
    const finalFrameValue = finalFrame && finalFrame.textContent;
    expect(finalFrameValue).toEqual(`${basicProps.end}`);
  });

  it("invokes the callbacks", () => {
    expect(onStart).toHaveBeenCalled();
  });
});
