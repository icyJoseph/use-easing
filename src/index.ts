import { useState, useEffect, useRef } from "react";
import { easing } from "./easings";

interface CountProps {
  start?: number;
  end: number;
  duration: number;
  easingFn: easing;
  formatFn?: FormatFn;
  autoStart?: boolean;
}

type Noop = () => void;
type Identity = <T>(_: T) => T;
type FormatFn = <T, G>(_: T) => T | G;

type Trigger = (_: boolean) => void;

export interface UseCountUpResult<T> {
  count: T;
  setTrigger: Trigger;
}

const noop: Noop = () => {};
const identity: Identity = val => val;

export function useCountUp<T>({
  start = 0,
  end,
  duration,
  easingFn,
  formatFn = identity,
  autoStart = true
}: CountProps): UseCountUpResult<T> {
  const [trigger, setTrigger] = useState(autoStart);
  const [data, setData] = useState<number>(start);
  const easingFnRef = useRef<easing>(easingFn);
  const dataRef = useRef<number>(data);
  dataRef.current = data;

  useEffect(() => {
    let raf: number;
    let callNewRaf: boolean = true;
    if (trigger) {
      console.group("CountUp Effect starts");
      // request animation frames receives time in milliseconds
      raf = window.requestAnimationFrame((startTime: number) => {
        const endTime = startTime + duration * 1000;
        // what to use as starting point?
        const _start = dataRef.current;
        // get the total change
        const change = end - _start;
        console.log("Animation Frames running with these settings:", {
          start: _start,
          currentRef: dataRef.current,
          end,
          change,
          startTime,
          endTime
        });
        console.groupEnd();
        setData(_start);

        const handler = (time: number) => {
          if (time > endTime) {
            setData(end);
            return noop;
          }
          setData(() =>
            easingFnRef.current(
              time - startTime,
              _start,
              change,
              duration * 1000
            )
          );
          if (callNewRaf) {
            raf = window.requestAnimationFrame(handler);
          }
          return noop;
        };

        raf = window.requestAnimationFrame(handler);
      });
    } else {
      console.group("CountUp effect");
      console.log("But it could not be started");
      console.log("trigger", trigger);
      console.groupEnd();
    }

    return () => {
      console.group("CountUp Clean Up");
      console.log("trigger: ", trigger);
      console.log("CountUp: ", dataRef.current);
      console.log("Animation Frame: ", raf);
      console.groupEnd();
      callNewRaf = false;
      window.cancelAnimationFrame(raf);
    };
  }, [trigger, end, duration]);

  return {
    count: formatFn<number, T>(data) as T,
    setTrigger
  } as UseCountUpResult<T>;
}

export default useCountUp;
