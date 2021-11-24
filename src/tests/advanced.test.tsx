import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";

/** TODO:
 *  - Unmount by parent
 *  - Change to end after stop
 *  - change to end while running
 *  - change to end while paused
 */

import useEasing from "../index";
import { easeInQuad } from "../easings"; // the default easing

const onStart = jest.fn();
const onEnd = jest.fn();
const onPauseResume = jest.fn();
const onCleanUp = jest.fn();
const formatFn = jest.fn((x) => Math.floor(x));

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
      <button data-testid="unmount" onClick={() => setMount((x) => !x)}>
        unMount
      </button>
      {children}
    </div>
  ) : null;
};

const StartStop = ({ start, end, duration }: StartStopProps) => {
  const { value, setTrigger } = useEasing<number>({
    start,
    end,
    duration,
    autoStart: false,
    formatFn,
    onStart,
    onEnd,
    onPauseResume,
    onCleanUp
  });
  return (
    <div>
      <div data-testid="value">{value}</div>
      <button data-testid="start" onClick={() => setTrigger(true)}>
        start
      </button>
      <button data-testid="stop" onClick={() => setTrigger(false)}>
        stop
      </button>
    </div>
  );
};

jest.useFakeTimers();

describe("useEasing stable 60fps", () => {
  // over 1 second, countUp from 0 to 100, using easeInQuad
  const basicProps: StartStopProps = { start: 0, end: 100, duration: 1 };
  render(
    <Container>
      <StartStop {...basicProps} />
    </Container>
  );

  it("starts at the specified value", () => {
    const startingFrame = screen.getByTestId("value");
    const startingFrameValue = startingFrame && startingFrame.textContent;
    expect(startingFrameValue).toEqual(`${basicProps.start}`);
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it("after one frame the value is still at the start", () => {
    act(() => {
      jest.advanceTimersByTime(16);
    });

    const firstFrame = screen.getByTestId("value");
    const firstFrameValue = firstFrame && firstFrame.textContent;
    expect(firstFrameValue).toEqual(`${basicProps.start}`);
  });

  it("starts when clicking start button", () => {
    const startButton = screen.getByTestId("start");

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
      jest.advanceTimersByTime(496); // account for **
    });

    const midFrame = screen.getByTestId("value");
    const midFrameValue = midFrame && midFrame.textContent;
    expect(midFrameValue).toEqual(`${Math.floor(expectedMidValue)}`);
  });

  it("can be paused", () => {
    const stopButton = screen.getByTestId("stop");

    act(() => {
      fireEvent.click(stopButton); // we are now paused!
    });

    // if there was something going on it will finish
    act(() => {
      jest.runOnlyPendingTimers();
    });

    const beforePausingFrame = screen.getByTestId("value");
    const beforePausingFrameValue =
      beforePausingFrame && beforePausingFrame.textContent;

    act(() => {
      jest.advanceTimersByTime(496); // should have no effect
    });

    const pausingFrame = screen.getByTestId("value");
    const pausingFrameValue = pausingFrame && pausingFrame.textContent;
    expect(pausingFrameValue).toEqual(beforePausingFrameValue);
  });

  it("eventually reaches the target value", () => {
    const startButton = screen.getByTestId("start");

    fireEvent.click(startButton);

    act(() => {
      jest.advanceTimersByTime(basicProps.duration * 1000 + 16 + 16); //
    });

    const finalFrame = screen.getByTestId("value");
    const finalFrameValue = finalFrame && finalFrame.textContent;
    expect(finalFrameValue).toEqual(`${basicProps.end}`);
  });

  it("invokes the callbacks", () => {
    expect(onStart).toHaveBeenCalled();
    expect(onPauseResume).toHaveBeenCalledTimes(2);
    expect(onCleanUp).toHaveBeenCalledTimes(3);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });
});
